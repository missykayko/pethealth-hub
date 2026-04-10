"use client";

import { useHousehold } from "@/hooks/use-household";
import { PetForm } from "@/components/pet-form";
import { Loader2 } from "lucide-react";

export default function NewPetPage() {
  const { household, isLoading } = useHousehold();

  if (isLoading || !household) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <PetForm householdId={household.id} />
    </div>
  );
}
