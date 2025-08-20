import OpenAI from "openai";

interface RawInsight {
  type?: string;
  title?: string;
  message?: string;
  action?: string;
  confidence?: number;
}

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "ExpenseTracker AI",
  },
});

export interface ExpenseRecord {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface AIInsight {
  id: string;
  type: "warning" | "info" | "success" | "tip";
  title: string;
  message: string;
  action?: string;
  confidence: number;
}

export async function generateExpenseInsights(
  expenses: ExpenseRecord[]
): Promise<AIInsight[]> {
  try {
    // Prepare expense data for AI analysis
    const expensesSummary = expenses.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));

    const prompt = `Analyze the following expense data and provide 3-4 actionable financial insights. 
    Return a JSON array of insights with this structure:
    {
      "type": "warning|info|success|tip",
      "title": "Brief title",
      "message": "Detailed insight message with specific numbers when possible",
      "action": "Actionable suggestion",
      "confidence": 0.8
    }

    Expense Data:
    ${JSON.stringify(expensesSummary, null, 2)}

    Focus on:
    1. Spending patterns (day of week, categories)
    2. Budget alerts (high spending areas)
    3. Money-saving opportunities
    4. Positive reinforcement for good habits

    Return only valid JSON array, no additional text.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        {
          role: "system",
          content:
            "You are a financial advisor AI that analyzes spending patterns and provides actionable insights. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
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

    // Add IDs and ensure proper format
    const formattedInsights = insights.map(
      (insight: RawInsight, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        type: insight.type || "info",
        title: insight.title || "AI Insight",
        message: insight.message || "Analysis complete",
        action: insight.action,
        confidence: insight.confidence || 0.8,
      })
    );

    return formattedInsights;
  } catch (error) {
    console.error("❌ Error generating AI insights:", error);

    // Fallback to mock insights if AI fails
    return [
      {
        id: "fallback-1",
        type: "info",
        title: "AI Analysis Unavailable",
        message:
          "Unable to generate personalized insights at this time. Please try again later.",
        action: "Refresh insights",
        confidence: 0.5,
      },
    ];
  }
}

export async function categorizeExpense(description: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        {
          role: "system",
          content:
            "You are an expense categorization AI. Categorize expenses into one of these categories: Food, Transportation, Entertainment, Shopping, Bills, Healthcare, Other. Respond with only the category name.",
        },
        {
          role: "user",
          content: `Categorize this expense: "${description}"`,
        },
      ],
      temperature: 0.1,
      max_tokens: 20,
    });

    const category = completion.choices[0].message.content?.trim();

    const validCategories = [
      "Food",
      "Transportation",
      "Entertainment",
      "Shopping",
      "Bills",
      "Healthcare",
      "Other",
    ];

    const finalCategory = validCategories.includes(category || "")
      ? category!
      : "Other";
    return finalCategory;
  } catch (error) {
    console.error("❌ Error categorizing expense:", error);
    return "Other";
  }
}

export async function generateAIAnswer(
  question: string,
  context: ExpenseRecord[]
): Promise<string> {
  try {
    const expensesSummary = context.map((expense) => ({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: expense.date,
    }));

    const prompt = `Based on the following expense data, provide a detailed and actionable answer to this question: "${question}"

    Expense Data:
    ${JSON.stringify(expensesSummary, null, 2)}

    Provide a comprehensive answer that:
    1. Addresses the specific question directly
    2. Uses concrete data from the expenses when possible
    3. Offers actionable advice
    4. Keeps the response concise but informative (2-3 sentences)
    
    Return only the answer text, no additional formatting.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful financial advisor AI that provides specific, actionable answers based on expense data. Be concise but thorough.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("No response from AI");
    }

    return response.trim();
  } catch (error) {
    console.error("❌ Error generating AI answer:", error);
    return "I'm unable to provide a detailed answer at the moment. Please try refreshing the insights or check your connection.";
  }
}

export async function generateInvestmentInsight(
  investmentData: {
    currentAge: number;
    retirementAge: number;
    currentInvestment: number;
    monthlyContribution: number;
    annualReturn: number;
  },
  result: {
    totalYears: number;
    finalAmount: number;
    initialBalance: number;
    totalContributions: number;
    totalGrowth: number;
  }
): Promise<
  Array<{
    title: string;
    additionalContribution: number;
    finalAmount: number;
    additionalGrowth: number;
  }>
> {
  try {
    const prompt = `Based on the following investment data, generate 3 creative "What if" scenarios that show how small lifestyle changes could significantly impact retirement savings.

    Investment Data:
    - Current Age: ${investmentData.currentAge}
    - Retirement Age: ${investmentData.retirementAge}
    - Current Investment: $${investmentData.currentInvestment}
    - Monthly Contribution: $${investmentData.monthlyContribution}
    - Annual Return: ${investmentData.annualReturn}%
    - Final Amount: $${result.finalAmount}
    - Total Years: ${result.totalYears}

    Generate 3 scenarios that:
    1. Are realistic lifestyle changes (e.g., cutting daily coffee, reducing dining out)
    2. Show the power of compound interest over time
    3. Include specific dollar amounts for additional monthly contributions
    4. Calculate the final amount with the additional contributions

    Return a JSON array with this structure:
    [
      {
        "title": "Creative scenario description",
        "additionalContribution": monthly_dollar_amount,
        "finalAmount": calculated_final_amount,
        "additionalGrowth": additional_growth_amount
      }
    ]

    Use realistic amounts and make the scenarios engaging and motivational.`;

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        {
          role: "system",
          content:
            "You are a financial advisor AI that creates engaging investment scenarios. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 800,
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
    const scenarios = JSON.parse(cleanedResponse);

    // Validate and format scenarios
    return scenarios.map(
      (scenario: {
        title?: string;
        additionalContribution?: number;
        finalAmount?: number;
        additionalGrowth?: number;
      }) => ({
        title: scenario.title || "Lifestyle Change",
        additionalContribution: scenario.additionalContribution || 100,
        finalAmount: scenario.finalAmount || result.finalAmount,
        additionalGrowth: scenario.additionalGrowth || 0,
      })
    );
  } catch (error) {
    console.error("❌ Error generating investment insights:", error);

    // Fallback scenarios
    return [
      {
        title: "Saved an extra $100 per month",
        additionalContribution: 100,
        finalAmount:
          result.finalAmount +
          100 *
            12 *
            result.totalYears *
            (1 + investmentData.annualReturn / 100) ** result.totalYears,
        additionalGrowth:
          100 *
          12 *
          result.totalYears *
          (1 + investmentData.annualReturn / 100) ** result.totalYears,
      },
      {
        title: "Gave up daily coffee purchases",
        additionalContribution: 128,
        finalAmount:
          result.finalAmount +
          128 *
            12 *
            result.totalYears *
            (1 + investmentData.annualReturn / 100) ** result.totalYears,
        additionalGrowth:
          128 *
          12 *
          result.totalYears *
          (1 + investmentData.annualReturn / 100) ** result.totalYears,
      },
      {
        title: "Gave up weekly restaurant visits",
        additionalContribution: 200,
        finalAmount:
          result.finalAmount +
          200 *
            12 *
            result.totalYears *
            (1 + investmentData.annualReturn / 100) ** result.totalYears,
        additionalGrowth:
          200 *
          12 *
          result.totalYears *
          (1 + investmentData.annualReturn / 100) ** result.totalYears,
      },
    ];
  }
}

export async function generateSavingInsights(
  investmentData: {
    currentAge: number;
    retirementAge: number;
    currentInvestment: number;
    monthlyContribution: number;
    annualReturn: number;
  },
  result: {
    totalYears: number;
    finalAmount: number;
    initialBalance: number;
    totalContributions: number;
    totalGrowth: number;
  } | null
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
        .replace(/^```json\s*/, "")
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
    console.error("❌ Error generating saving insights:", error);

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
