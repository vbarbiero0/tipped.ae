-- 0006: ear_tipped must default to FALSE.
--
-- 0004 created the column with `default true` (correct for the cat backfill,
-- wrong as a standing default). The dashboard form always sends an explicit
-- value, so app-created rows are fine — but any row inserted without the
-- field (imports, scripts, future API paths) would silently claim a tipped
-- ear. That's a TNR mark: a factual claim about the animal. Default off.
--
-- NOT YET APPLIED — the management-API token was revoked (good) before this
-- was written. Paste into the Supabase SQL editor, or hand the session a
-- fresh token.

alter table animals alter column ear_tipped set default false;
