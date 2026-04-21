"use client";

import { Check, Utensils, Footprints, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TaskType, StatusLog } from "@/types/database";

const taskConfig: Record<
  TaskType,
  { label: string; pastLabel: string; icon: typeof Utensils; color: string; activeColor: string }
> = {
  fed: {
    label: "Fed",
    pastLabel: "fed",
    icon: Utensils,
    color: "border-orange-200 text-orange-700 hover:bg-orange-50",
    activeColor: "bg-orange-100 border-orange-300 text-orange-800",
  },
  walked: {
    label: "Walked",
    pastLabel: "walked",
    icon: Footprints,
    color: "border-green-200 text-green-700 hover:bg-green-50",
    activeColor: "bg-green-100 border-green-300 text-green-800",
  },
  medicated: {
    label: "Meds",
    pastLabel: "medicated",
    icon: Pill,
    color: "border-blue-200 text-blue-700 hover:bg-blue-50",
    activeColor: "bg-blue-100 border-blue-300 text-blue-800",
  },
};

interface StatusButtonProps {
  taskType: TaskType;
  petName: string;
  latestLog: StatusLog | undefined;
  onLog: () => void;
  isLogging: boolean;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function StatusButton({
  taskType,
  petName,
  latestLog,
  onLog,
  isLogging,
}: StatusButtonProps) {
  const config = taskConfig[taskType];
  const Icon = config.icon;
  const isDone = !!latestLog;

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={onLog}
        disabled={isLogging}
        className={cn(
          "h-12 w-12 rounded-full border-2 p-0 transition-all",
          isDone ? config.activeColor : config.color
        )}
      >
        {isDone ? (
          <Check className="h-5 w-5" />
        ) : (
          <Icon className="h-5 w-5" />
        )}
      </Button>
      <span className="text-[10px] font-medium text-gray-500">
        {config.label}
      </span>
      {isDone && (
        <p className="text-[10px] text-gray-400 text-center max-w-[100px] leading-tight">
          {petName} was {config.pastLabel} by {latestLog.completed_by_name} at{" "}
          {formatTime(latestLog.completed_at)}
        </p>
      )}
    </div>
  );
}
