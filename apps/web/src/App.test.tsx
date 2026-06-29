import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App.js";

describe("promotional landing page", () => {
  it("renders the public room content", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Tu refugio en Barcelona" })).toBeInTheDocument();
    expect(screen.getByText("Habitación acogedora en piso familiar tranquilo, balcón con vistas verdes y acceso a los servicios del hogar.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Reservar por WhatsApp/i })).toHaveAttribute("href", expect.stringContaining("wa.me/34664158678"));
    expect(screen.getAllByText(/80/).length).toBeGreaterThan(0);
    expect(screen.getByText("Precio individual: consultar")).toBeInTheDocument();
    expect(screen.queryByText("Balcón verde")).not.toBeInTheDocument();
    expect(screen.queryByText(/limpieza/i)).not.toBeInTheDocument();
    expect(screen.getByText("Un piso luminoso para sentirse cerca de casa")).toBeInTheDocument();
    expect(screen.getByText("Extras bajo pedido")).toBeInTheDocument();
    expect(screen.getByText("Disponibles si los necesitas. Te confirmamos los detalles por WhatsApp.")).toBeInTheDocument();
    expect(screen.getByText("Recogida en aeropuerto").closest("article")).not.toHaveTextContent("35");
  });

  it("switches language to English", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "EN" }));

    expect(screen.getByRole("heading", { name: "Your calm base in Barcelona" })).toBeInTheDocument();
    expect(screen.getByText("Solo traveller rate: ask us")).toBeInTheDocument();
    expect(screen.getByText("Extras on request")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Book on WhatsApp/i })).toHaveAttribute("href", expect.stringContaining("Hi%2C%20I%20am%20interested"));
  });
});