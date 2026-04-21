"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Pet } from "@/types/database";

export function usePets(householdId: string | undefined) {
  return useQuery({
    queryKey: ["pets", householdId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("household_id", householdId!)
        .order("name");

      if (error) throw error;
      return data as Pet[];
    },
    enabled: !!householdId,
  });
}

export function useAddPet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      pet: Omit<Pet, "id"> & { id?: string }
    ) => {
      const { data, error } = await supabase
        .from("pets")
        .insert(pet)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["pets", data.household_id],
      });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Pet> & { id: string }) => {
      const { data, error } = await supabase
        .from("pets")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["pets", data.household_id],
      });
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
    },
  });
}
