import InvestmentCalculator from "@/components/InvestmentCalculator";
import Guest from "@/components/Guest";
import { currentUser } from "@clerk/nextjs/server";

export default async function InvestmentPage() {
  const user = await currentUser();
  if (!user) {
    return <Guest />;
  }

  return (
    <main className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans min-h-screen transition-colors duration-300">
      {/* Mobile-optimized container with responsive padding */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Investment Calculator Component */}
        <InvestmentCalculator
          user={{
            firstName: user.firstName || "User",
            imageUrl: user.imageUrl,
          }}
        />
      </div>
    </main>
  );
}

