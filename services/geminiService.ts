
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
  const results = await res.json()
  return (results) as AIAnalysis;
};
