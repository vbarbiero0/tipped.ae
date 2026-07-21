-- 0010: rescuer identity — phone + vet collaborations + multi-platform socials.
--
-- Vanessa: applications need a phone number and the vet clinic(s) the rescuer
-- usually works with ("this is to confirm their identity" — the vet can vouch
-- for them), and socials should cover Instagram/Facebook/TikTok/other, not
-- just Instagram. `instagram` folds into a `socials jsonb` array of
-- {platform, handle} and is dropped; existing handles are backfilled.

-- rescuers ------------------------------------------------------------------
alter table rescuers add column phone text;
alter table rescuers add column socials jsonb not null default '[]'::jsonb;

update rescuers
  set socials = jsonb_build_array(jsonb_build_object('platform', 'instagram', 'handle', instagram))
  where instagram is not null and instagram <> '';

alter table rescuers drop column instagram;

-- Phone is identity data, not directory data: never expose it to the public
-- REST surface. (Authenticated rescuers can still read it — a small, vetted
-- pool; tighten to admin-only if the pool ever widens.)
revoke select (phone) on rescuers from anon;

-- applications --------------------------------------------------------------
alter table rescuer_applications add column phone text;
alter table rescuer_applications add column vets text;
alter table rescuer_applications add column socials jsonb not null default '[]'::jsonb;

update rescuer_applications
  set socials = jsonb_build_array(jsonb_build_object('platform', 'instagram', 'handle', instagram))
  where instagram is not null and instagram <> '';

alter table rescuer_applications drop column instagram;
