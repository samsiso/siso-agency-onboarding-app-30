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
      agency_pain_points: {
        Row: {
          agency_type_id: string | null
          created_at: string
          description: string
          icon: string
          id: string
          impact_areas: string[]
          industry_trends: Json | null
          severity: string
          solutions: string[]
          statistic: string
          survey_data: Json
          testimonial: Json | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          agency_type_id?: string | null
          created_at?: string
          description: string
          icon: string
          id?: string
          impact_areas?: string[]
          industry_trends?: Json | null
          severity: string
          solutions?: string[]
          statistic: string
          survey_data?: Json
          testimonial?: Json | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          agency_type_id?: string | null
          created_at?: string
          description?: string
          icon?: string
          id?: string
          impact_areas?: string[]
          industry_trends?: Json | null
          severity?: string
          solutions?: string[]
          statistic?: string
          survey_data?: Json
          testimonial?: Json | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agency_pain_points_agency_type_id_fkey"
            columns: ["agency_type_id"]
            isOneToOne: false
            referencedRelation: "agency_types"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_types: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      banner_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_default: boolean | null
          metadata: Json | null
          name: string
          template_type: string
          text_overlay: Json | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_default?: boolean | null
          metadata?: Json | null
          name: string
          template_type: string
          text_overlay?: Json | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_default?: boolean | null
          metadata?: Json | null
          name?: string
          template_type?: string
          text_overlay?: Json | null
        }
        Relationships: []
      }
      case_studies: {
        Row: {
          agency_type_id: string | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          notion_url: string | null
          title: string
        }
        Insert: {
          agency_type_id?: string | null
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          notion_url?: string | null
          title: string
        }
        Update: {
          agency_type_id?: string | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          notion_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_studies_agency_type_id_fkey"
            columns: ["agency_type_id"]
            isOneToOne: false
            referencedRelation: "agency_types"
            referencedColumns: ["id"]
          },
        ]
      }
      category_stats: {
        Row: {
          category: string
          community_count: number | null
          id: string
          total_members: number | null
          updated_at: string | null
        }
        Insert: {
          category: string
          community_count?: number | null
          id?: string
          total_members?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          community_count?: number | null
          id?: string
          total_members?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      crypto_transactions: {
        Row: {
          created_at: string | null
          id: string
          points_exchanged: number
          status: string | null
          tokens_received: number
          transaction_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          points_exchanged: number
          status?: string | null
          tokens_received: number
          transaction_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          points_exchanged?: number
          status?: string | null
          tokens_received?: number
          transaction_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      education_creators: {
        Row: {
          channel_avatar_url: string | null
          channel_id: string | null
          created_at: string | null
          description: string | null
          expertise: string[] | null
          id: string
          name: string
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          channel_avatar_url?: string | null
          channel_id?: string | null
          created_at?: string | null
          description?: string | null
          expertise?: string[] | null
          id?: string
          name: string
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          channel_avatar_url?: string | null
          channel_id?: string | null
          created_at?: string | null
          description?: string | null
          expertise?: string[] | null
          id?: string
          name?: string
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      help_articles: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          is_pinned: boolean
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_pinned?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      leaderboard_entries: {
        Row: {
          id: string
          level: number
          points: number
          rank: number | null
          streak_days: number
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          level?: number
          points?: number
          rank?: number | null
          streak_days?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          level?: number
          points?: number
          rank?: number | null
          streak_days?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      login_streaks: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_login: string | null
          longest_streak: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_login?: string | null
          longest_streak?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_login?: string | null
          longest_streak?: number | null
          user_id?: string
        }
        Relationships: []
      }
      networking_resources: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          is_featured: boolean | null
          join_url: string | null
          member_count: number | null
          metadata: Json | null
          name: string
          platform: string
          profile_image_url: string | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          join_url?: string | null
          member_count?: number | null
          metadata?: Json | null
          name: string
          platform: string
          profile_image_url?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          join_url?: string | null
          member_count?: number | null
          metadata?: Json | null
          name?: string
          platform?: string
          profile_image_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      news_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          news_id: string
          user_email: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          news_id: string
          user_email?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          news_id?: string
          user_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      nft_collections: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          points_multiplier: number | null
          tier: string | null
          updated_at: string | null
          weekly_bonus: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          points_multiplier?: number | null
          tier?: string | null
          updated_at?: string | null
          weekly_bonus?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          points_multiplier?: number | null
          tier?: string | null
          updated_at?: string | null
          weekly_bonus?: number | null
        }
        Relationships: []
      }
      onboarding: {
        Row: {
          app_idea: string | null
          created_at: string
          id: string
          name: string | null
          organization: string | null
          social_links: Json | null
          status: string | null
          user_id: string | null
          whatsapp_number: string | null
        }
        Insert: {
          app_idea?: string | null
          created_at?: string
          id?: string
          name?: string | null
          organization?: string | null
          social_links?: Json | null
          status?: string | null
          user_id?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          app_idea?: string | null
          created_at?: string
          id?: string
          name?: string | null
          organization?: string | null
          social_links?: Json | null
          status?: string | null
          user_id?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      plans: {
        Row: {
          app_name: string | null
          branding: Json | null
          company_name: string | null
          created_at: string | null
          estimated_cost: number | null
          estimated_days: number | null
          features: string[] | null
          id: string
          status: string | null
          username: string
        }
        Insert: {
          app_name?: string | null
          branding?: Json | null
          company_name?: string | null
          created_at?: string | null
          estimated_cost?: number | null
          estimated_days?: number | null
          features?: string[] | null
          id?: string
          status?: string | null
          username: string
        }
        Update: {
          app_name?: string | null
          branding?: Json | null
          company_name?: string | null
          created_at?: string | null
          estimated_cost?: number | null
          estimated_days?: number | null
          features?: string[] | null
          id?: string
          status?: string | null
          username?: string
        }
        Relationships: []
      }
      point_configurations: {
        Row: {
          action: string
          cooldown_minutes: number | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          max_daily: number | null
          points_value: number | null
          updated_at: string | null
        }
        Insert: {
          action: string
          cooldown_minutes?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_daily?: number | null
          points_value?: number | null
          updated_at?: string | null
        }
        Update: {
          action?: string
          cooldown_minutes?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_daily?: number | null
          points_value?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      points_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          points_earned: number
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          points_earned: number
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          points_earned?: number
          user_id?: string
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          project_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          project_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          project_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_items_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          business_name: string | null
          created_at: string
          full_name: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          onboarding_completed: boolean | null
          professional_role: string | null
          siso_tokens: number | null
          solana_wallet_address: string | null
          twitter_url: string | null
          updated_at: string
          website_url: string | null
          youtube_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          business_name?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          instagram_url?: string | null
          linkedin_url?: string | null
          onboarding_completed?: boolean | null
          professional_role?: string | null
          siso_tokens?: number | null
          solana_wallet_address?: string | null
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          business_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          onboarding_completed?: boolean | null
          professional_role?: string | null
          siso_tokens?: number | null
          solana_wallet_address?: string | null
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      project_documentation: {
        Row: {
          content: string
          created_at: string | null
          id: string
          order_index: number | null
          project_id: string | null
          related_components: string[] | null
          section: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          order_index?: number | null
          project_id?: string | null
          related_components?: string[] | null
          section: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          order_index?: number | null
          project_id?: string | null
          related_components?: string[] | null
          section?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_documentation_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          completion_percentage: number
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completion_percentage?: number
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completion_percentage?: number
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      skill_paths: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          level: number
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          level?: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          level?: number
          name?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          cooldown_minutes: number | null
          created_at: string
          description: string
          id: string
          level: number
          name: string
          path_id: string
          points: number
          prerequisites: string[]
          requirements: Json
        }
        Insert: {
          cooldown_minutes?: number | null
          created_at?: string
          description: string
          id?: string
          level?: number
          name: string
          path_id: string
          points?: number
          prerequisites?: string[]
          requirements?: Json
        }
        Update: {
          cooldown_minutes?: number | null
          created_at?: string
          description?: string
          id?: string
          level?: number
          name?: string
          path_id?: string
          points?: number
          prerequisites?: string[]
          requirements?: Json
        }
        Relationships: [
          {
            foreignKeyName: "skills_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "skill_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      tools: {
        Row: {
          assistant_type: string
          category: string
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          metadata: Json | null
          name: string
          updated_at: string | null
        }
        Insert: {
          assistant_type: string
          category: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          metadata?: Json | null
          name: string
          updated_at?: string | null
        }
        Update: {
          assistant_type?: string
          category?: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          metadata?: Json | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          status: string
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          status?: string
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          status?: string
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_crypto_history: {
        Row: {
          created_at: string | null
          id: string
          points_exchanged: number
          status: string | null
          tokens_received: number
          transaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          points_exchanged: number
          status?: string | null
          tokens_received: number
          transaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          points_exchanged?: number
          status?: string | null
          tokens_received?: number
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_nfts: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          mint_address: string | null
          nft_collections: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          mint_address?: string | null
          nft_collections?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          mint_address?: string | null
          nft_collections?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_nfts_nft_collections_fkey"
            columns: ["nft_collections"]
            isOneToOne: false
            referencedRelation: "nft_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      user_search_history: {
        Row: {
          created_at: string | null
          id: string
          query: string
          result_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          query: string
          result_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          query?: string
          result_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_skill_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          last_completed_at: string | null
          progress: number
          skill_id: string
          times_completed: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          last_completed_at?: string | null
          progress?: number
          skill_id: string
          times_completed?: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          last_completed_at?: string | null
          progress?: number
          skill_id?: string
          times_completed?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skill_progress_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      video_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          video_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          video_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_bookmarks_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "youtube_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          last_position: number | null
          progress: number | null
          updated_at: string | null
          user_id: string
          video_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          last_position?: number | null
          progress?: number | null
          updated_at?: string | null
          user_id: string
          video_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          last_position?: number | null
          progress?: number | null
          updated_at?: string | null
          user_id?: string
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_progress_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "youtube_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_summaries: {
        Row: {
          created_at: string | null
          difficulty_level: string | null
          id: string
          key_points: string[] | null
          sentiment_score: number | null
          summary: string | null
          topics: string[] | null
          updated_at: string | null
          video_id: string | null
        }
        Insert: {
          created_at?: string | null
          difficulty_level?: string | null
          id?: string
          key_points?: string[] | null
          sentiment_score?: number | null
          summary?: string | null
          topics?: string[] | null
          updated_at?: string | null
          video_id?: string | null
        }
        Update: {
          created_at?: string | null
          difficulty_level?: string | null
          id?: string
          key_points?: string[] | null
          sentiment_score?: number | null
          summary?: string | null
          topics?: string[] | null
          updated_at?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_summaries_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "youtube_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_nonces: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          nonce: string
          public_key: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          nonce: string
          public_key: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          nonce?: string
          public_key?: string
          user_id?: string | null
        }
        Relationships: []
      }
      welcome_nft_mints: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      youtube_videos: {
        Row: {
          channel_id: string | null
          created_at: string | null
          description: string | null
          duration: string | null
          full_description: string | null
          id: string
          published_at: string | null
          tags: string[] | null
          thumbnailurl: string | null
          title: string
          updated_at: string | null
          url: string
          viewcount: number | null
        }
        Insert: {
          channel_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          full_description?: string | null
          id: string
          published_at?: string | null
          tags?: string[] | null
          thumbnailurl?: string | null
          title: string
          updated_at?: string | null
          url: string
          viewcount?: number | null
        }
        Update: {
          channel_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          full_description?: string | null
          id?: string
          published_at?: string | null
          tags?: string[] | null
          thumbnailurl?: string | null
          title?: string
          updated_at?: string | null
          url?: string
          viewcount?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
