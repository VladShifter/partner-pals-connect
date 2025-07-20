export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          target_id: string | null
          target_table: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id?: string | null
          target_table?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id?: string | null
          target_table?: string | null
        }
        Relationships: []
      }
      partner_applications: {
        Row: {
          company_name: string | null
          completed_steps: number[] | null
          created_at: string | null
          current_step: number | null
          email: string
          experience_years: number | null
          id: string
          marketing_channels: string[] | null
          monthly_revenue: number | null
          name: string | null
          partnership_goals: string[] | null
          phone: string | null
          previous_partnerships: string | null
          product_id: string | null
          status: string | null
          target_market: string | null
          team_size: number | null
          updated_at: string | null
          why_interested: string | null
        }
        Insert: {
          company_name?: string | null
          completed_steps?: number[] | null
          created_at?: string | null
          current_step?: number | null
          email: string
          experience_years?: number | null
          id?: string
          marketing_channels?: string[] | null
          monthly_revenue?: number | null
          name?: string | null
          partnership_goals?: string[] | null
          phone?: string | null
          previous_partnerships?: string | null
          product_id?: string | null
          status?: string | null
          target_market?: string | null
          team_size?: number | null
          updated_at?: string | null
          why_interested?: string | null
        }
        Update: {
          company_name?: string | null
          completed_steps?: number[] | null
          created_at?: string | null
          current_step?: number | null
          email?: string
          experience_years?: number | null
          id?: string
          marketing_channels?: string[] | null
          monthly_revenue?: number | null
          name?: string | null
          partnership_goals?: string[] | null
          phone?: string | null
          previous_partnerships?: string | null
          product_id?: string | null
          status?: string | null
          target_market?: string | null
          team_size?: number | null
          updated_at?: string | null
          why_interested?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_applications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          company_name: string
          created_at: string | null
          id: string
          status: string | null
          subtype: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_name: string
          created_at?: string | null
          id?: string
          status?: string | null
          subtype?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string | null
          id?: string
          status?: string | null
          subtype?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      partnership_requests: {
        Row: {
          created_at: string | null
          id: string
          partner_id: string | null
          product_id: string | null
          status: string | null
          subtype: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          partner_id?: string | null
          product_id?: string | null
          status?: string | null
          subtype?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          partner_id?: string | null
          product_id?: string | null
          status?: string | null
          subtype?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partnership_requests_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partnership_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_pricing_tiers: {
        Row: {
          commission_rate: number
          created_at: string
          description: string | null
          id: string
          is_most_popular: boolean
          monthly_fee: number
          product_id: string | null
          tier_name: string
          tier_order: number
          updated_at: string
        }
        Insert: {
          commission_rate: number
          created_at?: string
          description?: string | null
          id?: string
          is_most_popular?: boolean
          monthly_fee?: number
          product_id?: string | null
          tier_name: string
          tier_order?: number
          updated_at?: string
        }
        Update: {
          commission_rate?: number
          created_at?: string
          description?: string | null
          id?: string
          is_most_popular?: boolean
          monthly_fee?: number
          product_id?: string | null
          tier_name?: string
          tier_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_pricing_tiers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_tags: {
        Row: {
          id: string
          product_id: string | null
          tag_id: string | null
        }
        Insert: {
          id?: string
          product_id?: string | null
          tag_id?: string | null
        }
        Update: {
          id?: string
          product_id?: string | null
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_tags_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          annual_income_potential: number | null
          average_deal_size: number | null
          build_from_scratch_cost: number | null
          commission_rate: number | null
          created_at: string | null
          description: string | null
          extended_description: string | null
          features: string[] | null
          getting_customers: string[] | null
          id: string
          ideal_resellers: string[] | null
          launch_steps: string[] | null
          name: string
          price: number | null
          reseller_benefits: string[] | null
          roi_default_deal_value: number | null
          roi_default_deals_per_month: number | null
          roi_monthly_fee: number | null
          setup_fee: number | null
          status: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          annual_income_potential?: number | null
          average_deal_size?: number | null
          build_from_scratch_cost?: number | null
          commission_rate?: number | null
          created_at?: string | null
          description?: string | null
          extended_description?: string | null
          features?: string[] | null
          getting_customers?: string[] | null
          id?: string
          ideal_resellers?: string[] | null
          launch_steps?: string[] | null
          name: string
          price?: number | null
          reseller_benefits?: string[] | null
          roi_default_deal_value?: number | null
          roi_default_deals_per_month?: number | null
          roi_monthly_fee?: number | null
          setup_fee?: number | null
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          annual_income_potential?: number | null
          average_deal_size?: number | null
          build_from_scratch_cost?: number | null
          commission_rate?: number | null
          created_at?: string | null
          description?: string | null
          extended_description?: string | null
          features?: string[] | null
          getting_customers?: string[] | null
          id?: string
          ideal_resellers?: string[] | null
          launch_steps?: string[] | null
          name?: string
          price?: number | null
          reseller_benefits?: string[] | null
          roi_default_deal_value?: number | null
          roi_default_deals_per_month?: number | null
          roi_monthly_fee?: number | null
          setup_fee?: number | null
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          category: string | null
          color_hex: string | null
          created_at: string | null
          filter_type: string | null
          id: string
          is_featured: boolean | null
          is_global: boolean | null
          name: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          color_hex?: string | null
          created_at?: string | null
          filter_type?: string | null
          id?: string
          is_featured?: boolean | null
          is_global?: boolean | null
          name: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          color_hex?: string | null
          created_at?: string | null
          filter_type?: string | null
          id?: string
          is_featured?: boolean | null
          is_global?: boolean | null
          name?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vendor_tags: {
        Row: {
          id: string
          tag_id: string | null
          vendor_id: string | null
        }
        Insert: {
          id?: string
          tag_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          id?: string
          tag_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_tags_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          banner_image_url: string | null
          company_name: string
          created_at: string | null
          demo_video_file_url: string | null
          id: string
          niche: string | null
          pitch: string | null
          preview_image_url: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          banner_image_url?: string | null
          company_name: string
          created_at?: string | null
          demo_video_file_url?: string | null
          id?: string
          niche?: string | null
          pitch?: string | null
          preview_image_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          banner_image_url?: string | null
          company_name?: string
          created_at?: string | null
          demo_video_file_url?: string | null
          id?: string
          niche?: string | null
          pitch?: string | null
          preview_image_url?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_commission_range_tag: {
        Args: { commission_rate: number }
        Returns: string
      }
      get_deal_size_range_tag: {
        Args: { deal_size: number }
        Returns: string
      }
      get_monthly_income_range_tag: {
        Args: { annual_income: number }
        Returns: string
      }
      get_setup_fee_range_tag: {
        Args: { setup_fee: number }
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      update_vendor_tags: {
        Args: { vendor_id_param: string; tag_ids: string[] }
        Returns: undefined
      }
    }
    Enums: {
      user_role: "admin" | "user" | "vendor" | "partner"
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
      user_role: ["admin", "user", "vendor", "partner"],
    },
  },
} as const
