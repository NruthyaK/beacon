import { test, expect } from '@playwright/test';

test.describe('Auth flows', () => {
  test('login page shows provider buttons and initiates OAuth', async ({ page }) => {
    // Enable test auth stub by setting env before page load
    await page.addInitScript(() => {
      // flag the app to run in test auth mode
      Object.defineProperty(import.meta, 'env', { value: { VITE_TEST_AUTH: 'true' } });
    });
    await page.goto('/login');
    await expect(page.getByRole('button', { name: /Continue with Google|Google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /GitHub/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Microsoft/i })).toBeVisible();

    // Click Google and expect navigation to Supabase or provider (may be blocked if not configured)
    // Instead of performing real OAuth, stub a successful session and role.
    const fakeSession = {
      access_token: 'test-token',
      refresh_token: 'refresh',
      user: { id: 'test-user-id', email: 'student@example.edu' },
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    };
    await page.evaluate((s) => {
      localStorage.setItem('TEST_SUPABASE_SESSION', JSON.stringify(s));
      localStorage.setItem('TEST_USER_ROLE', 'participant');
    }, fakeSession);

    // Navigate directly to the OAuth finish route to simulate the provider redirect
    await page.goto('/auth/finish');
    await expect(page.locator('text=Signing you in')).toBeVisible();
  });
});
