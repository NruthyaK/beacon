
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
-- has_role is used inside RLS USING clauses; those run as the row owner/security context.
-- We can keep it callable by authenticated since it only checks the caller's own roles.
