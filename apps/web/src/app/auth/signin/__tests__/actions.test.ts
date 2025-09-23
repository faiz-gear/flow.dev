import { signIn } from '../actions';
import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';

// Mock Supabase client
jest.mock('@/app/utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

// Mock Next.js redirect
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

const mockSupabase = {
  auth: {
    signInWithPassword: jest.fn(),
  },
};

describe('signIn action', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  it('validates email format on server side', async () => {
    const formData = new FormData();
    formData.append('email', 'invalid-email');
    formData.append('password', 'password123');

    const result = await signIn(formData);

    expect(result).toEqual({ error: 'Please enter a valid email address' });
    expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it('validates password is not empty', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', '');

    const result = await signIn(formData);

    expect(result).toEqual({ error: 'Password is required' });
    expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it('calls Supabase signInWithPassword with correct credentials', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'password123');

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'user-id' } },
      error: null,
    });

    await signIn(formData);

    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('redirects to dashboard on successful sign-in', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'password123');

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'user-id' } },
      error: null,
    });

    await signIn(formData);

    expect(redirect).toHaveBeenCalledWith('/dashboard');
  });

  it('returns generic error for invalid credentials', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'wrongpassword');

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Invalid login credentials' },
    });

    const result = await signIn(formData);

    expect(result).toEqual({ error: 'Invalid email or password' });
    expect(redirect).not.toHaveBeenCalled();
  });

  it('returns rate limit error for too many attempts', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'password123');

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Too many requests' },
    });

    const result = await signIn(formData);

    expect(result).toEqual({ error: 'Too many sign-in attempts. Please try again later.' });
    expect(redirect).not.toHaveBeenCalled();
  });

  it('returns generic error for unexpected errors', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'password123');

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Unexpected error occurred' },
    });

    const result = await signIn(formData);

    expect(result).toEqual({ error: 'An error occurred during sign in. Please try again.' });
    expect(redirect).not.toHaveBeenCalled();
  });

  it('handles email confirmation errors with generic message', async () => {
    const formData = new FormData();
    formData.append('email', 'test@example.com');
    formData.append('password', 'password123');

    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Email not confirmed' },
    });

    const result = await signIn(formData);

    expect(result).toEqual({ error: 'Invalid email or password' });
    expect(redirect).not.toHaveBeenCalled();
  });
});