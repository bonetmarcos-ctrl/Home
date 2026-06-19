import { createInitialState } from "@habitacion/domain";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App.js";

describe("App shell", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.endsWith("/api/auth/me")) {
        return Promise.resolve(new Response(JSON.stringify({ user: { ownerId: "u1", username: "tester" } }), { status: 200 }));
      }
      if (url.endsWith("/api/state")) {
        return Promise.resolve(new Response(JSON.stringify(createInitialState()), { status: 200 }));
      }
      return Promise.resolve(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    }));
  });

  it("renders authenticated dashboard", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText("Gestion diaria")).toBeInTheDocument());
    expect(screen.getByText("tester")).toBeInTheDocument();
  });
});