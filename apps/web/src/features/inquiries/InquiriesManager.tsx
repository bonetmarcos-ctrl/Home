import type { AppState, Inquiry } from "@habitacion/domain";
import { Edit3, Plus, Trash2, X } from "lucide-react";
import { FormEvent, useState } from "react";

interface InquiriesManagerProps {
  state: AppState;
  onSave(inquiry: Inquiry): void;
  onDelete(id: string): void;
}

function blankInquiry(): Inquiry {
  return {
    id: crypto.randomUUID(),
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    startDate: "",
    endDate: "",
    guests: 1,
    message: "",
    status: "new",
    createdAt: new Date().toISOString()
  };
}

export function InquiriesManager({ state, onSave, onDelete }: InquiriesManagerProps) {
  const [draft, setDraft] = useState<Inquiry>(() => blankInquiry());
  const isEditing = state.inquiries.some((inquiry) => inquiry.id === draft.id);

  function resetDraft() {
    setDraft(blankInquiry());
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    onSave(draft);
    resetDraft();
  }

  return (
    <section className="view-stack">
      <div className="view-heading">
        <div><p className="eyebrow">Consultas</p><h1>Bandeja de interesados</h1></div>
      </div>

      <article className="panel">
        <div className="panel-title-row">
          <h2>{isEditing ? "Editar consulta" : "Nueva consulta"}</h2>
          {isEditing ? <button className="ghost-action" type="button" onClick={resetDraft}><X size={16} /> Cancelar</button> : null}
        </div>
        <form className="form-grid" onSubmit={submit}>
          <label>Nombre<input required value={draft.guestName} onChange={(event) => setDraft({ ...draft, guestName: event.target.value })} /></label>
          <label>Email<input value={draft.guestEmail} onChange={(event) => setDraft({ ...draft, guestEmail: event.target.value })} /></label>
          <label>Telefono<input value={draft.guestPhone} onChange={(event) => setDraft({ ...draft, guestPhone: event.target.value })} /></label>
          <label>Personas<input min={1} type="number" value={draft.guests} onChange={(event) => setDraft({ ...draft, guests: Number(event.target.value) })} /></label>
          <label>Entrada<input type="date" value={draft.startDate} onChange={(event) => setDraft({ ...draft, startDate: event.target.value })} /></label>
          <label>Salida<input type="date" value={draft.endDate} onChange={(event) => setDraft({ ...draft, endDate: event.target.value })} /></label>
          <label>Estado
            <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as Inquiry["status"] })}>
              <option value="new">Nueva</option>
              <option value="contacted">Contactada</option>
              <option value="converted">Convertida</option>
              <option value="archived">Archivada</option>
            </select>
          </label>
          <label className="full-row">Mensaje<textarea value={draft.message} onChange={(event) => setDraft({ ...draft, message: event.target.value })} /></label>
          <button className="primary-action full-row" type="submit"><Plus size={16} /> {isEditing ? "Actualizar consulta" : "Guardar consulta"}</button>
        </form>
      </article>

      <div className="table-panel">
        <table>
          <thead><tr><th>Nombre</th><th>Fechas</th><th>Estado</th><th>Mensaje</th><th /></tr></thead>
          <tbody>
            {state.inquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td>{inquiry.guestName}</td>
                <td>{inquiry.startDate || "-"} a {inquiry.endDate || "-"}</td>
                <td><span className={`tag-chip ${inquiry.status}`}>{inquiry.status}</span></td>
                <td>{inquiry.message}</td>
                <td className="row-actions">
                  <button className="icon-button" title="Editar consulta" type="button" onClick={() => setDraft(inquiry)}><Edit3 size={16} /></button>
                  <button className="icon-button" title="Eliminar consulta" type="button" onClick={() => onDelete(inquiry.id)}><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}