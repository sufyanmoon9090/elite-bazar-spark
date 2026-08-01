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
      blog_posts: {
        Row: {
          category: string
          created_at: string
          date: string
          excerpt: string
          id: string
          image: string
          sort_order: number
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          date?: string
          excerpt?: string
          id?: string
          image?: string
          sort_order?: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          excerpt?: string
          id?: string
          image?: string
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          icon: string
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          icon?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          icon?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string
          discount: number
          expires_at: string
          id: string
          min_order: number
          type: string
          usage_limit: number
          used: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          discount?: number
          expires_at?: string
          id?: string
          min_order?: number
          type?: string
          usage_limit?: number
          used?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          discount?: number
          expires_at?: string
          id?: string
          min_order?: number
          type?: string
          usage_limit?: number
          used?: number
        }
        Relationships: []
      }
      notification_reads: {
        Row: {
          id: string
          notification_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          id?: string
          notification_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          id?: string
          notification_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_reads_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          target_user_id: string | null
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          target_user_id?: string | null
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          target_user_id?: string | null
          title?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: Json
          created_at: string
          guest_email: string | null
          guest_phone: string | null
          id: string
          items: Json
          order_number: string
          payment_method: string
          shipping_cost: number
          shipping_method: string
          status: string
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: Json
          created_at?: string
          guest_email?: string | null
          guest_phone?: string | null
          id?: string
          items?: Json
          order_number: string
          payment_method?: string
          shipping_cost?: number
          shipping_method?: string
          status?: string
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: Json
          created_at?: string
          guest_email?: string | null
          guest_phone?: string | null
          id?: string
          items?: Json
          order_number?: string
          payment_method?: string
          shipping_cost?: number
          shipping_method?: string
          status?: string
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      product_reviews: {
        Row: {
          comment: string
          created_at: string
          id: string
          product_id: string
          rating: number
          user_email: string | null
          user_name: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          product_id: string
          rating: number
          user_email?: string | null
          user_name: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          user_email?: string | null
          user_name?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image: string
          original_price: number | null
          price: number
          product_id: string
          variant_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string
          original_price?: number | null
          price?: number
          product_id: string
          variant_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image?: string
          original_price?: number | null
          price?: number
          product_id?: string
          variant_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          badge: string | null
          category: string
          created_at: string
          description: string | null
          id: string
          image: string
          images: Json | null
          in_stock: boolean
          name: string
          original_price: number | null
          price: number
          rating: number
          reviews: number
          supplier_url: string | null
        }
        Insert: {
          badge?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string
          images?: Json | null
          in_stock?: boolean
          name: string
          original_price?: number | null
          price?: number
          rating?: number
          reviews?: number
          supplier_url?: string | null
        }
        Update: {
          badge?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image?: string
          images?: Json | null
          in_stock?: boolean
          name?: string
          original_price?: number | null
          price?: number
          rating?: number
          reviews?: number
          supplier_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          full_name: string | null
          id: string
          is_suspended: boolean
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          full_name?: string | null
          id: string
          is_suspended?: boolean
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          full_name?: string | null
          id?: string
          is_suspended?: boolean
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          section_data: Json
          section_key: string
          updated_at: string
        }
        Insert: {
          id?: string
          section_data?: Json
          section_key: string
          updated_at?: string
        }
        Update: {
          id?: string
          section_data?: Json
          section_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      product_reviews_public: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string | null
          product_id: string | null
          rating: number | null
          user_name: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string | null
          product_id?: string | null
          rating?: number | null
          user_name?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string | null
          product_id?: string | null
          rating?: number | null
          user_name?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_all_users_for_admin: {
        Args: never
        Returns: {
          email: string
          full_name: string
          id: string
          is_suspended: boolean
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
