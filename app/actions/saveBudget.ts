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

async function saveBudget(budgetData: BudgetData): Promise<{
  success?: boolean;
  error?: string;
}> {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  try {
    // Check if user exists in our database
    let user = await db.user.findUnique({
      where: { createUserId: userId },
    });

    if (!user) {
      // Create user if they don't exist
      user = await db.user.create({
        data: {
          createUserId: userId,
          email: "", // We'll update this when available
          name: "",
        },
      });
    }

    // Store budget data as JSON in a new Budget table
    // First, let's check if we need to create the budget table via migration
    // For now, we'll store it as a JSON field in the user record or create a simple record

    // Since we don't have a Budget model yet, let's create a simple Record entry
    // that represents the budget plan (different from expense records)

    await db.record.create({
      data: {
        userId: user.id,
        text: `Budget Plan - Income: $${budgetData.monthlyIncome}`,
        amount: budgetData.monthlyIncome,
        category: "BUDGET_PLAN", // Special category to identify budget records
        date: new Date(),
      },
    });

    // For a more robust solution, you'd want to create a separate Budget model
    // but this works as a quick implementation

    return { success: true };
  } catch (error) {
    console.error("Error saving budget:", error);
    return { error: "Failed to save budget" };
  }
}

export default saveBudget;
