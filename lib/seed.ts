import type { Animal, BillPaid, Product, Rescuer, ShopLedgerRow } from "./types";

// Placeholder rescuers — real people appear only with their consent (Hard rule 5).
// is_placeholder stays true until each rescuer confirms.
export const seedRescuers: Rescuer[] = [
  {
    id: "r-silvana",
    name: "Silvana",
    emirate: "Dubai",
    blurb:
      "Feeds the cafeteria block in Deira every night. Knows every cat by name and most by opinion.",
    email: "silvana@tipped.ae",
    instagram: "straycatdubai",
    cats_saved: 34,
    clinics: [{ name: "Modern Vet, Umm Suqeim" }],
    is_placeholder: true,
  },
  {
    id: "r-kwagga",
    name: "Kwagga",
    emirate: "Dubai",
    blurb:
      "TNR runs around the Al Quoz warehouses. If a cat is under a truck, Kwagga has already met it.",
    email: "kwagga@tipped.ae",
    instagram: "kevinofdxb",
    cats_saved: 21,
    clinics: [{ name: "Modern Vet, Umm Suqeim" }],
    is_placeholder: true,
  },
  {
    id: "r-fawaz",
    name: "Fawaz",
    emirate: "Dubai",
    blurb:
      "Runs Save Dubai Stray Cats out of Satwa. Specialises in the ones everyone else gave up on.",
    email: "fawaz@tipped.ae",
    instagram: null,
    cats_saved: 47,
    clinics: [{ name: "Modern Vet, Umm Suqeim" }],
    is_placeholder: true,
  },
  {
    id: "r-noor",
    name: "Noor",
    emirate: "Sharjah",
    blurb:
      "Works the desert edge where the dogs are. Runs feeding rounds at dawn before the heat, and knows every saluki mix between Sharjah and Mirdif.",
    email: "noor@tipped.ae",
    instagram: null,
    cats_saved: 18,
    clinics: [{ name: "Modern Vet, Umm Suqeim" }],
    is_placeholder: true,
  },
];

export const seedAnimals: Animal[] = [
  {
    id: "a-karak",
    ref: "DUBAI-001",
    rescuer_id: "r-silvana",
    species: "cat",
    name: "Karak",
    sex: "Male",
    age: "~2 yrs",
    emirate: "Dubai",
    story:
      "Lived behind a cafeteria in Deira. Knows his name and yells it back. Fine with kids, firm about breakfast.",
    medical: "Clean bill of health. Microchip booked for his next clinic visit.",
    sterilised: true,
    vaccinated: true,
    microchipped: false,
    tested: ["fiv_felv"],
    conditions: [],
    status: "available",
    for_adoption: true,
    for_foster: false,
    in_foster: false,
    photos: [],
  },
  {
    id: "a-mango",
    ref: "DUBAI-002",
    rescuer_id: "r-kwagga",
    species: "cat",
    name: "Mango",
    sex: "Female",
    age: "~3 yrs",
    emirate: "Dubai",
    story:
      "Raised three kittens under a parked truck. The kittens are homed. It's her turn now, and she knows it.",
    medical:
      "Slight notch in the left ear from street life — purely cosmetic.",
    sterilised: true,
    vaccinated: true,
    microchipped: true,
    tested: ["fiv_felv"],
    conditions: [],
    status: "available",
    for_adoption: true,
    for_foster: false,
    in_foster: true,
    photos: [],
  },
  {
    id: "a-batata",
    ref: "DUBAI-003",
    rescuer_id: "r-fawaz",
    species: "cat",
    name: "Batata",
    sex: "Male",
    age: "~4 yrs",
    emirate: "Dubai",
    story:
      "Bin-diver, reformed. Lost half a tail out there and none of the appetite. Wants a warm lap and a routine.",
    medical: "Dental extraction underway at Modern Vet — recovering well.",
    sterilised: true,
    vaccinated: true,
    microchipped: true,
    tested: ["fiv_felv"],
    conditions: [],
    status: "available",
    for_adoption: true,
    for_foster: true,
    in_foster: false,
    photos: ["/animals/batata.jpg"],
  },
  {
    id: "a-loomi",
    ref: "AJMAN-001",
    rescuer_id: "r-fawaz",
    species: "cat",
    name: "Loomi",
    sex: "Female",
    age: "~5 yrs",
    emirate: "Ajman",
    story:
      "Ran the parking garage behind an Ajman bakery — staff paid rent in leftovers. FIV positive, entirely unbothered. Wants sunbeams and a slow morning.",
    medical:
      "FIV positive — see below for what that actually means. Otherwise healthy, with the bloodwork to prove it.",
    sterilised: true,
    vaccinated: true,
    microchipped: true,
    tested: [],
    conditions: ["fiv"],
    status: "available",
    for_adoption: true,
    for_foster: true,
    in_foster: false,
    photos: [],
  },
  {
    id: "a-chapati",
    ref: "DUBAI-004",
    rescuer_id: "r-noor",
    species: "dog",
    name: "Chapati",
    sex: "Male",
    age: "~1.5 yrs",
    emirate: "Dubai",
    story:
      "Desert-born saluki mix. Runs like a rumour, sleeps like a rock. Learned 'sit' in one evening and hasn't stopped showing it off.",
    medical: "Nothing to report. The vet called him boring, approvingly.",
    sterilised: true,
    vaccinated: true,
    microchipped: true,
    tested: ["heartworm"],
    conditions: [],
    status: "available",
    for_adoption: true,
    for_foster: false,
    in_foster: false,
    photos: [],
  },
  {
    id: "a-simsim",
    ref: "SHARJAH-001",
    rescuer_id: "r-noor",
    species: "dog",
    name: "Simsim",
    sex: "Female",
    age: "~3 yrs",
    emirate: "Sharjah",
    story:
      "Kept a whole construction crew company through two summers. The site closed; she didn't get the memo. Gentle with everyone, patient beyond reason.",
    medical:
      "A healed fracture in one hind leg — she doesn't mention it.",
    sterilised: true,
    vaccinated: true,
    microchipped: true,
    tested: ["heartworm"],
    conditions: [],
    status: "available",
    for_adoption: false,
    for_foster: true,
    in_foster: false,
    photos: [],
  },
];

export const seedBillsPaid: BillPaid[] = [
  {
    id: "b-batata-dental",
    paid_on: "2026-07-10",
    context: "Batata — dental extraction",
    animal_ref: "DUBAI-003",
    clinic: "Modern Vet · Umm Suqeim",
    amount_aed: 840,
    amount_covered_aed: 520,
    receipt_url: null,
    source: "shop",
    note: "Bill #04211",
  },
];

export const seedShopLedger: ShopLedgerRow[] = [
  {
    id: "s-1",
    sold_on: "2026-07-05",
    item: "The ear-tipped tote",
    qty: 3,
    amount_aed: 285,
    benefit: "→ vet bills",
    note: null,
  },
  {
    id: "s-2",
    sold_on: "2026-07-08",
    item: '"Street graduate" collar tag',
    qty: 5,
    amount_aed: 225,
    benefit: "→ vet bills",
    note: null,
  },
  {
    id: "s-3",
    sold_on: "2026-07-12",
    item: "Street graduate wet bag",
    qty: 1,
    amount_aed: 120,
    benefit: "→ vet bills",
    note: null,
  },
];

// The shop is static catalog content in v1 — no checkout (Selling model in CLAUDE.md).
export const products: Product[] = [
  {
    slug: "ear-tipped-tote",
    name: "The ear-tipped tote",
    price_aed: 95,
    benefit: "→ 100% of profit to vet bills",
    description:
      "Heavy cotton, the two ears on the front. Carries 8kg of dry food, which is exactly what it will be used for.",
  },
  {
    slug: "street-graduate-wet-bag",
    name: "Street graduate wet bag",
    price_aed: 120,
    benefit: "→ 100% of profit to vet bills",
    description:
      "Waterproof, wipeable, roomy enough for a clinic run. Made for rescuers, useful for everyone.",
  },
  {
    slug: "street-graduate-collar-tag",
    name: '"Street graduate" collar tag',
    price_aed: 45,
    benefit: "→ 100% of profit to vet bills",
    description:
      "Engraved brass tag for a cat or dog that earned it. Every one sold goes straight at the open bills.",
  },
];

export const heroImage = "/animals/hero-tortie.jpg";
