import { calculateBookingQuote, calculateDashboardMetrics, type AppState } from "@habitacion/domain";
import { useMemo } from "react";
import { todayDate } from "../utils/format.js";

export function useDashboardData(state: AppState) {
  return useMemo(() => {
    const listing = state.listings[0];
    const metrics = calculateDashboardMetrics(state, todayDate(), 30);
    const nextInquiry = state.inquiries.find((inquiry) => inquiry.status === "new");
    const nextBooking = state.bookings
      .filter((booking) => booking.status === "pending" || booking.status === "confirmed")
      .sort((left, right) => left.startDate.localeCompare(right.startDate))[0];
    const nextQuote = listing && nextInquiry?.startDate && nextInquiry?.endDate
      ? calculateBookingQuote({
          listing,
          availabilityDays: state.availabilityDays,
          services: state.services,
          startDate: nextInquiry.startDate,
          endDate: nextInquiry.endDate
        })
      : null;

    return { listing, metrics, nextInquiry, nextBooking, nextQuote };
  }, [state]);
}