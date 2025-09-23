import { test, expect } from '@playwright/test';

test.describe('Sign In Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to sign-in page
    await page.goto('/auth/signin');
  });

  test('displays sign-in form with all elements', async ({ page }) => {
    // Check page heading and description
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByText('Welcome back! Please sign in to your account')).toBeVisible();

    // Check form fields
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();

    // Check navigation links
    await expect(page.getByText('Don\'t have an account?')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign Up' })).toBeVisible();
  });

  test('validates email format', async ({ page }) => {
    // Enter invalid email
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByRole('textbox', { name: /password/i }).fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Check validation error
    await expect(page.getByText('Please enter a valid email address')).toBeVisible();
  });

  test('validates password is required', async ({ page }) => {
    // Enter valid email but empty password
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Check validation error
    await expect(page.getByText('Password is required')).toBeVisible();
  });

  test('submit button is disabled when form is invalid', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: 'Sign In' });

    // Button should be disabled initially
    await expect(submitButton).toBeDisabled();

    // Enter invalid email
    await page.getByLabel('Email').fill('invalid-email');
    await expect(submitButton).toBeDisabled();

    // Enter valid email but empty password
    await page.getByLabel('Email').fill('test@example.com');
    await expect(submitButton).toBeDisabled();
  });

  test('submit button is enabled when form is valid', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: 'Sign In' });

    // Enter valid credentials
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByRole('textbox', { name: /password/i }).fill('password123');

    // Button should be enabled
    await expect(submitButton).toBeEnabled();
  });

  test('toggles password visibility', async ({ page }) => {
    const passwordInput = page.getByRole('textbox', { name: /password/i });
    const toggleButton = page.getByRole('button', { name: 'toggle password visibility' });

    // Password should be hidden by default
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle button to show password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click toggle button to hide password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('displays error for invalid credentials', async ({ page }) => {
    // Mock the sign-in API to return an error
    await page.route('**/auth/signin', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: 'Invalid email or password',
      });
    });

    // Enter credentials and submit
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByRole('textbox', { name: /password/i }).fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Check error message is displayed
    await expect(page.getByText('Invalid email or password')).toBeVisible();
  });

  test('clears errors when user modifies input', async ({ page }) => {
    // First trigger an error
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByText('Please enter a valid email address')).toBeVisible();

    // Modify email input - error should clear
    await page.getByLabel('Email').fill('valid@example.com');
    await expect(page.getByText('Please enter a valid email address')).not.toBeVisible();
  });

  test('navigates to sign-up page', async ({ page }) => {
    // Click sign-up link
    await page.getByRole('link', { name: 'Sign Up' }).click();

    // Should navigate to sign-up page
    await expect(page).toHaveURL('/auth/signup');
    await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeVisible();
  });

  test('redirects authenticated users to dashboard', async ({ page }) => {
    // Mock authenticated state by setting a cookie
    await page.addInitScript(() => {
      // Simulate authenticated session
      localStorage.setItem('supabase.auth.token', JSON.stringify({
        access_token: 'mock-token',
        user: { id: 'user-id', email: 'test@example.com' }
      }));
    });

    // Navigate to sign-in page
    await page.goto('/auth/signin');

    // Should be redirected to dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('shows loading state during sign-in', async ({ page }) => {
    // Delay the response to see loading state
    await page.route('**/auth/signin', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: 'Success',
      });
    });

    // Enter credentials and submit
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByRole('textbox', { name: /password/i }).fill('password123');

    const submitButton = page.getByRole('button', { name: 'Sign In' });
    await submitButton.click();

    // Check loading state
    await expect(submitButton).toBeDisabled();
    // Note: HeroUI Button loading state might show a spinner or loading text
  });
});

test.describe('Sign In Navigation from Landing Page', () => {
  test('navigates to sign-in from landing page', async ({ page }) => {
    // Navigate to landing page
    await page.goto('/');

    // Click sign-in button
    await page.getByRole('link', { name: 'Sign In' }).click();

    // Should navigate to sign-in page
    await expect(page).toHaveURL('/auth/signin');
    await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
  });
});