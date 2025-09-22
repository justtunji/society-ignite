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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          handled: boolean | null
          id: string
          message: string
          name: string
          notes: string | null
          source_page: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          handled?: boolean | null
          id?: string
          message: string
          name: string
          notes?: string | null
          source_page?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          handled?: boolean | null
          id?: string
          message?: string
          name?: string
          notes?: string | null
          source_page?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          capacity: number | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          end_datetime: string | null
          id: string
          location_mode: string | null
          location_text: string | null
          price: number | null
          registration_url: string | null
          slug: string
          start_datetime: string | null
          status: string | null
          tags: string[] | null
          timezone: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          end_datetime?: string | null
          id?: string
          location_mode?: string | null
          location_text?: string | null
          price?: number | null
          registration_url?: string | null
          slug: string
          start_datetime?: string | null
          status?: string | null
          tags?: string[] | null
          timezone?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          end_datetime?: string | null
          id?: string
          location_mode?: string | null
          location_text?: string | null
          price?: number | null
          registration_url?: string | null
          slug?: string
          start_datetime?: string | null
          status?: string | null
          tags?: string[] | null
          timezone?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          caption: string | null
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string
          metadata: Json | null
          photographer_credit: string | null
          related_program_id: string | null
          slug: string
          title: string
          updated_at: string | null
          visible: boolean | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          metadata?: Json | null
          photographer_credit?: string | null
          related_program_id?: string | null
          slug: string
          title: string
          updated_at?: string | null
          visible?: boolean | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          metadata?: Json | null
          photographer_credit?: string | null
          related_program_id?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
          visible?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_items_related_program_id_fkey"
            columns: ["related_program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          category: string | null
          created_at: string | null
          email: string
          id: string
          is_verified: boolean | null
          joined_at: string | null
          mailerlite_id: string | null
          mailerlite_subscribed: boolean | null
          name: string
          preferences: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_verified?: boolean | null
          joined_at?: string | null
          mailerlite_id?: string | null
          mailerlite_subscribed?: boolean | null
          name: string
          preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_verified?: boolean | null
          joined_at?: string | null
          mailerlite_id?: string | null
          mailerlite_subscribed?: boolean | null
          name?: string
          preferences?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      navigation_items: {
        Row: {
          created_at: string | null
          cta_style: boolean | null
          external: boolean | null
          id: string
          label: string
          order_index: number | null
          parent_id: string | null
          updated_at: string | null
          url: string
          visible: boolean | null
        }
        Insert: {
          created_at?: string | null
          cta_style?: boolean | null
          external?: boolean | null
          id?: string
          label: string
          order_index?: number | null
          parent_id?: string | null
          updated_at?: string | null
          url: string
          visible?: boolean | null
        }
        Update: {
          created_at?: string | null
          cta_style?: boolean | null
          external?: boolean | null
          id?: string
          label?: string
          order_index?: number | null
          parent_id?: string | null
          updated_at?: string | null
          url?: string
          visible?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "navigation_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation_items"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          created_at: string | null
          excerpt: string | null
          id: string
          is_homepage: boolean | null
          og_image_url: string | null
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_homepage?: boolean | null
          og_image_url?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          excerpt?: string | null
          id?: string
          is_homepage?: boolean | null
          og_image_url?: string | null
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      partners: {
        Row: {
          carousel_visible: boolean | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          order_index: number | null
          target_blank: boolean | null
          tier: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          carousel_visible?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          order_index?: number | null
          target_blank?: boolean | null
          tier?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          carousel_visible?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          order_index?: number | null
          target_blank?: boolean | null
          tier?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          application_url: string | null
          created_at: string | null
          eligibility: string | null
          end_date: string | null
          hero_image_url: string | null
          id: string
          location_mode: string | null
          location_text: string | null
          long_description: string | null
          program_type: string | null
          short_description: string | null
          slug: string
          start_date: string | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          application_url?: string | null
          created_at?: string | null
          eligibility?: string | null
          end_date?: string | null
          hero_image_url?: string | null
          id?: string
          location_mode?: string | null
          location_text?: string | null
          long_description?: string | null
          program_type?: string | null
          short_description?: string | null
          slug: string
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          application_url?: string | null
          created_at?: string | null
          eligibility?: string | null
          end_date?: string | null
          hero_image_url?: string | null
          id?: string
          location_mode?: string | null
          location_text?: string | null
          long_description?: string | null
          program_type?: string | null
          short_description?: string | null
          slug?: string
          start_date?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          created_at: string | null
          end_date: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          link: string | null
          long_description: string | null
          order_index: number | null
          short_description: string | null
          slug: string
          sponsor_name: string | null
          start_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          link?: string | null
          long_description?: string | null
          order_index?: number | null
          short_description?: string | null
          slug: string
          sponsor_name?: string | null
          start_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          link?: string | null
          long_description?: string | null
          order_index?: number | null
          short_description?: string | null
          slug?: string
          sponsor_name?: string | null
          start_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      resources: {
        Row: {
          created_at: string | null
          description: string | null
          file_url: string | null
          id: string
          published_at: string | null
          resource_type: string | null
          slug: string
          thumbnail_url: string | null
          title: string
          topics: string[] | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          published_at?: string | null
          resource_type?: string | null
          slug: string
          thumbnail_url?: string | null
          title: string
          topics?: string[] | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          published_at?: string | null
          resource_type?: string | null
          slug?: string
          thumbnail_url?: string | null
          title?: string
          topics?: string[] | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: []
      }
      sections: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          order_index: number | null
          page_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          order_index?: number | null
          page_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          order_index?: number | null
          page_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sections_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          accent_color: string | null
          address: string | null
          captcha_provider: string | null
          captcha_secret_key: string | null
          captcha_site_key: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          email_fallback_provider: string | null
          email_from_address: string | null
          email_from_name: string | null
          favicon_url: string | null
          font_body: string | null
          font_heading: string | null
          footer_blurb: string | null
          hero_cta_label: string | null
          hero_cta_url: string | null
          hero_headline: string | null
          hero_subheadline: string | null
          id: string
          instagram_access_token: string | null
          is_mega_menu: boolean | null
          linkedin_access_token: string | null
          linkedin_company_id: string | null
          logo_url: string | null
          newsletter_list_id: string | null
          newsletter_position: string | null
          newsletter_provider: string | null
          og_image_url: string | null
          partner_carousel_pause_on_hover: boolean | null
          partner_carousel_speed: number | null
          primary_color: string
          secondary_color: string
          seo_default_description: string | null
          seo_default_title: string | null
          show_instagram_feed: boolean | null
          show_linkedin_feed: boolean | null
          show_partner_carousel: boolean | null
          show_promotions_section: boolean | null
          site_name: string
          social_instagram: string | null
          social_linkedin: string | null
          social_x: string | null
          tagline: string | null
          updated_at: string | null
        }
        Insert: {
          accent_color?: string | null
          address?: string | null
          captcha_provider?: string | null
          captcha_secret_key?: string | null
          captcha_site_key?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          email_fallback_provider?: string | null
          email_from_address?: string | null
          email_from_name?: string | null
          favicon_url?: string | null
          font_body?: string | null
          font_heading?: string | null
          footer_blurb?: string | null
          hero_cta_label?: string | null
          hero_cta_url?: string | null
          hero_headline?: string | null
          hero_subheadline?: string | null
          id?: string
          instagram_access_token?: string | null
          is_mega_menu?: boolean | null
          linkedin_access_token?: string | null
          linkedin_company_id?: string | null
          logo_url?: string | null
          newsletter_list_id?: string | null
          newsletter_position?: string | null
          newsletter_provider?: string | null
          og_image_url?: string | null
          partner_carousel_pause_on_hover?: boolean | null
          partner_carousel_speed?: number | null
          primary_color?: string
          secondary_color?: string
          seo_default_description?: string | null
          seo_default_title?: string | null
          show_instagram_feed?: boolean | null
          show_linkedin_feed?: boolean | null
          show_partner_carousel?: boolean | null
          show_promotions_section?: boolean | null
          site_name?: string
          social_instagram?: string | null
          social_linkedin?: string | null
          social_x?: string | null
          tagline?: string | null
          updated_at?: string | null
        }
        Update: {
          accent_color?: string | null
          address?: string | null
          captcha_provider?: string | null
          captcha_secret_key?: string | null
          captcha_site_key?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          email_fallback_provider?: string | null
          email_from_address?: string | null
          email_from_name?: string | null
          favicon_url?: string | null
          font_body?: string | null
          font_heading?: string | null
          footer_blurb?: string | null
          hero_cta_label?: string | null
          hero_cta_url?: string | null
          hero_headline?: string | null
          hero_subheadline?: string | null
          id?: string
          instagram_access_token?: string | null
          is_mega_menu?: boolean | null
          linkedin_access_token?: string | null
          linkedin_company_id?: string | null
          logo_url?: string | null
          newsletter_list_id?: string | null
          newsletter_position?: string | null
          newsletter_provider?: string | null
          og_image_url?: string | null
          partner_carousel_pause_on_hover?: boolean | null
          partner_carousel_speed?: number | null
          primary_color?: string
          secondary_color?: string
          seo_default_description?: string | null
          seo_default_title?: string | null
          show_instagram_feed?: boolean | null
          show_linkedin_feed?: boolean | null
          show_partner_carousel?: boolean | null
          show_promotions_section?: boolean | null
          site_name?: string
          social_instagram?: string | null
          social_linkedin?: string | null
          social_x?: string | null
          tagline?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string | null
          email: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          linkedin_url: string | null
          name: string
          order_index: number | null
          title: string | null
          twitter_url: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          linkedin_url?: string | null
          name: string
          order_index?: number | null
          title?: string | null
          twitter_url?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          linkedin_url?: string | null
          name?: string
          order_index?: number | null
          title?: string | null
          twitter_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      public_site_settings: {
        Row: {
          accent_color: string | null
          address: string | null
          captcha_provider: string | null
          captcha_site_key: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          favicon_url: string | null
          font_body: string | null
          font_heading: string | null
          footer_blurb: string | null
          hero_cta_label: string | null
          hero_cta_url: string | null
          hero_headline: string | null
          hero_subheadline: string | null
          id: string | null
          is_mega_menu: boolean | null
          logo_url: string | null
          newsletter_position: string | null
          newsletter_provider: string | null
          og_image_url: string | null
          partner_carousel_pause_on_hover: boolean | null
          partner_carousel_speed: number | null
          primary_color: string | null
          secondary_color: string | null
          seo_default_description: string | null
          seo_default_title: string | null
          show_instagram_feed: boolean | null
          show_linkedin_feed: boolean | null
          show_partner_carousel: boolean | null
          show_promotions_section: boolean | null
          site_name: string | null
          social_instagram: string | null
          social_linkedin: string | null
          social_x: string | null
          tagline: string | null
          updated_at: string | null
        }
        Relationships: []
      }
      team_members_public: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string | null
          image_url: string | null
          is_featured: boolean | null
          linkedin_url: string | null
          name: string | null
          order_index: number | null
          title: string | null
          twitter_url: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string | null
          image_url?: string | null
          is_featured?: boolean | null
          linkedin_url?: string | null
          name?: string | null
          order_index?: number | null
          title?: string | null
          twitter_url?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string | null
          image_url?: string | null
          is_featured?: boolean | null
          linkedin_url?: string | null
          name?: string | null
          order_index?: number | null
          title?: string | null
          twitter_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_public_site_settings: {
        Args: Record<PropertyKey, never>
        Returns: {
          accent_color: string
          address: string
          captcha_provider: string
          captcha_site_key: string
          contact_email: string
          contact_phone: string
          created_at: string
          favicon_url: string
          font_body: string
          font_heading: string
          footer_blurb: string
          hero_cta_label: string
          hero_cta_url: string
          hero_headline: string
          hero_subheadline: string
          id: string
          is_mega_menu: boolean
          logo_url: string
          newsletter_position: string
          newsletter_provider: string
          og_image_url: string
          partner_carousel_pause_on_hover: boolean
          partner_carousel_speed: number
          primary_color: string
          secondary_color: string
          seo_default_description: string
          seo_default_title: string
          show_instagram_feed: boolean
          show_linkedin_feed: boolean
          show_partner_carousel: boolean
          show_promotions_section: boolean
          site_name: string
          social_instagram: string
          social_linkedin: string
          social_x: string
          tagline: string
          updated_at: string
        }[]
      }
      get_public_team_members: {
        Args: Record<PropertyKey, never>
        Returns: {
          bio: string
          created_at: string
          id: string
          image_url: string
          is_featured: boolean
          linkedin_url: string
          name: string
          order_index: number
          title: string
          twitter_url: string
          updated_at: string
        }[]
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
