"use client";

import { CreateOrganization } from "@clerk/nextjs";
import { PawPrint } from "lucide-react";

export function NoOrgPrompt() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <PawPrint className="h-16 w-16 text-indigo-400" />
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Create Your Household
        </h2>
        <p className="mt-2 text-gray-600">
          Set up your household to start tracking your pets&apos; health together.
          You can invite family members after creating it.
        </p>
      </div>
      <CreateOrganization
        afterCreateOrganizationUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg",
          },
        }}
      />
    </div>
  );
}
