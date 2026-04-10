"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAddPet, useUpdatePet } from "@/hooks/use-pets";
import { Loader2 } from "lucide-react";
import type { Pet } from "@/types/database";

interface PetFormProps {
  householdId: string;
  pet?: Pet;
}

export function PetForm({ householdId, pet }: PetFormProps) {
  const router = useRouter();
  const addPet = useAddPet();
  const updatePet = useUpdatePet();
  const isEditing = !!pet;

  const [name, setName] = useState(pet?.name ?? "");
  const [species, setSpecies] = useState(pet?.species ?? "dog");
  const [breed, setBreed] = useState(pet?.breed ?? "");
  const [photoUrl, setPhotoUrl] = useState(pet?.photo_url ?? "");
  const [notes, setNotes] = useState(pet?.notes ?? "");
  const [error, setError] = useState<string | null>(null);

  const isPending = addPet.isPending || updatePet.isPending;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const petData = {
      name: name.trim(),
      species,
      breed: breed.trim() || null,
      photo_url: photoUrl.trim() || null,
      notes: notes.trim() || null,
      household_id: householdId,
    };

    try {
      if (isEditing) {
        await updatePet.mutateAsync({ id: pet.id, ...petData });
      } else {
        await addPet.mutateAsync(petData);
      }
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
            ? String((err as { message: unknown }).message)
            : "Failed to save pet. Please try again.";
      setError(message);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Pet" : "Add New Pet"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Luna, Max, Buddy..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="species">Species *</Label>
            <Select value={species} onValueChange={(val) => { if (val) setSpecies(val); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dog">Dog</SelectItem>
                <SelectItem value="cat">Cat</SelectItem>
                <SelectItem value="bird">Bird</SelectItem>
                <SelectItem value="fish">Fish</SelectItem>
                <SelectItem value="rabbit">Rabbit</SelectItem>
                <SelectItem value="hamster">Hamster</SelectItem>
                <SelectItem value="reptile">Reptile</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="breed">Breed</Label>
            <Input
              id="breed"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="Golden Retriever, Siamese..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Photo URL</Label>
            <Input
              id="photo"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="https://..."
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Allergies, special needs..."
              rows={3}
            />
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={isPending || !name.trim()}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Add Pet"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
