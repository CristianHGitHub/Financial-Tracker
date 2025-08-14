"use server";

import { checkUser } from "@/lib/checkUser";
import { db } from "@/lib/db";

interface BudgetData {
  monthlyIncome: number;
  housing: number;
  savings: number;
  retirement: number;
  food: number;
  transportation: number;
  utilities: number;
  insurance: number;
  personalEntertainment: number;
  debt: number;
  householdItems: number;
  giving: number;
  other: number;
}

export async function loadBudget(): Promise<{
  success: boolean;
  data?: BudgetData;
  message: string;
}> {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get user's budget data
    const budget = await db.budget.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!budget) {
      return {
        success: true,
        data: {
          monthlyIncome: 0,
          housing: 0,
          savings: 0,
          retirement: 0,
          food: 0,
          transportation: 0,
          utilities: 0,
          insurance: 0,
          personalEntertainment: 0,
          debt: 0,
          householdItems: 0,
          giving: 0,
          other: 0,
        },
        message: "No budget data found, using defaults",
      };
    }

    return {
      success: true,
      data: {
        monthlyIncome: budget.monthlyIncome,
        housing: budget.housing,
        savings: budget.savings,
        retirement: budget.retirement,
        food: budget.food,
        transportation: budget.transportation,
        utilities: budget.utilities,
        insurance: budget.insurance,
        personalEntertainment: budget.personalEntertainment,
        debt: budget.debt,
        householdItems: budget.householdItems,
        giving: budget.giving,
        other: budget.other,
      },
      message: "Budget data loaded successfully",
    };
  } catch (error) {
    console.error("Error loading budget:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to load budget",
    };
  }
}
