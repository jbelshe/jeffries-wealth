
import { FinancialInput, AIAnalysis } from "../types";


export const generateFinancialInsights = async (
  input: FinancialInput,
): Promise<AIAnalysis> => {
  const res = await fetch("/api/generateFinancialInsights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error("Failed to generate financial insights");
  }

  return (await res.json()) as AIAnalysis;
};



// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// // Deterministic Logic Tree to prevent hallucinations
// const preComputeRisks = (input: FinancialInput, grossIncome: number, concentrationRatio: number, netWorth: number): string[] => {
//     const risks: string[] = [];

//     // 1. Estate Gap 
//     // Logic: If they have dependents, they need a plan.
//     // RISK TRIGGER: Dependents > 0 AND (No Plan OR Plan is Old OR Beneficiaries Not Verified)
//     if (input.dependents > 0) {
//         if (!input.hasEstatePlan) {
//             risks.push("ESTATE_PLAN_GAP");
//         } else {
//             // Plan exists. 
//             // If plan is 'old' OR 'medium' -> Check if beneficiaries updated.
//             // If plan is 'recent' -> Safe.
//             const isPlanRecent = input.estatePlanDate === 'recent';
//             const isVerified = input.beneficiariesUpdated;
            
//             // If plan is NOT recent, we rely on beneficiary verification
//             if (!isPlanRecent && !isVerified) {
//                  risks.push("ESTATE_PLAN_GAP");
//             }
//         }
//     }

//     // 2. Liability / Insurance Gaps
//     const totalAssets = input.cashAmount + input.investedAmount + input.employerStock;
    
//     // Umbrella check
//     if ((totalAssets > 1000000 || grossIncome > 400000) && !input.hasUmbrella) {
//         risks.push("LIABILITY_UMBRELLA_GAP");
//     }

//     // Life Insurance Portability Check
//     if (input.dependents > 0 && input.hasLifeInsurance && input.lifeInsuranceSource === 'Work Only') {
//         risks.push("INSURANCE_PORTABILITY_RISK");
//     }

//     // 3. Concentration Risk (Logic: Employer Stock > 10% of Total Assets)
//     if (concentrationRatio > 0.10) {
//         risks.push("CONCENTRATION_RISK");
//     }

//     // 4. CPA Gap (Logic: Income > 250k AND No CPA)
//     if (grossIncome > 250000 && !input.hasCPA) {
//         risks.push("TAX_PROFESSIONAL_GAP");
//     }

//     // 5. Cash Drag (Logic: Cash > Invested Amount * 0.5)
//     if (input.cashAmount > 50000 && input.cashAmount > (input.investedAmount * 0.5)) {
//         risks.push("CASH_DRAG_INFLATION");
//     }

//     // 6. Savings/Surplus Gap (Logic: High Surplus but Low Net Worth)
//     if (input.computedSurplus && input.computedSurplus > 50000 && netWorth < 250000 && input.age > 30) {
//         risks.push("ACCUMULATION_GAP_LEAKAGE");
//     }
    
//     // 7. Debt Drag
//     if (input.hasNonMortgageDebt && input.nonMortgageDebtAmount > 10000) {
//         risks.push("BAD_DEBT_DRAG");
//     }

//     return risks;
// };

// export const generateFinancialInsights = async (input: FinancialInput): Promise<AIAnalysis> => {
//   try {
//     const totalAssets = input.cashAmount + input.investedAmount + input.employerStock;
//     const debt = input.hasNonMortgageDebt ? input.nonMortgageDebtAmount : 0;
//     const netWorth = totalAssets - debt;
    
//     const concentrationRatio = totalAssets > 0 ? (input.employerStock / totalAssets) : 0;
//     const grossIncome = input.baseSalary + input.variableComp;

//     // Run deterministic checks first
//     const detectedRisks = preComputeRisks(input, grossIncome, concentrationRatio, netWorth);

//     const prompt = `
//       Act as "Jeffries Wealth", a financial planner for high-earners.
      
//       We have ALREADY run a deterministic logic check on this client's data.
//       Here are the CONFIRMED risks detected by our algorithm: ${JSON.stringify(detectedRisks)}

//       YOUR JOB:
//       1. Select the Top 3 most important risks from the list above. 
//       2. If the list is empty or has fewer than 2 items, generate a positive "Good Health" insight about their Savings Rate or Asset Base.
//       3. CRITICAL: If you generate a positive insight (like "Strong Savings" or "Great Foundation"), you MUST set the status to "good". Do NOT use "warning" for positive things.
//       4. Write a short, punchy Title and Description for each.
//       5. DO NOT invent new risks that are not in the list.
      
//       CONTEXT FOR WRITING:
//       - Client Income: $${grossIncome}
//       - Implied Surplus: $${input.computedSurplus}
//       - Net Worth: $${netWorth} (Assets: ${totalAssets}, Debt: ${debt})
      
//       DEFINITIONS OF RISKS:
//       - BAD_DEBT_DRAG: "Consumer Debt" - High interest debt is eroding your wealth building potential.
//       - ESTATE_PLAN_GAP: "Family Protection Gap" - You have dependents but your estate plan is outdated, missing, or beneficiaries are not verified.
//       - INSURANCE_PORTABILITY_RISK: "Coverage Tied to Job" - Your life insurance is tied to your employer. If you leave, you lose coverage.
//       - LIABILITY_UMBRELLA_GAP: "Liability Exposure" - Your income/assets exceed your coverage. One lawsuit could be catastrophic.
//       - CONCENTRATION_RISK: "Single Stock Risk" - A large % of your net worth is tied to one company.
//       - TAX_PROFESSIONAL_GAP: "Tax Complexity" - At your income level, DIY tax filing often misses opportunities.
//       - CASH_DRAG_INFLATION: "Lazy Cash" - You have too much cash sitting on the sidelines losing to inflation.
//       - ACCUMULATION_GAP_LEAKAGE: "Wealth Leakage" - You are earning well, but your balance sheet doesn't reflect it yet.

//       Output JSON format exactly as requested.
//     `;

//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: prompt,
//       config: {
//         responseMimeType: "application/json",
//         responseSchema: {
//           type: Type.OBJECT,
//           properties: {
//             headline: { type: Type.STRING, description: "e.g. 'Critical Liability Gap Detected' or 'Strong Foundation, Ready to Scale'" },
//             publicInsights: {
//               type: Type.ARRAY,
//               items: {
//                 type: Type.OBJECT,
//                 properties: {
//                   title: { type: Type.STRING },
//                   description: { type: Type.STRING },
//                   status: { type: Type.STRING, enum: ["critical", "warning", "good"] }
//                 }
//               }
//             },
//             hiddenRoadmapItems: { type: Type.ARRAY, items: { type: Type.STRING } },
//           },
//         },
//       },
//     });

//     if (response.text) {
//       return JSON.parse(response.text) as AIAnalysis;
//     }
//     throw new Error("No analysis generated");
//   } catch (error) {
//     // Fallback if AI fails
//     return {
//       headline: "Audit Complete",
//       publicInsights: [
//         { title: "Review Complete", description: "Please discuss the detailed findings with your advisor.", status: "good" }
//       ],
//       hiddenRoadmapItems: ["Schedule Review", "Tax Analysis"],
//     };
//   }
// };
