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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      certificates: {
        Row: {
          cert_type: string
          created_at: string
          delivery_status: string | null
          event_id: string
          id: string
          pdf_url: string | null
          rank: number | null
          recipient_email: string
          recipient_name: string
          score: number | null
          sent_at: string | null
          team_member_id: string | null
        }
        Insert: {
          cert_type?: string
          created_at?: string
          delivery_status?: string | null
          event_id: string
          id?: string
          pdf_url?: string | null
          rank?: number | null
          recipient_email: string
          recipient_name: string
          score?: number | null
          sent_at?: string | null
          team_member_id?: string | null
        }
        Update: {
          cert_type?: string
          created_at?: string
          delivery_status?: string | null
          event_id?: string
          id?: string
          pdf_url?: string | null
          rank?: number | null
          recipient_email?: string
          recipient_name?: string
          score?: number | null
          sent_at?: string | null
          team_member_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          banner_url: string | null
          college: string
          created_at: string
          event_date: string
          id: string
          judging_open: boolean
          leaderboard_public: boolean
          max_participants: number | null
          max_team_size: number
          name: string
          organizer_id: string
          registration_deadline: string
          status: Database["public"]["Enums"]["event_status"]
          submission_deadline: string
          updated_at: string
          venue: string | null
          welcome_message: string | null
        }
        Insert: {
          banner_url?: string | null
          college: string
          created_at?: string
          event_date: string
          id?: string
          judging_open?: boolean
          leaderboard_public?: boolean
          max_participants?: number | null
          max_team_size?: number
          name: string
          organizer_id: string
          registration_deadline: string
          status?: Database["public"]["Enums"]["event_status"]
          submission_deadline: string
          updated_at?: string
          venue?: string | null
          welcome_message?: string | null
        }
        Update: {
          banner_url?: string | null
          college?: string
          created_at?: string
          event_date?: string
          id?: string
          judging_open?: boolean
          leaderboard_public?: boolean
          max_participants?: number | null
          max_team_size?: number
          name?: string
          organizer_id?: string
          registration_deadline?: string
          status?: Database["public"]["Enums"]["event_status"]
          submission_deadline?: string
          updated_at?: string
          venue?: string | null
          welcome_message?: string | null
        }
        Relationships: []
      }
      judging_criteria: {
        Row: {
          created_at: string
          event_id: string
          id: string
          max_points: number
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          max_points?: number
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          max_points?: number
          name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "judging_criteria_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      jury_members: {
        Row: {
          created_at: string
          designation: string | null
          email: string
          event_id: string
          expertise: string[] | null
          full_name: string
          id: string
          invite_sent_at: string | null
          invite_status: Database["public"]["Enums"]["invite_status"]
          last_seen_at: string | null
          organization: string | null
          photo_url: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          designation?: string | null
          email: string
          event_id: string
          expertise?: string[] | null
          full_name: string
          id?: string
          invite_sent_at?: string | null
          invite_status?: Database["public"]["Enums"]["invite_status"]
          last_seen_at?: string | null
          organization?: string | null
          photo_url?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          designation?: string | null
          email?: string
          event_id?: string
          expertise?: string[] | null
          full_name?: string
          id?: string
          invite_sent_at?: string | null
          invite_status?: Database["public"]["Enums"]["invite_status"]
          last_seen_at?: string | null
          organization?: string | null
          photo_url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jury_members_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      problem_statements: {
        Row: {
          created_at: string
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty"]
          event_id: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty"]
          event_id: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty"]
          event_id?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "problem_statements_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          college: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          college?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          college?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      scores: {
        Row: {
          created_at: string
          criteria_id: string
          id: string
          jury_member_id: string
          notes: string | null
          points: number
          submission_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          criteria_id: string
          id?: string
          jury_member_id: string
          notes?: string | null
          points?: number
          submission_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          criteria_id?: string
          id?: string
          jury_member_id?: string
          notes?: string | null
          points?: number
          submission_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scores_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "judging_criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_jury_member_id_fkey"
            columns: ["jury_member_id"]
            isOneToOne: false
            referencedRelation: "jury_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scores_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          created_at: string
          demo_url: string | null
          description: string | null
          event_id: string
          github_url: string | null
          id: string
          is_late: boolean
          project_name: string
          slides_url: string | null
          status: Database["public"]["Enums"]["submission_status"]
          team_id: string
          updated_at: string
          validation: Json | null
        }
        Insert: {
          created_at?: string
          demo_url?: string | null
          description?: string | null
          event_id: string
          github_url?: string | null
          id?: string
          is_late?: boolean
          project_name: string
          slides_url?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          team_id: string
          updated_at?: string
          validation?: Json | null
        }
        Update: {
          created_at?: string
          demo_url?: string | null
          description?: string | null
          event_id?: string
          github_url?: string | null
          id?: string
          is_late?: boolean
          project_name?: string
          slides_url?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          team_id?: string
          updated_at?: string
          validation?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          college: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_lead: boolean
          team_id: string
          user_id: string | null
        }
        Insert: {
          college?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_lead?: boolean
          team_id: string
          user_id?: string | null
        }
        Update: {
          college?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_lead?: boolean
          team_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          college: string | null
          created_at: string
          event_id: string
          id: string
          name: string
          problem_statement_id: string | null
        }
        Insert: {
          college?: string | null
          created_at?: string
          event_id: string
          id?: string
          name: string
          problem_statement_id?: string | null
        }
        Update: {
          college?: string | null
          created_at?: string
          event_id?: string
          id?: string
          name?: string
          problem_statement_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teams_problem_statement_id_fkey"
            columns: ["problem_statement_id"]
            isOneToOne: false
            referencedRelation: "problem_statements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string | null
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "organizer" | "jury" | "participant"
      difficulty: "easy" | "medium" | "hard"
      event_status: "draft" | "upcoming" | "live" | "judging" | "completed"
      invite_status:
        | "pending"
        | "sent"
        | "opened"
        | "logged_in"
        | "completed"
        | "failed"
      submission_status: "incomplete" | "pending" | "valid" | "flagged"
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
      app_role: ["organizer", "jury", "participant"],
      difficulty: ["easy", "medium", "hard"],
      event_status: ["draft", "upcoming", "live", "judging", "completed"],
      invite_status: [
        "pending",
        "sent",
        "opened",
        "logged_in",
        "completed",
        "failed",
      ],
      submission_status: ["incomplete", "pending", "valid", "flagged"],
    },
  },
} as const
