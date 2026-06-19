import { describe, expect, it } from "vitest";
import { availabilityDaySchema, bookingSchema, createInitialState, parseAppState } from "./index.js";

describe("domain schemas", () => {
  it("coerces ids and numeric form values", () => {
    const day = availabilityDaySchema.parse({
      id: 42,
      date: "2026-06-18",
      status: "available",
      nightlyRate: "72"
    });

    expect(day.id).toBe("42");
    expect(day.nightlyRate).toBe(72);
  });

  it("normalizes booking defaults from partial form data", () => {
    const booking = bookingSchema.parse({
      id: "booking-1",
      guestName: "Alex",
      startDate: "2026-06-27",
      endDate: "2026-06-30",
      guests: "2"
    });

    expect(booking.status).toBe("pending");
    expect(booking.guests).toBe(2);
    expect(booking.cleaningFee).toBe(0);
  });

  it("creates a complete valid initial state", () => {
    const state = createInitialState();
    expect(parseAppState(state).listings[0]?.id).toBe("room-poblenou");
    expect(state.availabilityDays.length).toBeGreaterThan(20);
    expect(state.services.some((service) => service.category === "extra")).toBe(true);
  });
});