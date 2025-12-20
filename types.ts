
export interface FinancialInput {
  // --- SECTION 1: General Profile ---
  firstName: string;
  age: number;
  kidsCount: number;
  filingStatus: string; // Single, Married Filing Jointly, Other
  state: string;
  financialObjectives: string[];
  primaryConcern: string;
  jobTitle: string;
  employer: string;
  additionalNotes: string;

  // --- SECTION 2: Income & Tax ---
  annualBaseIncome: number;
  annualVariableComp: number;
  lastYearTotalComp: number;
  equityCompensation: string[]; // RSUs, ISOs, NSOs, ESPP, Other, None
  equityGrantValue: number; // New field
  maxing401k: string; // Yes, No, Unsure
  hsaEligible: string; // Yes, No, Unsure
  hsaContributing: string; // Yes, No, Unsure
  hasCPA: string; // Yes, No, Sometimes
  hasSelfEmploymentIncome: boolean;
  hasRealEstateInvestments: boolean;

  // --- SECTION 3: Cash Flow ---
  monthlyTakeHome: number;
  monthlySpending: number;
  runsSurplus: string; // Yes, No, Unsure
  surplusAllocation: string; // Retirement, Taxable, Cash, Varies
  hasSavingsSystem: boolean;

  // --- SECTION 4: Assets & Liquidity ---
  netWorth: number; // Exclude primary home
  retirementBalance: number;
  retirementSplit: string; // MostlyTraditional, Roughly split, MostlyRoth, Unsure
  cashHoldings: number;
  hasConcentratedPosition: boolean;
  housingStatus: 'rent' | 'own';
  // If Own:
  monthlyHousingPayment: number;
  mortgageBalance: number;
  homeValue: number;

  // --- SECTION 5: Risk & Estate ---
  disabilityCoverage: string; // None, Work, Private, Both
  lifeInsuranceCoverage: string; // None, Work, Private, Both, NA
  hasWholeLife: string; // Yes, No, Unsure
  hasUmbrella: string; // Yes, No, Unsure
  hasEstatePlan: string; // Yes, No, Unsure
  estateLastReviewed: string; // Within the last 3 years, 3–5 years ago, More than 5 years ago, Never / Unsure

  // --- GATE INFO ---
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface KeyFacts {
  totalComp: number;
  effectiveTaxRate: number;
  totalTaxEst: number;
  monthlySurplus: number;
  savingsRate: number; // New metric
  cashRunwayMonths: number;
  netWorthExHome: number;
}

export interface AIAnalysis {
  headline: string;
  keyFacts: KeyFacts;
  publicInsights: Array<{
    title: string;
    description: string;
    status: 'critical' | 'warning' | 'good' | 'info';
  }>;
  hiddenRoadmapItems: string[];
  compliance?: {
    engineVersion: string;
    generatedAtISO: string;
    rawInput: FinancialInput;
    derived: {
      total_comp_current: number;
      variable_pct: number;
      income_volatility_level: 'High' | 'Moderate' | 'Low';
      required_liquidity_months: number;
      monthly_surplus: number;
      annual_surplus: number;
      cash_runway_months: number;
      income_change_pct: number;
      has_dependents: boolean;
      investable_assets_est: number;
      human_capital_est: number;
      human_capital_multiple: number;
    };
    triggeredAlertIds: string[];
    presentedAlertIds: string[];
  };
}
