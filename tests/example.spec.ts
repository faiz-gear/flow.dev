import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect the page to have flow.dev in the title
  await expect(page).toHaveTitle(/flow.dev/);
});

test('displays landing page content', async ({ page }) => {
  await page.goto('/');

  // Check for the main heading
  await expect(page.locator('h1')).toContainText('flow.dev');

  // Check for the tagline
  await expect(page.locator('text=Professional engineering tools for developers')).toBeVisible();

  // Check for the buttons
  await expect(page.locator('button:has-text("Get Started")')).toBeVisible();
  await expect(page.locator('button:has-text("Learn More")')).toBeVisible();
});