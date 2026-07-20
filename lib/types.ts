export interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
}

export interface TimeRange {
  start: string; // "HH:MM"
  end: string; // "HH:MM"
}

/** Index 0 = Sunday … 6 = Saturday, matching Date#getDay(). */
export type WorkingHours = Record<number, TimeRange[]>;

export interface Booking {
  id: string;
  /** Present for the legacy single-business booking flow (services catalog). */
  serviceId?: string;
  /** Present for marketplace studio bookings — scopes conflict checks to that studio's own calendar. */
  studioId?: string;
  studioName?: string;
  /** Human label for what was booked, used when there's no serviceId to look up. */
  label?: string;
  price?: number;
  date: string; // "YYYY-MM-DD"
  startMinutes: number;
  endMinutes: number;
  customerName: string;
  customerEmail: string;
  stripeSessionId?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  createdAt: string;
}

export interface Business {
  name: string;
  services: Service[];
  workingHours: WorkingHours;
  bookings: Booking[];
  bufferMinutes: number;
  totalRequests: number;
  cancelledCount: number;
  contactMessages: ContactMessage[];
}
