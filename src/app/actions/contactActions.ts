'use server';

import { ContactFormSchema, NewsletterSchema } from '@/lib/security/validation';
import { checkRateLimit } from '@/lib/security/rateLimit';

export interface FormResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

export async function submitContactForm(prevState: FormResponse | null, formData: FormData): Promise<FormResponse> {
  const name = (formData.get('name') as string) || '';
  const email = (formData.get('email') as string) || '';
  const subject = (formData.get('subject') as string) || '';
  const message = (formData.get('message') as string) || '';
  const honeypot = (formData.get('honeypot') as string) || '';

  // 1. Anti-spam honeypot check
  if (honeypot.length > 0) {
    return { error: 'Spam submission detected.' };
  }

  // 2. Rate limiting by IP/Email (limit to 3 submissions per 10 minutes)
  const rateLimit = checkRateLimit(`contact:${email || 'anonymous'}`, 3, 10 * 60 * 1000);
  if (!rateLimit.success) {
    return {
      error: 'You have submitted multiple inquiries recently. Please wait a few minutes before sending another message.',
    };
  }

  // 3. Validate with Zod
  const validation = ContactFormSchema.safeParse({
    name,
    email,
    subject,
    message,
    honeypot,
  });

  if (!validation.success) {
    return {
      error: validation.error.issues[0].message,
    };
  }

  // Here you can send email via Resend / SendGrid or store inquiry in Supabase
  console.log(`[Contact Form Received] From: ${validation.data.name} (${validation.data.email}) - Subject: ${validation.data.subject}`);

  return {
    success: true,
    message: 'Thank you for reaching out! Our AI editorial team will respond to your inquiry within 24 hours.',
  };
}

export async function subscribeNewsletter(prevState: FormResponse | null, formData: FormData): Promise<FormResponse> {
  const email = (formData.get('email') as string) || '';

  // 1. Rate limiting
  const rateLimit = checkRateLimit(`newsletter:${email}`, 3, 5 * 60 * 1000);
  if (!rateLimit.success) {
    return {
      error: 'Please wait a moment before trying again.',
    };
  }

  // 2. Validation
  const validation = NewsletterSchema.safeParse({ email });
  if (!validation.success) {
    return {
      error: validation.error.issues[0].message,
    };
  }

  console.log(`[Newsletter Subscription] ${validation.data.email}`);

  return {
    success: true,
    message: 'Welcome to the 2026 AI Frontier! You are now subscribed to our weekly research dispatch.',
  };
}
