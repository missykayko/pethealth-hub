"use client";

import { useHousehold } from "@/hooks/use-household";
import { usePets } from "@/hooks/use-pets";
import { useAllMedications } from "@/hooks/use-medications";
import { useTodayStatusLogs } from "@/hooks/use-status-logs";
import { MedicationList } from "@/components/medication-list";
import { Loader2 } from "lucide-react";

export default function MedicationsPage() {
  const { household, isLoading: householdLoading } = useHousehold();
  const { data: pets, isLoading: petsLoading } = usePets(household?.id);
  const petIds = pets?.map((p) => p.id) ?? [];
  const { data: medications } = useAllMedications(petIds);
  const { data: todayLogs } = useTodayStatusLogs(petIds);

  if (householdLoading || petsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Medications</h1>
      <MedicationList
        medications={medications ?? []}
        todayLogs={todayLogs ?? []}
        pets={pets ?? []}
      />
    </div>
  );
}
