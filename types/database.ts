export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

/* =========================================================
   PROFILE
   ========================================================= */

export type Profile = {
  id: string;
  user_id: string;
  display_name: string;
  country: string | null;
  army_since: number | null;
  bias: string | null;
  favorite_album: string | null;
  favorite_song: string | null;
  favorite_era: string | null;
  favorite_quote: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type ProfileInsert = {
  id?: string;
  user_id: string;
  display_name: string;
  country?: string | null;
  army_since?: number | null;
  bias?: string | null;
  favorite_album?: string | null;
  favorite_song?: string | null;
  favorite_era?: string | null;
  favorite_quote?: string | null;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ProfileUpdate = {
  id?: string;
  user_id?: string;
  display_name?: string;
  country?: string | null;
  army_since?: number | null;
  bias?: string | null;
  favorite_album?: string | null;
  favorite_song?: string | null;
  favorite_era?: string | null;
  favorite_quote?: string | null;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
};

/* =========================================================
   CALENDAR EVENTS
   ========================================================= */

export type CalendarEvent = {
  id: string;
  created_by: string;
  title: string;
  category: string;
  event_date: string;
  description: string | null;
  location: string | null;
  event_link: string | null;
  is_global: boolean;
  created_at: string;
  updated_at: string;
};

export type CalendarEventInsert = {
  id?: string;
  created_by: string;
  title: string;
  category: string;
  event_date: string;
  description?: string | null;
  location?: string | null;
  event_link?: string | null;
  is_global?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CalendarEventUpdate = {
  id?: string;
  created_by?: string;
  title?: string;
  category?: string;
  event_date?: string;
  description?: string | null;
  location?: string | null;
  event_link?: string | null;
  is_global?: boolean;
  created_at?: string;
  updated_at?: string;
};

/* =========================================================
   FAN PROJECTS
   ========================================================= */

export type FanProject = {
  id: string;
  created_by: string;
  title: string;
  category: string;
  organizer_name: string | null;
  project_date: string | null;
  country: string | null;
  city: string | null;
  description: string | null;
  project_link: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type FanProjectInsert = {
  id?: string;
  created_by: string;
  title: string;
  category: string;
  organizer_name?: string | null;
  project_date?: string | null;
  country?: string | null;
  city?: string | null;
  description?: string | null;
  project_link?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

export type FanProjectUpdate = {
  id?: string;
  created_by?: string;
  title?: string;
  category?: string;
  organizer_name?: string | null;
  project_date?: string | null;
  country?: string | null;
  city?: string | null;
  description?: string | null;
  project_link?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

/* =========================================================
   MEMORY VAULT
   ========================================================= */

export type Memory = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: string | null;
  memory_date: string | null;
  visibility: string;
  cover_image_path: string | null;
  created_at: string;
  updated_at: string;
};

export type MemoryInsert = {
  id?: string;
  user_id: string;
  title: string;
  content: string;
  mood?: string | null;
  memory_date?: string | null;
  visibility?: string;
  cover_image_path?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type MemoryUpdate = {
  id?: string;
  user_id?: string;
  title?: string;
  content?: string;
  mood?: string | null;
  memory_date?: string | null;
  visibility?: string;
  cover_image_path?: string | null;
  created_at?: string;
  updated_at?: string;
};

/* =========================================================
   SUPABASE DATABASE TYPE
   ========================================================= */

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };

      events: {
        Row: CalendarEvent;
        Insert: CalendarEventInsert;
        Update: CalendarEventUpdate;
        Relationships: [];
      };

      fan_projects: {
        Row: FanProject;
        Insert: FanProjectInsert;
        Update: FanProjectUpdate;
        Relationships: [];
      };

      memories: {
        Row: Memory;
        Insert: MemoryInsert;
        Update: MemoryUpdate;
        Relationships: [];
      };
    };

    Views: Record<string, never>;

    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };

    Enums: Record<string, never>;

    CompositeTypes: Record<string, never>;
  };
};