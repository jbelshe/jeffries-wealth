
import { FinancialInput, AIAnalysis, KeyFacts } from "../types";

/**
 * DETERMINISTIC WEALTH AUDIT ENGINE
 * Version: wealth-audit-engine@1.0.0
 * 
 * Implements strict rules-based logic for high-earning accumulators.
 */

const ENGINE_VERSION = "wealth-audit-engine@1.0.0";

// --- HELPERS ---
const maxVal = (n: number, d: number) => Math.max(n, d);
const absVal = (x: number) => Math.abs(x);

// --- SECTION E: TAX ENGINE (2026 SUNSET PROJECTION) ---
const calculateTax2026 = (input: FinancialInput, total_comp_current: number) => {
    const isMFJ = input.filingStatus === 'Married Filing Jointly';
    const standardDeduction = isMFJ ? 32200 : 16100;
    const pretax401k = input.maxing401k === 'Yes' ? 23500 : 0;
    
    let hsa = 0;
    if (input.hsaContributing === 'Yes') {
        hsa = isMFJ ? 8550 : 4300;
    }

    const agi_est = maxVal(0, total_comp_current - pretax401k - hsa);
    const taxable_income = maxVal(0, agi_est - standardDeduction);

    const singleBrackets = [
        { cap: 12400, rate: 0.10 },
        { cap: 50400, rate: 0.12 },
        { cap: 105700, rate: 0.22 },
        { cap: 201775, rate: 0.24 },
        { cap: 256225, rate: 0.32 },
        { cap: 640600, rate: 0.35 },
        { cap: Infinity, rate: 0.37 }
    ];

    const mfjBrackets = [
        { cap: 24800, rate: 0.10 },
        { cap: 100800, rate: 0.12 },
        { cap: 211400, rate: 0.22 },
        { cap: 403550, rate: 0.24 },
        { cap: 512450, rate: 0.32 },
        { cap: 768700, rate: 0.35 },
        { cap: Infinity, rate: 0.37 }
    ];

    const brackets = isMFJ ? mfjBrackets : singleBrackets;
    let fedTax = 0;
    let prevCap = 0;
    for (const b of brackets) {
        if (taxable_income > prevCap) {
            const rangeAmount = Math.min(taxable_income, b.cap) - prevCap;
            fedTax += rangeAmount * b.rate;
            prevCap = b.cap;
        } else {
            break;
        }
    }

    const ssTax = Math.min(total_comp_current, 176100) * 0.062;
    const medTax = total_comp_current * 0.0145;
    const addMedThreshold = isMFJ ? 250000 : 200000;
    const addMedTax = maxVal(0, total_comp_current - addMedThreshold) * 0.009;

    const noTaxStates = ['TX', 'FL', 'NV', 'WA', 'TN', 'NH', 'SD', 'WY', 'AK'];
    const highTaxStates = ['CA', 'NY', 'NJ', 'HI', 'OR', 'MN'];
    let stateRate = 0.045;
    if (noTaxStates.includes(input.state)) stateRate = 0;
    else if (highTaxStates.includes(input.state)) stateRate = 0.09;
    const state_tax = agi_est * stateRate;

    const totalTax = fedTax + ssTax + medTax + addMedTax + state_tax;
    const effectiveRate = total_comp_current > 0 ? (totalTax / total_comp_current) : 0;

    return { totalTax, effectiveRate };
};

// --- SECTION F: ALERT LIBRARY ---
interface AlertSpec {
    id: string;
    category: string;
    title: string;
    description: string;
    status: 'critical' | 'warning' | 'info';
    sortScore: number;
    triggerFn: (input: FinancialInput, derived: any) => boolean;
}

const alertLibrary: AlertSpec[] = [
    {
        id: 'HUMAN_CAPITAL_SNAPSHOT',
        category: 'human_capital',
        title: "Human Capital Snapshot",
        description: "Based on your inputs, your future earning potential may be a meaningful financial asset alongside your current net worth. For accumulators with a large share of lifetime earnings ahead, the ability to convert income into long-term assets can materially influence flexibility over time.",
        status: 'info',
        sortScore: 2000,
        triggerFn: () => true
    },
    {
        id: 'LIQ_CRITICAL_01',
        category: 'liquidity',
        title: "Critical Liquidity Risk",
        description: "Based on your inputs, your liquid reserves appear lower than what is commonly maintained by households with volatile income. In periods of income disruption—such as a commission slowdown, equity timing delay, or job transition—this may increase the risk of forced financial or career decisions.",
        status: 'critical',
        sortScore: 1000,
        triggerFn: (input, derived) => (derived.income_volatility_level === 'High' || derived.income_volatility_level === 'Moderate') && derived.cash_runway_months < 6
    },
    {
        id: 'CF_NEG_01',
        category: 'liquidity',
        title: "Negative Cash Flow Pattern",
        description: "Your reported monthly spending exceeds your take-home income. Over time, patterns like this can place pressure on savings and reduce flexibility, particularly during income volatility.",
        status: 'critical',
        sortScore: 950,
        triggerFn: (input, derived) => derived.monthly_surplus < 0
    },
    {
        id: 'HC_CONVERSION_01',
        category: 'human_capital',
        title: "Human Capital Conversion Gap",
        description: "Your projected future earnings substantially exceed your current invested assets. When a large share of lifetime earnings is still ahead, the effectiveness of converting income into long-term assets can meaningfully influence future outcomes.",
        status: 'critical',
        sortScore: 900,
        triggerFn: (input, derived) => derived.human_capital_est > 5 * input.netWorth && (derived.annual_surplus / maxVal(derived.total_comp_current, 1)) < 0.20
    },
    {
        id: 'INS_DIS_NONE_01',
        category: 'other',
        title: "Disability Coverage Gap",
        description: "You indicated no disability coverage. For working households, income is often the primary financial asset, and limited protection may increase vulnerability to unexpected disruptions.",
        status: 'critical',
        sortScore: 850,
        triggerFn: (input) => input.disabilityCoverage === 'None' && input.age <= 50
    },
    {
        id: 'INS_LIFE_NONE_DEP_01',
        category: 'other',
        title: "Life Coverage Gap (Dependents)",
        description: "You indicated no life insurance coverage while others may rely on your income. In similar situations, households often review how income disruption could affect longer-term plans.",
        status: 'critical',
        sortScore: 800,
        triggerFn: (input, derived) => input.lifeInsuranceCoverage === 'None' && derived.has_dependents === true
    },
    {
        id: 'ESTATE_NONE_KIDS_01',
        category: 'other',
        title: "Guardianship Planning Gap",
        description: "You indicated no estate planning documents while having dependent children. In many households, this is where guardianship preferences are formally documented, which can reduce uncertainty during unexpected events.",
        status: 'critical',
        sortScore: 750,
        triggerFn: (input, derived) => input.hasEstatePlan === 'No' && derived.has_dependents === true
    },
    {
        id: 'RISK_CONC_01',
        category: 'risk',
        title: "Concentrated Position Noted",
        description: "You indicated a concentrated position in a single holding. Concentration can increase portfolio volatility, and some households evaluate a range of risk-management approaches depending on taxes, timelines, and constraints.",
        status: 'critical',
        sortScore: 700,
        triggerFn: (input) => input.hasConcentratedPosition === true
    },
    {
        id: 'LIQ_LOW_LOWVOL_01',
        category: 'liquidity',
        title: "Liquidity Below 3-Month Baseline",
        description: "Based on your inputs, your liquid reserves appear below a commonly used 3-month baseline. In some cases, this can increase sensitivity to unexpected expenses or short-term income disruption.",
        status: 'warning',
        sortScore: 640,
        triggerFn: (input, derived) => derived.income_volatility_level === 'Low' && derived.cash_runway_months < 3
    },
    {
        id: 'SAVE_RATE_01',
        category: 'liquidity',
        title: "Savings Rate Below Accumulator Norms",
        description: "Based on your inputs, the portion of income being saved appears lower than what is commonly seen among high-income accumulators focused on building long-term flexibility.",
        status: 'warning',
        sortScore: 630,
        triggerFn: (input, derived) => (derived.annual_surplus / maxVal(derived.total_comp_current, 1)) < 0.20 && derived.monthly_surplus > 0
    },
    {
        id: 'TAX_PRETAX_01',
        category: 'tax',
        title: "Limited Pre-Tax Utilization at Higher Income",
        description: "At higher income levels, taxes can meaningfully affect how income converts into long-term wealth. Your inputs suggest some commonly used pre-tax strategies may not be fully utilized.",
        status: 'warning',
        sortScore: 620,
        triggerFn: (input, derived) => {
            const highIncome = (input.filingStatus === 'Single' && derived.total_comp_current >= 201776) || (input.filingStatus === 'Married Filing Jointly' && derived.total_comp_current >= 403551);
            return highIncome && input.maxing401k === 'No';
        }
    },
    {
        id: 'EQ_GRANT_CONC_01',
        category: 'risk',
        title: "Equity Grant Concentration",
        description: "A significant portion of your compensation appears tied to equity grants. In similar situations, timing, concentration, and tax treatment can influence how reliably income translates into usable capital.",
        status: 'warning',
        sortScore: 610,
        triggerFn: (input, derived) => input.equityCompensation.includes('None') === false && input.equityGrantValue >= (0.30 * derived.total_comp_current)
    },
    {
        id: 'DATA_MISMATCH_01',
        category: 'other',
        title: "Potential Data Inconsistency",
        description: "Some of your entries appear directionally inconsistent (for example, monthly take-home relative to annual compensation). This may reflect taxes/benefits/withholding differences—or a data entry issue that could change the outputs.",
        status: 'warning',
        sortScore: 600,
        triggerFn: (input, derived) => absVal(input.monthlyTakeHome - (derived.total_comp_current / 12)) > (0.50 * (derived.total_comp_current / 12))
    },
    {
        id: 'RET_CONC_01',
        category: 'risk',
        title: "Retirement-Heavy Asset Mix",
        description: "Your inputs suggest a high concentration of wealth in retirement accounts. In some cases, households evaluate how much flexibility they want in taxable or liquid accounts for goals before traditional retirement ages.",
        status: 'warning',
        sortScore: 590,
        triggerFn: (input) => input.netWorth > 0 && input.retirementBalance >= (0.80 * input.netWorth)
    },
    {
        id: 'RET_ROTH_CONC_01',
        category: 'risk',
        title: "Roth-Heavy Retirement Mix",
        description: "You indicated a Roth-heavy retirement mix. Roth assets can be valuable for tax-free growth, though the optimal balance can vary based on expected future income, tax rates, and withdrawal timing.",
        status: 'warning',
        sortScore: 580,
        triggerFn: (input) => input.retirementSplit === 'MostlyRoth'
    },
    {
        id: 'RET_PRETAX_CONC_01',
        category: 'risk',
        title: "Pre-Tax-Heavy Retirement Mix",
        description: "You indicated a pre-tax-heavy retirement mix. Pre-tax deferral can be efficient, though some households monitor future tax-rate uncertainty and withdrawal flexibility when evaluating overall balance.",
        status: 'warning',
        sortScore: 570,
        triggerFn: (input) => input.retirementSplit === 'MostlyTraditional'
    },
    {
        id: 'VAR_INCOME_HIGH_01',
        category: 'liquidity',
        title: "High Variable Income Profile",
        description: "Your inputs suggest a high proportion of compensation is variable. In similar situations, households sometimes use more structured cash flow systems to reduce month-to-month volatility and avoid overcommitting during strong periods.",
        status: 'warning',
        sortScore: 560,
        triggerFn: (input, derived) => derived.income_volatility_level === 'High'
    },
    {
        id: 'CPA_SE_01',
        category: 'tax',
        title: "Self-Employment Without CPA Coordination",
        description: "You indicated self-employment income and no CPA relationship. In some cases, 1099/self-employment income can introduce additional tax and retirement-plan complexity that benefits from coordinated review.",
        status: 'warning',
        sortScore: 550,
        triggerFn: (input) => input.hasSelfEmploymentIncome === true && input.hasCPA === 'No'
    },
    {
        id: 'CPA_RE_01',
        category: 'tax',
        title: "Real Estate Investing Without CPA Coordination",
        description: "You indicated real estate investments and no CPA relationship. In some cases, real estate tax rules and reporting can affect outcomes, and households coordinate planning decisions with tax professionals.",
        status: 'warning',
        sortScore: 540,
        triggerFn: (input) => input.hasRealEstateInvestments === true && input.hasCPA === 'No'
    },
    {
        id: 'TAX_BRACKET_RE_01',
        category: 'tax',
        title: "High Marginal Bracket Without Real Estate Exposure",
        description: "Your inputs suggest a higher marginal bracket and no real estate investments. Some households evaluate whether real estate belongs in their plan due to potential tax characteristics, though these investments also carry additional risks and complexity.",
        status: 'warning',
        sortScore: 530,
        triggerFn: (input, derived) => {
            const highIncome = (input.filingStatus === 'Single' && derived.total_comp_current >= 201776) || (input.filingStatus === 'Married Filing Jointly' && derived.total_comp_current >= 403551);
            return highIncome && input.hasRealEstateInvestments === false;
        }
    },
    {
        id: 'SURPLUS_UNSURE_01',
        category: 'liquidity',
        title: "Surplus Consistency Unclear",
        description: "You indicated uncertainty about whether you typically run a monthly surplus. In some cases, a short cash flow review can clarify recurring expenses and identify drivers of variability.",
        status: 'warning',
        sortScore: 520,
        triggerFn: (input) => input.runsSurplus === 'Unsure'
    },
    {
        id: 'SAVE_SYSTEM_01',
        category: 'liquidity',
        title: "No Defined Savings System Noted",
        description: "You indicated no defined savings target or system. In similar situations, households sometimes find that a clear structure improves consistency and reduces decision fatigue.",
        status: 'warning',
        sortScore: 510,
        triggerFn: (input) => input.hasSavingsSystem === false
    },
    {
        id: 'LIQ_EXCESS_01',
        category: 'liquidity',
        title: "Elevated Cash Holdings",
        description: "Your cash holdings appear higher than what is typically held for short-term needs. While this may be intentional, elevated cash balances can affect long-term growth if not tied to a specific purpose.",
        status: 'info',
        sortScore: 400,
        triggerFn: (input, derived) => derived.cash_runway_months > 12
    },
    {
        id: 'TAX_CPA_NONE_01',
        category: 'tax',
        title: "Limited Tax Coordination",
        description: "You indicated that you do not currently work with a CPA. As income complexity increases, some households coordinate planning decisions more closely with tax professionals.",
        status: 'info',
        sortScore: 390,
        triggerFn: (input) => input.hasCPA === 'No'
    },
    {
        id: 'WHOLE_LIFE_01',
        category: 'risk',
        title: "Permanent Life Policy Present",
        description: "You indicated ownership of a permanent life insurance policy. These policies can vary widely in structure and purpose and are often reviewed periodically to ensure alignment with broader goals.",
        status: 'info',
        sortScore: 380,
        triggerFn: (input) => input.hasWholeLife === 'Yes'
    },
    {
        id: 'ADV_INVEST_01',
        category: 'risk',
        title: "Advanced Investment Access",
        description: "Your inputs suggest asset levels that may provide access to a broader range of investment structures. In some cases, these options can influence diversification and after-tax results.",
        status: 'info',
        sortScore: 370,
        triggerFn: (input) => input.netWorth >= 5000000
    },
    {
        id: 'BACKDOOR_ROTH_01',
        category: 'tax',
        title: "Potential Backdoor Roth Relevance",
        description: "Your inputs suggest income may be above commonly cited thresholds for direct Roth IRA contributions. In some cases, households evaluate alternative contribution methods depending on their tax situation.",
        status: 'info',
        sortScore: 360,
        triggerFn: (input, derived) => {
            const isMFJ = input.filingStatus === 'Married Filing Jointly';
            return (!isMFJ && derived.total_comp_current > 161000) || (isMFJ && derived.total_comp_current > 240000);
        }
    },
    {
        id: 'HOUSE_PAID_OFF_01',
        category: 'risk',
        title: "Paid-Off Home Noted",
        description: "You indicated a fully paid-off home. In many cases, lower fixed housing costs can increase the capacity to build liquid or investable assets over time, depending on goals and cash flow.",
        status: 'info',
        sortScore: 350,
        triggerFn: (input) => input.housingStatus === 'own' && input.mortgageBalance === 0 && input.homeValue > 0
    },
    {
        id: 'SOLO401K_01',
        category: 'tax',
        title: "Self-Employment Retirement Plan Opportunity",
        description: "You indicated self-employment / 1099 income. In some cases, this can open access to additional retirement-plan options that may affect tax outcomes and long-term savings capacity.",
        status: 'info',
        sortScore: 340,
        triggerFn: (input) => input.hasSelfEmploymentIncome === true
    },
    {
        id: 'UMBRELLA_GAP_01',
        category: 'risk',
        title: "Umbrella Coverage Noted as Absent",
        description: "Based on your inputs, household assets and/or income may increase exposure to liability risk. Some households evaluate umbrella coverage as an additional layer of protection depending on circumstances.",
        status: 'info',
        sortScore: 330,
        triggerFn: (input, derived) => (input.netWorth > 1000000 || derived.total_comp_current > 300000) && input.hasUmbrella === 'No'
    },
    {
        id: 'ESTATE_STALE_01',
        category: 'other',
        title: "Estate Plan Review Timing",
        description: "You indicated having estate documents, but the last review appears dated or unclear. In some cases, life events or asset changes can make periodic reviews relevant.",
        status: 'info',
        sortScore: 320,
        triggerFn: (input) => input.hasEstatePlan === 'Yes' && (input.estateLastReviewed === 'More than 5 years ago' || input.estateLastReviewed === 'Never / Unsure')
    },
    {
        id: 'BASELINE_OK_01',
        category: 'other',
        title: "No Major Issues Detected",
        description: "Based on the information provided, no major risk flags were identified by this rules-based scan. Many households still use a deeper review to confirm assumptions, validate inputs, and identify more nuanced planning opportunities.",
        status: 'info',
        sortScore: 10,
        triggerFn: () => false // Handled manually by selection logic
    }
];

export const generateFinancialInsights = async (input: FinancialInput): Promise<AIAnalysis> => {
    // --- SECTION B: DERIVED VALUES ---
    const total_comp_current = input.annualBaseIncome + input.annualVariableComp;
    const variable_pct = total_comp_current > 0 ? (input.annualVariableComp / total_comp_current) : 0;
    const monthly_surplus = input.monthlyTakeHome - input.monthlySpending;
    const annual_surplus = monthly_surplus * 12;
    const cash_runway_months = input.monthlySpending > 0 ? (input.cashHoldings / input.monthlySpending) : 0;
    const income_change_pct = (total_comp_current - input.lastYearTotalComp) / maxVal(input.lastYearTotalComp, 1);
    const has_dependents = input.kidsCount >= 1;
    const investable_assets_est = input.netWorth;

    // --- SECTION C: HUMAN CAPITAL ---
    const years_remaining = maxVal(0, 60 - input.age);
    let human_capital_est = 0;
    for (let t = 0; t <= years_remaining; t++) {
        human_capital_est += total_comp_current * Math.pow(1.03, t);
    }
    const human_capital_multiple = human_capital_est / maxVal(input.netWorth, 1);

    // --- SECTION D: VOLATILITY & LIQUIDITY ---
    let income_volatility_level: 'High' | 'Moderate' | 'Low' = 'Low';
    if (variable_pct >= 0.40) income_volatility_level = 'High';
    else if (variable_pct >= 0.20) income_volatility_level = 'Moderate';

    let required_liquidity_months = 3;
    if (income_volatility_level === 'High') required_liquidity_months = 6;
    else if (income_volatility_level === 'Moderate') required_liquidity_months = 4;

    const derived = {
        total_comp_current,
        variable_pct,
        income_volatility_level,
        required_liquidity_months,
        monthly_surplus,
        annual_surplus,
        cash_runway_months,
        income_change_pct,
        has_dependents,
        investable_assets_est,
        human_capital_est,
        human_capital_multiple
    };

    const taxStats = calculateTax2026(input, total_comp_current);

    // --- SECTION G: SELECTION & ORDERING ---
    // Exclude Baseline from default evaluation
    const triggered = alertLibrary.filter(a => a.id !== 'BASELINE_OK_01' && a.triggerFn(input, derived));
    const triggeredAlertIds = triggered.map(a => a.id);

    // Filter non-snapshot triggered alerts
    const nonSnapshotTriggered = triggered.filter(a => a.id !== 'HUMAN_CAPITAL_SNAPSHOT');
    const snapshot = alertLibrary.find(a => a.id === 'HUMAN_CAPITAL_SNAPSHOT')!;
    
    let presented: AlertSpec[] = [];

    if (nonSnapshotTriggered.length === 0) {
        // Fallback case: Snapshot + Baseline info
        const baseline = alertLibrary.find(a => a.id === 'BASELINE_OK_01')!;
        presented = [snapshot, baseline];
    } else {
        presented = [snapshot];
        
        // Priority 1: Critical Liquidity
        const liqCritical = nonSnapshotTriggered.find(a => a.id === 'LIQ_CRITICAL_01');
        if (liqCritical) presented.push(liqCritical);

        // Priority 2: Pool by sort score
        let pool = nonSnapshotTriggered.filter(a => a.id !== 'LIQ_CRITICAL_01');
        pool.sort((a, b) => b.sortScore - a.sortScore || a.id.localeCompare(b.id));

        // Up to 6 total insights
        while (presented.length < 6 && pool.length > 0) {
            presented.push(pool.shift()!);
        }
    }

    return {
        headline: presented.some(p => p.status === 'critical') ? "Immediate Action Items Detected" : "Wealth Accumulation Audit Complete",
        keyFacts: {
            totalComp: total_comp_current,
            effectiveTaxRate: taxStats.effectiveRate,
            totalTaxEst: taxStats.totalTax,
            monthlySurplus: monthly_surplus,
            savingsRate: total_comp_current > 0 ? (annual_surplus / total_comp_current) : 0,
            cashRunwayMonths: cash_runway_months,
            netWorthExHome: input.netWorth
        },
        publicInsights: presented.map(a => ({
            title: a.title,
            description: a.description,
            status: a.status
        })),
        hiddenRoadmapItems: [
            "These observations reflect common patterns seen among high-income accumulators.",
            "A short discovery call can help determine whether any of these areas warrant deeper review."
        ],
        compliance: {
            engineVersion: ENGINE_VERSION,
            generatedAtISO: new Date().toISOString(),
            rawInput: { ...input },
            derived: { ...derived },
            triggeredAlertIds,
            presentedAlertIds: presented.map(p => p.id)
        }
    };
};
