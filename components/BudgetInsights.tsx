"use client";

import { useState, useEffect, useCallback } from "react";

interface BudgetCategory {
  name: string;
  amount: number;
  icon: string;
  description: string;
  recommendedPercentage: number;
}

interface BudgetInsightsProps {
  monthlyIncome: number;
  categories: BudgetCategory[];
  totalBudgeted: number;
  remainingIncome: number;
}

const BudgetInsights = ({
  monthlyIncome,
  categories,
  totalBudgeted,
  remainingIncome,
}: BudgetInsightsProps) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateLocalInsights = useCallback(() => {
    const localInsights: string[] = [];

    // Budget balance analysis
    if (remainingIncome > 0) {
      localInsights.push(
        `💡 You have $${remainingIncome.toFixed(
          2
        )} left to allocate. Consider increasing your savings or emergency fund.`
      );
    } else if (remainingIncome < 0) {
      localInsights.push(
        `⚠️ Your budget exceeds your income by $${Math.abs(
          remainingIncome
        ).toFixed(2)}. Review your categories to reduce expenses.`
      );
    } else {
      localInsights.push(
        `✅ Perfect! Your budget exactly matches your income. You've allocated every dollar.`
      );
    }

    // Category-specific insights
    categories.forEach((cat) => {
      if (cat.amount > 0) {
        const actualPercentage = (cat.amount / monthlyIncome) * 100;
        const variance = actualPercentage - cat.recommendedPercentage;

        if (Math.abs(variance) > 5) {
          if (variance > 0) {
            localInsights.push(
              `📈 ${cat.icon} ${
                cat.name
              }: You're allocating ${actualPercentage.toFixed(
                1
              )}% vs recommended ${
                cat.recommendedPercentage
              }%. Consider if this aligns with your priorities.`
            );
          } else {
            localInsights.push(
              `📉 ${cat.icon} ${cat.name}: You're under the recommended ${cat.recommendedPercentage}% allocation. You might want to increase this category.`
            );
          }
        }
      }
    });

    // Emergency fund check
    const savingsCategory = categories.find((cat) => cat.name === "Savings");
    if (savingsCategory && savingsCategory.amount > 0) {
      const monthsOfExpenses =
        savingsCategory.amount / (totalBudgeted - savingsCategory.amount);
      if (monthsOfExpenses < 0.5) {
        localInsights.push(
          `🚨 Consider increasing your emergency fund. Aim for 3-6 months of expenses ($${(
            (totalBudgeted - savingsCategory.amount) *
            3
          ).toFixed(2)} - $${(
            (totalBudgeted - savingsCategory.amount) *
            6
          ).toFixed(2)}).`
        );
      }
    }

    // Debt insights
    const debtCategory = categories.find((cat) => cat.name === "Debt");
    if (debtCategory && debtCategory.amount > monthlyIncome * 0.2) {
      localInsights.push(
        `💳 Your debt payments are quite high (${(
          (debtCategory.amount / monthlyIncome) *
          100
        ).toFixed(1)}%). Consider debt consolidation or payment strategies.`
      );
    }

    setInsights(localInsights.slice(0, 5)); // Limit to 5 insights
  }, [monthlyIncome, totalBudgeted, remainingIncome, categories]);

  const generateInsights = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Prepare budget analysis data
      const budgetAnalysis = {
        monthlyIncome,
        totalBudgeted,
        remainingIncome,
        categories: categories
          .filter((cat) => cat.amount > 0)
          .map((cat) => ({
            name: cat.name,
            amount: cat.amount,
            percentage: (cat.amount / monthlyIncome) * 100,
            recommendedPercentage: cat.recommendedPercentage,
            variance:
              (cat.amount / monthlyIncome) * 100 - cat.recommendedPercentage,
          })),
      };

      const response = await fetch("/api/budget-insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budgetAnalysis),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.insights && Array.isArray(data.insights)) {
          setInsights(data.insights);
          setLastGenerated(new Date());
        } else {
          throw new Error("Invalid response format from API");
        }
      } else {
        const errorText = await response.text();
        let errorMessage = "Failed to generate insights";

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If we can't parse the error response, use the text directly
          errorMessage = errorText || errorMessage;
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error generating AI insights:", error);
      setError(
        error instanceof Error ? error.message : "Failed to generate insights"
      );
      // Fallback to local insights if API fails
      generateLocalInsights();
    } finally {
      setIsLoading(false);
    }
  }, [
    monthlyIncome,
    totalBudgeted,
    remainingIncome,
    categories,
    generateLocalInsights,
  ]);

  useEffect(() => {
    if (monthlyIncome > 0 && totalBudgeted > 0) {
      // Add a small delay to avoid too frequent API calls
      const timer = setTimeout(() => {
        generateInsights();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [monthlyIncome, totalBudgeted, categories, generateInsights]);

  if (insights.length === 0 && !isLoading && !error) {
    return null;
  }

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-white text-sm sm:text-lg">🤖</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
            AI Budget Insights
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Powered by DeepSeek AI - Personalized recommendations for your
            budget
          </p>
        </div>
        {lastGenerated && (
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Last updated
            </p>
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {lastGenerated.toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 rounded-xl">
          <p className="text-sm text-red-700 dark:text-red-300">
            ⚠️ {error} - Showing local insights instead.
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              AI is analyzing your budget...
            </span>
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="p-3 bg-gradient-to-r from-emerald-50/50 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-100/50 dark:border-emerald-800/50 hover:from-emerald-100/70 hover:to-green-100/70 dark:hover:from-emerald-800/30 dark:hover:to-green-800/30 transition-all duration-200"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {insight}
              </p>
            </div>
          ))}

          {insights.length === 0 && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Adjust your budget to get personalized insights!
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
        <div className="flex gap-2">
          <button
            onClick={generateInsights}
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              <>
                <span>🔄</span>
                Refresh AI Insights
              </>
            )}
          </button>
          {insights.length > 0 && (
            <button
              onClick={generateLocalInsights}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-xl text-sm font-semibold transition-all duration-200"
              title="Use local insights instead of AI"
            >
              📊 Local
            </button>
          )}
        </div>

        {insights.length > 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Insights powered by {error ? "local analysis" : "DeepSeek AI"}
          </p>
        )}
      </div>
    </div>
  );
};

export default BudgetInsights;
