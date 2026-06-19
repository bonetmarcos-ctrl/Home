import type { AppState } from "@habitacion/domain";
import { CalendarCheck, Euro, MessageSquare, Percent } from "lucide-react";
import { useDashboardData } from "../../hooks/useDashboardData.js";
import { formatMoney, formatPercent } from "../../utils/format.js";

export function Dashboard({ state }: { state: AppState }) {
  const { listing, metrics, nextBooking, nextInquiry, nextQuote } = useDashboardData(state);
  const currency = listing?.currency ?? "EUR";
  const availableWidth = metrics.horizonDays > 0 ? (metrics.availableDays / metrics.horizonDays) * 100 : 0;
  const bookedWidth = metrics.horizonDays > 0 ? (metrics.bookedDays / metrics.horizonDays) * 100 : 0;
  const blockedWidth = metrics.horizonDays > 0 ? (metrics.blockedDays / metrics.horizonDays) * 100 : 0;

  return (
    <section className="view-stack">
      <div className="view-heading">
        <div>
          <p className="eyebrow">Gestion diaria</p>
          <h1>{listing?.name.es ?? "Habitacion"}</h1>
        </div>
      </div>

      <div className="kpi-grid">
        <article className="kpi-card"><Percent size={20} /><span>Ocupacion 30 dias</span><strong>{formatPercent(metrics.occupancyRate)}</strong></article>
        <article className="kpi-card"><CalendarCheck size={20} /><span>Dias disponibles</span><strong>{metrics.availableDays}</strong></article>
        <article className="kpi-card"><MessageSquare size={20} /><span>Consultas nuevas</span><strong>{metrics.pendingInquiries}</strong></article>
        <article className="kpi-card"><Euro size={20} /><span>Ingresos estimados</span><strong>{formatMoney(metrics.estimatedRevenue, currency)}</strong></article>
      </div>

      <div className="two-column">
        <article className="panel">
          <h2>Proxima consulta</h2>
          {nextInquiry ? (
            <div className="summary-list">
              <p><strong>{nextInquiry.guestName}</strong></p>
              <p>{nextInquiry.startDate || "sin entrada"} a {nextInquiry.endDate || "sin salida"}</p>
              <p>{nextQuote ? formatMoney(nextQuote.total, currency) : "Sin fechas suficientes"}</p>
            </div>
          ) : <p className="empty-state">No hay consultas nuevas.</p>}
        </article>

        <article className="panel">
          <h2>Proxima reserva activa</h2>
          {nextBooking ? (
            <div className="summary-list">
              <p><strong>{nextBooking.guestName}</strong></p>
              <p>{nextBooking.startDate} a {nextBooking.endDate}</p>
              <p>{nextBooking.status}</p>
            </div>
          ) : <p className="empty-state">No hay reservas pendientes o confirmadas.</p>}
        </article>
      </div>

      <article className="panel">
        <h2>Estado calendario</h2>
        <div className="status-bars">
          <span style={{ width: `${availableWidth}%` }} className="available" />
          <span style={{ width: `${bookedWidth}%` }} className="booked" />
          <span style={{ width: `${blockedWidth}%` }} className="blocked" />
        </div>
        <div className="legend-row">
          <span><i className="dot available" /> Libre</span>
          <span><i className="dot booked" /> Reservado</span>
          <span><i className="dot blocked" /> Bloqueado</span>
        </div>
      </article>
    </section>
  );
}