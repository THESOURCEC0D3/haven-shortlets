export interface Apartment {
  id: string;
  slug: string;
  name: string;
  location: string;
  area: "gra" | "woji";
  bedrooms: number;
  bathrooms: number;
  size: number;
  pricePerNight: number;
  pricePerWeek: number;
  pricePerMonth: number;
  maxGuests: number;
  description: string;
  shortDescription: string;
  images: string[];
  amenities: string[];
  featured: boolean;
}

export const apartments: Apartment[] = [
  {
    id: "1",
    slug: "executive-suite-gra",
    name: "Executive Suite — GRA Phase 3",
    location: "GRA Phase 3, Port Harcourt",
    area: "gra",
    bedrooms: 3,
    bathrooms: 3,
    size: 220,
    pricePerNight: 150000,
    pricePerWeek: 900000,
    pricePerMonth: 3000000,
    maxGuests: 6,
    description:
      "Our flagship executive suite in the heart of GRA Phase 3 — Port Harcourt's most prestigious neighbourhood. Luxuriously furnished with premium Italian fittings, smart TV in every room, and a fully equipped kitchen. Ideal for oil and gas executives, expatriates, corporate delegations, and diaspora returnees who demand the very best. The apartment features 24/7 uninterrupted power supply, high-speed fibre Wi-Fi, air conditioning in every room, and a dedicated parking space. Walking distance to top restaurants, banks, and corporate offices on Peter Odili Road.",
    shortDescription:
      "Flagship luxury suite in GRA Phase 3. Premium fittings, 24/7 power, fibre Wi-Fi. Ideal for executives and expatriates.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    amenities: [
      "24/7 power supply",
      "High-speed fibre Wi-Fi",
      "Air conditioning — all rooms",
      "Smart TV — all rooms",
      "Fully equipped kitchen",
      "Washing machine",
      "Dedicated parking",
      "CCTV security",
      "Daily housekeeping available",
      "Airport pickup available",
    ],
    featured: true,
  },
  {
    id: "2",
    slug: "deluxe-studio-gra",
    name: "Deluxe Studio — GRA Phase 2",
    location: "GRA Phase 2, Port Harcourt",
    area: "gra",
    bedrooms: 1,
    bathrooms: 1,
    size: 75,
    pricePerNight: 75000,
    pricePerWeek: 450000,
    pricePerMonth: 1500000,
    maxGuests: 2,
    description:
      "A tastefully furnished studio apartment in the serene GRA Phase 2. Perfect for solo business travellers, contractors on short rotations, and couples seeking a private, comfortable base in Port Harcourt. The apartment features a king-size bed, a well-equipped kitchenette, smart TV, and 24/7 power supply. Compact, efficient, and everything you need — nothing you do not.",
    shortDescription:
      "Tastefully furnished studio in GRA Phase 2. Perfect for solo travellers and couples. 24/7 power, smart TV.",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800",
    ],
    amenities: [
      "24/7 power supply",
      "Wi-Fi internet",
      "Air conditioning",
      "Smart TV",
      "Kitchenette",
      "CCTV security",
      "Secure parking",
    ],
    featured: true,
  },
  {
    id: "3",
    slug: "premium-2bed-woji",
    name: "Premium 2-Bedroom — Woji",
    location: "Woji, Port Harcourt",
    area: "woji",
    bedrooms: 2,
    bathrooms: 2,
    size: 140,
    pricePerNight: 100000,
    pricePerWeek: 600000,
    pricePerMonth: 2000000,
    maxGuests: 4,
    description:
      "A well-appointed 2-bedroom apartment in the rapidly developing Woji corridor — midway between Trans-Amadi and GRA. Ideal for small families, colleagues travelling together, or business guests who need more space. Both bedrooms are ensuite with quality fittings. The open-plan living and dining area is perfect for working or unwinding after a long day. 24/7 power supply and high-speed Wi-Fi included.",
    shortDescription:
      "Spacious 2-bedroom in Woji. Both rooms ensuite, open-plan living. Great for families and colleagues.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    amenities: [
      "24/7 power supply",
      "High-speed Wi-Fi",
      "Air conditioning — all rooms",
      "Smart TV",
      "Fully equipped kitchen",
      "Both rooms ensuite",
      "Secure estate",
      "Parking space",
    ],
    featured: true,
  },
  {
    id: "4",
    slug: "classic-1bed-woji",
    name: "Classic 1-Bedroom — Woji",
    location: "Woji, Port Harcourt",
    area: "woji",
    bedrooms: 1,
    bathrooms: 1,
    size: 90,
    pricePerNight: 65000,
    pricePerWeek: 390000,
    pricePerMonth: 1300000,
    maxGuests: 2,
    description:
      "A comfortable and well-maintained 1-bedroom apartment in a quiet estate in Woji. Suitable for solo professionals, couples, and anyone seeking affordable quality short-let accommodation outside the GRA premium corridor. Clean, functional, and reliably powered — everything a working professional needs for a productive stay in Port Harcourt.",
    shortDescription:
      "Comfortable 1-bedroom in quiet Woji estate. Affordable quality for solo professionals and couples.",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800",
    ],
    amenities: [
      "24/7 power supply",
      "Wi-Fi internet",
      "Air conditioning",
      "Smart TV",
      "Equipped kitchen",
      "Secure estate",
      "Parking space",
    ],
    featured: false,
  },
  {
    id: "5",
    slug: "corporate-suite-gra",
    name: "Corporate Suite — GRA Phase 1",
    location: "GRA Phase 1, Port Harcourt",
    area: "gra",
    bedrooms: 2,
    bathrooms: 2,
    size: 160,
    pricePerNight: 120000,
    pricePerWeek: 720000,
    pricePerMonth: 2400000,
    maxGuests: 4,
    description:
      "A premium corporate-grade 2-bedroom suite in the exclusive GRA Phase 1 — Port Harcourt's oldest and most established highbrow neighbourhood. Designed for senior executives, corporate delegations, and high-value diaspora guests. Features a dedicated home office workspace, ultra-fast fibre internet, premium bedding, and a fully stocked kitchen. The building has a corporate reception desk and meeting room available to guests.",
    shortDescription:
      "Premium corporate suite in GRA Phase 1. Home office workspace, ultra-fast fibre. For senior executives.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    amenities: [
      "24/7 power supply",
      "Ultra-fast fibre Wi-Fi",
      "Air conditioning — all rooms",
      "Smart TV — all rooms",
      "Home office workspace",
      "Fully stocked kitchen",
      "Premium bedding",
      "Corporate reception desk",
      "Meeting room access",
      "Airport pickup available",
      "Daily housekeeping",
    ],
    featured: true,
  },
  {
    id: "6",
    slug: "cozy-studio-woji",
    name: "Cozy Studio — Woji",
    location: "Woji, Port Harcourt",
    area: "woji",
    bedrooms: 1,
    bathrooms: 1,
    size: 60,
    pricePerNight: 55000,
    pricePerWeek: 330000,
    pricePerMonth: 1100000,
    maxGuests: 2,
    description:
      "Our most affordable studio option — cozy, clean, and fully equipped. Located in a well-maintained estate in Woji, this studio is ideal for budget-conscious business travellers, young professionals on rotation, and anyone who needs a clean, reliable base in Port Harcourt without the GRA price tag. Small but perfectly formed — everything works and nothing is broken.",
    shortDescription:
      "Affordable studio in Woji. Clean, reliable, fully equipped. Best value short-let in Port Harcourt.",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800",
    ],
    amenities: [
      "24/7 power supply",
      "Wi-Fi internet",
      "Air conditioning",
      "Smart TV",
      "Kitchenette",
      "Secure estate",
      "Parking space",
    ],
    featured: false,
  },
];

export const getFeaturedApartments = (): Apartment[] => {
  return apartments.filter((a) => a.featured);
};

export const getApartmentBySlug = (slug: string): Apartment | undefined => {
  return apartments.find((a) => a.slug === slug);
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};
