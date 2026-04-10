"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, Clock } from "lucide-react";
import type { Medication, StatusLog, Pet } from "@/types/database";

interface MedicationListProps {
  medications: Medication[];
  todayLogs: StatusLog[];
  pets: Pet[];
}

function getLastMedLog(medId: string, logs: StatusLog[]) {
  return logs.find(
    (log) => log.task_type === "medicated" && log.med_id === medId
  );
}

function getCountdown(lastLog: StatusLog | undefined, frequencyHours: number) {
  if (!lastLog) return { text: "Due now", overdue: true };

  const lastTime = new Date(lastLog.completed_at).getTime();
  const nextDue = lastTime + frequencyHours * 60 * 60 * 1000;
  const now = Date.now();
  const diff = nextDue - now;

  if (diff <= 0) return { text: "Due now", overdue: true };

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return { text: `${hours}h ${minutes}m`, overdue: false };
  }
  return { text: `${minutes}m`, overdue: false };
}

export function MedicationList({
  medications,
  todayLogs,
  pets,
}: MedicationListProps) {
  const [, setTick] = useState(0);

  // Update countdown every minute
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  if (medications.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Pill className="h-10 w-10 text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">No active medications</p>
          <p className="text-xs text-gray-400 mt-1">
            Add medications from a pet&apos;s detail page
          </p>
        </CardContent>
      </Card>
    );
  }

  const petMap = new Map(pets.map((p) => [p.id, p]));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Pill className="h-5 w-5 text-blue-500" />
          Medication Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {medications.map((med) => {
          const lastLog = getLastMedLog(med.id, todayLogs);
          const countdown = getCountdown(lastLog, med.frequency_hours);
          const pet = petMap.get(med.pet_id);

          return (
            <div
              key={med.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{med.name}</span>
                  <Badge variant="secondary" className="text-[10px]">
                    {pet?.name}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {med.dosage} &middot; every {med.frequency_hours}h
                </p>
                {med.instructions && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {med.instructions}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1.5 ml-3">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span
                  className={`text-xs font-medium ${
                    countdown.overdue ? "text-red-500" : "text-gray-600"
                  }`}
                >
                  {countdown.text}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
