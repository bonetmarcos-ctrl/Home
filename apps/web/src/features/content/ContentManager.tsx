import type { AppState, HouseRule, LocationPoint, Service } from "@habitacion/domain";
import { Edit3, Plus, Trash2, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { formatMoney } from "../../utils/format.js";

interface ContentManagerProps {
  state: AppState;
  onSaveService(service: Service): void;
  onDeleteService(id: string): void;
  onSaveHouseRule(rule: HouseRule): void;
  onDeleteHouseRule(id: string): void;
  onSaveLocation(location: LocationPoint): void;
  onDeleteLocation(id: string): void;
}

function blankService(): Service {
  return {
    id: crypto.randomUUID(),
    name: { es: "", en: "" },
    description: { es: "", en: "" },
    category: "included",
    billingType: "included",
    price: 0,
    active: true
  };
}

function blankRule(): HouseRule {
  return {
    id: crypto.randomUUID(),
    category: { es: "", en: "" },
    rule: { es: "", en: "" },
    severity: "info",
    active: true
  };
}

function blankLocation(): LocationPoint {
  return {
    id: crypto.randomUUID(),
    kind: "landmark",
    name: { es: "", en: "" },
    detail: { es: "", en: "" },
    minutes: 0,
    mode: "walk",
    active: true
  };
}

const serviceCategoryLabels: Record<Service["category"], string> = {
  included: "Incluido",
  extra: "Extra"
};

const serviceBillingLabels: Record<Service["billingType"], string> = {
  included: "Sin cargo",
  perStay: "Por estancia",
  perNight: "Por noche"
};

export function ContentManager({
  state,
  onSaveService,
  onDeleteService,
  onSaveHouseRule,
  onDeleteHouseRule,
  onSaveLocation,
  onDeleteLocation
}: ContentManagerProps) {
  const [activeEditor, setActiveEditor] = useState<"services" | "rules" | "locations">("services");
  const [serviceDraft, setServiceDraft] = useState<Service>(() => blankService());
  const [ruleDraft, setRuleDraft] = useState<HouseRule>(() => blankRule());
  const [locationDraft, setLocationDraft] = useState<LocationPoint>(() => blankLocation());
  const currency = state.listings[0]?.currency ?? "EUR";
  const editingService = state.services.some((service) => service.id === serviceDraft.id);
  const editingRule = state.houseRules.some((rule) => rule.id === ruleDraft.id);
  const editingLocation = state.locations.some((location) => location.id === locationDraft.id);

  function submitService(event: FormEvent) {
    event.preventDefault();
    const next: Service = {
      ...serviceDraft,
      category: serviceDraft.price > 0 ? serviceDraft.category : "included",
      billingType: serviceDraft.price > 0 ? serviceDraft.billingType : "included"
    };
    onSaveService(next);
    setServiceDraft(blankService());
  }

  function submitRule(event: FormEvent) {
    event.preventDefault();
    onSaveHouseRule(ruleDraft);
    setRuleDraft(blankRule());
  }

  function submitLocation(event: FormEvent) {
    event.preventDefault();
    onSaveLocation(locationDraft);
    setLocationDraft(blankLocation());
  }

  return (
    <section className="view-stack">
      <div className="view-heading">
        <div><p className="eyebrow">Contenido</p><h1>Datos editables importados</h1></div>
      </div>

      <div className="segmented feature-tabs" role="tablist" aria-label="Editar contenido">
        <button className={activeEditor === "services" ? "active" : ""} onClick={() => setActiveEditor("services")} type="button">Servicios</button>
        <button className={activeEditor === "rules" ? "active" : ""} onClick={() => setActiveEditor("rules")} type="button">Normas</button>
        <button className={activeEditor === "locations" ? "active" : ""} onClick={() => setActiveEditor("locations")} type="button">Ubicaciones</button>
      </div>

      {activeEditor === "services" ? (
        <div className="two-column wide-left">
          <article className="panel">
            <div className="panel-title-row">
              <h2>{editingService ? "Editar servicio" : "Nuevo servicio"}</h2>
              {editingService ? <button className="ghost-action" type="button" onClick={() => setServiceDraft(blankService())}><X size={16} /> Cancelar</button> : null}
            </div>
            <form className="form-grid" onSubmit={submitService}>
              <label>Nombre ES<input required value={serviceDraft.name.es} onChange={(event) => setServiceDraft({ ...serviceDraft, name: { ...serviceDraft.name, es: event.target.value } })} /></label>
              <label>Nombre EN<input value={serviceDraft.name.en} onChange={(event) => setServiceDraft({ ...serviceDraft, name: { ...serviceDraft.name, en: event.target.value } })} /></label>
              <label>Categoria
                <select value={serviceDraft.category} onChange={(event) => setServiceDraft({ ...serviceDraft, category: event.target.value as Service["category"] })}>
                  <option value="included">Incluido</option>
                  <option value="extra">Extra</option>
                </select>
              </label>
              <label>Cobro
                <select value={serviceDraft.billingType} onChange={(event) => setServiceDraft({ ...serviceDraft, billingType: event.target.value as Service["billingType"] })}>
                  <option value="included">Incluido</option>
                  <option value="perStay">Por estancia</option>
                  <option value="perNight">Por noche</option>
                </select>
              </label>
              <label>Precio<input min={0} type="number" value={serviceDraft.price} onChange={(event) => setServiceDraft({ ...serviceDraft, price: Number(event.target.value) })} /></label>
              <label>Activo
                <select value={String(serviceDraft.active)} onChange={(event) => setServiceDraft({ ...serviceDraft, active: event.target.value === "true" })}>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </label>
              <label className="full-row">Descripcion ES<textarea value={serviceDraft.description.es} onChange={(event) => setServiceDraft({ ...serviceDraft, description: { ...serviceDraft.description, es: event.target.value } })} /></label>
              <label className="full-row">Descripcion EN<textarea value={serviceDraft.description.en} onChange={(event) => setServiceDraft({ ...serviceDraft, description: { ...serviceDraft.description, en: event.target.value } })} /></label>
              <button className="primary-action full-row" type="submit"><Plus size={16} /> {editingService ? "Actualizar servicio" : "Agregar servicio"}</button>
            </form>
          </article>

          <article className="panel">
            <h2>Servicios</h2>
            <div className="item-list">
              {state.services.map((service) => (
                <div className="list-row" key={service.id}>
                  <span>{service.name.es}</span>
                  <small>{serviceCategoryLabels[service.category]} · {serviceBillingLabels[service.billingType]} · {formatMoney(service.price, currency)}</small>
                  <div className="row-actions">
                    <button className="icon-button" title="Editar servicio" type="button" onClick={() => setServiceDraft(service)}><Edit3 size={16} /></button>
                    <button className="icon-button" title="Eliminar servicio" type="button" onClick={() => onDeleteService(service.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      ) : null}

      {activeEditor === "rules" ? (
        <div className="two-column wide-left">
          <article className="panel">
            <div className="panel-title-row">
              <h2>{editingRule ? "Editar norma" : "Nueva norma"}</h2>
              {editingRule ? <button className="ghost-action" type="button" onClick={() => setRuleDraft(blankRule())}><X size={16} /> Cancelar</button> : null}
            </div>
            <form className="form-grid" onSubmit={submitRule}>
              <label>Categoria ES<input required value={ruleDraft.category.es} onChange={(event) => setRuleDraft({ ...ruleDraft, category: { ...ruleDraft.category, es: event.target.value } })} /></label>
              <label>Categoria EN<input value={ruleDraft.category.en} onChange={(event) => setRuleDraft({ ...ruleDraft, category: { ...ruleDraft.category, en: event.target.value } })} /></label>
              <label>Severidad
                <select value={ruleDraft.severity} onChange={(event) => setRuleDraft({ ...ruleDraft, severity: event.target.value as HouseRule["severity"] })}>
                  <option value="info">Informativa</option>
                  <option value="important">Importante</option>
                </select>
              </label>
              <label>Activo
                <select value={String(ruleDraft.active)} onChange={(event) => setRuleDraft({ ...ruleDraft, active: event.target.value === "true" })}>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </label>
              <label className="full-row">Norma ES<textarea required value={ruleDraft.rule.es} onChange={(event) => setRuleDraft({ ...ruleDraft, rule: { ...ruleDraft.rule, es: event.target.value } })} /></label>
              <label className="full-row">Norma EN<textarea value={ruleDraft.rule.en} onChange={(event) => setRuleDraft({ ...ruleDraft, rule: { ...ruleDraft.rule, en: event.target.value } })} /></label>
              <button className="primary-action full-row" type="submit"><Plus size={16} /> {editingRule ? "Actualizar norma" : "Agregar norma"}</button>
            </form>
          </article>

          <article className="panel">
            <h2>Normas</h2>
            <div className="item-list">
              {state.houseRules.map((rule) => (
                <div className="list-row" key={rule.id}>
                  <span>{rule.rule.es}</span>
                  <small>{rule.category.es} · {rule.severity} · {rule.active ? "activa" : "inactiva"}</small>
                  <div className="row-actions">
                    <button className="icon-button" title="Editar norma" type="button" onClick={() => setRuleDraft(rule)}><Edit3 size={16} /></button>
                    <button className="icon-button" title="Eliminar norma" type="button" onClick={() => onDeleteHouseRule(rule.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      ) : null}

      {activeEditor === "locations" ? (
        <div className="two-column wide-left">
          <article className="panel">
            <div className="panel-title-row">
              <h2>{editingLocation ? "Editar ubicacion" : "Nueva ubicacion"}</h2>
              {editingLocation ? <button className="ghost-action" type="button" onClick={() => setLocationDraft(blankLocation())}><X size={16} /> Cancelar</button> : null}
            </div>
            <form className="form-grid" onSubmit={submitLocation}>
              <label>Nombre ES<input required value={locationDraft.name.es} onChange={(event) => setLocationDraft({ ...locationDraft, name: { ...locationDraft.name, es: event.target.value } })} /></label>
              <label>Nombre EN<input value={locationDraft.name.en} onChange={(event) => setLocationDraft({ ...locationDraft, name: { ...locationDraft.name, en: event.target.value } })} /></label>
              <label>Tipo
                <select value={locationDraft.kind} onChange={(event) => setLocationDraft({ ...locationDraft, kind: event.target.value as LocationPoint["kind"] })}>
                  <option value="transport">Transporte</option>
                  <option value="distance">Distancia</option>
                  <option value="landmark">Lugar</option>
                </select>
              </label>
              <label>Modo
                <select value={locationDraft.mode} onChange={(event) => setLocationDraft({ ...locationDraft, mode: event.target.value as LocationPoint["mode"] })}>
                  <option value="walk">A pie</option>
                  <option value="metro">Metro</option>
                  <option value="tram">Tranvia</option>
                  <option value="bus">Bus</option>
                  <option value="train">Tren</option>
                  <option value="other">Otro</option>
                </select>
              </label>
              <label>Minutos<input min={0} type="number" value={locationDraft.minutes} onChange={(event) => setLocationDraft({ ...locationDraft, minutes: Number(event.target.value) })} /></label>
              <label>Activo
                <select value={String(locationDraft.active)} onChange={(event) => setLocationDraft({ ...locationDraft, active: event.target.value === "true" })}>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </label>
              <label className="full-row">Detalle ES<textarea value={locationDraft.detail.es} onChange={(event) => setLocationDraft({ ...locationDraft, detail: { ...locationDraft.detail, es: event.target.value } })} /></label>
              <label className="full-row">Detalle EN<textarea value={locationDraft.detail.en} onChange={(event) => setLocationDraft({ ...locationDraft, detail: { ...locationDraft.detail, en: event.target.value } })} /></label>
              <button className="primary-action full-row" type="submit"><Plus size={16} /> {editingLocation ? "Actualizar ubicacion" : "Agregar ubicacion"}</button>
            </form>
          </article>

          <article className="panel">
            <h2>Ubicaciones</h2>
            <div className="item-list">
              {state.locations.map((location) => (
                <div className="list-row" key={location.id}>
                  <span>{location.name.es}</span>
                  <small>{location.kind} · {location.minutes} min · {location.mode}</small>
                  <div className="row-actions">
                    <button className="icon-button" title="Editar ubicacion" type="button" onClick={() => setLocationDraft(location)}><Edit3 size={16} /></button>
                    <button className="icon-button" title="Eliminar ubicacion" type="button" onClick={() => onDeleteLocation(location.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      ) : null}
    </section>
  );
}