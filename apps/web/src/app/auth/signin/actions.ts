'use server';

import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // Server-side validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: 'Please enter a valid email address' };
  }

  if (!password || password.length === 0) {
    return { error: 'Password is required' };
  }

  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Map Supabase error codes to user-friendly messages
    // Use generic messages to avoid user enumeration attacks
    if (error.message.includes('Invalid login credentials') ||
        error.message.includes('Email not confirmed') ||
        error.message.includes('Invalid email') ||
        error.message.includes('Wrong password')) {
      return { error: 'Invalid email or password' };
    }

    if (error.message.includes('Too many requests')) {
      return { error: 'Too many sign-in attempts. Please try again later.' };
    }

    if (error.message.includes('Email rate limit exceeded')) {
      return { error: 'Too many attempts. Please try again later.' };
    }

    // Generic error message for unexpected errors
    return { error: 'An error occurred during sign in. Please try again.' };
  }

  // Successful authentication - redirect to dashboard
  redirect('/dashboard');
}