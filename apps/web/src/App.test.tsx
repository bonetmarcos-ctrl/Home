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
    expect(screen.getAllByText("Consultar").length).toBeGreaterThan(0);
    expect(screen.queryByText(/80\s*€/)).not.toBeInTheDocument();
    expect(screen.queryByText(/precio/i)).not.toBeInTheDocument();
    expect(screen.queryByText("ES / EN / IT")).not.toBeInTheDocument();
    expect(screen.getByText("ES / EN")).toBeInTheDocument();
    expect(screen.queryByText("Balcón verde")).not.toBeInTheDocument();
    expect(screen.queryByText("Fotos reales")).not.toBeInTheDocument();
    expect(screen.getAllByText("Fotos").length).toBeGreaterThan(0);
    expect(screen.queryByText(/trabajar en remoto/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/limpieza/i)).not.toBeInTheDocument();
    expect(screen.getByText("Un piso luminoso para sentirse cerca de casa")).toBeInTheDocument();
    expect(screen.getAllByText("Salón compartido").length).toBeGreaterThan(0);
    expect(screen.getByText("Habitación con escritorio")).toBeInTheDocument();
    expect(screen.queryByText("Descanso tranquilo")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Habitación privada con cama simple o doble" })).toBeInTheDocument();
    expect(screen.getAllByText("Cama simple o doble").length).toBeGreaterThan(0);
    expect(screen.getByText("Baño compartido")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Habitación preparada con cama doble" })).toHaveAttribute("src", "/images/room-double.jpg");
    expect(screen.getByRole("heading", { name: "Hola, somos Marcos y Sofi" })).toBeInTheDocument();
    expect(screen.getByText("Esperamos darte la bienvenida pronto.")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Los anfitriones en un paisaje de viñedos" })).toHaveAttribute("src", "/images/hosts.jpg");
    expect(screen.getByText("Extras bajo pedido")).toBeInTheDocument();
    expect(screen.getByText("Disponibles si los necesitas. Te confirmamos los detalles por WhatsApp.")).toBeInTheDocument();
    expect(screen.getByText("Recogida en aeropuerto").closest("article")).not.toHaveTextContent("35");
    expect(screen.queryByText("Playa Nova Icaria")).not.toBeInTheDocument();
  });

  it("switches language to English", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "EN" }));

    expect(screen.getByRole("heading", { name: "Your calm base in Barcelona" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Hi, we are Marcos and Sofi" })).toBeInTheDocument();
    expect(screen.getAllByText("Single or double bed").length).toBeGreaterThan(0);
    expect(screen.getByText("Shared bathroom")).toBeInTheDocument();
    expect(screen.getAllByText("Ask us").length).toBeGreaterThan(0);
    expect(screen.queryByText(/80\s*€/)).not.toBeInTheDocument();
    expect(screen.queryByText(/final price/i)).not.toBeInTheDocument();
    expect(screen.queryByText("ES / EN / IT")).not.toBeInTheDocument();
    expect(screen.getByText("Extras on request")).toBeInTheDocument();
    expect(screen.queryByText("Nova Icaria Beach")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Book on WhatsApp/i })).toHaveAttribute("href", expect.stringContaining("Hi%2C%20I%20am%20interested"));
  });
});