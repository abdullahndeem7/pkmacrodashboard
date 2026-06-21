-- Allow an authenticated user to check their own admin status.
-- 0001_init.sql intentionally left admin_users with no public read policy
-- ("only readable via service role"), but the admin layout needs to verify
-- the logged-in user's own row using their authenticated session (not a
-- service-role bypass). This policy only ever exposes a row to the user it
-- belongs to — it does not let anyone enumerate other admins.
create policy "Users can check their own admin status"
  on admin_users for select
  using (auth.uid() = user_id);
