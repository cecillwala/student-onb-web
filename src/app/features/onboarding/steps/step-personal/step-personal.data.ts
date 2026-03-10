// step-personal.data.ts
// -------------------------------------------------------
// Static lookup data for the Personal Details step.
// Replace sample constituencies/wards with the full Kenya dataset.
// A good source is the IEBC boundaries dataset (47 counties,
// 290 constituencies, ~1,450 wards).
// -------------------------------------------------------

export const NATIONALITIES = [
  { id: 'KE', name: 'Kenyan' },
  { id: 'UG', name: 'Ugandan' },
  { id: 'TZ', name: 'Tanzanian' },
  { id: 'RW', name: 'Rwandan' },
  { id: 'ET', name: 'Ethiopian' },
  { id: 'SS', name: 'South Sudanese' },
  { id: 'SO', name: 'Somali' },
  { id: 'CD', name: 'Congolese' },
  { id: 'NG', name: 'Nigerian' },
  { id: 'GH', name: 'Ghanaian' },
  { id: 'IN', name: 'Indian' },
  { id: 'OTHER', name: 'Other' },
];

// ---------- Kenya Counties (all 47) ----------
export const KENYA_COUNTIES = [
  { id: 1, name: 'Mombasa' },
  { id: 2, name: 'Kwale' },
  { id: 3, name: 'Kilifi' },
  { id: 4, name: 'Tana River' },
  { id: 5, name: 'Lamu' },
  { id: 6, name: 'Taita-Taveta' },
  { id: 7, name: 'Garissa' },
  { id: 8, name: 'Wajir' },
  { id: 9, name: 'Mandera' },
  { id: 10, name: 'Marsabit' },
  { id: 11, name: 'Isiolo' },
  { id: 12, name: 'Meru' },
  { id: 13, name: 'Tharaka-Nithi' },
  { id: 14, name: 'Embu' },
  { id: 15, name: 'Kitui' },
  { id: 16, name: 'Machakos' },
  { id: 17, name: 'Makueni' },
  { id: 18, name: 'Nyandarua' },
  { id: 19, name: 'Nyeri' },
  { id: 20, name: 'Kirinyaga' },
  { id: 21, name: 'Murang\'a' },
  { id: 22, name: 'Kiambu' },
  { id: 23, name: 'Turkana' },
  { id: 24, name: 'West Pokot' },
  { id: 25, name: 'Samburu' },
  { id: 26, name: 'Trans-Nzoia' },
  { id: 27, name: 'Uasin Gishu' },
  { id: 28, name: 'Elgeyo-Marakwet' },
  { id: 29, name: 'Nandi' },
  { id: 30, name: 'Baringo' },
  { id: 31, name: 'Laikipia' },
  { id: 32, name: 'Nakuru' },
  { id: 33, name: 'Narok' },
  { id: 34, name: 'Kajiado' },
  { id: 35, name: 'Kericho' },
  { id: 36, name: 'Bomet' },
  { id: 37, name: 'Kakamega' },
  { id: 38, name: 'Vihiga' },
  { id: 39, name: 'Bungoma' },
  { id: 40, name: 'Busia' },
  { id: 41, name: 'Siaya' },
  { id: 42, name: 'Kisumu' },
  { id: 43, name: 'Homa Bay' },
  { id: 44, name: 'Migori' },
  { id: 45, name: 'Kisii' },
  { id: 46, name: 'Nyamira' },
  { id: 47, name: 'Nairobi' },
];

// ---------- Constituencies (sample — expand with full IEBC data) ----------
// Each entry links to its parent county via countyId
export const CONSTITUENCIES: { id: number; name: string; countyId: number }[] = [
  // Nairobi (47)
  { id: 290, name: 'Westlands', countyId: 47 },
  { id: 291, name: 'Dagoretti North', countyId: 47 },
  { id: 292, name: 'Dagoretti South', countyId: 47 },
  { id: 293, name: 'Langata', countyId: 47 },
  { id: 294, name: 'Kibra', countyId: 47 },
  { id: 295, name: 'Roysambu', countyId: 47 },
  { id: 296, name: 'Kasarani', countyId: 47 },
  { id: 297, name: 'Ruaraka', countyId: 47 },
  { id: 298, name: 'Embakasi South', countyId: 47 },
  { id: 299, name: 'Embakasi North', countyId: 47 },
  { id: 300, name: 'Embakasi Central', countyId: 47 },
  { id: 301, name: 'Embakasi East', countyId: 47 },
  { id: 302, name: 'Embakasi West', countyId: 47 },
  { id: 303, name: 'Makadara', countyId: 47 },
  { id: 304, name: 'Kamukunji', countyId: 47 },
  { id: 305, name: 'Starehe', countyId: 47 },
  { id: 306, name: 'Mathare', countyId: 47 },

  // Nakuru (32) — sample
  { id: 200, name: 'Nakuru Town East', countyId: 32 },
  { id: 201, name: 'Nakuru Town West', countyId: 32 },
  { id: 202, name: 'Naivasha', countyId: 32 },
  { id: 203, name: 'Gilgil', countyId: 32 },
  { id: 204, name: 'Subukia', countyId: 32 },
  { id: 205, name: 'Njoro', countyId: 32 },
  { id: 206, name: 'Molo', countyId: 32 },
  { id: 207, name: 'Rongai', countyId: 32 },
  { id: 208, name: 'Bahati', countyId: 32 },
  { id: 209, name: 'Kuresoi North', countyId: 32 },
  { id: 210, name: 'Kuresoi South', countyId: 32 },

  // Uasin Gishu (27) — sample (Egerton is in Nakuru but students come from everywhere)
  { id: 180, name: 'Ainabkoi', countyId: 27 },
  { id: 181, name: 'Kapseret', countyId: 27 },
  { id: 182, name: 'Kesses', countyId: 27 },
  { id: 183, name: 'Moiben', countyId: 27 },
  { id: 184, name: 'Soy', countyId: 27 },
  { id: 185, name: 'Turbo', countyId: 27 },

  // TODO: Add remaining constituencies for all 47 counties
];

// ---------- Wards (sample — expand with full IEBC data) ----------
// Each entry links to its parent constituency via constituencyId
export const WARDS: { id: number; name: string; constituencyId: number }[] = [
  // Westlands (290)
  { id: 1000, name: 'Kitisuru', constituencyId: 290 },
  { id: 1001, name: 'Parklands/Highridge', constituencyId: 290 },
  { id: 1002, name: 'Karura', constituencyId: 290 },
  { id: 1003, name: 'Kangemi', constituencyId: 290 },
  { id: 1004, name: 'Mountain View', constituencyId: 290 },

  // Langata (293)
  { id: 1010, name: 'Karen', constituencyId: 293 },
  { id: 1011, name: 'Nairobi West', constituencyId: 293 },
  { id: 1012, name: 'Mugumo-Ini', constituencyId: 293 },
  { id: 1013, name: 'South C', constituencyId: 293 },
  { id: 1014, name: 'Nyayo Highrise', constituencyId: 293 },

  // Njoro (205) — near Egerton University
  { id: 1050, name: 'Njoro', constituencyId: 205 },
  { id: 1051, name: 'Mau', constituencyId: 205 },
  { id: 1052, name: 'Mauche', constituencyId: 205 },
  { id: 1053, name: 'Kihingo', constituencyId: 205 },
  { id: 1054, name: 'Nessuit', constituencyId: 205 },
  { id: 1055, name: 'Lare', constituencyId: 205 },

  // TODO: Add remaining wards for all constituencies
];