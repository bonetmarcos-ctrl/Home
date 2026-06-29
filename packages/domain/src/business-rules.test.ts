import { describe, expect, it } from "vitest";
import {
  calculateBookingQuote,
  calculateDashboardMetrics,
  createInitialState,
  enumerateNights,
  findBookingConflicts,
  getAvailabilityStatus,
  rangesOverlap
} from "./index.js";

describe("business rules", () => {
  it("enumerates checkout-exclusive nights", () => {
    expect(enumerateNights("2026-06-27", "2026-06-30")).toEqual([
      "2026-06-27",
      "2026-06-28",
      "2026-06-29"
    ]);
  });

  it("detects overlapping booking ranges but allows checkout/checkin adjacency", () => {
    expect(rangesOverlap("2026-06-08", "2026-06-15", "2026-06-14", "2026-06-16")).toBe(true);
    expect(rangesOverlap("2026-06-08", "2026-06-15", "2026-06-15", "2026-06-17")).toBe(false);
  });

  it("finds conflicts only against active calendar-blocking bookings", () => {
    const state = createInitialState();
    const conflicts = findBookingConflicts(state.bookings, {
      id: "new-booking",
      startDate: "2026-06-10",
      endDate: "2026-06-12"
    });

    expect(conflicts.map((booking) => booking.id)).toEqual(["booking-june-confirmed"]);
  });

  it("derives status from past dates, bookings and manual blocks", () => {
    const state = createInitialState();
    expect(getAvailabilityStatus(state, "2026-06-17", "2026-06-18")).toBe("past");
    expect(getAvailabilityStatus(state, "2026-06-12", "2026-06-01")).toBe("booked");
    expect(getAvailabilityStatus(state, "2026-06-22", "2026-06-18")).toBe("blocked");
    expect(getAvailabilityStatus(state, "2026-06-27", "2026-06-18")).toBe("available");
  });

  it("calculates a quote with nightly overrides and extra services", () => {
    const state = createInitialState();
    const listing = state.listings[0]!;
    const quote = calculateBookingQuote({
      listing,
      availabilityDays: state.availabilityDays,
      services: state.services,
      startDate: "2026-06-27",
      endDate: "2026-06-30",
      serviceIds: ["laundry"]
    });

    expect(quote.nights).toBe(3);
    expect(quote.nightlySubtotal).toBe(222);
    expect(quote.extrasTotal).toBe(10);
    expect(quote.total).toBe(232);
    expect(quote.unavailableDates).toEqual([]);
  });

  it("summarizes operational dashboard metrics", () => {
    const metrics = calculateDashboardMetrics(createInitialState(), "2026-06-18", 10);
    expect(metrics.availableDays).toBe(5);
    expect(metrics.blockedDays).toBe(5);
    expect(metrics.pendingInquiries).toBe(1);
    expect(metrics.activeBookings).toBe(1);
  });
});