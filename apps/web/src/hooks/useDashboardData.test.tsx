import { createInitialState } from "@habitacion/domain";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDashboardData } from "./useDashboardData.js";

describe("useDashboardData", () => {
  it("derives metrics through domain rules", () => {
    const { result } = renderHook(() => useDashboardData(createInitialState()));
    expect(result.current.metrics.pendingInquiries).toBe(1);
    expect(result.current.listing?.id).toBe("room-poblenou");
  });
});