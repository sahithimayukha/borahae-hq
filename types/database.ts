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
  is_read_only: boolean;
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
  is_read_only?: boolean;
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
  is_read_only?: boolean;
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
  is_read_only: boolean;
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
  is_read_only?: boolean;
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
  is_read_only?: boolean;
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
   SUPPORT REQUESTS
   ========================================================= */

export type SupportRequest = {
  id: string;
  user_id: string;
  account_email: string;
  category: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type SupportRequestInsert = {
  id?: string;
  user_id: string;
  account_email: string;
  category: string;
  message: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

export type SupportRequestUpdate = {
  id?: string;
  user_id?: string;
  account_email?: string;
  category?: string;
  message?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

/* =========================================================
   OFFICIAL NOTICE IMPORT QUEUE
   ========================================================= */

export type OfficialNoticeImport = {
  id: string;
  source_name: string;
  source_url: string;
  notice_title: string;
  notice_date: string | null;
  raw_summary: string | null;
  suggested_destination: string | null;
  suggested_category: string | null;
  review_status: string;
  discovered_at: string;
  reviewed_at: string | null;
  imported_at: string | null;
  content_hash: string | null;
};

export type OfficialNoticeImportInsert = {
  id?: string;
  source_name: string;
  source_url: string;
  notice_title: string;
  notice_date?: string | null;
  raw_summary?: string | null;
  suggested_destination?: string | null;
  suggested_category?: string | null;
  review_status?: string;
  discovered_at?: string;
  reviewed_at?: string | null;
  imported_at?: string | null;
  content_hash?: string | null;
};

export type OfficialNoticeImportUpdate = {
  id?: string;
  source_name?: string;
  source_url?: string;
  notice_title?: string;
  notice_date?: string | null;
  raw_summary?: string | null;
  suggested_destination?: string | null;
  suggested_category?: string | null;
  review_status?: string;
  discovered_at?: string;
  reviewed_at?: string | null;
  imported_at?: string | null;
  content_hash?: string | null;
};

/* =========================================================
   OFFICIAL NOTICE SYNC RUNS
   ========================================================= */

export type OfficialNoticeSyncRun = {
  id: string;
  started_at: string;
  finished_at: string | null;
  run_status: string;
  notices_checked: number;
  notices_added: number;
  error_message: string | null;
};

export type OfficialNoticeSyncRunInsert = {
  id?: string;
  started_at?: string;
  finished_at?: string | null;
  run_status?: string;
  notices_checked?: number;
  notices_added?: number;
  error_message?: string | null;
};

export type OfficialNoticeSyncRunUpdate = {
  id?: string;
  started_at?: string;
  finished_at?: string | null;
  run_status?: string;
  notices_checked?: number;
  notices_added?: number;
  error_message?: string | null;
};

/* =========================================================
   OFFICIAL CONTENT SOURCES
   ========================================================= */

export type OfficialContentSource = {
  id: string;
  source_name: string;
  source_url: string;
  source_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type OfficialContentSourceInsert = {
  id?: string;
  source_name: string;
  source_url: string;
  source_type: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type OfficialContentSourceUpdate = {
  id?: string;
  source_name?: string;
  source_url?: string;
  source_type?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

/* =========================================================
   OFFICIAL CONTENT SNAPSHOTS
   ========================================================= */

export type OfficialContentSnapshot = {
  id: string;
  source_id: string;
  content_hash: string;
  checked_at: string;
};

export type OfficialContentSnapshotInsert = {
  id?: string;
  source_id: string;
  content_hash: string;
  checked_at?: string;
};

export type OfficialContentSnapshotUpdate = {
  id?: string;
  source_id?: string;
  content_hash?: string;
  checked_at?: string;
};

/* =========================================================
   USER REMINDERS
   ========================================================= */

export type UserReminder = {
  id: string;
  user_id: string;
  target_type: "event" | "fan_project";
  event_id: string | null;
  fan_project_id: string | null;
  reminder_option:
    | "same_day"
    | "1_day_before"
    | "3_days_before"
    | "7_days_before";
  remind_on: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type UserReminderInsert = {
  id?: string;
  user_id: string;
  target_type: "event" | "fan_project";
  event_id?: string | null;
  fan_project_id?: string | null;
  reminder_option:
    | "same_day"
    | "1_day_before"
    | "3_days_before"
    | "7_days_before";
  remind_on?: string;
  is_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type UserReminderUpdate = {
  id?: string;
  user_id?: string;
  target_type?: "event" | "fan_project";
  event_id?: string | null;
  fan_project_id?: string | null;
  reminder_option?:
    | "same_day"
    | "1_day_before"
    | "3_days_before"
    | "7_days_before";
  remind_on?: string;
  is_enabled?: boolean;
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

      support_requests: {
        Row: SupportRequest;
        Insert: SupportRequestInsert;
        Update: SupportRequestUpdate;
        Relationships: [];
      };

      official_notice_imports: {
        Row: OfficialNoticeImport;
        Insert: OfficialNoticeImportInsert;
        Update: OfficialNoticeImportUpdate;
        Relationships: [];
      };

      official_notice_sync_runs: {
        Row: OfficialNoticeSyncRun;
        Insert: OfficialNoticeSyncRunInsert;
        Update: OfficialNoticeSyncRunUpdate;
        Relationships: [];
      };

      official_content_sources: {
        Row: OfficialContentSource;
        Insert: OfficialContentSourceInsert;
        Update: OfficialContentSourceUpdate;
        Relationships: [];
      };

      official_content_snapshots: {
        Row: OfficialContentSnapshot;
        Insert: OfficialContentSnapshotInsert;
        Update: OfficialContentSnapshotUpdate;
        Relationships: [];
      };
    };

    Views: Record<string, never>;

    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };

      can_run_official_source_sync: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };

      publish_official_notice: {
        Args: {
          notice_id: string;
          destination: string;
          public_title: string;
          public_category: string;
          public_date: string;
          public_description: string;
          public_location: string;
          public_link: string;
          public_is_global?: boolean;
        };
        Returns: Json;
      };
    };

    Enums: Record<string, never>;

    CompositeTypes: Record<string, never>;
  };
};

