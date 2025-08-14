import BudgetCalculator from "@/components/BudgetCalculator";
import Guest from "@/components/Guest";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function BudgetPage() {
  const user = await currentUser();
  if (!user) {
    return <Guest />;
  }

  return (
    <main className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans min-h-screen transition-colors duration-300">
      {/* Mobile-optimized container with responsive padding */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Budget Calculator Component */}
        <BudgetCalculator
          user={{
            firstName: user.firstName || "User",
            imageUrl: user.imageUrl,
          }}
        />
      </div>
    </main>
  );
}
