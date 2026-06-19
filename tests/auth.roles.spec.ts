import { test, expect } from '@playwright/test';

test.describe('Auth finish role redirects', () => {
  test('organizer is redirected to organizer dashboard', async ({ page }) => {
    const fakeSession = {
      access_token: 'test-token',
      refresh_token: 'refresh',
      user: { id: 'org-user-id', email: 'admin@beacont.ai' },
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    };
    await page.evaluate((s) => {
      localStorage.setItem('TEST_SUPABASE_SESSION', JSON.stringify(s));
      localStorage.setItem('TEST_USER_ROLE', 'organizer');
    }, fakeSession);

    await page.goto('/auth/finish');
    await page.waitForURL('**/organizer/dashboard', { timeout: 5000 });
    expect(page.url()).toContain('/organizer/dashboard');
  });

  test('participant is redirected to home', async ({ page }) => {
    const fakeSession = {
      access_token: 'test-token',
      refresh_token: 'refresh',
      user: { id: 'part-user-id', email: 'student@example.edu' },
      expires_at: Math.floor(Date.now() / 1000) + 3600,
    };
    await page.evaluate((s) => {
      localStorage.setItem('TEST_SUPABASE_SESSION', JSON.stringify(s));
      localStorage.setItem('TEST_USER_ROLE', 'participant');
    }, fakeSession);

    await page.goto('/auth/finish');
    await page.waitForURL('**/', { timeout: 5000 });
    expect(new URL(page.url()).pathname).toBe('/');
  });
});
