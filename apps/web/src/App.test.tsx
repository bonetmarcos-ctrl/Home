import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App.js";

describe("promotional landing page", () => {
  it("renders the public room content", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Habitacion en Poblenou" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Reservar por WhatsApp/i })).toHaveAttribute("href", expect.stringContaining("wa.me/34664158678"));
    expect(screen.getByText("Un piso tranquilo, luminoso y bien conectado")).toBeInTheDocument();
    expect(screen.getByText("Lo esencial incluido y extras si los necesitas")).toBeInTheDocument();
  });

  it("switches language to English", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "EN" }));

    expect(screen.getByRole("heading", { name: "Room in Poblenou" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Book on WhatsApp/i })).toHaveAttribute("href", expect.stringContaining("Hi%2C%20I%20am%20interested"));
  });
});