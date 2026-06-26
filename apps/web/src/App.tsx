import type {
  AvailabilityDay,
  Booking,
  HouseRule,
  Inquiry,
  Listing,
  LocationPoint,
  Service,
  SiteSetting
} from "@habitacion/domain";
import { useState } from "react";
import { LoginView } from "./components/LoginView.js";
import { Shell } from "./components/Shell.js";
import type { ViewId } from "./constants/navigation.js";
import { AvailabilityManager } from "./features/availability/AvailabilityManager.js";
import { BookingsManager } from "./features/bookings/BookingsManager.js";
import { ContentManager } from "./features/content/ContentManager.js";
import { Dashboard } from "./features/dashboard/Dashboard.js";
import { InquiriesManager } from "./features/inquiries/InquiriesManager.js";
import { SettingsManager } from "./features/settings/SettingsManager.js";
import { useAppState } from "./hooks/useAppState.js";
import { useAuth } from "./hooks/useAuth.js";

export function App() {
  const auth = useAuth();
  const [activeView, setActiveView] = useState<ViewId>("dashboard");
  const appState = useAppState(auth.user?.ownerId);

  if (auth.status === "checking") {
    return <div className="loading-screen">Cargando sesion</div>;
  }

  if (!auth.user) {
    return <LoginView error={auth.error} onLogin={auth.login} onRegister={auth.register} />;
  }

  const state = appState.state;
  const content: Record<ViewId, JSX.Element> = {
    dashboard: <Dashboard state={state} />,
    availability: (
      <AvailabilityManager
        state={state}
        onChange={(days: AvailabilityDay[]) => appState.replaceCollection("availabilityDays", days)}
      />
    ),
    bookings: (
      <BookingsManager
        state={state}
        onSave={(booking: Booking) => appState.upsertItem("bookings", booking)}
        onDelete={(id) => appState.deleteItem("bookings", id)}
      />
    ),
    inquiries: (
      <InquiriesManager
        state={state}
        onSave={(inquiry: Inquiry) => appState.upsertItem("inquiries", inquiry)}
        onDelete={(id) => appState.deleteItem("inquiries", id)}
      />
    ),
    content: (
      <ContentManager
        state={state}
        onSaveService={(service: Service) => appState.upsertItem("services", service)}
        onDeleteService={(id) => appState.deleteItem("services", id)}
        onSaveHouseRule={(rule: HouseRule) => appState.upsertItem("houseRules", rule)}
        onDeleteHouseRule={(id) => appState.deleteItem("houseRules", id)}
        onSaveLocation={(location: LocationPoint) => appState.upsertItem("locations", location)}
        onDeleteLocation={(id) => appState.deleteItem("locations", id)}
      />
    ),
    settings: (
      <SettingsManager
        state={state}
        onSaveListing={(listing: Listing) => appState.upsertItem("listings", listing)}
        onDeleteListing={(id) => appState.deleteItem("listings", id)}
        onSaveSiteSetting={(setting: SiteSetting) => appState.upsertItem("siteSettings", setting)}
        onDeleteSiteSetting={(id) => appState.deleteItem("siteSettings", id)}
      />
    )
  };

  return (
    <Shell
      activeView={activeView}
      syncStatus={appState.syncStatus}
      user={auth.user}
      onNavigate={setActiveView}
      onLogout={auth.logout}
      onReset={appState.reset}
    >
      {appState.error ? <p className="sync-warning">{appState.error}</p> : null}
      {content[activeView]}
    </Shell>
  );
}