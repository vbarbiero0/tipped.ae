-- Logged-in rescuers need to find their own row by auth_user_id (the
-- dashboard's "who am I" query). Column stays hidden from anon; authenticated
-- users may read it — rescuer accounts are hand-vetted and uuids aren't
-- secrets.
grant select (auth_user_id) on rescuers to authenticated;
