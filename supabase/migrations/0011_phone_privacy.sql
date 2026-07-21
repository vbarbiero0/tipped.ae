-- 0011: actually hide rescuers.phone from the public REST surface.
--
-- 0010's `revoke select (phone) ... from anon` was a no-op: anon held a
-- TABLE-level SELECT grant, and Postgres privileges are additive — a column
-- revoke can't subtract from a table grant. The fix is the inverse shape:
-- drop the table grant and re-grant an explicit column list (everything
-- except phone and auth_user_id).

revoke select on rescuers from anon;
grant select (
  id, username, avatar_url, name, emirate, blurb, email,
  pets_saved, clinics, wishlist_links, is_placeholder,
  created_at, trust_level, active, role, socials
) on rescuers to anon;
