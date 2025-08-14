import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { openai } from "@/lib/ai";

interface BudgetCategory {
  name: string;
  amount: number;
  icon: string;
  description: string;
  recommendedPercentage: number;
}

interface BudgetData {
  monthlyIncome: number;
  totalBudgeted: number;
  remainingIncome: number;
  categories: BudgetCategory[];
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const budgetData: BudgetData = await req.json();
    const { monthlyIncome, totalBudgeted, remainingIncome, categories } =
      budgetData;

    // Enhanced prompt for more intelligent budget analysis
    const prompt = `You are an expert financial advisor analyzing a user's monthly budget. Provide 4-6 intelligent, actionable insights about their budget allocation.

Budget Overview:
- Monthly Income: $${monthlyIncome.toLocaleString()}
- Total Budgeted: $${totalBudgeted.toLocaleString()}
- Remaining Income: $${remainingIncome.toLocaleString()}

Category Breakdown:
${categories
  .map((cat: BudgetCategory) => {
    const actualPercentage = (cat.amount / monthlyIncome) * 100;
    const variance = actualPercentage - cat.recommendedPercentage;
    const varianceText =
      variance > 0 ? `+${variance.toFixed(1)}%` : `${variance.toFixed(1)}%`;

    return `- ${
      cat.name
    }: $${cat.amount.toLocaleString()} (${actualPercentage.toFixed(
      1
    )}% vs recommended ${
      cat.recommendedPercentage
    }%, variance: ${varianceText})`;
  })
  .join("\n")}

Financial Health Analysis:
- Budget Utilization: ${((totalBudgeted / monthlyIncome) * 100).toFixed(1)}%
- Emergency Fund Status: ${(() => {
      const savings =
        categories.find((c: BudgetCategory) => c.name === "Savings")?.amount ||
        0;
      const monthlyExpenses = totalBudgeted - savings;
      const monthsCovered =
        monthlyExpenses > 0 ? (savings / monthlyExpenses).toFixed(1) : "0";
      return `${monthsCovered} months covered`;
    })()}
- Debt-to-Income Ratio: ${(() => {
      const debt =
        categories.find((c: BudgetCategory) => c.name === "Debt")?.amount || 0;
      return debt > 0 ? ((debt / monthlyIncome) * 100).toFixed(1) : "0";
    })()}%

Please provide insights that:
1. Address budget balance and financial health
2. Highlight significant deviations from recommended percentages with specific context
3. Suggest concrete improvements with actionable steps
4. Consider the user's overall financial situation
5. Use appropriate emojis to make insights engaging and memorable
6. Provide specific dollar amounts and percentages when relevant
7. Consider emergency fund adequacy and debt management
8. Suggest optimization strategies for better financial outcomes

Format each insight as a single, comprehensive sentence starting with an emoji. Be encouraging but honest about areas for improvement.

Example insights:
"💡 You have $${remainingIncome.toFixed(
      2
    )} remaining - consider allocating this to your emergency fund to reach the recommended 3-6 months of expenses coverage."
"🎯 Your housing allocation of ${(
      ((categories.find((c: BudgetCategory) => c.name === "Housing")?.amount ||
        0) /
        monthlyIncome) *
      100
    ).toFixed(1)}% is ${(() => {
      const housing =
        categories.find((c: BudgetCategory) => c.name === "Housing")?.amount ||
        0;
      const housingPct = (housing / monthlyIncome) * 100;
      return housingPct > 30
        ? "above the recommended 25-30% range"
        : "within the recommended range";
    })()} - this affects your ability to save and invest."
"✅ Excellent job keeping debt payments at ${(
      ((categories.find((c: BudgetCategory) => c.name === "Debt")?.amount ||
        0) /
        monthlyIncome) *
      100
    ).toFixed(1)}% of income, well below the recommended 20% threshold!"

Provide exactly 4-6 insights, one per line, focusing on the most impactful recommendations:`;

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free", // Using DeepSeek (free) instead of Claude
      messages: [
        {
          role: "system",
          content:
            "You are an expert financial advisor with deep knowledge of personal finance, budgeting strategies, and financial planning. Provide intelligent, actionable insights that help users optimize their financial health. Always be specific with numbers and percentages, and offer concrete next steps.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 800,
      temperature: 0.3, // Lower temperature for more consistent financial advice
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    // Enhanced parsing of insights with better filtering
    const insights = aiResponse
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .filter((line) => {
        // Check for common emoji patterns in financial insights
        const emojiPattern = /[💡🎯✅⚠️📈📉🚨💳🏆💰🔍📊🎉]/;
        return emojiPattern.test(line) && line.length > 20; // Ensure meaningful content
      })
      .slice(0, 6); // Allow up to 6 insights

    // If we don't have enough AI insights, supplement with smart local insights
    if (insights.length < 3) {
      const localInsights = generateSmartLocalInsights(budgetData);
      insights.push(...localInsights.slice(0, 6 - insights.length));
    }

    return NextResponse.json({ insights });
  } catch (error) {
    console.error("Error generating budget insights:", error);

    // Return basic fallback insights on error
    const basicFallbackInsights = [
      "💡 Review your budget regularly to stay on track with your financial goals.",
      "🎯 Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings and debt repayment.",
      "✅ Every dollar should have a purpose - make sure you've allocated your entire income.",
      "🚨 Build an emergency fund of 3-6 months of expenses for financial security.",
      "📈 Automate your savings to make budgeting easier and more consistent.",
    ];

    return NextResponse.json({ insights: basicFallbackInsights });
  }
}

// Enhanced local insights generation for fallback
function generateSmartLocalInsights(budgetData: BudgetData) {
  const { monthlyIncome, totalBudgeted, remainingIncome, categories } =
    budgetData;
  const insights: string[] = [];

  // Budget balance analysis
  if (remainingIncome > 0) {
    insights.push(
      `💡 You have $${remainingIncome.toFixed(
        2
      )} remaining to allocate. Consider increasing your emergency fund or retirement contributions for better long-term financial security.`
    );
  } else if (remainingIncome < 0) {
    insights.push(
      `⚠️ Your budget exceeds your income by $${Math.abs(
        remainingIncome
      ).toFixed(
        2
      )}. This creates a deficit that could lead to debt accumulation - review your categories to reduce expenses.`
    );
  } else {
    insights.push(
      `✅ Perfect budget allocation! Your income and expenses are perfectly balanced, giving you a solid foundation for financial success.`
    );
  }

  // Emergency fund analysis
  const savingsCategory = categories.find(
    (cat: BudgetCategory) => cat.name === "Savings"
  );
  if (savingsCategory && savingsCategory.amount > 0) {
    const monthlyExpenses = totalBudgeted - savingsCategory.amount;
    const monthsOfExpenses =
      monthlyExpenses > 0 ? savingsCategory.amount / monthlyExpenses : 0;

    if (monthsOfExpenses < 3) {
      insights.push(
        `🚨 Your emergency fund covers ${monthsOfExpenses.toFixed(
          1
        )} months of expenses. Aim for 3-6 months ($${(
          monthlyExpenses * 3
        ).toFixed(2)} - $${(monthlyExpenses * 6).toFixed(
          2
        )}) for financial security.`
      );
    } else if (monthsOfExpenses >= 6) {
      insights.push(
        `🏆 Excellent emergency fund! You have ${monthsOfExpenses.toFixed(
          1
        )} months covered, which exceeds the recommended 3-6 months. Consider redirecting some savings to investments.`
      );
    }
  }

  // Category-specific insights with smart analysis
  categories.forEach((cat: BudgetCategory) => {
    if (cat.amount > 0) {
      const actualPercentage = (cat.amount / monthlyIncome) * 100;
      const variance = actualPercentage - cat.recommendedPercentage;

      if (Math.abs(variance) > 5) {
        if (variance > 0) {
          insights.push(
            `📈 ${cat.icon} ${
              cat.name
            }: You're allocating ${actualPercentage.toFixed(
              1
            )}% vs recommended ${cat.recommendedPercentage}%. This ${
              variance > 10 ? "significant" : "moderate"
            } overspending could impact your savings goals.`
          );
        } else {
          insights.push(
            `📉 ${cat.icon} ${cat.name}: You're under the recommended ${
              cat.recommendedPercentage
            }% allocation by ${Math.abs(variance).toFixed(
              1
            )}%. Consider if this aligns with your financial priorities.`
          );
        }
      }
    }
  });

  // Debt management insights
  const debtCategory = categories.find(
    (cat: BudgetCategory) => cat.name === "Debt"
  );
  if (debtCategory && debtCategory.amount > 0) {
    const debtRatio = (debtCategory.amount / monthlyIncome) * 100;
    if (debtRatio > 20) {
      insights.push(
        `💳 Your debt payments are ${debtRatio.toFixed(
          1
        )}% of income, above the recommended 20% threshold. Consider debt consolidation or payment strategies to improve your financial health.`
      );
    } else if (debtRatio <= 10) {
      insights.push(
        `✅ Great debt management! Your debt payments are only ${debtRatio.toFixed(
          1
        )}% of income, well below the recommended 20% threshold.`
      );
    }
  }

  // Investment opportunity insights
  if (remainingIncome > monthlyIncome * 0.1) {
    insights.push(
      `💰 With $${remainingIncome.toFixed(
        2
      )} remaining, you have an excellent opportunity to boost your retirement contributions or start investing for long-term wealth building.`
    );
  }

  return insights;
}
