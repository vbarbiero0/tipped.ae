-- Login email ≠ public contact email. The username lookup must return the
-- AUTH email (auth.users), not rescuers.email — Vanessa signs in with
-- vbarbiero0@gmail.com while Silvana's public contact stays silvana@tipped.ae.
create or replace function get_rescuer_email(p_username text)
returns text language sql security definer stable as $$
  select u.email
  from rescuers r
  join auth.users u on u.id = r.auth_user_id
  where r.username = lower(p_username);
$$;
