import { BarChart3, CalendarDays, ClipboardList, Home, MessageSquare, Settings } from "lucide-react";

export const navigationItems = [
  { id: "dashboard", label: "Panel", icon: BarChart3 },
  { id: "availability", label: "Calendario", icon: CalendarDays },
  { id: "bookings", label: "Reservas", icon: ClipboardList },
  { id: "inquiries", label: "Consultas", icon: MessageSquare },
  { id: "content", label: "Contenido", icon: Home },
  { id: "settings", label: "Ajustes", icon: Settings }
] as const;

export type ViewId = (typeof navigationItems)[number]["id"];