"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "FinancialTracker AI",
  },
});

interface InvestmentData {
  currentAge: number;
  retirementAge: number;
  currentInvestment: number;
  monthlyContribution: number;
  annualReturn: number;
}

interface InvestmentResult {
  totalYears: number;
  finalAmount: number;
  initialBalance: number;
  totalContributions: number;
  totalGrowth: number;
}

export async function generateInvestmentInsights(
  investmentData: InvestmentData,
  result: InvestmentResult | null
): Promise<
  Array<{
    title: string;
    description: string;
    potentialSavings: string;
    category: string;
  }>
> {
  try {
    const prompt = `Based on the following investment data, generate 6 creative and actionable money-saving tips that could help this person increase their monthly contributions and reach their retirement goals faster.

    Investment Data:
    - Current Age: ${investmentData.currentAge}
    - Retirement Age: ${investmentData.retirementAge}
    - Current Investment: $${investmentData.currentInvestment}
    - Monthly Contribution: $${investmentData.monthlyContribution}
    - Annual Return: ${investmentData.annualReturn}%
    - Years to Retirement: ${
      investmentData.retirementAge - investmentData.currentAge
    }
    ${result ? `- Projected Final Amount: $${result.finalAmount}` : ""}

    Generate 6 diverse saving tips that:
    1. Are realistic and actionable for this person's situation
    2. Include specific dollar amounts they could save
    3. Cover different categories (lifestyle, automation, expenses, etc.)
    4. Show the potential impact on their retirement savings
    5. Are personalized to their age and financial profile

    Return a JSON array with this structure:
    [
      {
        "title": "Creative tip title",
        "description": "Detailed explanation of the tip and how to implement it",
        "potentialSavings": "Specific dollar amount (e.g., '$500 annually' or '$50 monthly')",
        "category": "Category name (e.g., 'Lifestyle', 'Automation', 'Expenses', 'Utilities', 'Entertainment')"
      }
    ]

    Make the tips engaging, specific, and tailored to help this person reach their retirement goals.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        {
          role: "system",
          content:
            "You are a financial advisor AI that creates personalized money-saving strategies. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 1200,
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("No response from AI");
    }

    // Clean the response by removing markdown code blocks if present
    let cleanedResponse = response.trim();
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "");
    }

    // Parse AI response
    const insights = JSON.parse(cleanedResponse);

    // Validate and format insights
    return insights.map(
      (insight: {
        title?: string;
        description?: string;
        potentialSavings?: string;
        category?: string;
      }) => ({
        title: insight.title || "Saving Tip",
        description:
          insight.description || "Implement this strategy to save money.",
        potentialSavings: insight.potentialSavings || "$100+ annually",
        category: insight.category || "General",
      })
    );
  } catch (error) {
    console.error("❌ Error generating investment insights:", error);

    // Fallback insights
    return [
      {
        title: "Automate Your Savings",
        description:
          "Set up automatic transfers from your checking to savings account on payday. This 'pay yourself first' approach ensures you never forget to save.",
        potentialSavings: "$2,400+ annually",
        category: "Automation",
      },
      {
        title: "Review Subscriptions",
        description:
          "Audit your monthly subscriptions and cancel unused services. Many people pay for services they forgot they had.",
        potentialSavings: "$300-600 annually",
        category: "Subscriptions",
      },
      {
        title: "Energy Efficiency",
        description:
          "Switch to LED bulbs, use smart thermostats, and unplug electronics when not in use. Small changes add up to significant savings.",
        potentialSavings: "$200-400 annually",
        category: "Utilities",
      },
      {
        title: "Meal Planning",
        description:
          "Plan your meals weekly and buy groceries in bulk. This reduces food waste and impulse purchases.",
        potentialSavings: "$1,200+ annually",
        category: "Food",
      },
      {
        title: "Transportation Optimization",
        description:
          "Consider carpooling, public transit, or biking for short trips. Even small changes can save on gas and maintenance.",
        potentialSavings: "$800-1,500 annually",
        category: "Transportation",
      },
      {
        title: "Negotiate Bills",
        description:
          "Call your service providers annually to negotiate better rates. Many companies offer discounts to retain customers.",
        potentialSavings: "$200-500 annually",
        category: "Bills",
      },
    ];
  }
}
