"use client";

import { useHousehold } from "@/hooks/use-household";
import { usePets } from "@/hooks/use-pets";
import { useAllMedications } from "@/hooks/use-medications";
import { useTodayStatusLogs } from "@/hooks/use-status-logs";
import { PetCard } from "@/components/pet-card";
import { MedicationList } from "@/components/medication-list";
import { NoOrgPrompt } from "@/components/no-org-prompt";
import { buttonVariants } from "@/components/ui/button";
import { PlusCircle, Loader2, PawPrint } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { household, isLoading: householdLoading, hasOrganization } = useHousehold();
  const { data: pets, isLoading: petsLoading } = usePets(household?.id);
  const petIds = pets?.map((p) => p.id) ?? [];
  const { data: medications } = useAllMedications(petIds);
  const { data: todayLogs } = useTodayStatusLogs(petIds);

  if (householdLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (!hasOrganization) {
    return <NoOrgPrompt />;
  }

  if (petsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Your Pets</h1>
        <Link href="/pets/new" className={cn(buttonVariants({ size: "sm" }))}>
          <PlusCircle className="mr-1.5 h-4 w-4" />
          Add Pet
        </Link>
      </div>

      {!pets || pets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16 text-center">
          <PawPrint className="h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-700">No pets yet</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            Add your first pet to start tracking their health
          </p>
          <Link href="/pets/new" className={cn(buttonVariants())}>
            <PlusCircle className="mr-1.5 h-4 w-4" />
            Add Your First Pet
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                todayLogs={todayLogs ?? []}
              />
            ))}
          </div>

          {medications && pets && (
            <MedicationList
              medications={medications}
              todayLogs={todayLogs ?? []}
              pets={pets}
            />
          )}
        </>
      )}
    </div>
  );
}
