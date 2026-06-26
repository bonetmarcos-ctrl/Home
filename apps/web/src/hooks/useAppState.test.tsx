import { createInitialState, type AppState } from "@habitacion/domain";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAppState } from "./useAppState.js";

const apiClientMock = vi.hoisted(() => ({
  getState: vi.fn(),
  saveState: vi.fn(),
  resetState: vi.fn()
}));

vi.mock("../services/apiClient.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../services/apiClient.js")>();
  return { ...actual, apiClient: apiClientMock };
});

function stateWithInquiry(id: string): AppState {
  const state = createInitialState();
  const inquiry = state.inquiries[0];
  if (!inquiry) {
    throw new Error("Missing inquiry fixture");
  }

  return { ...state, inquiries: [{ ...inquiry, id, guestName: id }] };
}

describe("useAppState", () => {
  beforeEach(() => {
    localStorage.clear();
    apiClientMock.getState.mockReset();
    apiClientMock.saveState.mockReset();
    apiClientMock.resetState.mockReset();
  });

  it("hydrates from the active owner's local cache when offline", async () => {
    const ownerAState = stateWithInquiry("owner-a-inquiry");
    const ownerBState = stateWithInquiry("owner-b-inquiry");
    localStorage.setItem("habitacion-poblenou-state:owner-a", JSON.stringify(ownerAState));
    localStorage.setItem("habitacion-poblenou-state:owner-b", JSON.stringify(ownerBState));
    apiClientMock.getState.mockRejectedValue(new Error("offline"));

    const { result, rerender } = renderHook(({ ownerId }) => useAppState(ownerId), {
      initialProps: { ownerId: "owner-a" }
    });

    await waitFor(() => expect(result.current.syncStatus).toBe("local"));
    expect(result.current.state.inquiries[0]?.id).toBe("owner-a-inquiry");

    rerender({ ownerId: "owner-b" });

    await waitFor(() => expect(result.current.state.inquiries[0]?.id).toBe("owner-b-inquiry"));
    expect(localStorage.getItem("habitacion-poblenou-state:owner-b")).toBe(JSON.stringify(ownerBState));
  });

  it("stores remote state under the owner scoped cache key", async () => {
    const remoteState = stateWithInquiry("remote-inquiry");
    apiClientMock.getState.mockResolvedValue(remoteState);

    const { result } = renderHook(() => useAppState("owner-a"));

    await waitFor(() => expect(result.current.syncStatus).toBe("synced"));
    const cached = JSON.parse(localStorage.getItem("habitacion-poblenou-state:owner-a") ?? "null") as AppState;
    expect(cached.inquiries[0]?.id).toBe("remote-inquiry");
    expect(localStorage.getItem("habitacion-poblenou-state")).toBeNull();
  });
});