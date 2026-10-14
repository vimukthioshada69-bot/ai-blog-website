export interface Author {
  id: string;
  name: string;
  slug: string;
  avatar_url: string | null;
  bio: string | null;
  social_links?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
    youtube?: string;
  } | null;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon?: string | null;
  created_at?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category_id: string | null;
  author_id?: string | null;
  reading_time?: number;
  source_name?: string | null;
  source_url?: string | null;
  scheduled_for?: string | null;
  tags: string[];
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  seo_title: string | null;
  seo_description: string | null;
  view_count: number;
}

export interface PostWithCategory extends Post {
  category?: Category | null;
  author?: Author | null;
}

export interface SiteSettings {
  id: string;
  site_title: string;
  site_description: string;
  social_links: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    youtube?: string;
  };
  updated_at: string;
}

export interface PageContent {
  id: string;
  page_key: string;
  title: string | null;
  banner_text: string | null;
  body_content: string | null;
  seo_title: string | null;
  seo_description: string | null;
  updated_at: string;
}

export interface CreatePostInput {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url?: string | null;
  category_id?: string | null;
  author_id?: string | null;
  reading_time?: number;
  source_name?: string | null;
  source_url?: string | null;
  scheduled_for?: string | null;
  tags?: string[];
  published?: boolean;
  seo_title?: string | null;
  seo_description?: string | null;
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  id: string;
}

export type CommentStatus = 'approved' | 'pending' | 'rejected' | 'spam';

export interface Comment {
  id: string;
  post_id: string;
  parent_id?: string | null;
  author_name: string;
  author_email?: string | null;
  content: string;
  status: CommentStatus;
  is_pinned: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CommentWithPost extends Comment {
  post?: {
    id: string;
    title: string;
    slug: string;
    category?: {
      slug: string;
    } | null;
  } | null;
}

export interface CreateCommentInput {
  post_id: string;
  author_name: string;
  author_email?: string | null;
  content: string;
  parent_id?: string | null;
}


export type Database = {
  public: {
    Tables: {
      authors: {
        Row: Author;
        Insert: {
          id?: string;
          name: string;
          slug: string;
          avatar_url?: string | null;
          bio?: string | null;
          social_links?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          avatar_url?: string | null;
          bio?: string | null;
          social_links?: any;
          created_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: Category;
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      posts: {
        Row: Post;
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          cover_image_url?: string | null;
          category_id?: string | null;
          author_id?: string | null;
          reading_time?: number;
          source_name?: string | null;
          source_url?: string | null;
          scheduled_for?: string | null;
          tags?: string[];
          published?: boolean;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
          seo_title?: string | null;
          seo_description?: string | null;
          view_count?: number;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          cover_image_url?: string | null;
          category_id?: string | null;
          author_id?: string | null;
          reading_time?: number;
          source_name?: string | null;
          source_url?: string | null;
          scheduled_for?: string | null;
          tags?: string[];
          published?: boolean;
          published_at?: string;
          created_at?: string;
          updated_at?: string;
          seo_title?: string | null;
          seo_description?: string | null;
          view_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: "posts_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "authors";
            referencedColumns: ["id"];
          }
        ];
      };
      site_settings: {
        Row: SiteSettings;
        Insert: {
          id?: string;
          site_title?: string;
          site_description?: string;
          social_links?: any;
          updated_at?: string;
        };
        Update: {
          id?: string;
          site_title?: string;
          site_description?: string;
          social_links?: any;
          updated_at?: string;
        };
        Relationships: [];
      };
      comments: {
        Row: Comment;
        Insert: {
          id?: string;
          post_id: string;
          parent_id?: string | null;
          author_name: string;
          author_email?: string | null;
          content: string;
          status?: CommentStatus;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          parent_id?: string | null;
          author_name?: string;
          author_email?: string | null;
          content?: string;
          status?: CommentStatus;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          }
        ];
      };
      page_content: {
        Row: PageContent;
        Insert: {
          id?: string;
          page_key: string;
          title?: string | null;
          banner_text?: string | null;
          body_content?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          page_key?: string;
          title?: string | null;
          banner_text?: string | null;
          body_content?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_view_count: {
        Args: {
          post_slug: string;
        };
        Returns: void;
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
