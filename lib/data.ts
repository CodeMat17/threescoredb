export type DestinationKey = "Kenya" | "Uganda" | "Tanzania" | "Dubai";

export type TravelPackage = {
  id: string;
  slug: string;
  title: string;
  destination: DestinationKey;
  priceFromUsd: number;
  days: number | { min?: number; max?: number };
  highlights: string[];
  itineraryPreview: string[];
  imageUrl: string;
};

export type Service = {
  id: string;
  key:
    | "air-ticketing"
    | "car-rental"
    | "safari-tours"
    | "team-building"
    | "hotel-reservations"
    | "airbnb-arrangements";
  title: string;
  description: string;
  imageUrl?: string;
};

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  avatarUrl?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  dateIso: string;
  tags: string[];
  author: string;
};

export const company = {
  name: "Threescore Exquisite Ltd Tours",
  address: "Riara Road, Nairobi",
  phones: ["+254706572045", "+254781068874"],
  email: "threescoreexquisitetour@gmail.com",
  instagram: "https://instagram.com/threescoreexquisite_cotravel",
  facebook: "https://facebook.com/Threescore Luxury Tours".replace(
    /\s/g,
    "%20"
  ),
  businessHours: [
    { label: "Mon–Fri", hours: "08:00 – 18:00" },
    { label: "Sat", hours: "09:00 – 16:00" },
    { label: "Sun", hours: "Closed" },
  ],
} as const;

export const heroSlides: Array<{
  title: string;
  subtitle: string;
  imageUrl: string;
}> = [
  {
    title: "Unforgettable Safaris",
    subtitle: "Witness the Big Five in their natural habitat",
    imageUrl:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Wildlife Adventures",
    subtitle: "Close encounters with Africa’s majestic wildlife",
    imageUrl:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "Scenic Landscapes",
    subtitle: "From savannahs to beaches—discover it all",
    imageUrl:
      "https://images.unsplash.com/photo-1542498539-24204cf5fbd8?q=80&w=1600&auto=format&fit=crop",
  },
  {
    title: "City Escapes",
    subtitle: "Iconic skylines and luxury shopping in Dubai",
    imageUrl:
      "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?q=80&w=1600&auto=format&fit=crop",
  },
];

export const packages: TravelPackage[] = [
  // Kenya
  {
    id: "ke-1",
    slug: "3-days-watamu-malindi-kilifi",
    title: "3 days Watamu, Malindi & Kilifi",
    destination: "Kenya",
    priceFromUsd: 650,
    days: 3,
    highlights: ["Watamu beaches", "Malindi culture", "Kilifi sunsets"],
    itineraryPreview: [
      "Arrival and beach relaxation",
      "Explore Malindi historical sites",
      "Kilifi creek cruise and departure",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1558980664-10ae3b67a7ad?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "ke-2",
    slug: "5-days-watamu-malindi-kilifi",
    title: "5 days Watamu, Malindi & Kilifi",
    destination: "Kenya",
    priceFromUsd: 860,
    days: 5,
    highlights: ["Marine park", "Gede ruins", "Kilifi creek"],
    itineraryPreview: ["Marine park snorkeling", "Cultural tour", "Beach day"],
    imageUrl:
      "https://images.unsplash.com/photo-1533050487297-09b450131914?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "ke-3",
    slug: "maasai-mara",
    title: "Maasai Mara",
    destination: "Kenya",
    priceFromUsd: 800,
    days: 3,
    highlights: ["Big Five", "Maasai village", "Great Migration (seasonal)"],
    itineraryPreview: ["Game drive", "Village visit", "Sunrise safari"],
    imageUrl:
      "https://images.unsplash.com/photo-1543248939-ff40856f65d1?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "ke-4",
    slug: "10-days-bush-safari-kenya",
    title: "10 days Bush Safari (Northern & Southern Kenya)",
    destination: "Kenya",
    priceFromUsd: 3120,
    days: 10,
    highlights: ["Samburu", "Amboseli", "Tsavo", "Mara"],
    itineraryPreview: ["Diverse parks", "Photography", "Cultural immersion"],
    imageUrl:
      "https://images.unsplash.com/photo-1483721310020-03333e577078?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "ke-5",
    slug: "2-days-tsavo-east-from-mombasa",
    title: "2 days Tsavo East NP from Mombasa",
    destination: "Kenya",
    priceFromUsd: 270,
    days: 2,
    highlights: ["Red elephants", "Aruba dam"],
    itineraryPreview: ["Transfer & game drive", "Morning drive & return"],
    imageUrl:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "ke-6",
    slug: "3-days-mombasa-beach",
    title: "3 days Mombasa beach packages",
    destination: "Kenya",
    priceFromUsd: 130,
    days: 3,
    highlights: ["Fort Jesus", "Old Town", "Beach time"],
    itineraryPreview: ["Arrival", "City tour", "Relax & depart"],
    imageUrl:
      "https://images.unsplash.com/photo-1597852074816-331bfc67ad42?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "ke-7",
    slug: "4-days-magical-kenya",
    title: "4 days Magical Kenya",
    destination: "Kenya",
    priceFromUsd: 760,
    days: 4,
    highlights: ["Mara", "Lake Naivasha", "Hell’s Gate"],
    itineraryPreview: ["Boat ride", "Game drives", "Gorges cycling"],
    imageUrl:
      "https://images.unsplash.com/photo-1543764477-94605bc9c417?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "ke-8",
    slug: "3-days-mara-budget",
    title: "3 days Maasai Mara budget safari",
    destination: "Kenya",
    priceFromUsd: 350,
    days: 3,
    highlights: ["Game drives", "Budget camps"],
    itineraryPreview: ["Drive to Mara", "Full day drive", "Return"],
    imageUrl:
      "https://images.unsplash.com/photo-1532390205962-30b0ac8df966?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "ke-9",
    slug: "2-days-nairobi-amboseli",
    title: "2 days Nairobi–Amboseli NP",
    destination: "Kenya",
    priceFromUsd: 265,
    days: 2,
    highlights: ["Mt. Kilimanjaro views", "Elephants"],
    itineraryPreview: ["Drive to Amboseli", "Morning game drive & return"],
    imageUrl:
      "https://images.unsplash.com/photo-1558980664-9f23a9b6b981?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "ke-10",
    slug: "2-days-tsavo-east-alt",
    title: "2 days Tsavo East NP from Mombasa (Alt)",
    destination: "Kenya",
    priceFromUsd: 500,
    days: 2,
    highlights: ["Tsavo wilderness"],
    itineraryPreview: ["Evening drive", "Sunrise safari"],
    imageUrl:
      "https://images.unsplash.com/photo-1536364198787-89d0b1dcd12f?q=80&w=1200&auto=format&fit=crop",
  },
  // Tanzania
  {
    id: "tz-1",
    slug: "tanzania-bush-beach-thrills",
    title: "Tanzania’s Bush & Beach Thrills",
    destination: "Tanzania",
    priceFromUsd: 950,
    days: { min: 4, max: 8 },
    highlights: ["Serengeti", "Zanzibar"],
    itineraryPreview: ["Game drives", "Zanzibar relaxation"],
    imageUrl:
      "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?q=80&w=1200&auto=format&fit=crop",
  },
  // Uganda
  {
    id: "ug-1",
    slug: "uganda-gorilla-trekking",
    title: "Uganda Gorilla Trekking",
    destination: "Uganda",
    priceFromUsd: 2400,
    days: { min: 3, max: 5 },
    highlights: ["Bwindi Forest", "Gorilla permits"],
    itineraryPreview: ["Briefing", "Trek", "Community visit"],
    imageUrl:
      "https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?q=80&w=1200&auto=format&fit=crop",
  },
  // Dubai
  {
    id: "ae-1",
    slug: "dubai-packages",
    title: "Dubai Packages",
    destination: "Dubai",
    priceFromUsd: 850,
    days: { min: 3, max: 7 },
    highlights: ["Desert safari", "Burj Khalifa", "Dubai Mall"],
    itineraryPreview: ["City tour", "Desert camp", "Shopping"],
    imageUrl:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop",
  },
];

export const services: Service[] = [
  {
    id: "svc-1",
    key: "air-ticketing",
    title: "Air Ticketing",
    description:
      "Domestic and international flight bookings with flexible options and great fares.",
  },
  {
    id: "svc-2",
    key: "car-rental",
    title: "Car Rental",
    description:
      "Reliable vehicles for city rides, safaris, and group travel—chauffeur or self-drive.",
  },
  {
    id: "svc-3",
    key: "safari-tours",
    title: "Safari Tours",
    description:
      "Curated safari experiences across East Africa with expert guides and tailored itineraries.",
  },
  {
    id: "svc-4",
    key: "team-building",
    title: "Team Building",
    description:
      "Energizing retreats and corporate packages that inspire collaboration and growth.",
  },
  {
    id: "svc-5",
    key: "hotel-reservations",
    title: "Hotel Reservations",
    description:
      "Handpicked stays—from boutique lodges to luxury resorts—at competitive rates.",
  },
  {
    id: "svc-6",
    key: "airbnb-arrangements",
    title: "Airbnb Arrangements",
    description:
      "Comfortable and convenient apartment stays tailored to your travel style and budget.",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    name: "Amina K.",
    location: "Nairobi, KE",
    rating: 5,
    text: "The Maasai Mara safari was beyond incredible—thoughtful planning and wonderful guide!",
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=256&auto=format&fit=crop",
  },
  {
    id: "t-2",
    name: "James M.",
    location: "Kampala, UG",
    rating: 5,
    text: "Seamless trip to Dubai. Flights, hotel, and activities were all perfectly arranged.",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "great-migration-guide",
    title: "A Quick Guide to the Great Migration",
    excerpt:
      "When to go, where to stay, and how to get the most from this bucket-list spectacle.",
    content:
      "The Great Migration sees millions of wildebeest and zebras crossing the Mara River...",
    coverImageUrl:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1600&auto=format&fit=crop",
    dateIso: new Date().toISOString(),
    tags: ["safari", "maasai mara", "kenya"],
    author: "Threescore Team",
  },
  {
    slug: "zanzibar-or-diani",
    title: "Zanzibar vs Diani: Which Beach Escape?",
    excerpt:
      "Two Indian Ocean gems with distinct vibes—here’s how to choose your perfect getaway.",
    content:
      "From spice tours to coral reefs, compare experiences and travel logistics...",
    coverImageUrl:
      "https://images.unsplash.com/photo-1543248939-ff40856f65d1?q=80&w=1600&auto=format&fit=crop",
    dateIso: new Date().toISOString(),
    tags: ["beach", "tanzania", "kenya"],
    author: "Threescore Team",
  },
];
