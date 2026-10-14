'use server';

import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { LoginFormSchema } from '@/lib/security/validation';
import { checkRateLimit } from '@/lib/security/rateLimit';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface AuthState {
  error?: string;
  success?: boolean;
}

export async function loginAdmin(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const redirectTo = (formData.get('redirectTo') as string) || '/admin';

  // 1. Rate limiting by email
  const rateLimit = checkRateLimit(`login:${email || 'unknown'}`, 5, 60 * 1000);
  if (!rateLimit.success) {
    return {
      error: 'Too many login attempts. Please wait 1 minute before trying again.',
    };
  }

  // 2. Validate inputs with Zod
  const validation = LoginFormSchema.safeParse({ email, password });
  if (!validation.success) {
    return {
      error: validation.error.issues[0].message,
    };
  }

  // 3. Supabase Auth Check
  if (!isSupabaseConfigured()) {
    // Helpful feedback in dev mode when Supabase is not yet configured
    if (email === 'admin@example.com' && password === 'password123') {
      // Allow demo admin preview in local dev
      redirect(redirectTo);
    }
    return {
      error: 'Supabase credentials are not yet configured in .env.local. Please check README.md for setup instructions.',
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: validation.data.email,
      password: validation.data.password,
    });

    if (error) {
      return {
        error: error.message || 'Invalid email or password.',
      };
    }

    revalidatePath('/admin');
  } catch (err: any) {
    return {
      error: err.message || 'An unexpected error occurred during login.',
    };
  }

  redirect(redirectTo);
}

export async function logoutAdmin() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  }
  revalidatePath('/', 'layout');
  redirect('/admin/login');
}
