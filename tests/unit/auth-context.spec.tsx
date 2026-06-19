import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/lib/auth-context';

vi.mock('@/integrations/supabase/client', async () => {
  return {
    supabase: {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
    },
  };
});

describe('AuthProvider', () => {
  it('provides default values without session', async () => {
    const wrapper = ({ children }: any) => <AuthProvider>{children}</AuthProvider>;
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), { wrapper });
    // initial values
    expect(result.current.loading).toBe(true);
    // Wait for effect to complete
    await new Promise((r) => setTimeout(r, 10));
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
