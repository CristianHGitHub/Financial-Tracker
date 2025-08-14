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

export async function saveBudget(budgetData: BudgetData): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const user = await checkUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Upsert budget data - create if doesn't exist, update if it does
    await db.budget.upsert({
      where: {
        userId: user.id,
      },
      update: {
        monthlyIncome: budgetData.monthlyIncome,
        housing: budgetData.housing,
        savings: budgetData.savings,
        retirement: budgetData.retirement,
        food: budgetData.food,
        transportation: budgetData.transportation,
        utilities: budgetData.utilities,
        insurance: budgetData.insurance,
        personalEntertainment: budgetData.personalEntertainment,
        debt: budgetData.debt,
        householdItems: budgetData.householdItems,
        giving: budgetData.giving,
        other: budgetData.other,
        updatedAt: new Date(),
      },
      create: {
        userId: user.id,
        monthlyIncome: budgetData.monthlyIncome,
        housing: budgetData.housing,
        savings: budgetData.savings,
        retirement: budgetData.retirement,
        food: budgetData.food,
        transportation: budgetData.transportation,
        utilities: budgetData.utilities,
        insurance: budgetData.insurance,
        personalEntertainment: budgetData.personalEntertainment,
        debt: budgetData.debt,
        householdItems: budgetData.householdItems,
        giving: budgetData.giving,
        other: budgetData.other,
      },
    });

    return {
      success: true,
      message: "Budget saved successfully",
    };
  } catch (error) {
    console.error("Error saving budget:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save budget",
    };
  }
}
