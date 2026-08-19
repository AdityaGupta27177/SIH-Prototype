/**
 * Seed data: 5 fake 7/12 Khatedar records with GeoJSON polygon boundaries.
 * Located in a fictional village "Wadgaon" near Pune, Maharashtra.
 * Coordinates are real-world plausible around 18.5°N, 73.85°E.
 */

export interface KhatedarRecord {
  gatNumber: string;
  khatedarName: string;
  khatedarPhone: string;
  khatedarAadhaar: string; // mock Aadhaar
  areaHectares: number;
  village: string;
  taluka: string;
  district: string;
  /** GeoJSON Polygon geometry */
  boundary: {
    type: "Polygon";
    coordinates: number[][][];
  };
}

export const SEED_KHATEDAR_RECORDS: KhatedarRecord[] = [
  {
    gatNumber: "142/A",
    khatedarName: "Suresh Patil",
    khatedarPhone: "9876543210",
    khatedarAadhaar: "123456789001",
    areaHectares: 2.5,
    village: "Wadgaon",
    taluka: "Haveli",
    district: "Pune",
    boundary: {
      type: "Polygon",
      coordinates: [[
        [73.8500, 18.5200],
        [73.8530, 18.5200],
        [73.8530, 18.5225],
        [73.8500, 18.5225],
        [73.8500, 18.5200],
      ]],
    },
  },
  {
    gatNumber: "87/B",
    khatedarName: "Meena Jadhav",
    khatedarPhone: "9876543211",
    khatedarAadhaar: "123456789002",
    areaHectares: 1.8,
    village: "Wadgaon",
    taluka: "Haveli",
    district: "Pune",
    boundary: {
      type: "Polygon",
      coordinates: [[
        [73.8540, 18.5200],
        [73.8570, 18.5200],
        [73.8570, 18.5220],
        [73.8540, 18.5220],
        [73.8540, 18.5200],
      ]],
    },
  },
  {
    gatNumber: "203/C",
    khatedarName: "Rajesh Deshmukh",
    khatedarPhone: "9876543212",
    khatedarAadhaar: "123456789003",
    areaHectares: 3.2,
    village: "Wadgaon",
    taluka: "Haveli",
    district: "Pune",
    boundary: {
      type: "Polygon",
      coordinates: [[
        [73.8480, 18.5230],
        [73.8520, 18.5230],
        [73.8520, 18.5260],
        [73.8480, 18.5260],
        [73.8480, 18.5230],
      ]],
    },
  },
  {
    gatNumber: "56/D",
    khatedarName: "Anita Shinde",
    khatedarPhone: "9876543213",
    khatedarAadhaar: "123456789004",
    areaHectares: 1.1,
    village: "Wadgaon",
    taluka: "Haveli",
    district: "Pune",
    boundary: {
      type: "Polygon",
      coordinates: [[
        [73.8560, 18.5230],
        [73.8580, 18.5230],
        [73.8580, 18.5245],
        [73.8560, 18.5245],
        [73.8560, 18.5230],
      ]],
    },
  },
  {
    gatNumber: "311/E",
    khatedarName: "Prakash More",
    khatedarPhone: "9876543214",
    khatedarAadhaar: "123456789005",
    areaHectares: 4.0,
    village: "Wadgaon",
    taluka: "Haveli",
    district: "Pune",
    boundary: {
      type: "Polygon",
      coordinates: [[
        [73.8450, 18.5170],
        [73.8500, 18.5170],
        [73.8500, 18.5200],
        [73.8450, 18.5200],
        [73.8450, 18.5170],
      ]],
    },
  },
];

/** Demo users for the live presentation */
export const SEED_USERS = [
  {
    phone: "9988776655",
    name: "Ramesh Kumar",
    role: "tenant" as const,
    kycVerified: true,
    aadhaarId: "999988887777",
  },
  {
    phone: "9876543210",
    name: "Suresh Patil",
    role: "landowner" as const,
    kycVerified: true,
    aadhaarId: "123456789001",
  },
  {
    phone: "9876543211",
    name: "Meena Jadhav",
    role: "landowner" as const,
    kycVerified: true,
    aadhaarId: "123456789002",
  },
  {
    phone: "9000000001",
    name: "Vijay Kadam",
    role: "official" as const,
    kycVerified: true,
    aadhaarId: "111122223333",
    sazaCode: "14",
  },
];

/** Lookup a khatedar record by Gat number */
export function findKhatedarByGat(gatNumber: string): KhatedarRecord | undefined {
  return SEED_KHATEDAR_RECORDS.find(
    (r) => r.gatNumber.toLowerCase() === gatNumber.toLowerCase()
  );
}

/** Check if a phone number matches the khatedar for a given Gat number (identity-to-title check) */
export function verifyKhatedarIdentity(
  gatNumber: string,
  phone: string
): { matched: boolean; record?: KhatedarRecord } {
  const record = findKhatedarByGat(gatNumber);
  if (!record) return { matched: false };
  return {
    matched: record.khatedarPhone === phone,
    record: record,
  };
}
