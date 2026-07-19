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
  serviceId: string;
  date: string; // "YYYY-MM-DD"
  startMinutes: number;
  endMinutes: number;
  customerName: string;
  customerEmail: string;
  createdAt: string;
}

export interface Business {
  name: string;
  services: Service[];
  workingHours: WorkingHours;
  bookings: Booking[];
}
