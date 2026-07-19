export type StudioCategory = "photo" | "podcast" | "video" | "music";

export const CATEGORY_LABELS: Record<StudioCategory, string> = {
  photo: "Photography",
  podcast: "Podcast",
  video: "Video",
  music: "Music",
};

export interface Studio {
  id: string;
  slug: string;
  name: string;
  category: StudioCategory;
  tagline: string;
  description: string;
  city: string;
  address: string;
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  capacity: number;
  sqft: number;
  images: string[];
  amenities: string[];
  equipment: string[];
  featured?: boolean;
  availabilityNote: string;
}

export interface StudioReview {
  studioId: string;
  author: string;
  rating: number;
  date: string;
  text: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  quote: string;
  rating: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TeamMember {
  name: string;
  role: string;
  initials: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  text: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  unit: "hr" | "flat";
}

function img(id: string, w = 1200) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
}

export const studios: Studio[] = [
  {
    id: "s1",
    slug: "lumen-loft",
    name: "Lumen Loft",
    category: "photo",
    tagline: "Daylight-flooded loft for portrait & product work",
    description:
      "A 1,400 sq ft daylight studio with 14-foot ceilings and floor-to-ceiling north-facing windows. Lumen Loft is built for photographers who want soft, even natural light without fighting a lighting rig — with a full blackout option and studio strobes on standby for anything after dark.",
    city: "Brooklyn, NY",
    address: "214 Ainslie St, Brooklyn, NY",
    pricePerHour: 85,
    rating: 4.9,
    reviewCount: 132,
    capacity: 12,
    sqft: 1400,
    images: [img("1519558260268-cde7e03a0152"), img("1493225457124-a3eb161ffa5f"), img("1497366216548-37526070297c")],
    amenities: ["Natural light", "Freight elevator", "Free Wi-Fi", "Climate control", "Street parking", "Wheelchair accessible"],
    equipment: ["2x Profoto B10 strobes", "Seamless paper (9 colors)", "C-stands & booms", "Rolling rails"],
    featured: true,
    availabilityNote: "Usually booked 3–5 days out",
  },
  {
    id: "s2",
    slug: "northlight-studio",
    name: "Northlight Studio",
    category: "photo",
    tagline: "Cyclorama wall built for e-commerce & fashion",
    description:
      "A seamless white cyclorama wall, 25 feet wide, with a full grid of overhead soft-boxes tuned for clean product and fashion catalog shoots. Includes a styling area, steamer, and rolling racks so your whole shoot day happens under one roof.",
    city: "Austin, TX",
    address: "88 Rainey St, Austin, TX",
    pricePerHour: 70,
    rating: 4.8,
    reviewCount: 96,
    capacity: 15,
    sqft: 1800,
    images: [img("1517841905240-472988babdf9"), img("1493711662062-fa541adb3fc8"), img("1485579149621-3123dd979885")],
    amenities: ["Cyclorama wall", "Styling area", "Free Wi-Fi", "Kitchenette", "On-site parking"],
    equipment: ["12-head softbox grid", "Steamer & rolling racks", "Sony Alpha bodies (rental)", "Tethering station"],
    availabilityNote: "Usually booked 1–2 days out",
  },
  {
    id: "s3",
    slug: "echo-room",
    name: "Echo Room",
    category: "podcast",
    tagline: "Four-mic podcast suite with a producer on call",
    description:
      "Acoustically treated from floor to ceiling, Echo Room fits up to four hosts around a broadcast-grade console with zero echo, zero street noise. Every booking includes a house engineer to run levels so you can just talk.",
    city: "Los Angeles, CA",
    address: "5510 Sunset Blvd, Los Angeles, CA",
    pricePerHour: 60,
    rating: 5.0,
    reviewCount: 210,
    capacity: 4,
    sqft: 400,
    images: [img("1598550874175-4d0ef436c909"), img("1598488035139-bdbb2231ce04"), img("1598387993441-a364f854c3e1")],
    amenities: ["Acoustic treatment", "House engineer included", "Free Wi-Fi", "Green room", "Free parking"],
    equipment: ["4x Shure SM7B", "Rodecaster Pro II", "Multi-cam video capture", "Live-stream ready"],
    featured: true,
    availabilityNote: "Usually booked same week",
  },
  {
    id: "s4",
    slug: "the-booth",
    name: "The Booth",
    category: "podcast",
    tagline: "Cozy two-mic room for solo hosts & interviews",
    description:
      "A compact, warmly lit booth built for two — perfect for a solo show or a weekly interview format. Plug in and go: everything is pre-wired and levelled, so setup takes under five minutes.",
    city: "Chicago, IL",
    address: "1140 W Fulton Market, Chicago, IL",
    pricePerHour: 35,
    rating: 4.7,
    reviewCount: 74,
    capacity: 2,
    sqft: 180,
    images: [img("1598620617148-c9e8ddee6711"), img("1550985616-10810253b84d"), img("1554415707-6e8cfc93fe23")],
    amenities: ["Acoustic treatment", "Free Wi-Fi", "Self check-in", "Free parking"],
    equipment: ["2x Shure SM7B", "Zoom PodTrak P4", "Ring light", "Webcam capture"],
    availabilityNote: "Usually booked same day",
  },
  {
    id: "s5",
    slug: "frame-and-co",
    name: "Frame & Co.",
    category: "video",
    tagline: "Cyc wall + green screen video stage",
    description:
      "A full production stage with a 20x12 cyclorama, dedicated green-screen bay, and grid-mounted LED fixtures on DMX. Frame & Co. is where brand teams and YouTube creators come to shoot anything from talking-head interviews to full commercial spots.",
    city: "Brooklyn, NY",
    address: "67 Bogart St, Brooklyn, NY",
    pricePerHour: 120,
    rating: 4.9,
    reviewCount: 88,
    capacity: 20,
    sqft: 2600,
    images: [img("1483412033650-1015ddeb83d1"), img("1571003123894-1f0594d2b5d9"), img("1598300042247-d088f8ab3a91")],
    amenities: ["Green screen bay", "DMX lighting grid", "Freight elevator", "Green room", "On-site parking"],
    equipment: ["Sony FX6 (2x)", "DMX LED panel grid", "Teleprompter", "Multi-cam switcher"],
    featured: true,
    availabilityNote: "Usually booked 4–6 days out",
  },
  {
    id: "s6",
    slug: "reel-house",
    name: "Reel House",
    category: "video",
    tagline: "Warm, cinematic set for narrative & branded work",
    description:
      "Reel House is built like a set, not a studio — exposed brick, moody practicals, and modular flats you can reconfigure between scenes. Popular with narrative shorts, music videos, and branded content that wants texture over a blank cyc wall.",
    city: "Nashville, TN",
    address: "812 Woodland St, Nashville, TN",
    pricePerHour: 95,
    rating: 4.8,
    reviewCount: 61,
    capacity: 18,
    sqft: 2100,
    images: [img("1526726538690-5cbf956ae2fd"), img("1533090161767-e6ffed986c88"), img("1512428813834-c702c7702b78")],
    amenities: ["Modular set flats", "Practical lighting", "Green room", "Free parking", "Loading dock"],
    equipment: ["ARRI SkyPanel (4x)", "Dolly & track", "Grip package", "Video village monitors"],
    availabilityNote: "Usually booked 5–7 days out",
  },
  {
    id: "s7",
    slug: "analog-sound",
    name: "Analog Sound",
    category: "music",
    tagline: "Full recording studio with a live tracking room",
    description:
      "A proper recording studio: an SSL-style console, a live room big enough for a full band, and an isolation booth for vocals. Analog Sound has hosted everything from solo singer-songwriter sessions to full-band album tracking.",
    city: "Los Angeles, CA",
    address: "2200 Sunset Blvd, Los Angeles, CA",
    pricePerHour: 110,
    rating: 5.0,
    reviewCount: 143,
    capacity: 8,
    sqft: 1600,
    images: [img("1519892300165-cb5542fb47c7"), img("1560184897-ae75f418493e"), img("1585951237318-9ea5e175b891")],
    amenities: ["Live room", "Isolation booth", "In-house engineer available", "Free parking", "Lounge"],
    equipment: ["SSL-style console", "Neumann U87 (2x)", "Full backline", "Pro Tools HDX rig"],
    featured: true,
    availabilityNote: "Usually booked 1 week out",
  },
  {
    id: "s8",
    slug: "wax-and-wire",
    name: "Wax & Wire",
    category: "music",
    tagline: "Vintage-gear room for warm, analog production",
    description:
      "Tape machines, tube preamps, and a wall of vintage synths — Wax & Wire is for producers chasing a warmer, grittier sound than a stock digital chain gives you. Small footprint, big character.",
    city: "Portland, OR",
    address: "3305 SE Belmont St, Portland, OR",
    pricePerHour: 65,
    rating: 4.7,
    reviewCount: 52,
    capacity: 4,
    sqft: 650,
    images: [img("1571330735066-03aaa9429d89"), img("1543807535-eceef0bc6599"), img("1595079676339-1534801ad6cf")],
    amenities: ["Vintage synth wall", "Tape machine", "Free Wi-Fi", "Street parking"],
    equipment: ["1/2\" tape machine", "Tube preamp chain", "Modular synth rack", "Vintage drum kit"],
    availabilityNote: "Usually booked 2–3 days out",
  },
];

export const studioReviews: StudioReview[] = [
  { studioId: "s1", author: "Priya N.", rating: 5, date: "2026-05-14", text: "The light in the afternoon is unreal — barely needed my strobes. Easiest load-in of any studio I've used." },
  { studioId: "s1", author: "Marcus T.", rating: 5, date: "2026-04-02", text: "Booked for a full-day product shoot, ran long, and the host let us stay an extra hour with zero fuss." },
  { studioId: "s1", author: "Ilsa R.", rating: 4, date: "2026-02-27", text: "Gorgeous space. Freight elevator is a little slow if you have a big crew, budget extra time." },
  { studioId: "s3", author: "Deshawn K.", rating: 5, date: "2026-06-01", text: "The house engineer alone is worth the price. We just talked, they handled every fader." },
  { studioId: "s3", author: "Anna B.", rating: 5, date: "2026-05-20", text: "Recorded 8 episodes back to back here. Sound is dead silent, zero street bleed." },
  { studioId: "s7", author: "Tomas V.", rating: 5, date: "2026-03-11", text: "Tracked a full band live in the main room and it sounded like a record from day one." },
  { studioId: "s5", author: "Grace L.", rating: 5, date: "2026-06-10", text: "Green screen bay keyed out perfectly, no spill even with four people in frame." },
];

export const testimonials: Testimonial[] = [
  { id: "t1", author: "Priya Nair", role: "Portrait photographer", quote: "I stopped renting three different studios for three different looks — Slotwise found me one with better light for less money.", rating: 5 },
  { id: "t2", author: "Deshawn Carter", role: "Podcast host, Long Story Short", quote: "Booking used to be five texts and a maybe. Now I pick a slot, pay, and show up. That's it.", rating: 5 },
  { id: "t3", author: "Grace Lin", role: "Video producer", quote: "Found a green-screen stage inside my budget in about four minutes of scrolling. Filters actually work.", rating: 5 },
  { id: "t4", author: "Tomas Varga", role: "Music producer", quote: "The buffer time between bookings means I've never once walked in on a session running late. Small thing, huge relief.", rating: 4 },
  { id: "t5", author: "Anna Beaumont", role: "Content creator", quote: "Same-day availability saved a shoot when our original space fell through. Genuinely saved the week.", rating: 5 },
];

export const faqItems: FaqItem[] = [
  { question: "How does booking actually work?", answer: "Pick a studio, choose a date and time from real-time availability, add any equipment or crew add-ons, and confirm — you get an instant confirmation, no back-and-forth with the studio owner." },
  { question: "What's the cancellation policy?", answer: "Free cancellation up to 48 hours before your session for a full refund. Inside 48 hours, you'll receive a credit toward a future booking." },
  { question: "Is equipment included in the hourly rate?", answer: "Each listing shows exactly what's included — lighting, mics, cameras, and backline vary by studio. Anything not included can usually be added as a paid add-on during checkout." },
  { question: "Do I need to pay a deposit?", answer: "Most studios charge the full session cost up front at booking; a few larger stages request a 20% deposit with the balance due on arrival — this is always shown before you confirm." },
  { question: "Can I book outside normal business hours?", answer: "Yes — availability reflects each studio's actual calendar, including early mornings, evenings, and some 24-hour spaces. Look for the 'after-hours' badge on a listing." },
  { question: "Is there insurance if something gets damaged?", answer: "All bookings include basic liability coverage. Studios with high-value gear may require a refundable damage hold, shown clearly on the studio's page before you book." },
];

export const teamMembers: TeamMember[] = [
  { name: "Nadia Chowdhury", role: "Co-founder & CEO", initials: "NC" },
  { name: "Owen Fitzgerald", role: "Co-founder & Head of Studios", initials: "OF" },
  { name: "Mei Tanaka", role: "Head of Product", initials: "MT" },
  { name: "Diego Ramirez", role: "Engineering Lead", initials: "DR" },
  { name: "Sofia Adeyemi", role: "Studio Partnerships", initials: "SA" },
];

export const timeline: TimelineItem[] = [
  { year: "2022", title: "Slotwise starts as a spreadsheet", text: "Two co-founders, four photo studios in Brooklyn, and a shared calendar that kept breaking." },
  { year: "2023", title: "First 100 studios", text: "Podcast and video studios join the platform; real-time availability replaces the spreadsheet for good." },
  { year: "2024", title: "Buffer scheduling & instant payouts", text: "Studio owners get automatic buffer time between sessions and same-day payouts on completed bookings." },
  { year: "2025", title: "Music studios & multi-city expansion", text: "Recording studios come online; Slotwise expands past the coasts into 12 cities." },
  { year: "2026", title: "500+ bookings and counting", text: "A studio booked on Slotwise roughly every two hours, across four creative categories." },
];

export const platformStats = [
  { label: "Bookings completed", value: 500, suffix: "+" },
  { label: "Studios listed", value: 50, suffix: "+" },
  { label: "Average rating", value: 4.9, suffix: "", decimals: 1 },
  { label: "Cities", value: 12, suffix: "+" },
];

export const clientLogos = ["NOVA MEDIA", "CIRCUIT", "gild.", "Fernweh", "PRISM STUDIOS", "Alder & Co."];

export const addOns: AddOn[] = [
  { id: "lighting", name: "Extra lighting kit", price: 25, unit: "hr" },
  { id: "camera", name: "Additional camera body", price: 40, unit: "hr" },
  { id: "mic", name: "Extra mic package", price: 15, unit: "hr" },
  { id: "assistant", name: "On-site assistant / crew", price: 50, unit: "hr" },
  { id: "editing", name: "Same-day edit pass", price: 150, unit: "flat" },
];

export function getStudioBySlug(slug: string): Studio | undefined {
  return studios.find((s) => s.slug === slug);
}

export function getSimilarStudios(studio: Studio, count = 3): Studio[] {
  return studios.filter((s) => s.id !== studio.id && s.category === studio.category).slice(0, count);
}

export function getReviewsForStudio(studioId: string): StudioReview[] {
  return studioReviews.filter((r) => r.studioId === studioId);
}
