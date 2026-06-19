import { addDays, getAvailabilityStatus, type AppState, type AvailabilityDay, type AvailabilityStatus } from "@habitacion/domain";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { monthLabel, todayDate } from "../../utils/format.js";

const statusLabels: Record<AvailabilityStatus | "past", string> = {
  available: "Disponible",
  booked: "Reservado",
  blocked: "Bloqueado",
  past: "Pasado"
};

function monthDays(month: string) {
  const [year = 0, monthIndex = 1] = month.split("-").map(Number);
  const first = new Date(Date.UTC(year, monthIndex - 1, 1));
  const next = new Date(Date.UTC(year, monthIndex, 1));
  const total = Math.round((next.getTime() - first.getTime()) / 86400000);
  return Array.from({ length: total }, (_, index) => `${month}-${String(index + 1).padStart(2, "0")}`);
}

interface AvailabilityManagerProps {
  state: AppState;
  onChange(days: AvailabilityDay[]): void;
}

export function AvailabilityManager({ state, onChange }: AvailabilityManagerProps) {
  const today = todayDate();
  const [month, setMonth] = useState(today.slice(0, 7));
  const [selectedDate, setSelectedDate] = useState(today);
  const [draft, setDraft] = useState({ status: "available" as AvailabilityStatus, nightlyRate: 0, note: "" });
  const days = useMemo(() => monthDays(month), [month]);
  const dayMap = useMemo(() => new Map(state.availabilityDays.map((day) => [day.date, day])), [state.availabilityDays]);
  const listing = state.listings[0];
  const selectedDay = dayMap.get(selectedDate);

  useEffect(() => {
    setDraft({
      status: selectedDay?.status ?? "available",
      nightlyRate: selectedDay?.nightlyRate ?? listing?.baseNightlyRate ?? 0,
      note: selectedDay?.note ?? ""
    });
  }, [listing?.baseNightlyRate, selectedDay]);

  function saveDay(event: FormEvent) {
    event.preventDefault();
    const nextDay: AvailabilityDay = {
      id: selectedDay?.id ?? selectedDate,
      date: selectedDate,
      status: draft.status,
      nightlyRate: Number(draft.nightlyRate),
      note: draft.note
    };
    const others = state.availabilityDays.filter((day) => day.date !== selectedDate);
    onChange([...others, nextDay].sort((left, right) => left.date.localeCompare(right.date)));
  }

  function deleteDay() {
    onChange(state.availabilityDays.filter((day) => day.date !== selectedDate));
  }

  return (
    <section className="view-stack">
      <div className="view-heading compact-heading">
        <div>
          <p className="eyebrow">Disponibilidad</p>
          <h1>Calendario operativo</h1>
        </div>
        <div className="toolbar">
          <button type="button" onClick={() => setMonth(addDays(`${month}-01`, -28).slice(0, 7))}>Anterior</button>
          <input aria-label="Mes" type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
          <button type="button" onClick={() => setMonth(addDays(`${month}-28`, 7).slice(0, 7))}>Siguiente</button>
        </div>
      </div>

      <div className="two-column wide-left">
        <article className="panel calendar-panel">
          <h2>{monthLabel(month)}</h2>
          <div className="calendar-grid" role="grid">
            {days.map((date) => {
              const derivedStatus = getAvailabilityStatus(state, date, today);
              return (
                <button
                  className={`calendar-day ${derivedStatus} ${selectedDate === date ? "selected" : ""}`}
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  title={`Editar ${date}`}
                  type="button"
                >
                  <strong>{date.slice(-2)}</strong>
                  <span>{statusLabels[derivedStatus]}</span>
                </button>
              );
            })}
          </div>
        </article>

        <article className="panel">
          <h2>Editar dia</h2>
          <form className="form-grid single-column" onSubmit={saveDay}>
            <label>Fecha<input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} /></label>
            <label>Estado
              <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as AvailabilityStatus })}>
                <option value="available">Disponible</option>
                <option value="booked">Reservado</option>
                <option value="blocked">Bloqueado</option>
              </select>
            </label>
            <label>Tarifa noche<input min={0} type="number" value={draft.nightlyRate} onChange={(event) => setDraft({ ...draft, nightlyRate: Number(event.target.value) })} /></label>
            <label>Nota<textarea value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} /></label>
            <div className="form-actions">
              <button className="primary-action" type="submit">Guardar dia</button>
              <button className="ghost-action" disabled={!selectedDay} type="button" onClick={deleteDay}>Eliminar ajuste</button>
            </div>
          </form>
        </article>
      </div>
    </section>
  );
}