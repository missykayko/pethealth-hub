"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Medication } from "@/types/database";

export function useMedications(petId: string | undefined) {
  return useQuery({
    queryKey: ["medications", petId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("pet_id", petId!)
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      return data as Medication[];
    },
    enabled: !!petId,
  });
}

export function useAllMedications(petIds: string[]) {
  return useQuery({
    queryKey: ["medications", "all", petIds],
    queryFn: async () => {
      if (petIds.length === 0) return [];
      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .in("pet_id", petIds)
        .eq("is_active", true)
        .order("name");

      if (error) throw error;
      return data as Medication[];
    },
    enabled: petIds.length > 0,
  });
}

export function useAddMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (med: Omit<Medication, "id"> & { id?: string }) => {
      const { data, error } = await supabase
        .from("medications")
        .insert(med)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["medications", data.pet_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["medications", "all"],
      });
    },
  });
}

export function useUpdateMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Medication> & { id: string }) => {
      const { data, error } = await supabase
        .from("medications")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["medications", data.pet_id],
      });
      queryClient.invalidateQueries({
        queryKey: ["medications", "all"],
      });
    },
  });
}
