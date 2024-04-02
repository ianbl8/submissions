export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assignments: {
        Row: {
          code: string | null
          created_at: string
          description: string | null
          due_at: string | null
          id: string
          late_at: string | null
          link: string | null
          name: string | null
          number: number
          release_at: string | null
          rubric: Json | null
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at: string
          description?: string | null
          due_at?: string | null
          id?: string
          late_at?: string | null
          link?: string | null
          name?: string | null
          number?: number
          release_at?: string | null
          rubric?: Json | null
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          id?: string
          late_at?: string | null
          link?: string | null
          name?: string | null
          number?: number
          release_at?: string | null
          rubric?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          code: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          link: string | null
          name: string | null
          number: number
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at: string
          description?: string | null
          end_date?: string | null
          id?: string
          link?: string | null
          name?: string | null
          number?: number
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          link?: string | null
          name?: string | null
          number?: number
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      courses_modules: {
        Row: {
          course_id: string
          created_at: string
          module_credits: number | null
          module_id: string
          module_level: string | null
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at: string
          module_credits?: number | null
          module_id: string
          module_level?: string | null
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          module_credits?: number | null
          module_id?: string
          module_level?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_courses_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_courses_modules_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          code: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          link: string | null
          name: string | null
          number: number
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          link?: string | null
          name?: string | null
          number?: number
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          link?: string | null
          name?: string | null
          number?: number
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      modules_assignments: {
        Row: {
          assignment_id: string
          assignment_weighting: number | null
          created_at: string
          module_id: string
          updated_at: string | null
        }
        Insert: {
          assignment_id: string
          assignment_weighting?: number | null
          created_at: string
          module_id: string
          updated_at?: string | null
        }
        Update: {
          assignment_id?: string
          assignment_weighting?: number | null
          created_at?: string
          module_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_modules_assignments_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_modules_assignments_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          assignment_id: string | null
          complete: boolean | null
          created_at: string | null
          data: Json | null
          id: string
          number: number
          student_id: string | null
          updated_at: string | null
        }
        Insert: {
          assignment_id?: string | null
          complete?: boolean | null
          created_at?: string | null
          data?: Json | null
          id?: string
          number?: number
          student_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assignment_id?: string | null
          complete?: boolean | null
          created_at?: string | null
          data?: Json | null
          id?: string
          number?: number
          student_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          forename: string | null
          id: string
          number: number
          role: Database["public"]["Enums"]["roles"] | null
          status: Database["public"]["Enums"]["statuses"] | null
          student_id: string | null
          surname: string | null
          updated_at: string | null
        }
        Insert: {
          created_at: string
          email?: string | null
          forename?: string | null
          id: string
          number?: number
          role?: Database["public"]["Enums"]["roles"] | null
          status?: Database["public"]["Enums"]["statuses"] | null
          student_id?: string | null
          surname?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          forename?: string | null
          id?: string
          number?: number
          role?: Database["public"]["Enums"]["roles"] | null
          status?: Database["public"]["Enums"]["statuses"] | null
          student_id?: string | null
          surname?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      roles: "Admin" | "Tutor" | "Student" | "Reviewer"
      statuses: "Pending" | "Active" | "Completed" | "Removed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
