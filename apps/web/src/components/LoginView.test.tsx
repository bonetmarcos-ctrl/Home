import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LoginView } from "./LoginView.js";

describe("LoginView", () => {
  it("submits login credentials", async () => {
    const onLogin = vi.fn().mockResolvedValue(undefined);
    render(<LoginView error="" onLogin={onLogin} onRegister={vi.fn()} />);

    await userEvent.clear(screen.getByLabelText(/Usuario/i));
    await userEvent.type(screen.getByLabelText(/Usuario/i), "owner");
    await userEvent.clear(screen.getByLabelText(/Password/i));
    await userEvent.type(screen.getByLabelText(/Password/i), "secret");
    await userEvent.click(screen.getByRole("button", { name: /Entrar a la app/i }));

    expect(onLogin).toHaveBeenCalledWith("owner", "secret");
  });
});