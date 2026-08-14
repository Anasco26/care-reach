export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          cancel_reason: string | null
          created_at: string
          date: string
          doctor_id: string
          id: string
          patient_id: string
          reason: string
          status: Database["public"]["Enums"]["appointment_status"]
          time: string
        }
        Insert: {
          cancel_reason?: string | null
          created_at?: string
          date: string
          doctor_id: string
          id?: string
          patient_id: string
          reason?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          time: string
        }
        Update: {
          cancel_reason?: string | null
          created_at?: string
          date?: string
          doctor_id?: string
          id?: string
          patient_id?: string
          reason?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          time?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          available: boolean
          available_slots: string[]
          bio: string
          created_at: string
          email: string
          experience_years: number
          fee: number
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          name: string
          phone: string
          specialization_id: string | null
          user_id: string | null
        }
        Insert: {
          available?: boolean
          available_slots?: string[]
          bio?: string
          created_at?: string
          email: string
          experience_years?: number
          fee?: number
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          name: string
          phone?: string
          specialization_id?: string | null
          user_id?: string | null
        }
        Update: {
          available?: boolean
          available_slots?: string[]
          bio?: string
          created_at?: string
          email?: string
          experience_years?: number
          fee?: number
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          name?: string
          phone?: string
          specialization_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "doctors_specialization_id_fkey"
            columns: ["specialization_id"]
            isOneToOne: false
            referencedRelation: "specializations"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string
          created_at: string
          date_of_birth: string | null
          email: string
          gender: Database["public"]["Enums"]["gender_type"]
          id: string
          name: string
          phone: string
          user_id: string
        }
        Insert: {
          address?: string
          created_at?: string
          date_of_birth?: string | null
          email: string
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          name: string
          phone?: string
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string
          date_of_birth?: string | null
          email?: string
          gender?: Database["public"]["Enums"]["gender_type"]
          id?: string
          name?: string
          phone?: string
          user_id?: string
        }
        Relationships: []
      }
      patient_reviews: {
        Row: {
          appointment_id: string
          comment: string
          created_at: string
          doctor_id: string
          id: string
          patient_id: string
          rating: number
        }
        Insert: {
          appointment_id: string
          comment: string
          created_at?: string
          doctor_id: string
          id?: string
          patient_id: string
          rating: number
        }
        Update: {
          appointment_id?: string
          comment?: string
          created_at?: string
          doctor_id?: string
          id?: string
          patient_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "patient_reviews_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: true
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_reviews_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_reviews_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string
        }
        Insert: {
          created_at?: string
          email?: string
          id: string
          name?: string
          phone?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      specializations: {
        Row: {
          description: string
          id: string
          name: string
        }
        Insert: {
          description?: string
          id?: string
          name: string
        }
        Update: {
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      booked_slots: {
        Args: { _date: string; _doctor_id: string }
        Returns: {
          slot: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      owns_doctor: { Args: { _doctor_id: string }; Returns: boolean }
      owns_patient: { Args: { _patient_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "ADMIN" | "DOCTOR" | "PATIENT"
      appointment_status: "PENDING" | "APPROVED" | "COMPLETED" | "CANCELLED"
      gender_type: "MALE" | "FEMALE" | "OTHER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["ADMIN", "DOCTOR", "PATIENT"],
      appointment_status: ["PENDING", "APPROVED", "COMPLETED", "CANCELLED"],
      gender_type: ["MALE", "FEMALE", "OTHER"],
    },
  },
} as const
