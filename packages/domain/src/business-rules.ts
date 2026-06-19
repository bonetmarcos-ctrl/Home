import type {
  AppState,
  AvailabilityStatus,
  Booking,
  Listing,
  Service
} from "./schemas.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const calendarBlockingStatuses = new Set<Booking["status"]>(["pending", "confirmed"]);

export type DerivedAvailabilityStatus = AvailabilityStatus | "past";

export interface BookingQuoteInput {
  listing: Listing;
  availabilityDays: AppState["availabilityDays"];
  services: Service[];
  startDate: string;
  endDate: string;
  serviceIds?: string[];
}

export interface BookingQuote {
  nights: number;
  nightlySubtotal: number;
  cleaningFee: number;
  extrasTotal: number;
  total: number;
  unavailableDates: string[];
}

export interface DashboardMetrics {
  horizonDays: number;
  availableDays: number;
  bookedDays: number;
  blockedDays: number;
  occupancyRate: number;
  pendingInquiries: number;
  activeBookings: number;
  estimatedRevenue: number;
}

export function toDateOnly(date: string): Date {
  const [year = 0, month = 1, day = 1] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: string, amount: number): string {
  return formatDateOnly(new Date(toDateOnly(date).getTime() + amount * DAY_MS));
}

export function enumerateNights(startDate: string, endDate: string): string[] {
  if (endDate <= startDate) {
    return [];
  }

  const nights: string[] = [];
  let current = startDate;
  while (current < endDate) {
    nights.push(current);
    current = addDays(current, 1);
  }
  return nights;
}

export function countNights(startDate: string, endDate: string): number {
  return enumerateNights(startDate, endDate).length;
}

export function rangesOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  return startA < endB && startB < endA;
}

export function findBookingConflicts(
  bookings: Booking[],
  candidate: Pick<Booking, "id" | "startDate" | "endDate">
): Booking[] {
  return bookings.filter(
    (booking) =>
      booking.id !== candidate.id &&
      calendarBlockingStatuses.has(booking.status) &&
      rangesOverlap(
        booking.startDate,
        booking.endDate,
        candidate.startDate,
        candidate.endDate
      )
  );
}

export function hasBookingConflict(
  bookings: Booking[],
  candidate: Pick<Booking, "id" | "startDate" | "endDate">
): boolean {
  return findBookingConflicts(bookings, candidate).length > 0;
}

export function getAvailabilityStatus(
  state: AppState,
  date: string,
  today = formatDateOnly(new Date())
): DerivedAvailabilityStatus {
  if (date < today) {
    return "past";
  }

  const blockingBooking = state.bookings.find(
    (booking) =>
      calendarBlockingStatuses.has(booking.status) &&
      rangesOverlap(booking.startDate, booking.endDate, date, addDays(date, 1))
  );
  if (blockingBooking) {
    return "booked";
  }

  return state.availabilityDays.find((day) => day.date === date)?.status ?? "available";
}

export function calculateBookingQuote(input: BookingQuoteInput): BookingQuote {
  const nights = enumerateNights(input.startDate, input.endDate);
  const selectedServiceIds = new Set(input.serviceIds ?? []);
  const availabilityByDate = new Map(input.availabilityDays.map((day) => [day.date, day]));
  const unavailableDates: string[] = [];

  const nightlySubtotal = nights.reduce((total, date) => {
    const day = availabilityByDate.get(date);
    if (day && day.status !== "available") {
      unavailableDates.push(date);
    }

    const nightlyRate = day && day.nightlyRate > 0 ? day.nightlyRate : input.listing.baseNightlyRate;
    return total + nightlyRate;
  }, 0);

  const extrasTotal = input.services.reduce((total, service) => {
    if (!selectedServiceIds.has(service.id) || service.category !== "extra") {
      return total;
    }

    if (service.billingType === "perNight") {
      return total + service.price * nights.length;
    }

    if (service.billingType === "perStay") {
      return total + service.price;
    }

    return total;
  }, 0);

  const cleaningFee = nights.length > 0 ? input.listing.cleaningFee : 0;

  return {
    nights: nights.length,
    nightlySubtotal,
    cleaningFee,
    extrasTotal,
    total: nightlySubtotal + cleaningFee + extrasTotal,
    unavailableDates
  };
}

export function calculateDashboardMetrics(
  state: AppState,
  today = formatDateOnly(new Date()),
  horizonDays = 30
): DashboardMetrics {
  const horizonDates = Array.from({ length: horizonDays }, (_, index) => addDays(today, index));
  const statusCounts = horizonDates.reduce(
    (counts, date) => {
      const status = getAvailabilityStatus(state, date, today);
      counts[status] += 1;
      return counts;
    },
    { available: 0, booked: 0, blocked: 0, past: 0 } satisfies Record<DerivedAvailabilityStatus, number>
  );

  const listing = state.listings[0];
  const estimatedRevenue = listing
    ? state.bookings
        .filter((booking) => booking.status === "confirmed")
        .reduce((total, booking) => {
          const chargeableNights = enumerateNights(booking.startDate, booking.endDate).filter((date) =>
            horizonDates.includes(date)
          );
          if (chargeableNights.length === 0) {
            return total;
          }

          const nightlyRate = booking.nightlyRate > 0 ? booking.nightlyRate : listing.baseNightlyRate;
          const cleaningFee = booking.startDate >= today && booking.startDate <= horizonDates.at(-1)!
            ? booking.cleaningFee
            : 0;
          return total + chargeableNights.length * nightlyRate + cleaningFee;
        }, 0)
    : 0;

  return {
    horizonDays,
    availableDays: statusCounts.available,
    bookedDays: statusCounts.booked,
    blockedDays: statusCounts.blocked,
    occupancyRate: horizonDays === 0 ? 0 : statusCounts.booked / horizonDays,
    pendingInquiries: state.inquiries.filter((inquiry) => inquiry.status === "new").length,
    activeBookings: state.bookings.filter((booking) => calendarBlockingStatuses.has(booking.status)).length,
    estimatedRevenue
  };
}