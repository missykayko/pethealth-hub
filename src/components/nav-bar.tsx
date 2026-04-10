"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  OrganizationSwitcher,
  UserButton,
} from "@clerk/nextjs";
import { PawPrint, Home, Pill, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/pets/new", label: "Add Pet", icon: PlusCircle },
  { href: "/medications", label: "Meds", icon: Pill },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-indigo-600">
            <PawPrint className="h-6 w-6" />
            <span className="hidden sm:inline">PetHealth Hub</span>
          </Link>
          <div className="flex items-center gap-3">
            <OrganizationSwitcher
              hidePersonal
              afterCreateOrganizationUrl="/dashboard"
              afterSelectOrganizationUrl="/dashboard"
              appearance={{
                elements: {
                  rootBox: "flex items-center",
                  organizationSwitcherTrigger:
                    "rounded-lg border px-2 py-1 text-sm",
                },
              }}
            />
            <UserButton />
          </div>
        </div>
      </header>

      {/* Bottom tab bar (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white sm:hidden">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1 text-xs",
                  isActive
                    ? "text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
