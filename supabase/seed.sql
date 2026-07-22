-- tipped — seed data. Mirrors lib/seed.ts so the live DB matches what the
-- site shipped with. Idempotent: safe to re-run (upserts by fixed uuid/ref).
-- Placeholder rescuers stay is_placeholder = true until each person consents.

insert into rescuers (id, username, name, emirate, blurb, email, instagram, pets_saved, clinics, is_placeholder, trust_level, role)
values
  ('00000000-0000-4000-8000-000000000001', 'straycatdubai', 'Silvana', 'Dubai',
   'Silvana feeds the cats of Deira every evening and knows each one by name. She has been rescuing for years, one cat at a time.',
   'vbarbiero0@gmail.com', 'straycatdubai', 34, '[{"name":"Modern Vet, Umm Suqeim"}]', true, 'trusted', 'admin'),
  ('00000000-0000-4000-8000-000000000002', 'kevinofdxb', 'Kwagga', 'Dubai',
   'Kwagga runs trap-neuter-return rounds around the Al Quoz warehouses, making sure every cat there is sterilised, vaccinated and fed.',
   'vbarbiero0@gmail.com', 'kevinofdxb', 21, '[{"name":"Modern Vet, Umm Suqeim"}]', true, 'review', 'rescuer'),
  ('00000000-0000-4000-8000-000000000003', 'fawaz', 'Fawaz', 'Dubai',
   'Fawaz runs Save Dubai Stray Cats from Satwa, giving special care to the animals others have given up on.',
   'vbarbiero0@gmail.com', null, 47, '[{"name":"Modern Vet, Umm Suqeim"}]', true, 'review', 'rescuer'),
  ('00000000-0000-4000-8000-000000000004', 'noor', 'Noor', 'Sharjah',
   'Noor cares for the desert dogs on the edge of Sharjah, running feeding rounds at dawn before the heat and finding homes for saluki mixes across the Emirates.',
   'vbarbiero0@gmail.com', null, 18, '[{"name":"Modern Vet, Umm Suqeim"}]', true, 'review', 'rescuer')
on conflict (id) do update set
  username = excluded.username, name = excluded.name, emirate = excluded.emirate,
  trust_level = excluded.trust_level, role = excluded.role,
  blurb = excluded.blurb, email = excluded.email, instagram = excluded.instagram,
  pets_saved = excluded.pets_saved, clinics = excluded.clinics;

insert into pets (id, ref, rescuer_id, species, name, sex, age, emirate, story, medical_other,
                     microchipped, microchip_number, vet_certificate_url, ear_tipped,
                     tested, conditions, medical_checks, status, approval_status,
                     for_adoption, for_foster, photos)
values
  ('00000000-0000-4000-9000-000000000001', 'DUBAI-001', '00000000-0000-4000-8000-000000000001',
   'cat', 'Karak', 'Male', '~2 yrs', 'Dubai',
   'Karak was rescued from behind a cafeteria in Deira, where staff had been feeding him for months. He''s affectionate and talkative, comes when called, and is gentle with children. Neutered, vaccinated and ready for a family of his own.',
   'Clean bill of health. Microchip booked for his next clinic visit.',
   false, 'PENDING-DUBAI-001', 'pending/awaiting-upload', true,
   '{fiv_felv}', '{}', '{spayed_neutered,vaccinated,dewormed}', 'available', 'approved',
   true, false, '{}'),
  ('00000000-0000-4000-9000-000000000002', 'DUBAI-002', '00000000-0000-4000-8000-000000000002',
   'cat', 'Mango', 'Female', '~3 yrs', 'Dubai',
   'Mango raised three kittens under a parked truck before she was rescued. All three have found homes, and now it''s her turn. She''s calm, sweet-natured, and settles quickly — she''d suit a quiet home where she can finally rest.',
   'Slight notch in the left ear from street life — purely cosmetic.',
   true, 'PENDING-DUBAI-002', 'pending/awaiting-upload', true,
   '{fiv_felv}', '{}', '{spayed_neutered,vaccinated,dewormed}', 'in_foster', 'approved',
   true, false, '{/animals/hero-tortie.jpg}'),
  ('00000000-0000-4000-9000-000000000003', 'DUBAI-003', '00000000-0000-4000-8000-000000000003',
   'cat', 'Batata', 'Male', '~4 yrs', 'Dubai',
   'Batata spent years surviving on the streets of Satwa and lost part of his tail along the way. It never dimmed his spirit — he''s cheerful, food-motivated, and loves company. He''s looking for a warm lap and a steady routine.',
   'Dental extraction underway at Modern Vet — recovering well.',
   true, 'PENDING-DUBAI-003', 'pending/awaiting-upload', true,
   '{fiv_felv}', '{}', '{spayed_neutered,vaccinated,dewormed}', 'available', 'approved',
   true, true, '{/animals/batata.jpg}'),
  ('00000000-0000-4000-9000-000000000004', 'AJMAN-001', '00000000-0000-4000-8000-000000000003',
   'cat', 'Loomi', 'Female', '~5 yrs', 'Ajman',
   'Loomi was found living in a parking garage behind an Ajman bakery, where the staff kept a kind eye on her. She is FIV positive, which simply means an indoor life and regular check-ups — it doesn''t slow her down. She loves sunny spots and quiet company.',
   'FIV positive — see below for what that actually means. Otherwise healthy, with the bloodwork to prove it.',
   true, 'PENDING-AJMAN-001', 'pending/awaiting-upload', true,
   '{}', '{fiv}', '{spayed_neutered,vaccinated,dewormed}', 'available', 'approved',
   true, true, '{}'),
  ('00000000-0000-4000-9000-000000000005', 'DUBAI-004', '00000000-0000-4000-8000-000000000004',
   'dog', 'Chapati', 'Male', '~1.5 yrs', 'Dubai',
   'Chapati is a desert-born saluki mix, quick and clever and eager to please — he learned to sit in a single evening. He would love an active family with room for him to run.',
   'Nothing to report. The vet called him boring, approvingly.',
   true, 'PENDING-DUBAI-004', 'pending/awaiting-upload', false,
   '{heartworm}', '{}', '{spayed_neutered,vaccinated,dewormed}', 'available', 'approved',
   true, false, '{}'),
  ('00000000-0000-4000-9000-000000000006', 'SHARJAH-001', '00000000-0000-4000-8000-000000000004',
   'dog', 'Simsim', 'Female', '~3 yrs', 'Sharjah',
   'Simsim kept a construction crew company through two long summers, and when the site closed she was left behind. She is gentle with everyone and endlessly patient, and she is waiting for a family of her own.',
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

insert into bills_paid (id, paid_on, context, pet_ref, clinic, amount_aed, amount_covered_aed, receipt_url, source, note)
values
  ('00000000-0000-4000-a000-000000000001', '2026-07-10', 'Batata — dental extraction',
   'DUBAI-003', 'Modern Vet · Umm Suqeim', 840, 520, null, 'shop', 'Bill #04211')
on conflict (id) do update set
  paid_on = excluded.paid_on, context = excluded.context, pet_ref = excluded.pet_ref,
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
