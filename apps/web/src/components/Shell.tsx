import { LogOut, RotateCcw, Save } from "lucide-react";
import type { ReactNode } from "react";
import { navigationItems, type ViewId } from "../constants/navigation.js";
import type { SyncStatus } from "../hooks/useAppState.js";
import type { SessionUser } from "../services/apiClient.js";

interface ShellProps {
  activeView: ViewId;
  syncStatus: SyncStatus;
  user: SessionUser;
  onNavigate(view: ViewId): void;
  onLogout(): void;
  onReset(): void;
  children: ReactNode;
}

const syncLabels: Record<SyncStatus, string> = {
  loading: "Cargando",
  synced: "Sincronizado",
  saving: "Guardando",
  local: "Modo local",
  error: "Error"
};

export function Shell({ activeView, syncStatus, user, onNavigate, onLogout, onReset, children }: ShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark">HP</span>
          <div>
            <strong>Habitacion</strong>
            <small>Poblenou</small>
          </div>
        </div>
        <nav className="nav-list" aria-label="Secciones">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={activeView === item.id ? "active" : ""}
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={item.label}
                type="button"
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <span className={`sync-pill ${syncStatus}`}>
            <Save size={14} /> {syncLabels[syncStatus]}
          </span>
          <div className="topbar-actions">
            <span className="user-chip">{user.username}</span>
            <button className="icon-button" onClick={onReset} title="Resetear datos iniciales" type="button">
              <RotateCcw size={18} />
            </button>
            <button className="icon-button" onClick={onLogout} title="Cerrar sesion" type="button">
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}