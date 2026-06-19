import { calculateBookingQuote, type AppState, type Booking } from "@habitacion/domain";
import { Edit3, Plus, Trash2, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { formatMoney } from "../../utils/format.js";

interface BookingsManagerProps {
  state: AppState;
  onSave(booking: Booking): void;
  onDelete(id: string): void;
}

const blankBooking = (state: AppState): Booking => ({
  id: crypto.randomUUID(),
  guestName: "",
  guestEmail: "",
  guestPhone: "",
  startDate: "",
  endDate: "",
  guests: 1,
  status: "pending",
  source: "direct",
  nightlyRate: state.listings[0]?.baseNightlyRate ?? 0,
  cleaningFee: state.listings[0]?.cleaningFee ?? 0,
  serviceIds: [],
  notes: "",
  createdAt: new Date().toISOString()
});

export function BookingsManager({ state, onSave, onDelete }: BookingsManagerProps) {
  const [draft, setDraft] = useState<Booking>(() => blankBooking(state));
  const listing = state.listings[0];
  const extras = state.services.filter((service) => service.active && service.category === "extra");
  const isEditing = state.bookings.some((booking) => booking.id === draft.id);
  const quote = listing && draft.startDate && draft.endDate
    ? calculateBookingQuote({
        listing,
        availabilityDays: state.availabilityDays,
        services: state.services,
        startDate: draft.startDate,
        endDate: draft.endDate,
        serviceIds: draft.serviceIds
      })
    : null;

  function resetDraft() {
    setDraft(blankBooking(state));
  }

  function toggleService(serviceId: string) {
    setDraft((current) => ({
      ...current,
      serviceIds: current.serviceIds.includes(serviceId)
        ? current.serviceIds.filter((id) => id !== serviceId)
        : [...current.serviceIds, serviceId]
    }));
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    onSave(draft);
    resetDraft();
  }

  return (
    <section className="view-stack">
      <div className="view-heading">
        <div><p className="eyebrow">Reservas</p><h1>Crear y seguir estancias</h1></div>
      </div>

      <div className="two-column wide-left">
        <article className="panel">
          <div className="panel-title-row">
            <h2>{isEditing ? "Editar reserva" : "Nueva reserva"}</h2>
            {isEditing ? <button className="ghost-action" type="button" onClick={resetDraft}><X size={16} /> Cancelar</button> : null}
          </div>
          <form className="form-grid" onSubmit={submit}>
            <label>Huesped<input required value={draft.guestName} onChange={(event) => setDraft({ ...draft, guestName: event.target.value })} /></label>
            <label>Email<input value={draft.guestEmail} onChange={(event) => setDraft({ ...draft, guestEmail: event.target.value })} /></label>
            <label>Telefono<input value={draft.guestPhone} onChange={(event) => setDraft({ ...draft, guestPhone: event.target.value })} /></label>
            <label>Origen
              <select value={draft.source} onChange={(event) => setDraft({ ...draft, source: event.target.value as Booking["source"] })}>
                <option value="direct">Directa</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="airbnb">Airbnb</option>
                <option value="other">Otro</option>
              </select>
            </label>
            <label>Entrada<input required type="date" value={draft.startDate} onChange={(event) => setDraft({ ...draft, startDate: event.target.value })} /></label>
            <label>Salida<input required type="date" value={draft.endDate} onChange={(event) => setDraft({ ...draft, endDate: event.target.value })} /></label>
            <label>Personas<input min={1} type="number" value={draft.guests} onChange={(event) => setDraft({ ...draft, guests: Number(event.target.value) })} /></label>
            <label>Estado
              <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as Booking["status"] })}>
                <option value="pending">Pendiente</option>
                <option value="confirmed">Confirmada</option>
                <option value="cancelled">Cancelada</option>
                <option value="completed">Completada</option>
              </select>
            </label>
            <label>Tarifa noche<input min={0} type="number" value={draft.nightlyRate} onChange={(event) => setDraft({ ...draft, nightlyRate: Number(event.target.value) })} /></label>
            <label>Limpieza<input min={0} type="number" value={draft.cleaningFee} onChange={(event) => setDraft({ ...draft, cleaningFee: Number(event.target.value) })} /></label>
            <fieldset className="full-row check-group">
              <legend>Servicios extra</legend>
              {extras.length ? extras.map((service) => (
                <label className="check-row" key={service.id}>
                  <input type="checkbox" checked={draft.serviceIds.includes(service.id)} onChange={() => toggleService(service.id)} />
                  {service.name.es} · {formatMoney(service.price, listing?.currency)}
                </label>
              )) : <p className="muted">No hay servicios extra activos.</p>}
            </fieldset>
            <label className="full-row">Notas<textarea value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} /></label>
            <button className="primary-action full-row" type="submit"><Plus size={16} /> {isEditing ? "Actualizar reserva" : "Guardar reserva"}</button>
          </form>
        </article>

        <article className="panel">
          <h2>Resumen</h2>
          {quote ? (
            <div className="summary-list">
              <p>Noches: {quote.nights}</p>
              <p>Subtotal noches: {formatMoney(quote.nightlySubtotal, listing?.currency)}</p>
              <p>Extras: {formatMoney(quote.extrasTotal, listing?.currency)}</p>
              <p>Total: {formatMoney(quote.total, listing?.currency)}</p>
              <p>Fechas no disponibles: {quote.unavailableDates.length}</p>
            </div>
          ) : <p className="empty-state">Selecciona fechas.</p>}
        </article>
      </div>

      <div className="table-panel">
        <table>
          <thead><tr><th>Huesped</th><th>Fechas</th><th>Estado</th><th>Tarifa</th><th /></tr></thead>
          <tbody>
            {state.bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.guestName}</td>
                <td>{booking.startDate} a {booking.endDate}</td>
                <td><span className={`tag-chip ${booking.status}`}>{booking.status}</span></td>
                <td>{formatMoney(booking.nightlyRate || listing?.baseNightlyRate || 0, listing?.currency)}</td>
                <td className="row-actions">
                  <button className="icon-button" title="Editar reserva" type="button" onClick={() => setDraft(booking)}><Edit3 size={16} /></button>
                  <button className="icon-button" title="Eliminar reserva" type="button" onClick={() => onDelete(booking.id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}