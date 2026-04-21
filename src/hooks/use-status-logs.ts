"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { StatusLog, TaskType } from "@/types/database";

function getTodayStart() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.toISOString();
}

export function useTodayStatusLogs(petIds: string[]) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["status_logs", "today", petIds],
    queryFn: async () => {
      if (petIds.length === 0) return [];
      const { data, error } = await supabase
        .from("status_logs")
        .select("*")
        .in("pet_id", petIds)
        .gte("completed_at", getTodayStart())
        .order("completed_at", { ascending: false });

      if (error) throw error;
      return data as StatusLog[];
    },
    enabled: petIds.length > 0,
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (petIds.length === 0) return;

    const channel = supabase
      .channel("status_logs_realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "status_logs",
        },
        (payload) => {
          const newLog = payload.new as StatusLog;
          if (petIds.includes(newLog.pet_id)) {
            queryClient.setQueryData(
              ["status_logs", "today", petIds],
              (old: StatusLog[] | undefined) => {
                if (!old) return [newLog];
                return [newLog, ...old];
              }
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [petIds, queryClient]);

  return query;
}

export function useLogStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (log: {
      pet_id: string;
      task_type: TaskType;
      med_id?: string | null;
      completed_by_name: string;
    }) => {
      const { data, error } = await supabase
        .from("status_logs")
        .insert({
          ...log,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newLog) => {
      // Optimistic update
      await queryClient.cancelQueries({
        queryKey: ["status_logs", "today"],
      });

      const optimisticLog: StatusLog = {
        id: `optimistic-${Date.now()}`,
        pet_id: newLog.pet_id,
        task_type: newLog.task_type,
        med_id: newLog.med_id ?? null,
        completed_at: new Date().toISOString(),
        completed_by_name: newLog.completed_by_name,
      };

      queryClient.setQueriesData(
        { queryKey: ["status_logs", "today"] },
        (old: StatusLog[] | undefined) => {
          if (!old) return [optimisticLog];
          return [optimisticLog, ...old];
        }
      );

      return { optimisticLog };
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["status_logs", "today"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["status_logs", "today"] });
    },
  });
}
