"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StatusButton } from "@/components/status-button";
import { useLogStatus } from "@/hooks/use-status-logs";
import type { Pet, StatusLog, TaskType } from "@/types/database";
import { Settings } from "lucide-react";

interface PetCardProps {
  pet: Pet;
  todayLogs: StatusLog[];
}

export function PetCard({ pet, todayLogs }: PetCardProps) {
  const { user } = useUser();
  const logStatus = useLogStatus();

  const petLogs = todayLogs.filter((log) => log.pet_id === pet.id);

  function getLatestLog(taskType: TaskType) {
    return petLogs.find((log) => log.task_type === taskType);
  }

  function handleLog(taskType: TaskType) {
    const displayName =
      user?.firstName || user?.username || "Someone";
    logStatus.mutate({
      pet_id: pet.id,
      task_type: taskType,
      completed_by_name: displayName,
    });
  }

  const initials = pet.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={pet.photo_url ?? undefined} alt={pet.name} />
              <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{pet.name}</CardTitle>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="secondary" className="text-xs capitalize">
                  {pet.species}
                </Badge>
                {pet.breed && (
                  <span className="text-xs text-gray-500">{pet.breed}</span>
                )}
              </div>
            </div>
          </div>
          <Link
            href={`/pets/${pet.id}`}
            className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-center gap-6">
          {(["fed", "walked", "medicated"] as TaskType[]).map((taskType) => (
            <StatusButton
              key={taskType}
              taskType={taskType}
              petName={pet.name}
              latestLog={getLatestLog(taskType)}
              onLog={() => handleLog(taskType)}
              isLogging={logStatus.isPending}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
