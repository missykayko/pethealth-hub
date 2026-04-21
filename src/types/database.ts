export type TaskType = "fed" | "walked" | "medicated";

export interface Database {
  public: {
    Tables: {
      households: {
        Row: {
          id: string;
          name: string;
          clerk_org_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          clerk_org_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          clerk_org_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      pets: {
        Row: {
          id: string;
          household_id: string;
          name: string;
          species: string;
          breed: string | null;
          photo_url: string | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          household_id: string;
          name: string;
          species: string;
          breed?: string | null;
          photo_url?: string | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          household_id?: string;
          name?: string;
          species?: string;
          breed?: string | null;
          photo_url?: string | null;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "pets_household_id_fkey";
            columns: ["household_id"];
            isOneToOne: false;
            referencedRelation: "households";
            referencedColumns: ["id"];
          },
        ];
      };
      medications: {
        Row: {
          id: string;
          pet_id: string;
          name: string;
          dosage: string;
          frequency_hours: number;
          instructions: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          pet_id: string;
          name: string;
          dosage: string;
          frequency_hours: number;
          instructions?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          pet_id?: string;
          name?: string;
          dosage?: string;
          frequency_hours?: number;
          instructions?: string | null;
          is_active?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "medications_pet_id_fkey";
            columns: ["pet_id"];
            isOneToOne: false;
            referencedRelation: "pets";
            referencedColumns: ["id"];
          },
        ];
      };
      status_logs: {
        Row: {
          id: string;
          pet_id: string;
          task_type: TaskType;
          med_id: string | null;
          completed_at: string;
          completed_by_name: string;
        };
        Insert: {
          id?: string;
          pet_id: string;
          task_type: TaskType;
          med_id?: string | null;
          completed_at?: string;
          completed_by_name: string;
        };
        Update: {
          id?: string;
          pet_id?: string;
          task_type?: TaskType;
          med_id?: string | null;
          completed_at?: string;
          completed_by_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "status_logs_pet_id_fkey";
            columns: ["pet_id"];
            isOneToOne: false;
            referencedRelation: "pets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "status_logs_med_id_fkey";
            columns: ["med_id"];
            isOneToOne: false;
            referencedRelation: "medications";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      task_type: TaskType;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type Household = Database["public"]["Tables"]["households"]["Row"];
export type Pet = Database["public"]["Tables"]["pets"]["Row"];
export type Medication = Database["public"]["Tables"]["medications"]["Row"];
export type StatusLog = Database["public"]["Tables"]["status_logs"]["Row"];
