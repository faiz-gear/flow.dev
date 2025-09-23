import { describe, it, expect } from '@jest/globals';

// Validation functions copied from the signup page
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string) => {
  return password.length >= 6;
};

describe('Email Validation', () => {
  it('should accept valid email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('test.user@example.co.uk')).toBe(true);
    expect(validateEmail('user+tag@example.org')).toBe(true);
    expect(validateEmail('user_name@example-domain.com')).toBe(true);
  });

  it('should reject invalid email addresses', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('user')).toBe(false);
    expect(validateEmail('user@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('user@example')).toBe(false);
    expect(validateEmail('user @example.com')).toBe(false);
    expect(validateEmail('user@example .com')).toBe(false);
  });
});

describe('Password Validation', () => {
  it('should accept passwords with 6 or more characters', () => {
    expect(validatePassword('123456')).toBe(true);
    expect(validatePassword('password')).toBe(true);
    expect(validatePassword('verylongpassword123')).toBe(true);
    expect(validatePassword('P@ssw0rd!')).toBe(true);
  });

  it('should reject passwords with less than 6 characters', () => {
    expect(validatePassword('')).toBe(false);
    expect(validatePassword('12345')).toBe(false);
    expect(validatePassword('pass')).toBe(false);
    expect(validatePassword('a')).toBe(false);
  });
});

describe('Error Message Mapping', () => {
  const mapErrorMessage = (error: string): string => {
    if (error.includes('User already registered')) {
      return 'An account with this email already exists';
    }
    if (error.includes('Invalid email')) {
      return 'Please enter a valid email address';
    }
    if (error.includes('Password')) {
      return 'Password does not meet requirements';
    }
    return 'An error occurred during sign up. Please try again.';
  };

  it('should map Supabase errors to user-friendly messages', () => {
    expect(mapErrorMessage('User already registered')).toBe('An account with this email already exists');
    expect(mapErrorMessage('Invalid email format')).toBe('Please enter a valid email address');
    expect(mapErrorMessage('Password too short')).toBe('Password does not meet requirements');
    expect(mapErrorMessage('Unknown error')).toBe('An error occurred during sign up. Please try again.');
  });
});