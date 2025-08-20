"use client";

import { useState, useEffect } from "react";
import { generateInvestmentInsights } from "@/app/actions/generateInvestmentInsights";

interface InvestmentCalculatorProps {
  user?: {
    firstName: string;
    imageUrl: string;
  };
}

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
  yearlyData: Array<{
    year: number;
    balance: number;
    contributions: number;
    growth: number;
  }>;
}

const InvestmentCalculator = ({ user }: InvestmentCalculatorProps) => {
  const [investmentData, setInvestmentData] = useState<InvestmentData>({
    currentAge: 0,
    retirementAge: 67,
    currentInvestment: 0,
    monthlyContribution: 0,
    annualReturn: 12,
  });

  const [result, setResult] = useState<InvestmentResult | null>(null);
  const [whatIfScenarios, setWhatIfScenarios] = useState<
    Array<{
      title: string;
      additionalContribution: number;
      finalAmount: number;
      additionalGrowth: number;
    }>
  >([]);
  const [isGeneratingScenarios, setIsGeneratingScenarios] = useState(false);
  const [annualReturnError, setAnnualReturnError] = useState<string>("");
  const [ageError, setAgeError] = useState<string>("");
  const [aiInsights, setAiInsights] = useState<
    Array<{
      title: string;
      description: string;
      potentialSavings: string;
      category: string;
    }>
  >([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  // Calculate investment growth
  const calculateInvestment = (data: InvestmentData): InvestmentResult => {
    const totalYears = data.retirementAge - data.currentAge;
    const monthlyRate = data.annualReturn / 100 / 12;
    const totalMonths = totalYears * 12;

    let balance = data.currentInvestment;
    const yearlyData = [];

    for (let year = 1; year <= totalYears; year++) {
      const yearStartBalance = balance;
      const yearContributions = data.monthlyContribution * 12;

      // Calculate monthly compounding for the year
      for (let month = 1; month <= 12; month++) {
        balance = balance * (1 + monthlyRate) + data.monthlyContribution;
      }

      const yearEndBalance = balance;
      const yearGrowth = yearEndBalance - yearStartBalance - yearContributions;

      yearlyData.push({
        year: data.currentAge + year,
        balance: yearEndBalance,
        contributions: yearContributions,
        growth: yearGrowth,
      });
    }

    const totalContributions = data.monthlyContribution * totalMonths;
    const totalGrowth = balance - data.currentInvestment - totalContributions;

    return {
      totalYears,
      finalAmount: balance,
      initialBalance: data.currentInvestment,
      totalContributions,
      totalGrowth,
      yearlyData,
    };
  };

  // Generate "What if" scenarios
  const generateWhatIfScenarios = () => {
    if (!result) return;

    setIsGeneratingScenarios(true);

    // Simulate AI processing delay
    setTimeout(() => {
      // Generate realistic scenarios based on the investment data
      const scenarios = [
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

      setWhatIfScenarios(scenarios);
      setIsGeneratingScenarios(false);
    }, 1500); // 1.5 second delay to simulate AI processing
  };

  // Generate AI-powered saving insights
  const generateAISavingInsights = async () => {
    setIsGeneratingInsights(true);

    try {
      const insights = await generateInvestmentInsights(investmentData, result);
      setAiInsights(insights);
    } catch (error) {
      console.error("Error generating AI insights:", error);
      // Fallback insights if AI fails
      const fallbackInsights = [
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

      // Personalize fallback insights based on user data
      if (investmentData.currentAge < 30) {
        fallbackInsights.push({
          title: "Start Early Advantage",
          description:
            "Your young age gives you the power of compound interest. Even small contributions now will grow significantly over time.",
          potentialSavings: "$50,000+ by retirement",
          category: "Strategy",
        });
      } else if (investmentData.currentAge > 50) {
        fallbackInsights.push({
          title: "Catch-Up Contributions",
          description:
            "Consider increasing your 401(k) contributions to catch-up limits. You can contribute an extra $7,500 annually if you're 50+.",
          potentialSavings: "$7,500+ annually",
          category: "Retirement",
        });
      }

      setAiInsights(fallbackInsights);
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  useEffect(() => {
    if (
      investmentData.currentAge > 0 &&
      investmentData.currentAge < investmentData.retirementAge &&
      investmentData.currentInvestment >= 0 &&
      investmentData.monthlyContribution >= 0 &&
      investmentData.annualReturn > 0 &&
      !annualReturnError &&
      !ageError
    ) {
      const calculatedResult = calculateInvestment(investmentData);
      setResult(calculatedResult);
    } else {
      setResult(null);
    }
  }, [investmentData, annualReturnError, ageError]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (amount: number, total: number) => {
    return ((amount / total) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Investment Calculator Welcome Box */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100/50 dark:border-gray-700/50">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8 w-full">
          {/* User Image */}
          {user && (
            <div className="relative flex-shrink-0">
              <img
                src={user.imageUrl}
                alt={`${user.firstName}'s profile`}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-white dark:border-gray-600 shadow-lg object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                <span className="text-white text-xs">💰</span>
              </div>
            </div>
          )}

          {/* Welcome Content */}
          <div className="flex-1 text-center lg:text-left w-full">
            <div className="flex flex-col items-center lg:items-start justify-center gap-2 sm:gap-3 mb-4">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Investment Calculator, {user?.firstName || "User"}!
              </h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 max-w-none lg:max-w-2xl lg:mx-0 mx-auto">
              Plan your retirement by calculating compound interest and
              exploring investment growth scenarios. Get AI-powered insights
              powered by DeepSeek to optimize your financial future.
            </p>
            {/* Investment-specific badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-100 dark:border-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">📈</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
                    Growth Analysis
                  </span>
                  <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
                    Real-time
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/30 dark:to-green-900/30 border border-green-100 dark:border-green-800 px-4 py-3 rounded-xl flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
                    AI Insights
                  </span>
                  <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
                    DeepSeek
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/50 border border-emerald-100 dark:border-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 justify-center lg:justify-start sm:col-span-2 lg:col-span-1">
                <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">🎯</span>
                </div>
                <div className="text-center lg:text-left">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 block">
                    Smart Scenarios
                  </span>
                  <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
                    What-if
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-600/50">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              Enter Your Information
            </h2>

            <div className="space-y-6">
              {/* Current Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter your current age.
                </label>
                <input
                  type="number"
                  value={investmentData.currentAge || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setInvestmentData((prev) => ({
                      ...prev,
                      currentAge: value,
                    }));

                    // Validate age constraint
                    if (value >= investmentData.retirementAge) {
                      setAgeError(
                        "Current age must be lower than retirement age."
                      );
                    } else {
                      setAgeError("");
                    }
                  }}
                  placeholder="0"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors ${
                    ageError
                      ? "border-red-300 dark:border-red-600"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  min="18"
                  max="100"
                />
                {ageError && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {ageError}
                  </p>
                )}
              </div>

              {/* Retirement Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter the age you plan to retire.
                </label>
                <input
                  type="number"
                  value={investmentData.retirementAge}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setInvestmentData((prev) => ({
                      ...prev,
                      retirementAge: value,
                    }));

                    // Re-validate age constraint when retirement age changes
                    if (
                      investmentData.currentAge > 0 &&
                      investmentData.currentAge >= value
                    ) {
                      setAgeError(
                        "Current age must be lower than retirement age."
                      );
                    } else {
                      setAgeError("");
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                  min="50"
                  max="100"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  If you were born in 1960 or later, you can retire at age 67
                  with full benefits.
                </p>
              </div>

              {/* Current Investment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  About how much money do you currently have in investments?
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={investmentData.currentInvestment || ""}
                    onChange={(e) =>
                      setInvestmentData((prev) => ({
                        ...prev,
                        currentInvestment: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                    min="0"
                    step="100"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  This should be the total of all your investment accounts,
                  including 401(k)s, IRAs, mutual funds, etc.
                </p>
              </div>

              {/* Monthly Contribution */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  How much will you contribute monthly?
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={investmentData.monthlyContribution || ""}
                    onChange={(e) =>
                      setInvestmentData((prev) => ({
                        ...prev,
                        monthlyContribution: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
                    min="0"
                    step="10"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  This is the amount you invest each month. We recommend
                  investing 15% of your paycheck.
                </p>
              </div>

              {/* Annual Return */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What do you think your annual return will be?
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={investmentData.annualReturn || ""}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setInvestmentData((prev) => ({
                        ...prev,
                        annualReturn: value,
                      }));

                      // Validate annual return
                      if (value > 20) {
                        setAnnualReturnError(
                          "Percentage needs to be lower than 20% in order for it to be realistic."
                        );
                      } else {
                        setAnnualReturnError("");
                      }
                    }}
                    placeholder="12.0"
                    className={`w-full pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors ${
                      annualReturnError
                        ? "border-red-300 dark:border-red-600"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    min="0"
                    max="20"
                    step="0.1"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    %
                  </span>
                </div>
                {annualReturnError && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {annualReturnError}
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  This is the return your investment will generate over time.
                  Historically, the 30-year return of the S&P 500 has been
                  roughly 10–12%.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* Main Result */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-600/50">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
                  Your Results
                </h2>

                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Estimated Retirement Savings
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    In {result.totalYears} years, your investment could be
                    worth:
                  </p>
                  <div className="text-4xl font-bold text-emerald-600">
                    {formatCurrency(result.finalAmount)}
                  </div>
                </div>

                {/* Breakdown */}
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Initial Balance
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(result.initialBalance)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatPercentage(
                        result.initialBalance,
                        result.finalAmount
                      )}
                      % of Total
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Contributions
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(result.totalContributions)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatPercentage(
                        result.totalContributions,
                        result.finalAmount
                      )}
                      % of Total
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Growth
                    </span>
                    <span className="font-semibold text-emerald-600">
                      {formatCurrency(result.totalGrowth)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatPercentage(result.totalGrowth, result.finalAmount)}
                      % of Total
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-600/50">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  Investment Growth Over Time
                </h3>
                <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-end justify-between p-4">
                  {result.yearlyData
                    .filter(
                      (_, i) =>
                        i % 5 === 0 || i === result.yearlyData.length - 1
                    )
                    .map((data) => (
                      <div
                        key={data.year}
                        className="flex flex-col items-center space-y-2"
                      >
                        <div
                          className="w-8 bg-gradient-to-t from-emerald-500 to-green-400 rounded-t-sm"
                          style={{
                            height: `${
                              (data.balance / result.finalAmount) * 200
                            }px`,
                          }}
                        ></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 rotate-45 origin-left">
                          {data.year}
                        </span>
                      </div>
                    ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>$0</span>
                  <span>{formatCurrency(result.finalAmount / 2)}</span>
                  <span>{formatCurrency(result.finalAmount)}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-600/50">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Enter Your Information
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Fill in all the fields above to see your investment
                  projection.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* What If Scenarios */}
      {result && whatIfScenarios.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-600/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              What if I...
            </h2>
            <button
              onClick={generateWhatIfScenarios}
              disabled={isGeneratingScenarios}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
            >
              {isGeneratingScenarios ? "Generating..." : "Show Scenarios"}
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Explore how small lifestyle changes could significantly impact your
            retirement savings.
          </p>

          {whatIfScenarios.length > 0 && (
            <div className="grid md:grid-cols-3 gap-6">
              {whatIfScenarios.map((scenario, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200/50 dark:border-gray-600/50"
                >
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {scenario.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Adds ${scenario.additionalContribution} per month in
                    contributions, but creates
                  </p>
                  <div className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(scenario.finalAmount)}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    in additional growth
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* AI Saving Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-600/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            AI-Powered Saving Insights
          </h2>
          <button
            onClick={generateAISavingInsights}
            disabled={isGeneratingInsights}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
          >
            {isGeneratingInsights ? "Generating..." : "Get AI Insights"}
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Discover personalized money-saving tips and strategies based on your
          investment profile. Our AI analyzes your financial situation to
          provide actionable advice using OpenRouter with DeepSeek.
        </p>

        {aiInsights.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiInsights.map((insight, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl p-5 border border-emerald-200/50 dark:border-emerald-700/50"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-800/50 px-2 py-1 rounded-full">
                    {insight.category}
                  </span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {insight.potentialSavings}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  {insight.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentCalculator;
