import { z } from 'zod';

const urlOrEmpty = z
  .string()
  .trim()
  .refine(
    (val) => !val || /^https?:\/\/[^\s$.?#].[^\s]*$/i.test(val),
    'Must be a valid web URL (e.g. https://...)'
  )
  .optional()
  .or(z.literal(''));

export const PostFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters long')
    .max(200, 'Slug cannot exceed 200 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .trim(),
  excerpt: z
    .string()
    .min(10, 'Excerpt must be at least 10 characters long')
    .max(500, 'Excerpt cannot exceed 500 characters')
    .trim(),
  content: z
    .string()
    .min(20, 'Post content must be at least 20 characters long')
    .trim(),
  cover_image_url: urlOrEmpty,
  category_id: z
    .string()
    .optional()
    .or(z.literal('')),
  author_id: z
    .string()
    .optional()
    .or(z.literal('')),
  reading_time: z.number().int().min(1).default(1),
  source_name: z.string().max(200).optional().or(z.literal('')),
  source_url: urlOrEmpty,
  scheduled_for: z.string().optional().or(z.literal('')),
  tags: z
    .array(z.string().trim().min(1).max(30))
    .max(10, 'Cannot exceed 10 tags')
    .default([]),
  published: z.boolean().default(false),
  seo_title: z
    .string()
    .max(70, 'SEO title should not exceed 70 characters')
    .optional()
    .or(z.literal('')),
  seo_description: z
    .string()
    .max(160, 'SEO description should not exceed 160 characters')
    .optional()
    .or(z.literal('')),
});

export const AuthorFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .trim(),
  avatar_url: urlOrEmpty,
  bio: z.string().max(1000).optional().or(z.literal('')),
  twitter: urlOrEmpty,
  github: urlOrEmpty,
  linkedin: urlOrEmpty,
  website: urlOrEmpty,
  youtube: urlOrEmpty,
});

export const CategoryFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80).trim(),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .trim(),
  description: z.string().max(500).optional().or(z.literal('')),
});

export const PageContentFormSchema = z.object({
  page_key: z
    .string()
    .min(2, 'Page key must be at least 2 characters')
    .max(50, 'Page key cannot exceed 50 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Page key must be lowercase letters, numbers, and hyphens only')
    .trim(),
  title: z.string().min(2, 'Title must be at least 2 characters').max(150).trim(),
  banner_text: z.string().max(500).optional().or(z.literal('')),
  body_content: z.string().optional().or(z.literal('')),
  seo_title: z.string().max(70, 'SEO title should not exceed 70 characters').optional().or(z.literal('')),
  seo_description: z.string().max(160, 'SEO description should not exceed 160 characters').optional().or(z.literal('')),
});

export const SiteSettingsFormSchema = z.object({
  site_title: z.string().min(2).max(100).trim(),
  site_description: z.string().min(10).max(500).trim(),
  twitter: urlOrEmpty,
  github: urlOrEmpty,
  linkedin: urlOrEmpty,
  youtube: urlOrEmpty,
});

export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name is too long')
    .trim(),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(120, 'Email is too long')
    .trim(),
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters')
    .max(150, 'Subject is too long')
    .trim(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(3000, 'Message cannot exceed 3000 characters')
    .trim(),
  honeypot: z.string().max(0, 'Spam detected').optional().or(z.literal('')),
});

export const LoginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address').trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const NewsletterSchema = z.object({
  email: z.string().email('Please provide a valid email address').trim(),
});

export const CommentFormSchema = z.object({
  post_id: z.string().min(1, 'Post ID is required'),
  author_name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name cannot exceed 60 characters')
    .trim(),
  author_email: z
    .string()
    .email('Please enter a valid email address')
    .max(120, 'Email is too long')
    .optional()
    .or(z.literal('')),
  content: z
    .string()
    .min(3, 'Comment must be at least 3 characters')
    .max(1500, 'Comment cannot exceed 1500 characters')
    .trim(),
  parent_id: z.string().optional().or(z.literal('')),
  honeypot: z.string().max(0, 'Spam detected').optional().or(z.literal('')),
});

export const ModerateCommentSchema = z.object({
  id: z.string().min(1, 'Comment ID is required'),
  status: z.enum(['approved', 'pending', 'rejected', 'spam']),
});

/**
 * Strips raw HTML tags and unsafe control characters from user text inputs
 */
export function sanitizeUserInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '') // strip < and > to prevent HTML injection
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '') // strip control chars
    .trim();
}
