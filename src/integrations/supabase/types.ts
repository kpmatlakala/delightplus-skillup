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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      users: {
        Row: {
          app_metadata: Json
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          location: string | null
          reputation: number
          role: string
          updated_at: string
          username: string | null
          website: string | null
        }
        Insert: {
          app_metadata?: Json
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          location?: string | null
          reputation?: number
          role?: string
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          app_metadata?: Json
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          location?: string | null
          reputation?: number
          role?: string
          updated_at?: string
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cet_check_in: {
        Args: {
          p_learner_id: string
          p_marked_by?: string
          p_session_id: string
        }
        Returns: undefined
      }
      cet_check_out: {
        Args: {
          p_learner_id: string
          p_marked_by?: string
          p_session_id: string
        }
        Returns: undefined
      }
      cet_delete_announcement: { Args: { p_id: string }; Returns: undefined }
      cet_enrolled_learners: {
        Args: never
        Returns: {
          email: string
          full_name: string
          id: string
          learner_code: string
          phone: string
          progress: number
          status: string
        }[]
      }
      cet_generate_assessment_otp: {
        Args: { p_module_id: string }
        Returns: Json
      }
      cet_get_active_otp: { Args: { p_module_id: string }; Returns: Json }
      cet_get_all_module_progress: {
        Args: never
        Returns: {
          assessment_submitted: boolean
          assessment_submitted_at: string
          assessment_unlocked: boolean
          guide_completed: boolean
          module_unit_standard_id: string
          quiz_passed: boolean
          submission_path: string
          submission_uploaded_at: string
          updated_at: string
        }[]
      }
      cet_get_announcements: {
        Args: never
        Returns: {
          audience: string
          author: string
          created_at: string
          id: string
          message: string
          pinned: boolean
          title: string
        }[]
      }
      cet_get_attendance_records: {
        Args: { p_session_id: string }
        Returns: {
          check_in_at: string
          check_out_at: string
          learner_id: string
          present: boolean
        }[]
      }
      cet_get_conversation_messages: {
        Args: { p_conversation_id: string }
        Returns: {
          body: string
          id: string
          read_at: string
          sender_id: string
          sent_at: string
        }[]
      }
      cet_get_facilitator_user_id: { Args: never; Returns: string }
      cet_get_module_assessment_status: {
        Args: { p_module_id: string }
        Returns: {
          assessment_submitted: boolean
          assessment_submitted_at: string
          email: string
          full_name: string
          learner_code: string
          learner_id: string
          submission_path: string
        }[]
      }
      cet_get_module_flow: { Args: { p_unit_std_id: string }; Returns: Json }
      cet_get_my_conversations: {
        Args: never
        Returns: {
          conversation_id: string
          last_body: string
          last_sent_at: string
          other_code: string
          other_name: string
          other_role: string
          other_user_id: string
          unread_count: number
        }[]
      }
      cet_get_my_profile: {
        Args: never
        Returns: {
          avatar_url: string
          bio: string
          created_at: string
          display_name: string
          id: string
          location: string
          reputation: number
          role: string
          updated_at: string
          username: string
          website: string
        }[]
      }
      cet_get_my_profile_v2: {
        Args: never
        Returns: {
          avatar_url: string
          bio: string
          created_at: string
          display_name: string
          id: string
          location: string
          phone: string
          reputation: number
          role: string
          updated_at: string
          username: string
          website: string
        }[]
      }
      cet_get_or_create_attendance_session: {
        Args: {
          p_created_by?: string
          p_module_id: string
          p_session_date: string
          p_session_label?: string
        }
        Returns: string
      }
      cet_list_learners_for_messaging: {
        Args: never
        Returns: {
          full_name: string
          id: string
          learner_code: string
          user_id: string
        }[]
      }
      cet_mark_conversation_read: {
        Args: { p_conversation_id: string }
        Returns: undefined
      }
      cet_modules: {
        Args: never
        Returns: {
          block_no: number
          day_label: string
          id: string
          title: string
        }[]
      }
      cet_pin_announcement: {
        Args: { p_id: string; p_pinned: boolean }
        Returns: undefined
      }
      cet_post_announcement: {
        Args: { p_audience?: string; p_message: string; p_title: string }
        Returns: string
      }
      cet_revoke_assessment_otp: {
        Args: { p_module_id: string }
        Returns: undefined
      }
      cet_self_register_learner: {
        Args: { p_email?: string; p_full_name?: string; p_phone?: string }
        Returns: string
      }
      cet_send_message: {
        Args: { p_body: string; p_recipient_id: string }
        Returns: string
      }
      cet_update_my_profile_v2: {
        Args: {
          p_avatar_url: string
          p_bio: string
          p_display_name: string
          p_location: string
          p_phone?: string
          p_username: string
          p_website: string
        }
        Returns: {
          avatar_url: string
          bio: string
          created_at: string
          display_name: string
          id: string
          location: string
          phone: string
          reputation: number
          role: string
          updated_at: string
          username: string
          website: string
        }[]
      }
      cet_upsert_module_flow: {
        Args: { p_flow: Json; p_unit_std_id: string }
        Returns: undefined
      }
      cet_upsert_module_progress: {
        Args: {
          p_assessment_submitted?: boolean
          p_assessment_submitted_at?: string
          p_assessment_unlocked?: boolean
          p_guide_completed?: boolean
          p_quiz_passed?: boolean
          p_submission_path?: string
          p_submission_uploaded_at?: string
          p_unit_std_id: string
        }
        Returns: undefined
      }
      cet_validate_assessment_otp: {
        Args: { p_module_id: string; p_otp: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
