import { createInitialState } from "@habitacion/domain";
import { describe, expect, it } from "vitest";
import { AppStateService } from "./AppStateService.js";
import { MemoryStateRepository } from "../infrastructure/MemoryStateRepository.js";

describe("AppStateService", () => {
  it("starts missing owners from initial state instead of default owner state", async () => {
    const service = new AppStateService(new MemoryStateRepository());
    const defaultState = await service.getState();
    await service.replaceState({ ...defaultState, inquiries: [] });

    const newOwnerState = await service.getState("new-owner");
    expect(newOwnerState.inquiries).toEqual(createInitialState().inquiries);
  });

  it("isolates state per owner", async () => {
    const service = new AppStateService(new MemoryStateRepository());
    const ownerA = await service.getState("owner-a");
    ownerA.inquiries = [];
    await service.replaceState(ownerA, "owner-a");

    const ownerB = await service.getState("owner-b");
    expect(ownerB.inquiries.length).toBeGreaterThan(0);
    expect((await service.getState("owner-a")).inquiries).toEqual([]);
  });

  it("rejects conflicting active bookings", async () => {
    const service = new AppStateService(new MemoryStateRepository());
    await expect(
      service.create(
        "bookings",
        {
          guestName: "Conflict",
          startDate: "2026-06-10",
          endDate: "2026-06-12",
          guests: 1,
          status: "confirmed"
        },
        "owner-a"
      )
    ).rejects.toMatchObject({ statusCode: 409, code: "BOOKING_CONFLICT" });
  });
});