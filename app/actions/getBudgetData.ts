"use server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Record } from "@/types/Record";

export interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface BudgetSummary {
  totalSpent: number;
  categoriesData: CategoryData[];
  records: Record[];
  topCategory: string;
  totalTransactions: number;
}

async function getBudgetData(): Promise<{
  budget?: BudgetSummary;
  error?: string;
}> {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }

  try {
    const records = await db.record.findMany({
      where: { userId },
      orderBy: {
        date: "desc",
      },
    });

    if (!records || records.length === 0) {
      return {
        budget: {
          totalSpent: 0,
          categoriesData: [],
          records: [],
          topCategory: "No data",
          totalTransactions: 0,
        },
      };
    }

    // Calculate category-wise breakdown
    const categoryMap = new Map<string, { amount: number; count: number }>();
    let totalSpent = 0;

    records.forEach((record) => {
      const category = record.category || "Other";
      const amount = Math.abs(record.amount); // Ensure positive values for budget analysis

      totalSpent += amount;

      if (categoryMap.has(category)) {
        const existing = categoryMap.get(category)!;
        existing.amount += amount;
        existing.count += 1;
      } else {
        categoryMap.set(category, { amount, count: 1 });
      }
    });

    // Convert to array and calculate percentages
    const categoriesData: CategoryData[] = Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        percentage: totalSpent > 0 ? (data.amount / totalSpent) * 100 : 0,
        count: data.count,
      }))
      .sort((a, b) => b.amount - a.amount); // Sort by highest spending

    const topCategory =
      categoriesData.length > 0 ? categoriesData[0].category : "No data";

    return {
      budget: {
        totalSpent,
        categoriesData,
        records: records.map((record) => ({
          ...record,
          date: record.date.toISOString(),
        })),
        topCategory,
        totalTransactions: records.length,
      },
    };
  } catch (error) {
    console.error("Error fetching budget data:", error);
    return { error: "Database error" };
  }
}

export default getBudgetData;
