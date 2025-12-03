
export interface FinancialInput {
  // 1. General Information
  age: number;
  employer: string;
  role: string;
  lastYearCompensation: number; // To track income trajectory
  advisoryGoals: string[]; // e.g., 'Tax', 'Equity', 'Organization'
  
  // 2. Income, Tax & Expenses
  state: string;
  filingStatus: 'single' | 'joint';
  dependents: number;
  hasCPA: boolean;
  baseSalary: number;
  variableComp: number; // Bonus/RSU/Commissions
  monthlySpend: number; // Moved here from Expenses

  // 3. Risk Management
  hasLifeInsurance: boolean;
  lifeInsuranceSource?: 'Work Only' | 'Private' | 'Both';
  lifeInsuranceAmount?: number;
  
  hasDisabilityInsurance: boolean;
  disabilitySource?: 'Work Only' | 'Private' | 'Both';
  
  hasUmbrella: boolean;
  knowsAutoLimits: boolean;
  hasYoungDrivers: boolean;
  beneficiariesUpdated: boolean; 
  
  hasEstatePlan: boolean; // Will/Trust
  estatePlanDate?: 'recent' | 'medium' | 'old'; // simplified to codes

  // 4. Current Assets
  cashAmount: number;
  employerStock: number; // Concentration risk
  investedAmount: number; // Everything else
  hasNonMortgageDebt: boolean; // New debt question
  nonMortgageDebtAmount: number; // New debt amount
  accountTypes: string[]; // 401k, Brokerage, Roth, etc.
  hasPermanentInsurance: boolean; // Legacy field, kept for compatibility or removal
  hasRealEstate: boolean; // Investment RE
  
  // Computed for AI Context
  computedTaxEst?: number;
  computedNetPay?: number;
  computedSurplus?: number;
  computedGross?: number;
}

export interface SimulationPoint {
  age: number;
  currentPath: number;
  potentialPath: number;
  gap: number;
}

export interface AIAnalysis {
  headline: string;
  publicInsights: Array<{
    title: string;
    description: string;
    status: 'critical' | 'warning' | 'good';
  }>;
  hiddenRoadmapItems: string[];
}
