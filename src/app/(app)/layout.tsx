import { NavBar } from "@/components/nav-bar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 pb-20 sm:pb-6">
        {children}
      </main>
    </>
  );
}
