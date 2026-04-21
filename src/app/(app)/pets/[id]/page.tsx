"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useHousehold } from "@/hooks/use-household";
import { useMedications } from "@/hooks/use-medications";
import { PetForm } from "@/components/pet-form";
import { MedicationForm } from "@/components/medication-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Pill } from "lucide-react";
import type { Pet, Medication } from "@/types/database";

function MedicationItem({ med }: { med: Medication }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div>
        <span className="font-medium text-sm">{med.name}</span>
        <p className="text-xs text-gray-500">
          {med.dosage} &middot; every {med.frequency_hours}h
        </p>
        {med.instructions && (
          <p className="text-xs text-gray-400 mt-0.5">{med.instructions}</p>
        )}
      </div>
      <Badge variant={med.is_active ? "default" : "secondary"}>
        {med.is_active ? "Active" : "Inactive"}
      </Badge>
    </div>
  );
}

export default function PetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { household, isLoading: householdLoading } = useHousehold();

  const { data: pet, isLoading: petLoading } = useQuery({
    queryKey: ["pet", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Pet;
    },
    enabled: !!id,
  });

  const { data: medications } = useMedications(id);

  if (householdLoading || petLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (!pet || !household) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">Pet not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PetForm householdId={household.id} pet={pet} />

      <Separator />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Pill className="h-5 w-5 text-blue-500" />
            Medications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {medications && medications.length > 0 ? (
            medications.map((med) => (
              <MedicationItem key={med.id} med={med} />
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No medications yet
            </p>
          )}
        </CardContent>
      </Card>

      <MedicationForm petId={pet.id} />
    </div>
  );
}
