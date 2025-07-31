import Guest from "@/components/Guest";
import { currentUser } from "@clerk/nextjs/server";

export default async function HomePage() {
  const user = await currentUser();

  if (!user) {
    return <Guest />;
  }

  return (
    <div className="text-red-400 dark:text-red-300">
      <h1> HomePage</h1>
    </div>
  );
}
