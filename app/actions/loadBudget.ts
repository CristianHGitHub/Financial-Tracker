"use server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

interface BudgetCategory {
  name: string;
  amount: number;
  icon: string;
  description: string;
  recommendedPercentage: number;
}

interface BudgetData {
  monthlyIncome: number;
  categories: BudgetCategory[];
}

async function loadBudget(): Promise<{
  budget?: BudgetData;
  error?: string;
}> {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  try {
    // Look for the most recent budget plan record
    const budgetRecord = await db.record.findFirst({
      where: {
        userId: userId,
        category: "BUDGET_PLAN",
      },
      orderBy: {
        date: "desc",
      },
    });

    if (!budgetRecord) {
      return { error: "No saved budget found" };
    }

    // For now, return a default structure since we're storing minimal data
    // In a full implementation, you'd store the complete budget structure
    const defaultCategories: BudgetCategory[] = [
      {
        name: "Giving",
        amount: 0,
        icon: "🤲",
        description: "Charitable donations and giving",
        recommendedPercentage: 10,
      },
      {
        name: "Savings",
        amount: 0,
        icon: "💰",
        description: "Emergency fund and general savings",
        recommendedPercentage: 20,
      },
      {
        name: "Food",
        amount: 0,
        icon: "🍽️",
        description: "Groceries and dining out",
        recommendedPercentage: 12,
      },
      {
        name: "Utilities",
        amount: 0,
        icon: "⚡",
        description: "Electric, gas, water, internet",
        recommendedPercentage: 8,
      },
      {
        name: "Housing",
        amount: 0,
        icon: "🏠",
        description: "Rent/mortgage and housing costs",
        recommendedPercentage: 25,
      },
      {
        name: "Transportation",
        amount: 0,
        icon: "🚗",
        description: "Car payments, gas, public transit",
        recommendedPercentage: 10,
      },
      {
        name: "Insurance",
        amount: 0,
        icon: "🛡️",
        description: "Health, auto, life insurance",
        recommendedPercentage: 5,
      },
      {
        name: "Household Items",
        amount: 0,
        icon: "🧽",
        description: "Cleaning supplies, maintenance",
        recommendedPercentage: 3,
      },
      {
        name: "Debt",
        amount: 0,
        icon: "💳",
        description: "Credit cards, loans",
        recommendedPercentage: 0,
      },
      {
        name: "Retirement",
        amount: 0,
        icon: "🏖️",
        description: "401k, IRA contributions",
        recommendedPercentage: 15,
      },
      {
        name: "Personal and Entertainment",
        amount: 0,
        icon: "🎮",
        description: "Hobbies, entertainment, personal care",
        recommendedPercentage: 7,
      },
      {
        name: "Other",
        amount: 0,
        icon: "📦",
        description: "Miscellaneous expenses",
        recommendedPercentage: 5,
      },
    ];

    return {
      budget: {
        monthlyIncome: budgetRecord.amount,
        categories: defaultCategories,
      },
    };
  } catch (error) {
    console.error("Error loading budget:", error);
    return { error: "Failed to load budget" };
  }
}

export default loadBudget;
