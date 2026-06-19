import { describe, it, expect, vi } from 'vitest';
import { fetchRole } from '@/lib/auth-utils';

vi.mock('@/integrations/supabase/client', async () => {
  return {
    supabase: {
      from: () => ({
        select: () => ({
          eq: () => ({
            order: async () => ({ data: [{ role: 'participant' }] }),
          }),
        }),
      }),
    },
  };
});

describe('fetchRole', () => {
  it('returns participant when role row exists', async () => {
    const r = await fetchRole('any-id');
    expect(r).toBe('participant');
  });
});
