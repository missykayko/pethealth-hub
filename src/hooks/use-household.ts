"use client";

import { useOrganization } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Household } from "@/types/database";

export function useHousehold() {
  const { organization, isLoaded } = useOrganization();

  const query = useQuery<Household | null>({
    queryKey: ["household", organization?.id],
    queryFn: async () => {
      if (!organization?.id) return null;

      // Try to find existing household
      const { data, error } = await supabase
        .from("households")
        .select("*")
        .eq("clerk_org_id", organization.id)
        .single();

      if (data) return data;

      // Create household if it doesn't exist
      if (error?.code === "PGRST116") {
        const { data: newHousehold, error: insertError } = await supabase
          .from("households")
          .insert({
            name: organization.name,
            clerk_org_id: organization.id,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return newHousehold;
      }

      throw error;
    },
    enabled: isLoaded && !!organization?.id,
  });

  return {
    household: query.data,
    isLoading: !isLoaded || query.isLoading,
    hasOrganization: !!organization,
    organizationName: organization?.name,
    error: query.error,
  };
}
