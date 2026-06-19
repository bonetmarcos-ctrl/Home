import { LockKeyhole, UserPlus } from "lucide-react";
import { FormEvent, useState } from "react";

interface LoginViewProps {
  error: string;
  onLogin(username: string, password: string): Promise<void>;
  onRegister(username: string, password: string): Promise<void>;
}

export function LoginView({ error, onLogin, onRegister }: LoginViewProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "login") {
        await onLogin(username, password);
      } else {
        await onRegister(username, password);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login-layout">
      <section className="login-panel" aria-label="Acceso">
        <div className="brand-mark">HP</div>
        <h1>Habitacion Poblenou</h1>
        <p>Gestion operativa de reservas, disponibilidad, consultas y contenido editable.</p>

        <div className="segmented" role="tablist" aria-label="Modo de acceso">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")} type="button">
            <LockKeyhole size={16} /> Entrar
          </button>
          <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")} type="button">
            <UserPlus size={16} /> Registrar
          </button>
        </div>

        <form className="stack" onSubmit={submit}>
          <label>
            Usuario
            <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
          </label>
          <label>
            Password
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="primary-action" disabled={busy} type="submit">
            {busy ? "Procesando" : mode === "login" ? "Entrar a la app" : "Crear usuario"}
          </button>
        </form>
      </section>
    </main>
  );
}