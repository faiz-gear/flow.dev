'use server';

import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Server-side validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: 'Please enter a valid email address' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters' };
  }

  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) {
    // Map Supabase error codes to user-friendly messages
    if (error.message.includes('User already registered')) {
      return { error: 'An account with this email already exists' };
    }
    if (error.message.includes('Invalid email')) {
      return { error: 'Please enter a valid email address' };
    }
    if (error.message.includes('Password')) {
      return { error: 'Password does not meet requirements' };
    }

    // Generic error message for unexpected errors
    return { error: 'An error occurred during sign up. Please try again.' };
  }

  // Check if email confirmation is required
  if (data.user && !data.user.confirmed_at) {
    // For now, we'll still redirect to dashboard but in production
    // you might want to redirect to an email confirmation page
    redirect('/dashboard');
  }

  redirect('/dashboard');
}