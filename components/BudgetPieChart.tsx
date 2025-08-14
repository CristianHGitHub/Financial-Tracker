"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useEffect } from "react";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface BudgetCategory {
  name: string;
  amount: number;
  icon: string;
  description: string;
  recommendedPercentage: number;
}

const BudgetPieChart = ({ budgetData }: { budgetData: BudgetCategory[] }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [windowWidth, setWindowWidth] = useState(1024);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 640;

  // Enhanced green color palette for budget categories
  const colors = [
    {
      bg: isDark ? "rgba(16, 185, 129, 0.8)" : "rgba(16, 185, 129, 0.7)", // Emerald
      border: isDark ? "rgba(16, 185, 129, 1)" : "rgba(16, 185, 129, 1)",
    },
    {
      bg: isDark ? "rgba(34, 197, 94, 0.8)" : "rgba(34, 197, 94, 0.7)", // Green
      border: isDark ? "rgba(34, 197, 94, 1)" : "rgba(34, 197, 94, 1)",
    },
    {
      bg: isDark ? "rgba(20, 184, 166, 0.8)" : "rgba(20, 184, 166, 0.7)", // Teal
      border: isDark ? "rgba(20, 184, 166, 1)" : "rgba(20, 184, 166, 1)",
    },
    {
      bg: isDark ? "rgba(5, 150, 105, 0.8)" : "rgba(5, 150, 105, 0.7)", // Emerald-600
      border: isDark ? "rgba(5, 150, 105, 1)" : "rgba(5, 150, 105, 1)",
    },
    {
      bg: isDark ? "rgba(6, 182, 212, 0.8)" : "rgba(6, 182, 212, 0.7)", // Cyan
      border: isDark ? "rgba(6, 182, 212, 1)" : "rgba(6, 182, 212, 1)",
    },
    {
      bg: isDark ? "rgba(101, 163, 13, 0.8)" : "rgba(101, 163, 13, 0.7)", // Lime-600
      border: isDark ? "rgba(101, 163, 13, 1)" : "rgba(101, 163, 13, 1)",
    },
    {
      bg: isDark ? "rgba(22, 163, 74, 0.8)" : "rgba(22, 163, 74, 0.7)", // Green-600
      border: isDark ? "rgba(22, 163, 74, 1)" : "rgba(22, 163, 74, 1)",
    },
    {
      bg: isDark ? "rgba(13, 148, 136, 0.8)" : "rgba(13, 148, 136, 0.7)", // Teal-600
      border: isDark ? "rgba(13, 148, 136, 1)" : "rgba(13, 148, 136, 1)",
    },
    {
      bg: isDark ? "rgba(132, 204, 22, 0.8)" : "rgba(132, 204, 22, 0.7)", // Lime
      border: isDark ? "rgba(132, 204, 22, 1)" : "rgba(132, 204, 22, 1)",
    },
    {
      bg: isDark ? "rgba(8, 145, 178, 0.8)" : "rgba(8, 145, 178, 0.7)", // Cyan-600
      border: isDark ? "rgba(8, 145, 178, 1)" : "rgba(8, 145, 178, 1)",
    },
    {
      bg: isDark ? "rgba(21, 128, 61, 0.8)" : "rgba(21, 128, 61, 0.7)", // Green-700
      border: isDark ? "rgba(21, 128, 61, 1)" : "rgba(21, 128, 61, 1)",
    },
    {
      bg: isDark ? "rgba(15, 118, 110, 0.8)" : "rgba(15, 118, 110, 0.7)", // Teal-700
      border: isDark ? "rgba(15, 118, 110, 1)" : "rgba(15, 118, 110, 1)",
    },
  ];

  const totalBudget = budgetData.reduce((sum, item) => sum + item.amount, 0);

  // Prepare data for the chart
  const data = {
    labels: budgetData.map((item) => `${item.icon} ${item.name}`),
    datasets: [
      {
        data: budgetData.map((item) => item.amount),
        backgroundColor: budgetData.map(
          (_, index) => colors[index % colors.length].bg
        ),
        borderColor: budgetData.map(
          (_, index) => colors[index % colors.length].border
        ),
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // We'll create a custom legend
      },
      tooltip: {
        backgroundColor: isDark
          ? "rgba(31, 41, 55, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
        titleColor: isDark ? "#f9fafb" : "#1f2937",
        bodyColor: isDark ? "#d1d5db" : "#374151",
        borderColor: isDark ? "#374151" : "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: function (
            context: import("chart.js").TooltipItem<"doughnut">
          ) {
            const dataIndex = context.dataIndex;
            const category = budgetData[dataIndex];
            const percentage = ((category.amount / totalBudget) * 100).toFixed(
              1
            );
            return [
              `${category.name}`,
              `Amount: $${category.amount.toFixed(2)}`,
              `Percentage: ${percentage}%`,
              `${category.description}`,
            ];
          },
        },
      },
    },
    cutout: isMobile ? "50%" : "60%", // Creates the doughnut hole
    elements: {
      arc: {
        borderRadius: 4,
      },
    },
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
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

      <div className="relative w-full h-64 sm:h-72 md:h-80 flex items-center justify-center mb-4">
        <Doughnut data={data} options={options} />

        {/* Center content showing total */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Budget
            </p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
              ${totalBudget.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {budgetData.length} categories
            </p>
          </div>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
          Category Breakdown
        </h4>
        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
          {budgetData.map((category, index) => {
            const percentage = ((category.amount / totalBudget) * 100).toFixed(
              1
            );

            return (
              <div
                key={category.name}
                className="flex items-center gap-2 p-2 rounded-lg bg-gray-50/50 dark:bg-gray-700/50"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: colors[index % colors.length].border,
                  }}
                ></div>
                <span className="text-sm">{category.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                    {category.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ${category.amount.toFixed(2)} ({percentage}%)
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetPieChart;
