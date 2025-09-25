/**
 * Integration tests for GitHub OAuth flow using Playwright
 * Tests complete OAuth flow including success and error scenarios
 */

import { test, expect } from '@playwright/test';

// Mock GitHub OAuth responses for testing
const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';

test.describe('GitHub OAuth Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Mock GitHub OAuth responses
    await page.route(GITHUB_TOKEN_URL, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'gho_test_token_123456789',
          token_type: 'bearer',
          scope: 'repo:status,public_repo'
        })
      });
    });

    // Mock GitHub API user validation
    await page.route('https://api.github.com/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 12345,
          login: 'testuser',
          name: 'Test User',
          email: 'test@example.com',
          avatar_url: 'https://github.com/images/error/octocat_happy.gif'
        })
      });
    });
  });

  test('should complete successful OAuth flow', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');

    // Should show not connected state initially
    await expect(page.getByText('Not connected')).toBeVisible();
    await expect(page.getByRole('button', { name: /connect github/i })).toBeVisible();

    // Click Connect GitHub button
    const connectButton = page.getByRole('button', { name: /connect github/i });

    // Set up route interception for GitHub OAuth redirect
    await page.route(`${GITHUB_AUTH_URL}*`, async (route) => {
      const url = new URL(route.request().url());
      const state = url.searchParams.get('state');
      const redirectUri = url.searchParams.get('redirect_uri');

      // Verify OAuth parameters
      expect(url.searchParams.get('client_id')).toBeTruthy();
      expect(url.searchParams.get('scope')).toBe('repo:status,public_repo');
      expect(state).toBeTruthy();
      expect(redirectUri).toContain('/api/auth/github/callback');

      // Simulate GitHub OAuth approval by redirecting to callback
      await route.fulfill({
        status: 302,
        headers: {
          'Location': `${redirectUri}?code=test_auth_code&state=${state}`
        }
      });
    });

    await connectButton.click();

    // Should show success message and connected state
    await expect(page.getByText('GitHub connected successfully')).toBeVisible();
    await expect(page.getByText('Connected')).toBeVisible();
    await expect(page.getByRole('button', { name: /disconnect github/i })).toBeVisible();
  });

  test('should handle OAuth cancellation', async ({ page }) => {
    await page.goto('/dashboard');

    const connectButton = page.getByRole('button', { name: /connect github/i });

    // Set up route interception for OAuth cancellation
    await page.route(`${GITHUB_AUTH_URL}*`, async (route) => {
      const url = new URL(route.request().url());
      const redirectUri = url.searchParams.get('redirect_uri');

      // Simulate user cancelling OAuth
      await route.fulfill({
        status: 302,
        headers: {
          'Location': `${redirectUri}?error=access_denied&error_description=The+user+denied+the+request`
        }
      });
    });

    await connectButton.click();

    // Should show error message and remain disconnected
    await expect(page.getByText('GitHub connection was cancelled')).toBeVisible();
    await expect(page.getByText('Not connected')).toBeVisible();
  });

  test('should handle OAuth errors', async ({ page }) => {
    await page.goto('/dashboard');

    const connectButton = page.getByRole('button', { name: /connect github/i });

    // Set up route interception for OAuth error
    await page.route(`${GITHUB_AUTH_URL}*`, async (route) => {
      const url = new URL(route.request().url());
      const redirectUri = url.searchParams.get('redirect_uri');

      // Simulate OAuth error
      await route.fulfill({
        status: 302,
        headers: {
          'Location': `${redirectUri}?error=invalid_request&error_description=Invalid+request+parameters`
        }
      });
    });

    await connectButton.click();

    // Should show error message
    await expect(page.getByText('Invalid request parameters')).toBeVisible();
    await expect(page.getByText('Not connected')).toBeVisible();
  });

  test('should handle token exchange failures', async ({ page }) => {
    // Override token exchange to return error
    await page.route(GITHUB_TOKEN_URL, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'invalid_grant',
          error_description: 'The code passed is incorrect or expired.'
        })
      });
    });

    await page.goto('/dashboard');

    const connectButton = page.getByRole('button', { name: /connect github/i });

    await page.route(`${GITHUB_AUTH_URL}*`, async (route) => {
      const url = new URL(route.request().url());
      const state = url.searchParams.get('state');
      const redirectUri = url.searchParams.get('redirect_uri');

      await route.fulfill({
        status: 302,
        headers: {
          'Location': `${redirectUri}?code=invalid_code&state=${state}`
        }
      });
    });

    await connectButton.click();

    // Should show token exchange error
    await expect(page.getByText(/The code passed is incorrect or expired/)).toBeVisible();
    await expect(page.getByText('Not connected')).toBeVisible();
  });

  test('should handle disconnect functionality', async ({ page }) => {
    // First, simulate being in connected state
    await page.goto('/dashboard?success=GitHub+connected+successfully');

    // Should show connected state
    await expect(page.getByText('Connected')).toBeVisible();
    await expect(page.getByRole('button', { name: /disconnect github/i })).toBeVisible();

    // Mock the disconnect API
    await page.route('/api/auth/github/disconnect', async (route) => {
      expect(route.request().method()).toBe('POST');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true })
      });
    });

    // Click disconnect button
    const disconnectButton = page.getByRole('button', { name: /disconnect github/i });
    await disconnectButton.click();

    // Page should reload and show disconnected state
    await expect(page.getByText('Not connected')).toBeVisible();
    await expect(page.getByRole('button', { name: /connect github/i })).toBeVisible();
  });

  test('should handle disconnect API failures', async ({ page }) => {
    await page.goto('/dashboard?success=GitHub+connected+successfully');

    // Mock disconnect API failure
    await page.route('/api/auth/github/disconnect', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    const disconnectButton = page.getByRole('button', { name: /disconnect github/i });
    await disconnectButton.click();

    // Should show error message and remain connected
    await expect(page.getByText('Failed to disconnect GitHub. Please try again.')).toBeVisible();
    await expect(page.getByText('Connected')).toBeVisible();
  });

  test('should validate OAuth state parameter for CSRF protection', async ({ page }) => {
    await page.goto('/dashboard');

    const connectButton = page.getByRole('button', { name: /connect github/i });

    // Set up route interception to return invalid state
    await page.route(`${GITHUB_AUTH_URL}*`, async (route) => {
      const url = new URL(route.request().url());
      const redirectUri = url.searchParams.get('redirect_uri');

      // Return with different state parameter (CSRF attack simulation)
      await route.fulfill({
        status: 302,
        headers: {
          'Location': `${redirectUri}?code=test_auth_code&state=malicious_state_parameter`
        }
      });
    });

    await connectButton.click();

    // Should show state validation error
    await expect(page.getByText('Invalid OAuth state parameter')).toBeVisible();
    await expect(page.getByText('Not connected')).toBeVisible();
  });

  test('should handle network errors during OAuth', async ({ page }) => {
    // Mock network failure for token exchange
    await page.route(GITHUB_TOKEN_URL, async (route) => {
      await route.abort('failed');
    });

    await page.goto('/dashboard');

    const connectButton = page.getByRole('button', { name: /connect github/i });

    await page.route(`${GITHUB_AUTH_URL}*`, async (route) => {
      const url = new URL(route.request().url());
      const state = url.searchParams.get('state');
      const redirectUri = url.searchParams.get('redirect_uri');

      await route.fulfill({
        status: 302,
        headers: {
          'Location': `${redirectUri}?code=test_auth_code&state=${state}`
        }
      });
    });

    await connectButton.click();

    // Should show network error message
    await expect(page.getByText(/Network error/)).toBeVisible();
    await expect(page.getByText('Not connected')).toBeVisible();
  });

  test('should maintain user session during OAuth flow', async ({ page }) => {
    // Navigate to dashboard (should be authenticated)
    await page.goto('/dashboard');

    // Should show user email indicating authenticated session
    await expect(page.getByText(/Logged in as:/)).toBeVisible();

    // Complete OAuth flow
    const connectButton = page.getByRole('button', { name: /connect github/i });

    await page.route(`${GITHUB_AUTH_URL}*`, async (route) => {
      const url = new URL(route.request().url());
      const state = url.searchParams.get('state');
      const redirectUri = url.searchParams.get('redirect_uri');

      await route.fulfill({
        status: 302,
        headers: {
          'Location': `${redirectUri}?code=test_auth_code&state=${state}`
        }
      });
    });

    await connectButton.click();

    // After OAuth, should still show user session
    await expect(page.getByText(/Logged in as:/)).toBeVisible();
    await expect(page.getByText('Connected')).toBeVisible();
  });

  test('should show appropriate loading states', async ({ page }) => {
    await page.goto('/dashboard');

    const connectButton = page.getByRole('button', { name: /connect github/i });

    // Delay the OAuth response to test loading state
    await page.route(`${GITHUB_AUTH_URL}*`, async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const url = new URL(route.request().url());
      const state = url.searchParams.get('state');
      const redirectUri = url.searchParams.get('redirect_uri');

      await route.fulfill({
        status: 302,
        headers: {
          'Location': `${redirectUri}?code=test_auth_code&state=${state}`
        }
      });
    });

    // Click and check for loading state
    await connectButton.click();

    // Should show loading state during OAuth flow
    // Note: This might require checking button disabled state or spinner
    await expect(connectButton).toHaveAttribute('data-loading', 'true');
  });
});