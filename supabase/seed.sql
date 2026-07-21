-- tipped — seed data. Mirrors lib/seed.ts so the live DB matches what the
-- site shipped with. Idempotent: safe to re-run (upserts by fixed uuid/ref).
-- Placeholder rescuers stay is_placeholder = true until each person consents.

insert into rescuers (id, username, name, emirate, blurb, email, instagram, cats_saved, clinics, is_placeholder, trust_level, role)
values
  ('00000000-0000-4000-8000-000000000001', 'straycatdubai', 'Silvana', 'Dubai',
   'Feeds the cafeteria block in Deira every night. Knows every cat by name and most by opinion.',
   'vbarbiero0@gmail.com', 'straycatdubai', 34, '[{"name":"Modern Vet, Umm Suqeim"}]', true, 'trusted', 'admin'),
  ('00000000-0000-4000-8000-000000000002', 'kevinofdxb', 'Kwagga', 'Dubai',
   'TNR runs around the Al Quoz warehouses. If a cat is under a truck, Kwagga has already met it.',
   'vbarbiero0@gmail.com', 'kevinofdxb', 21, '[{"name":"Modern Vet, Umm Suqeim"}]', true, 'review', 'rescuer'),
  ('00000000-0000-4000-8000-000000000003', 'fawaz', 'Fawaz', 'Dubai',
   'Runs Save Dubai Stray Cats out of Satwa. Specialises in the ones everyone else gave up on.',
   'vbarbiero0@gmail.com', null, 47, '[{"name":"Modern Vet, Umm Suqeim"}]', true, 'review', 'rescuer'),
  ('00000000-0000-4000-8000-000000000004', 'noor', 'Noor', 'Sharjah',
   'Works the desert edge where the dogs are. Runs feeding rounds at dawn before the heat, and knows every saluki mix between Sharjah and Mirdif.',
   'vbarbiero0@gmail.com', null, 18, '[{"name":"Modern Vet, Umm Suqeim"}]', true, 'review', 'rescuer')
on conflict (id) do update set
  username = excluded.username, name = excluded.name, emirate = excluded.emirate,
  trust_level = excluded.trust_level, role = excluded.role,
  blurb = excluded.blurb, email = excluded.email, instagram = excluded.instagram,
  cats_saved = excluded.cats_saved, clinics = excluded.clinics;

insert into animals (id, ref, rescuer_id, species, name, sex, age, emirate, story, medical_other,
                     microchipped, microchip_number, vet_certificate_url, ear_tipped,
                     tested, conditions, medical_checks, status, approval_status,
                     for_adoption, for_foster, photos)
values
  ('00000000-0000-4000-9000-000000000001', 'DUBAI-001', '00000000-0000-4000-8000-000000000001',
   'cat', 'Karak', 'Male', '~2 yrs', 'Dubai',
   'Lived behind a cafeteria in Deira. Knows his name and yells it back. Fine with kids, firm about breakfast.',
   'Clean bill of health. Microchip booked for his next clinic visit.',
   false, 'PENDING-DUBAI-001', 'pending/awaiting-upload', true,
   '{fiv_felv}', '{}', '{spayed_neutered,vaccinated,dewormed}', 'available', 'approved',
   true, false, '{}'),
  ('00000000-0000-4000-9000-000000000002', 'DUBAI-002', '00000000-0000-4000-8000-000000000002',
   'cat', 'Mango', 'Female', '~3 yrs', 'Dubai',
   'Raised three kittens under a parked truck. The kittens are homed. It''s her turn now, and she knows it.',
   'Slight notch in the left ear from street life — purely cosmetic.',
   true, 'PENDING-DUBAI-002', 'pending/awaiting-upload', true,
   '{fiv_felv}', '{}', '{spayed_neutered,vaccinated,dewormed}', 'in_foster', 'approved',
   true, false, '{/animals/hero-tortie.jpg}'),
  ('00000000-0000-4000-9000-000000000003', 'DUBAI-003', '00000000-0000-4000-8000-000000000003',
   'cat', 'Batata', 'Male', '~4 yrs', 'Dubai',
   'Bin-diver, reformed. Lost half a tail out there and none of the appetite. Wants a warm lap and a routine.',
   'Dental extraction underway at Modern Vet — recovering well.',
   true, 'PENDING-DUBAI-003', 'pending/awaiting-upload', true,
   '{fiv_felv}', '{}', '{spayed_neutered,vaccinated,dewormed}', 'available', 'approved',
   true, true, '{/animals/batata.jpg}'),
  ('00000000-0000-4000-9000-000000000004', 'AJMAN-001', '00000000-0000-4000-8000-000000000003',
   'cat', 'Loomi', 'Female', '~5 yrs', 'Ajman',
   'Ran the parking garage behind an Ajman bakery — staff paid rent in leftovers. FIV positive, entirely unbothered. Wants sunbeams and a slow morning.',
   'FIV positive — see below for what that actually means. Otherwise healthy, with the bloodwork to prove it.',
   true, 'PENDING-AJMAN-001', 'pending/awaiting-upload', true,
   '{}', '{fiv}', '{spayed_neutered,vaccinated,dewormed}', 'available', 'approved',
   true, true, '{}'),
  ('00000000-0000-4000-9000-000000000005', 'DUBAI-004', '00000000-0000-4000-8000-000000000004',
   'dog', 'Chapati', 'Male', '~1.5 yrs', 'Dubai',
   'Desert-born saluki mix. Runs like a rumour, sleeps like a rock. Learned ''sit'' in one evening and hasn''t stopped showing it off.',
   'Nothing to report. The vet called him boring, approvingly.',
   true, 'PENDING-DUBAI-004', 'pending/awaiting-upload', false,
   '{heartworm}', '{}', '{spayed_neutered,vaccinated,dewormed}', 'available', 'approved',
   true, false, '{}'),
  ('00000000-0000-4000-9000-000000000006', 'SHARJAH-001', '00000000-0000-4000-8000-000000000004',
   'dog', 'Simsim', 'Female', '~3 yrs', 'Sharjah',
   'Kept a whole construction crew company through two summers. The site closed; she didn''t get the memo. Gentle with everyone, patient beyond reason.',
   'A healed fracture in one hind leg — she doesn''t mention it.',
   true, 'PENDING-SHARJAH-001', 'pending/awaiting-upload', false,
   '{heartworm}', '{}', '{spayed_neutered,vaccinated,dewormed}', 'available', 'approved',
   false, true, '{}')
on conflict (id) do update set
  species = excluded.species, name = excluded.name, sex = excluded.sex,
  age = excluded.age, emirate = excluded.emirate, story = excluded.story,
  medical_other = excluded.medical_other, microchipped = excluded.microchipped,
  microchip_number = excluded.microchip_number,
  vet_certificate_url = excluded.vet_certificate_url,
  ear_tipped = excluded.ear_tipped, tested = excluded.tested,
  conditions = excluded.conditions, medical_checks = excluded.medical_checks,
  status = excluded.status, approval_status = excluded.approval_status,
  for_adoption = excluded.for_adoption, for_foster = excluded.for_foster,
  photos = excluded.photos;

insert into bills_paid (id, paid_on, context, animal_ref, clinic, amount_aed, amount_covered_aed, receipt_url, source, note)
values
  ('00000000-0000-4000-a000-000000000001', '2026-07-10', 'Batata — dental extraction',
   'DUBAI-003', 'Modern Vet · Umm Suqeim', 840, 520, null, 'shop', 'Bill #04211')
on conflict (id) do update set
  paid_on = excluded.paid_on, context = excluded.context, animal_ref = excluded.animal_ref,
  clinic = excluded.clinic, amount_aed = excluded.amount_aed,
  amount_covered_aed = excluded.amount_covered_aed, source = excluded.source, note = excluded.note;

insert into shop_ledger (id, sold_on, item, qty, amount_aed, benefit)
values
  ('00000000-0000-4000-b000-000000000001', '2026-07-05', 'The ear-tipped tote', 3, 285, '→ vet bills'),
  ('00000000-0000-4000-b000-000000000002', '2026-07-08', '"Street graduate" collar tag', 5, 225, '→ vet bills'),
  ('00000000-0000-4000-b000-000000000003', '2026-07-12', 'Street graduate wet bag', 1, 120, '→ vet bills')
on conflict (id) do update set
  sold_on = excluded.sold_on, item = excluded.item, qty = excluded.qty,
  amount_aed = excluded.amount_aed, benefit = excluded.benefit;
