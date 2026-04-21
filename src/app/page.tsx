import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PawPrint, Users, Bell, Pill } from "lucide-react";

export default async function LandingPage() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold text-indigo-600">
            <PawPrint className="h-6 w-6" />
            PetHealth Hub
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className={cn(buttonVariants({ variant: "ghost" }))}>
              Sign In
            </Link>
            <Link href="/sign-up" className={cn(buttonVariants())}>
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Never wonder{" "}
            <span className="text-indigo-600">&quot;Did the dog eat?&quot;</span>{" "}
            again
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            PetHealth Hub lets your whole household track pet feedings, walks,
            and medications in real time. One tap updates everyone instantly.
          </p>
          <div className="mt-8">
            <Link href="/sign-up" className={cn(buttonVariants({ size: "lg" }))}>
              Start Free
            </Link>
          </div>
        </section>

        <section className="border-t bg-white py-16">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Shared Household</h3>
              <p className="mt-1 text-sm text-gray-600">
                Everyone in your home sees the same dashboard. No more
                double-feeding.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Bell className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Real-Time Updates</h3>
              <p className="mt-1 text-sm text-gray-600">
                Tap &quot;Fed&quot; and it instantly shows on every device in your
                household.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Pill className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Med Tracking</h3>
              <p className="mt-1 text-sm text-gray-600">
                Countdown timers show when each medication is next due. Never
                miss a dose.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} PetHealth Hub
      </footer>
    </div>
  );
}
