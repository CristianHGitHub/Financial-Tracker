"use client";

import { useState } from "react";
import BudgetPieChart from "./BudgetPieChart";
import BudgetInsights from "./BudgetInsights";
import Image from "next/image";

interface BudgetCategory {
  name: string;
  amount: number;
  icon: string;
  description: string;
  recommendedPercentage: number;
}

interface BudgetCalculatorProps {
  user?: {
    firstName: string;
    imageUrl: string;
  };
}

const BudgetCalculator = ({ user }: BudgetCalculatorProps) => {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [categories, setCategories] = useState<BudgetCategory[]>([
    {
      name: "Housing",
      amount: 0,
      icon: "🏠",
      description: "Rent/mortgage and housing costs",
      recommendedPercentage: 28,
    },
    {
      name: "Savings",
      amount: 0,
      icon: "💰",
      description: "Emergency fund and general savings",
      recommendedPercentage: 20,
    },
    {
      name: "Retirement",
      amount: 0,
      icon: "🏖️",
      description: "401k, IRA contributions",
      recommendedPercentage: 15,
    },
    {
      name: "Food",
      amount: 0,
      icon: "🍽️",
      description: "Groceries and dining out",
      recommendedPercentage: 12,
    },
    {
      name: "Transportation",
      amount: 0,
      icon: "🚗",
      description: "Car payments, gas, public transit",
      recommendedPercentage: 6,
    },
    {
      name: "Utilities",
      amount: 0,
      icon: "⚡",
      description: "Electric, phone, water, internet",
      recommendedPercentage: 6,
    },
    {
      name: "Insurance",
      amount: 0,
      icon: "🛡️",
      description: "Health, auto, life insurance",
      recommendedPercentage: 5,
    },
    {
      name: "Personal and Entertainment",
      amount: 0,
      icon: "🎮",
      description: "Hobbies, entertainment, personal care",
      recommendedPercentage: 4,
    },
    {
      name: "Debt",
      amount: 0,
      icon: "💳",
      description: "Credit cards, loans (if any)",
      recommendedPercentage: 0,
    },
    {
      name: "Household Items",
      amount: 0,
      icon: "🧽",
      description: "Cleaning supplies, maintenance",
      recommendedPercentage: 2,
    },
    {
      name: "Giving",
      amount: 0,
      icon: "🤲",
      description:
        "Charitable donations and giving (Recommended 5-10% if the household is financially stable)",
      recommendedPercentage: 0,
    },
    {
      name: "Other",
      amount: 0,
      icon: "📦",
      description: "Miscellaneous expenses",
      recommendedPercentage: 2,
    },
  ]);

  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const remainingIncome = monthlyIncome - totalBudgeted;

  const handleIncomeChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setMonthlyIncome(numValue);
  };

  const handleCategoryChange = (index: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newCategories = [...categories];
    newCategories[index].amount = numValue;
    setCategories(newCategories);
  };

  const applyRecommendations = () => {
    if (monthlyIncome === 0) return;

    const newCategories = categories.map((cat) => ({
      ...cat,
      amount: Math.round((monthlyIncome * cat.recommendedPercentage) / 100),
    }));
    setCategories(newCategories);
  };

  const resetBudget = () => {
    setCategories(categories.map((cat) => ({ ...cat, amount: 0 })));
  };

  // Get categories with amounts > 0 for pie chart
  const budgetData = categories.filter((cat) => cat.amount > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Left Column - Welcome, Income, and Categories */}
      <div className="space-y-4 sm:space-y-6">
        {/* Budget Calculator Welcome Box */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* User Image */}
            {user && (
              <div className="relative flex-shrink-0">
                <Image
                  src={user.imageUrl}
                  alt={`${user.firstName}'s profile`}
                  width={80}
                  height={80}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-white dark:border-gray-600 shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  <span className="text-white text-xs">💰</span>
                </div>
              </div>
            )}

            {/* Welcome Content */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-2 sm:gap-3 mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm sm:text-lg">🧮</span>
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Budget Calculator, {user?.firstName || "User"}!
                </h2>
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto sm:mx-0">
                Plan your monthly budget by entering your income and allocating
                amounts to different categories. Get AI-powered insights powered
                by DeepSeek to optimize your financial planning.
              </p>
              {/* Budget-specific badges */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center sm:justify-start">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-100 dark:border-emerald-800 px-3 py-2 rounded-xl flex items-center gap-2 justify-center sm:justify-start">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">📊</span>
                  </div>
                  <div className="text-center sm:text-left">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">
                      Budget Planning
                    </span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Interactive
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 border border-green-100 dark:border-green-800 px-3 py-2 rounded-xl flex items-center gap-2 justify-center sm:justify-start">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">🤖</span>
                  </div>
                  <div className="text-center sm:text-left">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">
                      AI Insights
                    </span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      DeepSeek
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-100 dark:border-emerald-800 px-3 py-2 rounded-xl flex items-center gap-2 justify-center sm:justify-start">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs">🎯</span>
                  </div>
                  <div className="text-center sm:text-left">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">
                      Smart Analysis
                    </span>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Real-time
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Income Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50">
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-sm sm:text-lg">💵</span>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                Monthly Income
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Enter your after-tax monthly income
              </p>
            </div>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-lg">
              $
            </span>
            <input
              type="number"
              value={monthlyIncome || ""}
              onChange={(e) => handleIncomeChange(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-lg font-semibold"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              onClick={applyRecommendations}
              disabled={monthlyIncome === 0}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed"
            >
              Apply Recommendations
            </button>
            <button
              onClick={resetBudget}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
            >
              Reset Budget
            </button>
          </div>
        </div>

        {/* Categories Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-sm sm:text-lg">📊</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                  Budget Categories
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Allocate your income across categories
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Remaining
              </p>
              <p
                className={`text-lg font-bold ${
                  remainingIncome >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                ${remainingIncome.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className="bg-gray-50/50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-xl border border-gray-200/30 dark:border-gray-600/30"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{category.icon}</span>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {category.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    value={category.amount || ""}
                    onChange={(e) =>
                      handleCategoryChange(index, e.target.value)
                    }
                    placeholder="0.00"
                    className="w-full pl-6 pr-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                </div>
                {monthlyIncome > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Recommended: $
                    {Math.round(
                      (monthlyIncome * category.recommendedPercentage) / 100
                    )}{" "}
                    ({category.recommendedPercentage}%)
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Summary, Allocation, and AI Insights */}
      <div className="space-y-4 sm:space-y-6">
        {/* Budget Summary */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50">
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-500 via-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-sm sm:text-lg">📈</span>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                Budget Summary
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Overview of your budget allocation
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-xl">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Monthly Income
              </span>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                ${monthlyIncome.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50/50 dark:bg-green-900/20 rounded-xl">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Budgeted
              </span>
              <span className="text-sm font-bold text-green-700 dark:text-green-300">
                ${totalBudgeted.toFixed(2)}
              </span>
            </div>
            <div
              className={`flex justify-between items-center p-3 rounded-xl ${
                remainingIncome >= 0
                  ? "bg-green-50/50 dark:bg-green-900/20"
                  : "bg-red-50/50 dark:bg-red-900/20"
              }`}
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Remaining
              </span>
              <span
                className={`text-sm font-bold ${
                  remainingIncome >= 0
                    ? "text-green-700 dark:text-green-300"
                    : "text-red-700 dark:text-red-300"
                }`}
              >
                ${remainingIncome.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Budget Allocation (Pie Chart) */}
        {budgetData.length > 0 ? (
          <BudgetPieChart budgetData={budgetData} />
        ) : (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50">
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-sm sm:text-lg">🥧</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                  Budget Allocation
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Visual breakdown of your budget
                </p>
              </div>
            </div>

            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-emerald-200 to-green-300 dark:from-emerald-600 dark:to-green-700 rounded-full flex items-center justify-center">
                <span className="text-3xl text-emerald-400 dark:text-emerald-500">
                  🥧
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Enter your monthly income and allocate amounts to categories to
                see your budget allocation chart
              </p>
            </div>
          </div>
        )}

        {/* AI Insights */}
        {monthlyIncome > 0 && totalBudgeted > 0 ? (
          <BudgetInsights
            monthlyIncome={monthlyIncome}
            categories={categories}
            totalBudgeted={totalBudgeted}
            remainingIncome={remainingIncome}
          />
        ) : (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50">
            <div className="flex items-center gap-2 sm:gap-3 mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-sm sm:text-lg">🤖</span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                  AI Insights
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Powered by DeepSeek AI
                </p>
              </div>
            </div>

            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-emerald-200 to-green-300 dark:from-emerald-600 dark:to-green-700 rounded-full flex items-center justify-center">
                <span className="text-3xl text-emerald-400 dark:text-emerald-500">
                  🤖
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Enter your monthly income and budget categories to get
                AI-powered financial insights and recommendations
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetCalculator;
