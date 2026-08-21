export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      child_achievements: {
        Row: {
          achievement_id: string;
          child_id: string;
          claimed_at: string | null;
          created_at: string;
          id: string;
          metadata: Json;
          shown_at: string | null;
          unlocked_at: string;
          updated_at: string;
        };
        Insert: {
          achievement_id: string;
          child_id: string;
          claimed_at?: string | null;
          created_at?: string;
          id?: string;
          metadata?: Json;
          shown_at?: string | null;
          unlocked_at?: string;
          updated_at?: string;
        };
        Update: {
          achievement_id?: string;
          child_id?: string;
          claimed_at?: string | null;
          created_at?: string;
          id?: string;
          metadata?: Json;
          shown_at?: string | null;
          unlocked_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "child_achievements_child_id_fkey";
            columns: ["child_id"];
            isOneToOne: false;
            referencedRelation: "children";
            referencedColumns: ["id"];
          },
        ];
      };
      child_coin_events: {
        Row: {
          achievement_id: string | null;
          amount: number;
          child_id: string;
          created_at: string;
          id: string;
          level: number | null;
          reason: string;
          reward_id: string | null;
          task_id: string | null;
        };
        Insert: {
          achievement_id?: string | null;
          amount: number;
          child_id: string;
          created_at?: string;
          id?: string;
          level?: number | null;
          reason: string;
          reward_id?: string | null;
          task_id?: string | null;
        };
        Update: {
          achievement_id?: string | null;
          amount?: number;
          child_id?: string;
          created_at?: string;
          id?: string;
          level?: number | null;
          reason?: string;
          reward_id?: string | null;
          task_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "child_coin_events_child_id_fkey";
            columns: ["child_id"];
            isOneToOne: false;
            referencedRelation: "children";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "child_coin_events_reward_id_fkey";
            columns: ["reward_id"];
            isOneToOne: false;
            referencedRelation: "rewards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "child_coin_events_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "child_tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      child_tasks: {
        Row: {
          category: string | null;
          child_id: string | null;
          coin_reward: number;
          completed: boolean;
          created_at: string;
          description: string | null;
          due_at: string | null;
          emoji: string | null;
          id: string;
          parent_task_id: string | null;
          proof_photo_url: string | null;
          repeat_days: string[];
          status: string;
          title: string | null;
          xp_reward: number;
        };
        Insert: {
          category?: string | null;
          child_id?: string | null;
          coin_reward?: number;
          completed?: boolean;
          created_at?: string;
          description?: string | null;
          due_at?: string | null;
          emoji?: string | null;
          id?: string;
          parent_task_id?: string | null;
          proof_photo_url?: string | null;
          repeat_days?: string[];
          status?: string;
          title?: string | null;
          xp_reward?: number;
        };
        Update: {
          category?: string | null;
          child_id?: string | null;
          coin_reward?: number;
          completed?: boolean;
          created_at?: string;
          description?: string | null;
          due_at?: string | null;
          emoji?: string | null;
          id?: string;
          parent_task_id?: string | null;
          proof_photo_url?: string | null;
          repeat_days?: string[];
          status?: string;
          title?: string | null;
          xp_reward?: number;
        };
        Relationships: [
          {
            foreignKeyName: "child_tasks_child_id_fkey";
            columns: ["child_id"];
            isOneToOne: false;
            referencedRelation: "children";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "child_tasks_parent_task_id_fkey";
            columns: ["parent_task_id"];
            isOneToOne: false;
            referencedRelation: "child_tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      child_xp_events: {
        Row: {
          achievement_id: string | null;
          amount: number;
          child_id: string;
          created_at: string;
          event_date: string;
          id: string;
          reason: string;
          task_id: string | null;
        };
        Insert: {
          achievement_id?: string | null;
          amount: number;
          child_id: string;
          created_at?: string;
          event_date?: string;
          id?: string;
          reason: string;
          task_id?: string | null;
        };
        Update: {
          achievement_id?: string | null;
          amount?: number;
          child_id?: string;
          created_at?: string;
          event_date?: string;
          id?: string;
          reason?: string;
          task_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "child_xp_events_child_id_fkey";
            columns: ["child_id"];
            isOneToOne: false;
            referencedRelation: "children";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "child_xp_events_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "child_tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      children: {
        Row: {
          age: number | null;
          avatar_id: string | null;
          avatar_url: string | null;
          coin_balance: number;
          created_at: string;
          family_id: string | null;
          gender: string | null;
          id: string;
          expo_push_token: string | null;
          level: number;
          login_code: string | null;
          name: string | null;
          notifications_permission_status: string | null;
          push_token_updated_at: string | null;
          xp_total: number;
        };
        Insert: {
          age?: number | null;
          avatar_id?: string | null;
          avatar_url?: string | null;
          coin_balance?: number;
          created_at?: string;
          family_id?: string | null;
          gender?: string | null;
          id?: string;
          expo_push_token?: string | null;
          level?: number;
          login_code?: string | null;
          name?: string | null;
          notifications_permission_status?: string | null;
          push_token_updated_at?: string | null;
          xp_total?: number;
        };
        Update: {
          age?: number | null;
          avatar_id?: string | null;
          avatar_url?: string | null;
          coin_balance?: number;
          created_at?: string;
          family_id?: string | null;
          gender?: string | null;
          id?: string;
          expo_push_token?: string | null;
          level?: number;
          login_code?: string | null;
          name?: string | null;
          notifications_permission_status?: string | null;
          push_token_updated_at?: string | null;
          xp_total?: number;
        };
        Relationships: [
          {
            foreignKeyName: "children_family_id_fkey";
            columns: ["family_id"];
            isOneToOne: false;
            referencedRelation: "families";
            referencedColumns: ["id"];
          },
        ];
      };
      families: {
        Row: {
          created_at: string;
          id: string;
          parent_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          parent_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          parent_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "families_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          child_notifications_enabled: boolean;
          email: string;
          expo_push_token: string | null;
          id: string;
          language: string;
          name: string | null;
          notifications_permission_status: string | null;
          onboarding_completed: boolean;
          parent_notifications_enabled: boolean;
          push_token_updated_at: string | null;
          role: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          child_notifications_enabled?: boolean;
          email: string;
          expo_push_token?: string | null;
          id?: string;
          language?: string;
          name?: string | null;
          notifications_permission_status?: string | null;
          onboarding_completed?: boolean;
          parent_notifications_enabled?: boolean;
          push_token_updated_at?: string | null;
          role?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          child_notifications_enabled?: boolean;
          email?: string;
          expo_push_token?: string | null;
          id?: string;
          language?: string;
          name?: string | null;
          notifications_permission_status?: string | null;
          onboarding_completed?: boolean;
          parent_notifications_enabled?: boolean;
          push_token_updated_at?: string | null;
          role?: string | null;
        };
        Relationships: [];
      };
      rewards: {
        Row: {
          child_id: string | null;
          coin_amount: number | null;
          given_at: string | null;
          icon: string | null;
          id: string;
          image_uri: string | null;
          name: string | null;
          requested_at: string | null;
          status: string;
        };
        Insert: {
          child_id?: string | null;
          coin_amount?: number | null;
          given_at?: string | null;
          icon?: string | null;
          id?: string;
          image_uri?: string | null;
          name?: string | null;
          requested_at?: string | null;
          status?: string;
        };
        Update: {
          child_id?: string | null;
          coin_amount?: number | null;
          given_at?: string | null;
          icon?: string | null;
          id?: string;
          image_uri?: string | null;
          name?: string | null;
          requested_at?: string | null;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "rewards_child_id_fkey";
            columns: ["child_id"];
            isOneToOne: false;
            referencedRelation: "children";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      claim_child_achievement: {
        Args: {
          input_achievement_id: string;
          input_child_id: string;
          input_login_code: string;
        };
        Returns: {
          achievement_id: string;
          child_id: string;
          claimed_at: string | null;
          created_at: string;
          id: string;
          metadata: Json;
          shown_at: string | null;
          unlocked_at: string;
          updated_at: string;
        };
        SetofOptions: {
          from: "*";
          to: "child_achievements";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      claim_child_level_up_bonus: {
        Args: {
          input_child_id: string;
          input_level: number;
          input_login_code: string;
        };
        Returns: {
          age: number | null;
          avatar_id: string | null;
          avatar_url: string | null;
          coin_balance: number;
          created_at: string;
          family_id: string | null;
          gender: string | null;
          id: string;
          level: number;
          login_code: string | null;
          name: string | null;
          xp_total: number;
        };
        SetofOptions: {
          from: "*";
          to: "children";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      delete_current_user_account: { Args: never; Returns: undefined };
      get_child_achievement_stats: {
        Args: { input_child_id: string };
        Returns: Json;
      };
      get_child_by_login_code: {
        Args: { input_login_code: string };
        Returns: {
          avatar_id: string;
          avatar_url: string;
          id: string;
          login_code: string;
          name: string;
        }[];
      };
      get_child_level:
        | {
            Args: { input_xp_total: number };
            Returns: {
              error: true;
            } & "Could not choose the best candidate function between: public.get_child_level(input_xp_total => int8), public.get_child_level(input_xp_total => int4). Try renaming the parameters or the function itself in the database so function overloading can be resolved";
          }
        | {
            Args: { input_xp_total: number };
            Returns: {
              error: true;
            } & "Could not choose the best candidate function between: public.get_child_level(input_xp_total => int8), public.get_child_level(input_xp_total => int4). Try renaming the parameters or the function itself in the database so function overloading can be resolved";
          };
      get_kid_dashboard_data: {
        Args: { input_child_id: string; input_login_code: string };
        Returns: {
          achievement_stats: Json;
          child: Json;
          child_achievements: Json;
          rewards: Json;
          tasks: Json;
        }[];
      };
      mark_child_achievement_shown: {
        Args: {
          input_achievement_id: string;
          input_child_id: string;
          input_login_code: string;
        };
        Returns: {
          achievement_id: string;
          child_id: string;
          claimed_at: string | null;
          created_at: string;
          id: string;
          metadata: Json;
          shown_at: string | null;
          unlocked_at: string;
          updated_at: string;
        };
        SetofOptions: {
          from: "*";
          to: "child_achievements";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      materialize_child_daily_tasks: {
        Args: { input_child_id: string };
        Returns: {
          category: string | null;
          child_id: string | null;
          coin_reward: number;
          completed: boolean;
          created_at: string;
          description: string | null;
          due_at: string | null;
          emoji: string | null;
          id: string;
          parent_task_id: string | null;
          proof_photo_url: string | null;
          repeat_days: string[];
          status: string;
          title: string | null;
          xp_reward: number;
        }[];
        SetofOptions: {
          from: "*";
          to: "child_tasks";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      request_child_reward: {
        Args: {
          input_child_id: string;
          input_login_code: string;
          input_reward_id: string;
        };
        Returns: {
          child_id: string | null;
          coin_amount: number | null;
          given_at: string | null;
          icon: string | null;
          id: string;
          image_uri: string | null;
          name: string | null;
          requested_at: string | null;
          status: string;
        };
        SetofOptions: {
          from: "*";
          to: "rewards";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      submit_child_task_for_review: {
        Args: {
          input_child_id: string;
          input_login_code: string;
          input_proof_photo_url: string;
          input_task_id: string;
        };
        Returns: {
          category: string | null;
          child_id: string | null;
          coin_reward: number;
          completed: boolean;
          created_at: string;
          description: string | null;
          due_at: string | null;
          emoji: string | null;
          id: string;
          parent_task_id: string | null;
          proof_photo_url: string | null;
          repeat_days: string[];
          status: string;
          title: string | null;
          xp_reward: number;
        }[];
        SetofOptions: {
          from: "*";
          to: "child_tasks";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      sync_child_achievements: {
        Args: { input_child_id: string };
        Returns: {
          achievement_id: string;
          child_id: string;
          claimed_at: string | null;
          created_at: string;
          id: string;
          metadata: Json;
          shown_at: string | null;
          unlocked_at: string;
          updated_at: string;
        }[];
        SetofOptions: {
          from: "*";
          to: "child_achievements";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      update_child_task_status: {
        Args: {
          input_proof_photo_url?: string;
          input_status: string;
          input_task_id: string;
        };
        Returns: {
          category: string | null;
          child_id: string | null;
          coin_reward: number;
          completed: boolean;
          created_at: string;
          description: string | null;
          due_at: string | null;
          emoji: string | null;
          id: string;
          parent_task_id: string | null;
          proof_photo_url: string | null;
          repeat_days: string[];
          status: string;
          title: string | null;
          xp_reward: number;
        }[];
        SetofOptions: {
          from: "*";
          to: "child_tasks";
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
