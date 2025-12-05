
import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight, 
  Info, 
  Lock, 
  TrendingUp
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { FinancialInput, AIAnalysis } from '../types';
import { generateFinancialInsights } from '../services/geminiService';
import { logClientData } from '../services/loggingService';

// --- Helper: Formatted Simple Input ---
const FormattedInput: React.FC<{
    value: number;
    onChange: (val: number) => void;
    placeholder?: string;
}> = ({ value, onChange, placeholder }) => {
    const formatNumber = (num: number) => num === 0 ? '' : new Intl.NumberFormat('en-US').format(num);
    const [localValue, setLocalValue] = useState<string>(formatNumber(value));

    useEffect(() => {
        if (document.activeElement?.tagName !== 'INPUT') {
            setLocalValue(formatNumber(value));
        }
    }, [value]);

    const handleBlur = () => {
        const parsed = parseInt(localValue.replace(/,/g, '')) || 0;
        onChange(parsed);
        setLocalValue(formatNumber(parsed));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (/^[0-9,]*$/.test(val)) {
            setLocalValue(val);
        }
    };

    return (
        <input 
            type="text" 
            inputMode="numeric"
            className="w-full bg-stone-950 border border-stone-700 rounded p-3 text-stone-200"
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
        />
    );
};


// --- Helper Component: InputRow (Slider + Formatted Input) ---
const InputRow: React.FC<{
    label: string;
    value: number;
    onChange: (val: number) => void;
    min?: number;
    max?: number;
    step?: number;
    prefix?: string;
    tooltip?: string;
}> = ({ label, value, onChange, min = 0, max = 500000, step = 1000, prefix = '$', tooltip }) => {
    
    const formatNumber = (num: number) => new Intl.NumberFormat('en-US').format(num);
    const [localValue, setLocalValue] = useState<string>(formatNumber(value));

    useEffect(() => {
        const parsedLocal = parseInt(localValue.replace(/,/g, '')) || 0;
        if (parsedLocal !== value) {
             setLocalValue(formatNumber(value));
        }
    }, [value]);

    const handleBlur = () => {
        let parsed = parseInt(localValue.replace(/,/g, '')) || 0;
        if (parsed < min) parsed = min;
        onChange(parsed);
        setLocalValue(formatNumber(parsed));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (/^[0-9,]*$/.test(val)) {
            setLocalValue(val);
        } else if (val === '') {
            setLocalValue('');
        }
    };

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        setLocalValue(formatNumber(val));
        onChange(val);
    };

    return (
        <div className="mb-6 w-full">
            <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-stone-300 flex items-center gap-2">
                    {label}
                    {tooltip && (
                        <div className="group relative">
                            <Info size={14} className="text-stone-500 cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-stone-800 border border-stone-700 rounded-lg shadow-xl text-xs text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-pre-line">
                                {tooltip}
                            </div>
                        </div>
                    )}
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-sm">{prefix}</span>
                    <input 
                        type="text" 
                        inputMode="numeric"
                        className="w-36 bg-stone-950 border border-stone-800 rounded-lg py-1.5 pl-6 pr-3 text-right text-stone-200 text-sm focus:border-emerald-500 outline-none transition-colors"
                        value={localValue}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                    />
                </div>
            </div>
            <input 
                type="range" 
                min={min} 
                max={max} 
                step={step} 
                value={typeof value === 'number' ? value : 0} 
                onChange={handleSliderChange}
                className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
        </div>
    );
};

// --- Helper: Tooltip for Chart ---
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-stone-900 border border-stone-800 p-4 rounded-xl shadow-xl">
          <p className="text-stone-300 text-sm font-bold mb-2">Age {label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-stone-400">{entry.name}:</span>
              <span className="text-stone-100 font-mono">
                ${new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 1 }).format(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
};

// --- Main Component ---

const initialInput: FinancialInput = {
    age: 32,
    employer: '',
    role: '',
    lastYearCompensation: 0,
    advisoryGoals: [],
    state: 'CA',
    filingStatus: 'single',
    dependents: 0,
    hasCPA: false,
    baseSalary: 160000,
    variableComp: 40000,
    monthlySpend: 8000,
    hasLifeInsurance: false,
    lifeInsuranceSource: 'Work Only',
    hasDisabilityInsurance: false,
    disabilitySource: 'Work Only',
    hasUmbrella: false,
    knowsAutoLimits: false,
    hasYoungDrivers: false,
    beneficiariesUpdated: false,
    hasEstatePlan: false,
    estatePlanDate: 'old', // default to safe or old
    cashAmount: 50000,
    employerStock: 0,
    investedAmount: 100000,
    hasNonMortgageDebt: false,
    nonMortgageDebtAmount: 0,
    accountTypes: [],
    hasPermanentInsurance: false,
    hasRealEstate: false
};

const Calculator: React.FC<{ onBook: (source?: 'general' | 'audit') => void }> = ({ onBook }) => {
    const [inputs, setInputs] = useState<FinancialInput>(initialInput);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<AIAnalysis | null>(null);
    const [activeSection, setActiveSection] = useState<number>(0);
    const [chartData, setChartData] = useState<any[]>([]);
    const [hasRun, setHasRun] = useState(false);

    const handleInputChange = (field: keyof FinancialInput, value: any) => {
        setInputs(prev => ({ ...prev, [field]: value }));
    };

    const calculateProjections = (gross: number, surplus: number, startAssets: number) => {
        const data = [];
        let currentWealth = startAssets;
        let potentialWealth = startAssets;
        const years = 10;
        
        const potentialSavings = Math.max(gross * 0.20, surplus);
        const currentSavings = Math.max(0, surplus); 
        const statusQuoSavings = currentSavings * 0.5; // Assume 50% leakage

        for (let i = 0; i <= years; i++) {
            data.push({
                year: inputs.age + i,
                Current: Math.round(currentWealth),
                Potential: Math.round(potentialWealth),
            });
            currentWealth = (currentWealth * 1.06) + statusQuoSavings; 
            potentialWealth = (potentialWealth * 1.06) + potentialSavings;
        }
        return data;
    };

    const handleRunAudit = async () => {
        setLoading(true);
        const computedGross = inputs.baseSalary + inputs.variableComp;
        const computedTaxEst = computedGross * 0.30;
        const computedNetPay = computedGross - computedTaxEst;
        const computedSurplus = computedNetPay - (inputs.monthlySpend * 12);
        
        const fullInput = {
            ...inputs,
            computedGross,
            computedTaxEst,
            computedNetPay,
            computedSurplus
        };

        logClientData('WEALTH_SIMULATOR', fullInput);

        const netWorth = (inputs.cashAmount + inputs.investedAmount + inputs.employerStock) - (inputs.hasNonMortgageDebt ? inputs.nonMortgageDebtAmount : 0);
        const chart = calculateProjections(computedGross, computedSurplus, netWorth);
        setChartData(chart);

        try {
            const analysis = await generateFinancialInsights(fullInput);

            logClientData('WEALTH_SIMULATOR_ANALYSIS', analysis);
            setResult(analysis);
            setHasRun(true);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setActiveSection(-1);
        }
    };

    const calculateHumanCapitalPotential = () => {
        let income = inputs.baseSalary + inputs.variableComp;
        const incomeGrowth = 0.03;
        const yearsTo60 = 60 - inputs.age;
        if (yearsTo60 <= 0) return 0;

        let totalFutureIncome = 0;
        for (let i = 0; i < yearsTo60; i++) {
            totalFutureIncome += income;
            income = income * (1 + incomeGrowth);
        }
        return totalFutureIncome;
    };

    const humanCapitalValue = calculateHumanCapitalPotential();

    return (
        <section className="py-24 bg-stone-950" id="calculator">
            <div className="max-w-4xl mx-auto px-4">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-stone-100 mb-4 font-display">Your Human Capital Audit</h2>
                    <p className="text-stone-400 text-lg max-w-2xl mx-auto">
                        <strong>Quantify</strong> your human capital, identify where your high income is leaking, and <strong>project</strong> the 10-year cost of the status quo.
                    </p>
                </div>

                {/* --- INPUT FORM --- */}
                <div className="bg-stone-900 border border-stone-800 rounded-2xl shadow-xl overflow-hidden mb-12">
                    
                    {/* 1. General Info */}
                    <div className="border-b border-stone-800">
                        <button 
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-stone-800 transition-colors"
                            onClick={() => setActiveSection(activeSection === 0 ? -1 : 0)}
                        >
                            <span className="text-lg font-bold text-stone-200 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-emerald-500 text-sm">1</div>
                                General Information
                            </span>
                            {activeSection === 0 ? <ChevronUp className="text-emerald-500"/> : <ChevronDown className="text-stone-500"/>}
                        </button>
                        {activeSection === 0 && (
                            <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                                <div>
                                    <label className="text-xs text-stone-400 mb-1 block">Current Age</label>
                                    <input type="number" className="w-full bg-stone-950 border border-stone-700 rounded p-3 text-stone-200" 
                                        value={inputs.age} onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)} />
                                </div>
                                <div>
                                    <label className="text-xs text-stone-400 mb-1 block">Employer</label>
                                    <input type="text" className="w-full bg-stone-950 border border-stone-700 rounded p-3 text-stone-200" 
                                        value={inputs.employer} onChange={(e) => handleInputChange('employer', e.target.value)} placeholder="e.g. Google" />
                                </div>
                                <div>
                                    <label className="text-xs text-stone-400 mb-1 block">Role</label>
                                    <input type="text" className="w-full bg-stone-950 border border-stone-700 rounded p-3 text-stone-200" 
                                        value={inputs.role} onChange={(e) => handleInputChange('role', e.target.value)} placeholder="e.g. Sr Director" />
                                </div>
                                <div>
                                    <label className="text-xs text-stone-400 mb-1 block">Last Year's Total Comp</label>
                                    <FormattedInput 
                                        value={inputs.lastYearCompensation} 
                                        onChange={(v) => handleInputChange('lastYearCompensation', v)} 
                                        placeholder="$0"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. Income & Tax */}
                    <div className="border-b border-stone-800">
                        <button 
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-stone-800 transition-colors"
                            onClick={() => setActiveSection(activeSection === 1 ? -1 : 1)}
                        >
                            <span className="text-lg font-bold text-stone-200 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-emerald-500 text-sm">2</div>
                                Income & Tax Profile
                            </span>
                            {activeSection === 1 ? <ChevronUp className="text-emerald-500"/> : <ChevronDown className="text-stone-500"/>}
                        </button>
                        {activeSection === 1 && (
                            <div className="p-6 pt-0 animate-in slide-in-from-top-2 duration-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                    <InputRow label="Base Salary" value={inputs.baseSalary} onChange={(v) => handleInputChange('baseSalary', v)} max={1000000} />
                                    <InputRow label="Variable Comp (Bonus/RSU)" value={inputs.variableComp} onChange={(v) => handleInputChange('variableComp', v)} max={2000000} tooltip="Include target bonus, commissions, and RSU vesting value." />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 items-start">
                                     <div>
                                        <InputRow label="Monthly Spending" value={inputs.monthlySpend} onChange={(v) => handleInputChange('monthlySpend', v)} max={50000} step={100} tooltip="Everything going out the door: Mortgage, Kids, Travel, Food. Do not include savings/investments." />
                                     </div>

                                     <div className="flex flex-col gap-4 pt-1">
                                         <div className="grid grid-cols-2 gap-4 items-center">
                                            <div>
                                                <label className="text-xs text-stone-400 mb-1 block">Filing Status</label>
                                                <select className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-200 text-sm h-[38px]"
                                                    value={inputs.filingStatus} onChange={(e) => handleInputChange('filingStatus', e.target.value)}
                                                >
                                                    <option value="single">Single</option>
                                                    <option value="joint">Married (Joint)</option>
                                                </select>
                                            </div>
                                            <div>
                                                 <label className="text-xs text-stone-400 mb-1 block">State</label>
                                                 <select className="w-full bg-stone-950 border border-stone-700 rounded p-2 text-stone-200 text-sm h-[38px]"
                                                    value={inputs.state} onChange={(e) => handleInputChange('state', e.target.value)}
                                                >
                                                    {['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'].map(s => <option key={s} value={s}>{s}</option>)}
                                                 </select>
                                            </div>
                                         </div>
                                         <label className="flex items-center gap-2 cursor-pointer mt-2">
                                            <input type="checkbox" className="accent-emerald-500 w-4 h-4" checked={inputs.hasCPA} onChange={(e) => handleInputChange('hasCPA', e.target.checked)} />
                                            <span className="text-sm text-stone-300">I work with a CPA</span>
                                         </label>
                                     </div>
                                </div>
                                {inputs.filingStatus === 'joint' && (
                                    <p className="text-xs text-emerald-500/80 bg-emerald-900/10 p-2 rounded border border-emerald-900/30">
                                        Note: Please ensure Base Salary & Variable Comp include TOTAL household income.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 3. Assets */}
                    <div className="border-b border-stone-800">
                        <button 
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-stone-800 transition-colors"
                            onClick={() => setActiveSection(activeSection === 2 ? -1 : 2)}
                        >
                            <span className="text-lg font-bold text-stone-200 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-emerald-500 text-sm">3</div>
                                Assets & Net Worth
                            </span>
                            {activeSection === 2 ? <ChevronUp className="text-emerald-500"/> : <ChevronDown className="text-stone-500"/>}
                        </button>
                        {activeSection === 2 && (
                            <div className="p-6 pt-0 animate-in slide-in-from-top-2 duration-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                    <InputRow label="Cash & Savings" value={inputs.cashAmount} onChange={(v) => handleInputChange('cashAmount', v)} max={1000000} step={5000} />
                                    <InputRow label="Invested Assets" value={inputs.investedAmount} onChange={(v) => handleInputChange('investedAmount', v)} max={3000000} step={5000} tooltip="Total of 401k, IRAs, Brokerage. Do NOT include home equity." />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                     <InputRow label="Employer Stock" value={inputs.employerStock} onChange={(v) => handleInputChange('employerStock', v)} max={3000000} step={5000} tooltip={`Important: Only include VESTED shares here.\nUnvested RSUs should be counted in "Variable Comp" as future income.`} />
                                </div>
                                
                                {/* Debt Section */}
                                <div className="mb-6 p-4 bg-stone-900/50 border border-stone-800 rounded-lg">
                                    <label className="flex items-center gap-2 cursor-pointer mb-4">
                                        <input type="checkbox" className="accent-emerald-500 w-4 h-4" checked={inputs.hasNonMortgageDebt} onChange={(e) => handleInputChange('hasNonMortgageDebt', e.target.checked)} />
                                        <span className="text-sm text-stone-300 font-bold">I have non-mortgage debt (Credit Cards, Student Loans)</span>
                                    </label>
                                    {inputs.hasNonMortgageDebt && (
                                        <div className="animate-in slide-in-from-top-2 duration-200">
                                            <InputRow label="Estimated Debt Amount" value={inputs.nonMortgageDebtAmount} onChange={(v) => handleInputChange('nonMortgageDebtAmount', v)} max={500000} step={1000} />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="text-xs text-stone-400 mb-2 block">Account Types</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {['401k/403b', 'Roth 401(k)', 'Roth IRA', 'Trad IRA', 'Brokerage', 'HSA', '529 Plan', 'Crypto'].map(type => (
                                            <label key={type} className="flex items-center gap-2 p-2 bg-stone-900 border border-stone-800 rounded hover:border-emerald-500/50 cursor-pointer">
                                                <input type="checkbox" className="accent-emerald-500" 
                                                    checked={inputs.accountTypes.includes(type)}
                                                    onChange={(e) => {
                                                        const newTypes = e.target.checked 
                                                            ? [...inputs.accountTypes, type]
                                                            : inputs.accountTypes.filter(t => t !== type);
                                                        handleInputChange('accountTypes', newTypes);
                                                    }}
                                                />
                                                <span className="text-xs text-stone-300">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 4. Risk & Protection */}
                    <div className="border-b border-stone-800">
                        <button 
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-stone-800 transition-colors"
                            onClick={() => setActiveSection(activeSection === 3 ? -1 : 3)}
                        >
                             <span className="text-lg font-bold text-stone-200 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-emerald-500 text-sm">4</div>
                                Risk & Protection
                            </span>
                            {activeSection === 3 ? <ChevronUp className="text-emerald-500"/> : <ChevronDown className="text-stone-500"/>}
                        </button>
                        {activeSection === 3 && (
                            <div className="p-6 pt-0 animate-in slide-in-from-top-2 duration-200 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs text-stone-400 mb-1 block">Number of Dependents</label>
                                        <input type="number" className="w-full bg-stone-950 border border-stone-700 rounded p-3 text-stone-200" 
                                            value={inputs.dependents} onChange={(e) => handleInputChange('dependents', parseInt(e.target.value) || 0)} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="flex items-center gap-2 p-3 bg-stone-900/50 border border-stone-800 rounded cursor-pointer">
                                            <input type="checkbox" className="accent-emerald-500" checked={inputs.hasLifeInsurance} onChange={(e) => handleInputChange('hasLifeInsurance', e.target.checked)} />
                                            <span className="text-sm text-stone-300">I have Life Insurance</span>
                                        </label>
                                        {inputs.hasLifeInsurance && (
                                            <select className="bg-stone-950 border border-stone-700 rounded p-2 text-stone-300 text-sm ml-6"
                                                value={inputs.lifeInsuranceSource} onChange={(e) => handleInputChange('lifeInsuranceSource', e.target.value)}
                                            >
                                                <option>Work Only</option>
                                                <option>Private</option>
                                                <option>Both</option>
                                            </select>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="flex items-center gap-2 p-3 bg-stone-900/50 border border-stone-800 rounded cursor-pointer">
                                            <input type="checkbox" className="accent-emerald-500" checked={inputs.hasDisabilityInsurance} onChange={(e) => handleInputChange('hasDisabilityInsurance', e.target.checked)} />
                                            <span className="text-sm text-stone-300">I have Disability Insurance</span>
                                        </label>
                                         {inputs.hasDisabilityInsurance && (
                                            <select className="bg-stone-950 border border-stone-700 rounded p-2 text-stone-300 text-sm ml-6"
                                                value={inputs.disabilitySource} onChange={(e) => handleInputChange('disabilitySource', e.target.value)}
                                            >
                                                <option>Work Only</option>
                                                <option>Private</option>
                                                <option>Both</option>
                                            </select>
                                        )}
                                    </div>
                                    <div>
                                         <label className="flex items-center gap-2 p-3 bg-stone-900/50 border border-stone-800 rounded cursor-pointer mb-2">
                                            <input type="checkbox" className="accent-emerald-500" checked={inputs.hasUmbrella} onChange={(e) => handleInputChange('hasUmbrella', e.target.checked)} />
                                            <span className="text-sm text-stone-300">I have an Umbrella Policy</span>
                                        </label>
                                        <label className="flex items-center gap-2 p-3 bg-stone-900/50 border border-stone-800 rounded cursor-pointer">
                                            <input type="checkbox" className="accent-emerald-500" checked={inputs.hasYoungDrivers} onChange={(e) => handleInputChange('hasYoungDrivers', e.target.checked)} />
                                            <span className="text-sm text-stone-300">Household drivers under 21</span>
                                        </label>
                                    </div>
                                    <div>
                                         <label className="flex items-center gap-2 p-3 bg-stone-900/50 border border-stone-800 rounded cursor-pointer mb-2">
                                            <input type="checkbox" className="accent-emerald-500" checked={inputs.hasEstatePlan} onChange={(e) => handleInputChange('hasEstatePlan', e.target.checked)} />
                                            <span className="text-sm text-stone-300">I have a Will / Trust</span>
                                        </label>
                                         {inputs.hasEstatePlan && (
                                            <select className="bg-stone-950 border border-stone-700 rounded p-2 text-stone-300 text-sm ml-6 mb-2 w-full"
                                                value={inputs.estatePlanDate} onChange={(e) => handleInputChange('estatePlanDate', e.target.value)}
                                            >
                                                <option value="recent">Less than 2 years ago</option>
                                                <option value="medium">2-5 years ago</option>
                                                <option value="old">More than 5 years ago</option>
                                            </select>
                                        )}
                                        <label className="flex items-center gap-2 p-3 bg-stone-900/50 border border-stone-800 rounded cursor-pointer ml-6">
                                            <input type="checkbox" className="accent-emerald-500" checked={inputs.beneficiariesUpdated} onChange={(e) => handleInputChange('beneficiariesUpdated', e.target.checked)} />
                                            <span className="text-sm text-stone-300">Beneficiaries Verified Recently</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="p-6 bg-stone-900 border-t border-stone-800">
                        <button 
                            onClick={handleRunAudit}
                            disabled={loading}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                            {loading ? 'Running Analysis...' : 'Run Audit'}
                        </button>
                        <p className="text-center text-xs text-stone-500 mt-4 leading-relaxed px-4">
                            Data is processed securely via Google Gemini and is not permanently stored by the AI model. 
                            Results are stored for compliance reasons locally by Jeffries Wealth Management. 
                            <br className="hidden sm:block" />
                            <strong className="text-stone-400 font-medium">Do NOT input any personally identifiable information or private data.</strong>
                        </p>
                    </div>
                </div>

                {/* --- RESULTS DASHBOARD (Hidden until Run) --- */}
                {/* PREVIEW/BLURRED STATE */}
                {!hasRun && !loading && (
                    <div className="relative opacity-30 select-none pointer-events-none filter blur-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-stone-900 border border-stone-800 h-40 rounded-2xl"></div>
                            <div className="bg-stone-900 border border-stone-800 h-40 rounded-2xl"></div>
                        </div>
                        <div className="bg-stone-900 border border-stone-800 h-64 rounded-2xl mb-8"></div>
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="bg-stone-950/80 p-6 rounded-xl border border-stone-800 text-center">
                                <Lock className="mx-auto mb-2 text-stone-500" />
                                <span className="text-stone-400 text-sm font-medium">Run Audit to Unlock Results</span>
                            </div>
                        </div>
                    </div>
                )}

                {result && hasRun && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        {/* 1. AI Findings & Human Capital */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {/* Human Capital Potential Card */}
                            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-900/10 rounded-full blur-[40px] translate-x-10 -translate-y-10"></div>
                                <div className="flex items-center gap-2 mb-4 text-emerald-400">
                                    <TrendingUp size={20} />
                                    <span className="font-bold text-sm uppercase tracking-wider">Projected Human Capital</span>
                                </div>
                                <div className="text-4xl font-bold text-stone-100 mb-2 font-mono">
                                    ${new Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 2 }).format(humanCapitalValue)}
                                </div>
                                <p className="text-stone-400 text-sm leading-relaxed mb-4">
                                    The potential value of your income, not including current savings through age 60.
                                </p>
                                <div className="text-[10px] text-stone-600 border-t border-stone-800 pt-3">
                                    *Hypothetical projection for educational purposes. Assumes 3% annual income growth. Not a guarantee.
                                </div>
                            </div>

                             {/* AI Headline Card */}
                            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl flex flex-col justify-center">
                                <h3 className="text-2xl font-bold text-stone-100 mb-2">{result.headline}</h3>
                                <div className="flex flex-col gap-3 mt-2">
                                    {result.publicInsights.map((insight, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            {insight.status === 'critical' ? <AlertCircle size={16} className="text-red-500 shrink-0"/> : 
                                             insight.status === 'warning' ? <AlertCircle size={16} className="text-amber-500 shrink-0"/> :
                                             <CheckCircle size={16} className="text-emerald-500 shrink-0"/>}
                                            <span className="text-stone-300 text-sm font-medium">{insight.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 2. Diagnostic Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {result.publicInsights.map((insight, idx) => (
                                <div key={idx} className={`p-5 rounded-xl border ${
                                    insight.status === 'critical' ? 'bg-red-950/10 border-red-900/30' : 
                                    insight.status === 'warning' ? 'bg-amber-950/10 border-amber-900/30' : 
                                    'bg-emerald-950/10 border-emerald-900/30'
                                }`}>
                                    <div className={`mb-2 font-bold ${
                                        insight.status === 'critical' ? 'text-red-400' : 
                                        insight.status === 'warning' ? 'text-amber-400' : 
                                        'text-emerald-400'
                                    }`}>
                                        {insight.status.toUpperCase()}
                                    </div>
                                    <h4 className="text-stone-200 font-bold text-sm mb-1">{insight.title}</h4>
                                    <p className="text-xs text-stone-400 leading-relaxed">{insight.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* 3. The 10-Year Chart */}
                        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-stone-100">10-Year Opportunity Cost</h3>
                                    <p className="text-sm text-stone-400">The gap between the status quo vs. optimization.</p>
                                </div>
                                <div className="flex gap-4 text-xs font-mono">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                        <span className="text-stone-300">Potential Wealth</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-stone-600"></div>
                                        <span className="text-stone-500">Current Path</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorPotential" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
                                        <XAxis dataKey="year" stroke="#57534e" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis 
                                            stroke="#57534e" 
                                            fontSize={12} 
                                            tickLine={false} 
                                            axisLine={false}
                                            tickFormatter={(value) => `$${value / 1000}k`}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area 
                                            type="monotone" 
                                            dataKey="Potential" 
                                            stroke="#10b981" 
                                            strokeWidth={3}
                                            fillOpacity={1} 
                                            fill="url(#colorPotential)" 
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="Current" 
                                            stroke="#57534e" 
                                            strokeWidth={2}
                                            strokeDasharray="5 5"
                                            fill="transparent" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 text-[10px] text-stone-600 text-center">
                                *Assumes 6% real return. "Potential Wealth" calculates based on a 20% savings target or your actual surplus, whichever is higher. 
                                "Current Path" assumes 50% of surplus is lost to lifestyle creep/inefficiency.
                            </div>
                        </div>

                        {/* 4. Cash Flow Waterfall */}
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                             {/* Block 1: Gross */}
                             <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 text-center h-28 w-full md:w-1/4 flex flex-col justify-center">
                                <div className="text-stone-500 text-xs uppercase tracking-wider mb-1">Gross Income</div>
                                <div className="text-xl font-bold text-stone-200">
                                    ${new Intl.NumberFormat('en-US', { notation: "compact" }).format(inputs.baseSalary + inputs.variableComp)}
                                </div>
                             </div>
                             
                             <div className="hidden md:flex text-stone-600"><ArrowRight size={20}/></div>
                             
                             {/* Block 2: Taxes */}
                             <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 text-center group relative cursor-help h-28 w-full md:w-1/4 flex flex-col justify-center">
                                <div className="text-stone-500 text-xs uppercase tracking-wider mb-1">Est. Taxes</div>
                                <div className="text-xl font-bold text-red-400">
                                    -${new Intl.NumberFormat('en-US', { notation: "compact" }).format((inputs.baseSalary + inputs.variableComp) * 0.30)}
                                </div>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-stone-800 rounded text-[10px] text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                    Est. ~30% effective rate (Fed+State+FICA)
                                </div>
                             </div>
                             
                             <div className="hidden md:flex text-stone-600"><ArrowRight size={20}/></div>
                             
                             {/* Block 3: Lifestyle */}
                             <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 text-center group relative cursor-help h-28 w-full md:w-1/4 flex flex-col justify-center">
                                <div className="text-stone-500 text-xs uppercase tracking-wider mb-1">Lifestyle</div>
                                <div className="text-xl font-bold text-amber-400">
                                    -${new Intl.NumberFormat('en-US', { notation: "compact" }).format(inputs.monthlySpend * 12)}
                                </div>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-stone-800 rounded text-[10px] text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                    Annualized monthly spend: ${inputs.monthlySpend}/mo * 12
                                </div>
                             </div>
                             
                             <div className="hidden md:flex text-stone-600"><ArrowRight size={20}/></div>
                             
                             {/* Block 4: Potential Surplus */}
                             <div className="bg-emerald-900/10 border border-emerald-900/50 rounded-xl p-4 text-center group relative cursor-help h-28 w-full md:w-1/4 flex flex-col justify-center">
                                <div className="text-emerald-500 text-xs uppercase tracking-wider mb-1">Potential Surplus</div>
                                <div className="text-xl font-bold text-emerald-400">
                                    ${new Intl.NumberFormat('en-US', { notation: "compact" }).format(Math.max(0, (inputs.baseSalary + inputs.variableComp) * 0.70 - (inputs.monthlySpend * 12)))}
                                </div>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-stone-800 rounded text-[10px] text-stone-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                    This is the "Fuel" available to build wealth if optimized correctly.
                                </div>
                             </div>
                        </div>

                        {/* 5. Roadmap CTA (Locked) */}
                        <div className="bg-stone-950 rounded-2xl p-8 border border-stone-800 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-[2px]"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 opacity-10 select-none pointer-events-none">
                                {result.hiddenRoadmapItems.map((item, idx) => (
                                    <div key={idx} className="bg-stone-800 w-3/4 h-8 rounded-lg"></div>
                                ))}
                            </div>
                            
                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-4">
                                    <Lock size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-stone-100 mb-2">We've found 3 specific strategies for your situation.</h3>
                                <p className="text-stone-400 mb-8 max-w-lg mx-auto">
                                    Book a review call to unlock the full roadmap.
                                </p>
                                <button 
                                    onClick={() => onBook('audit')}
                                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-stone-950 bg-emerald-500 rounded-lg hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                >
                                    Get Your Roadmap
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Legal Disclosures */}
                         <div className="text-[10px] text-stone-600 max-w-3xl mx-auto text-center leading-relaxed">
                            IMPORTANT: This tool is for educational purposes only and does not constitute financial advice. 
                            Projections are hypothetical and based on assumptions (6% real return, constant tax rates) that may not reflect actual market conditions. 
                            Human capital projections assume continuous employment and income growth which are not guaranteed. 
                            Consult with a qualified professional before making investment decisions.
                        </div>

                    </div>
                )}
            </div>
        </section>
    );
};

export default Calculator;
