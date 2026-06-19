import type { AppState, Listing, SiteSetting } from "@habitacion/domain";
import { Edit3, Plus, Trash2, X } from "lucide-react";
import { FormEvent, useState } from "react";

interface SettingsManagerProps {
  state: AppState;
  onSaveListing(listing: Listing): void;
  onDeleteListing(id: string): void;
  onSaveSiteSetting(setting: SiteSetting): void;
  onDeleteSiteSetting(id: string): void;
}

function blankListing(): Listing {
  return {
    id: crypto.randomUUID(),
    name: { es: "", en: "" },
    tagline: { es: "", en: "" },
    description: { es: "", en: "" },
    neighborhood: "",
    city: "Barcelona",
    addressHint: "",
    currency: "EUR",
    baseNightlyRate: 0,
    cleaningFee: 0,
    maxGuests: 1,
    minNights: 1,
    checkOutTime: "11:00",
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
    contactPhone: "",
    languages: ["es", "en"],
    active: true
  };
}

function blankSiteSetting(): SiteSetting {
  return {
    id: crypto.randomUUID(),
    brandName: "Habitacion Poblenou",
    defaultLanguage: "es",
    whatsappTemplate: { es: "", en: "" },
    updatedAt: new Date().toISOString()
  };
}

export function SettingsManager({ state, onSaveListing, onDeleteListing, onSaveSiteSetting, onDeleteSiteSetting }: SettingsManagerProps) {
  const [listingDraft, setListingDraft] = useState<Listing>(() => state.listings[0] ?? blankListing());
  const [settingDraft, setSettingDraft] = useState<SiteSetting>(() => state.siteSettings[0] ?? blankSiteSetting());
  const editingListing = state.listings.some((listing) => listing.id === listingDraft.id);
  const editingSetting = state.siteSettings.some((setting) => setting.id === settingDraft.id);

  function submitListing(event: FormEvent) {
    event.preventDefault();
    onSaveListing(listingDraft);
  }

  function submitSetting(event: FormEvent) {
    event.preventDefault();
    onSaveSiteSetting({ ...settingDraft, updatedAt: new Date().toISOString() });
  }

  return (
    <section className="view-stack">
      <div className="view-heading">
        <div><p className="eyebrow">Ajustes</p><h1>Ficha y configuracion</h1></div>
      </div>

      <div className="two-column wide-left">
        <article className="panel">
          <div className="panel-title-row">
            <h2>{editingListing ? "Ficha del alojamiento" : "Nuevo alojamiento"}</h2>
            {editingListing ? <button className="ghost-action" type="button" onClick={() => setListingDraft(blankListing())}><Plus size={16} /> Nuevo</button> : null}
          </div>
          <form className="form-grid" onSubmit={submitListing}>
            <label>Nombre ES<input required value={listingDraft.name.es} onChange={(event) => setListingDraft({ ...listingDraft, name: { ...listingDraft.name, es: event.target.value } })} /></label>
            <label>Nombre EN<input value={listingDraft.name.en} onChange={(event) => setListingDraft({ ...listingDraft, name: { ...listingDraft.name, en: event.target.value } })} /></label>
            <label>Tagline ES<input value={listingDraft.tagline.es} onChange={(event) => setListingDraft({ ...listingDraft, tagline: { ...listingDraft.tagline, es: event.target.value } })} /></label>
            <label>Tagline EN<input value={listingDraft.tagline.en} onChange={(event) => setListingDraft({ ...listingDraft, tagline: { ...listingDraft.tagline, en: event.target.value } })} /></label>
            <label>Barrio<input value={listingDraft.neighborhood} onChange={(event) => setListingDraft({ ...listingDraft, neighborhood: event.target.value })} /></label>
            <label>Ciudad<input value={listingDraft.city} onChange={(event) => setListingDraft({ ...listingDraft, city: event.target.value })} /></label>
            <label>Referencia direccion<input value={listingDraft.addressHint} onChange={(event) => setListingDraft({ ...listingDraft, addressHint: event.target.value })} /></label>
            <label>Moneda<input value={listingDraft.currency} onChange={(event) => setListingDraft({ ...listingDraft, currency: event.target.value })} /></label>
            <label>Tarifa noche<input min={0} type="number" value={listingDraft.baseNightlyRate} onChange={(event) => setListingDraft({ ...listingDraft, baseNightlyRate: Number(event.target.value) })} /></label>
            <label>Limpieza<input min={0} type="number" value={listingDraft.cleaningFee} onChange={(event) => setListingDraft({ ...listingDraft, cleaningFee: Number(event.target.value) })} /></label>
            <label>Max personas<input min={1} type="number" value={listingDraft.maxGuests} onChange={(event) => setListingDraft({ ...listingDraft, maxGuests: Number(event.target.value) })} /></label>
            <label>Min noches<input min={1} type="number" value={listingDraft.minNights} onChange={(event) => setListingDraft({ ...listingDraft, minNights: Number(event.target.value) })} /></label>
            <label>Check-out<input value={listingDraft.checkOutTime} onChange={(event) => setListingDraft({ ...listingDraft, checkOutTime: event.target.value })} /></label>
            <label>Telefono<input value={listingDraft.contactPhone} onChange={(event) => setListingDraft({ ...listingDraft, contactPhone: event.target.value })} /></label>
            <label>Idiomas<input value={listingDraft.languages.join(", ")} onChange={(event) => setListingDraft({ ...listingDraft, languages: event.target.value.split(",").map((lang) => lang.trim()).filter(Boolean) })} /></label>
            <label>Activo
              <select value={String(listingDraft.active)} onChange={(event) => setListingDraft({ ...listingDraft, active: event.target.value === "true" })}>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </label>
            <label className="full-row">Descripcion ES<textarea value={listingDraft.description.es} onChange={(event) => setListingDraft({ ...listingDraft, description: { ...listingDraft.description, es: event.target.value } })} /></label>
            <label className="full-row">Descripcion EN<textarea value={listingDraft.description.en} onChange={(event) => setListingDraft({ ...listingDraft, description: { ...listingDraft.description, en: event.target.value } })} /></label>
            <button className="primary-action full-row" type="submit">Guardar alojamiento</button>
          </form>
        </article>

        <article className="panel">
          <h2>Alojamientos</h2>
          <div className="item-list">
            {state.listings.map((listing) => (
              <div className="list-row" key={listing.id}>
                <span>{listing.name.es}</span>
                <small>{listing.neighborhood} · {listing.baseNightlyRate} {listing.currency}</small>
                <div className="row-actions">
                  <button className="icon-button" title="Editar alojamiento" type="button" onClick={() => setListingDraft(listing)}><Edit3 size={16} /></button>
                  <button className="icon-button" title="Eliminar alojamiento" type="button" onClick={() => onDeleteListing(listing.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="panel-title-row padded-top">
            <h2>Configuracion de sitio</h2>
            {editingSetting ? <button className="ghost-action" type="button" onClick={() => setSettingDraft(blankSiteSetting())}><X size={16} /> Nueva</button> : null}
          </div>
          <form className="form-grid single-column" onSubmit={submitSetting}>
            <label>Marca<input value={settingDraft.brandName} onChange={(event) => setSettingDraft({ ...settingDraft, brandName: event.target.value })} /></label>
            <label>Idioma
              <select value={settingDraft.defaultLanguage} onChange={(event) => setSettingDraft({ ...settingDraft, defaultLanguage: event.target.value as SiteSetting["defaultLanguage"] })}>
                <option value="es">Espanol</option>
                <option value="en">English</option>
              </select>
            </label>
            <label>WhatsApp ES<textarea value={settingDraft.whatsappTemplate.es} onChange={(event) => setSettingDraft({ ...settingDraft, whatsappTemplate: { ...settingDraft.whatsappTemplate, es: event.target.value } })} /></label>
            <label>WhatsApp EN<textarea value={settingDraft.whatsappTemplate.en} onChange={(event) => setSettingDraft({ ...settingDraft, whatsappTemplate: { ...settingDraft.whatsappTemplate, en: event.target.value } })} /></label>
            <button className="primary-action" type="submit">Guardar configuracion</button>
          </form>
          <div className="item-list">
            {state.siteSettings.map((setting) => (
              <div className="list-row" key={setting.id}>
                <span>{setting.brandName}</span>
                <small>{setting.defaultLanguage} · {setting.updatedAt || "sin fecha"}</small>
                <div className="row-actions">
                  <button className="icon-button" title="Editar configuracion" type="button" onClick={() => setSettingDraft(setting)}><Edit3 size={16} /></button>
                  <button className="icon-button" title="Eliminar configuracion" type="button" onClick={() => onDeleteSiteSetting(setting.id)}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}