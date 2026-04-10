"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAddMedication } from "@/hooks/use-medications";
import { Loader2, Plus } from "lucide-react";

interface MedicationFormProps {
  petId: string;
}

export function MedicationForm({ petId }: MedicationFormProps) {
  const addMed = useAddMedication();
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequencyHours, setFrequencyHours] = useState("12");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      await addMed.mutateAsync({
        pet_id: petId,
        name: name.trim(),
        dosage: dosage.trim(),
        frequency_hours: parseInt(frequencyHours, 10),
        instructions: instructions.trim() || null,
        is_active: true,
      });

      setName("");
      setDosage("");
      setFrequencyHours("12");
      setInstructions("");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
            ? String((err as { message: unknown }).message)
            : "Failed to save medication. Please try again.";
      setError(message);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Plus className="h-5 w-5 text-green-500" />
          Add Medication
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="med-name">Name *</Label>
              <Input
                id="med-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Apoquel, Insulin..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="med-dosage">Dosage *</Label>
              <Input
                id="med-dosage"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="16mg, 2 units..."
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency (hours) *</Label>
            <Input
              id="frequency"
              type="number"
              min="1"
              max="168"
              value={frequencyHours}
              onChange={(e) => setFrequencyHours(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="med-instructions">Instructions</Label>
            <Textarea
              id="med-instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Give with food, shake bottle first..."
              rows={2}
            />
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button
            type="submit"
            size="sm"
            disabled={addMed.isPending || !name.trim() || !dosage.trim()}
          >
            {addMed.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Add Medication
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
