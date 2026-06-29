import { createInitialState } from "@habitacion/domain";
import {
  ArrowRight,
  BedDouble,
  Bus,
  CalendarDays,
  Car,
  Check,
  Clock,
  Coffee,
  CookingPot,
  Home,
  KeyRound,
  Languages,
  Laptop,
  MapPin,
  MessageCircle,
  Moon,
  Plane,
  ShieldCheck,
  Train,
  Utensils,
  WashingMachine,
  Waves,
  Wifi,
  Wind
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

type Language = "es" | "en";
type Copy = Record<Language, string>;

interface GalleryImage {
  src: string;
  alt: Copy;
  label: Copy;
  layout?: "wide" | "tall";
}

interface RuleGroup {
  icon: LucideIcon;
  title: Copy;
  items: Copy[];
}

interface QuickLink {
  href: string;
  icon: LucideIcon;
  label: Copy;
  detail: Copy;
}

const appState = createInitialState();
const listing = (appState.listings.find((candidate) => candidate.active) ?? appState.listings[0])!;
const siteSetting = (appState.siteSettings.find((candidate) => candidate.id === "main") ?? appState.siteSettings[0])!;

if (!listing || !siteSetting) {
  throw new Error("Missing public listing data");
}

const galleryImages: GalleryImage[] = [
  {
    src: "/images/room-01.jpg",
    alt: {
      es: "Balcón con mesa y vistas a árboles en Poblenou",
      en: "Balcony with table and leafy views in Poblenou"
    },
    label: { es: "Balcón con vistas verdes", en: "Balcony with green views" },
    layout: "tall"
  },
  {
    src: "/images/room-04.jpg",
    alt: {
      es: "Habitación privada con cama individual y escritorio",
      en: "Private room with single bed and desk"
    },
    label: { es: "Habitación privada", en: "Private room" }
  },
  {
    src: "/images/room-03.jpg",
    alt: {
      es: "Salón luminoso con sofá y salida al balcón",
      en: "Bright living room with sofa and balcony access"
    },
    label: { es: "Salón compartido", en: "Shared living room" },
    layout: "wide"
  },
  {
    src: "/images/room-05.jpg",
    alt: {
      es: "Detalle de escritorio y cama en la habitación",
      en: "Desk and bed detail in the room"
    },
    label: { es: "Escritorio para trabajar", en: "Desk for work" }
  },
  {
    src: "/images/room-07.jpg",
    alt: {
      es: "Cama preparada con estanterias y plantas",
      en: "Prepared bed with shelves and plants"
    },
    label: { es: "Descanso tranquilo", en: "Calm rest" }
  }
];

const serviceIcons: Record<string, LucideIcon> = {
  wifi: Wifi,
  linen: BedDouble,
  "coffee-tea": Coffee,
  kitchen: CookingPot,
  balcony: Home,
  climate: Wind,
  elevator: ArrowRight,
  "safe-area": ShieldCheck,
  "airport-pickup": Plane,
  "car-rental-help": Car,
  laundry: WashingMachine
};

const locationIcons: Record<string, LucideIcon> = {
  metro: Train,
  tram: Train,
  bus: Bus,
  train: Train,
  walk: Waves,
  other: Plane
};

const ruleGroups: RuleGroup[] = [
  {
    icon: Moon,
    title: { es: "Descanso", en: "Rest" },
    items: [
      { es: "Silencio de 22:00 a 08:00", en: "Quiet hours from 22:00 to 08:00" },
      { es: "No se permiten fiestas ni eventos", en: "No parties or events" },
      { es: "Respeto hacia vecinos y comunidad", en: "Respect for neighbours and the building" }
    ]
  },
  {
    icon: ShieldCheck,
    title: { es: "Convivencia", en: "Shared Living" },
    items: [
      { es: "No fumar en el interior", en: "No smoking inside" },
      { es: "No visitas sin autorización previa", en: "No visitors without prior authorization" },
      { es: "Solo huéspedes registrados", en: "Registered guests only" }
    ]
  },
  {
    icon: Utensils,
    title: { es: "Cuidado", en: "Care" },
    items: [
      { es: "Mantener limpias las zonas comunes", en: "Keep shared areas clean" },
      { es: "Lavar platos y utensilios tras usarlos", en: "Wash dishes and utensils after use" },
      { es: "Cuidar mobiliario y objetos del piso", en: "Take care of furniture and apartment items" }
    ]
  },
  {
    icon: KeyRound,
    title: { es: "Llegada", en: "Arrival" },
    items: [
      { es: "Check-out antes de las 11:00", en: "Check-out before 11:00" },
      { es: "Check-in flexible según disponibilidad", en: "Flexible check-in subject to availability" },
      { es: "La pérdida de llaves puede tener coste", en: "Lost keys may involve a replacement cost" }
    ]
  }
];

function formatMoney(amount: number, currency: string) {
  return currency === "EUR" ? `${amount} \u20ac` : `${amount} ${currency}`;
}

const coupleNightlyPrice = formatMoney(listing.baseNightlyRate, listing.currency);

const statItems = [
  {
    icon: CalendarDays,
    value: coupleNightlyPrice,
    label: { es: "parejas / noche", en: "couples / night" }
  },
  {
    icon: BedDouble,
    value: `${listing.maxGuests} max.`,
    label: { es: "huéspedes", en: "guests" }
  },
  {
    icon: Clock,
    value: `${listing.minNights}+`,
    label: { es: "noche mínima", en: "minimum night" }
  },
  {
    icon: Languages,
    value: listing.languages.map((language) => language.toUpperCase()).join(" / "),
    label: { es: "idiomas", en: "languages" }
  }
];

const quickLinks: QuickLink[] = [
  {
    href: "#galeria",
    icon: Home,
    label: { es: "Fotos reales", en: "Real photos" },
    detail: { es: "balcón, habitación y zonas comunes", en: "balcony, room and shared spaces" }
  },
  {
    href: "#estancia",
    icon: BedDouble,
    label: { es: "La estancia", en: "The stay" },
    detail: { es: "descanso, escritorio y ambiente de hogar", en: "rest, desk and a homely feel" }
  },
  {
    href: "#servicios",
    icon: Check,
    label: { es: "Servicios", en: "Services" },
    detail: { es: "incluidos y extras bajo pedido", en: "included and optional extras" }
  },
  {
    href: "#contacto",
    icon: MessageCircle,
    label: { es: "Reserva directa", en: "Direct booking" },
    detail: { es: "fechas y precio individual por WhatsApp", en: "dates and solo rate by WhatsApp" }
  }
];

function localized(copy: Copy, language: Language) {
  return copy[language];
}

function localizedText(copy: { es: string; en: string }, language: Language) {
  return copy[language];
}

export function App() {
  const defaultLanguage: Language = siteSetting.defaultLanguage === "en" ? "en" : "es";
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const includedServices = appState.services.filter((service) => service.active && service.category === "included").slice(0, 8);
  const extraServices = appState.services.filter((service) => service.active && service.category === "extra");
  const transportLocations = appState.locations.filter((location) => location.active && location.kind === "transport").slice(0, 4);
  const nearbyLocations = appState.locations.filter((location) => location.active && location.kind !== "transport").slice(0, 8);
  const whatsappNumber = listing.contactPhone.replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(localizedText(siteSetting.whatsappTemplate, language))}`;

  return (
    <div className="site-shell">
      <header className="site-header" aria-label={language === "es" ? "Navegacion principal" : "Main navigation"}>
        <a className="brand" href="#inicio" aria-label={siteSetting.brandName}>
          <span className="brand-mark">HP</span>
          <span>
            <strong>{siteSetting.brandName}</strong>
            <small>{listing.neighborhood}, {listing.city}</small>
          </span>
        </a>
        <nav className="nav-links">
          <a href="#galeria">{language === "es" ? "Fotos" : "Photos"}</a>
          <a href="#estancia">{language === "es" ? "Estancia" : "Stay"}</a>
          <a href="#servicios">{language === "es" ? "Servicios" : "Services"}</a>
          <a href="#ubicacion">{language === "es" ? "Ubicación" : "Location"}</a>
          <a href="#contacto">{language === "es" ? "Contacto" : "Contact"}</a>
        </nav>
        <div className="header-actions">
          <div className="language-toggle" aria-label={language === "es" ? "Cambiar idioma" : "Change language"}>
            <button className={language === "es" ? "active" : ""} type="button" aria-pressed={language === "es"} onClick={() => setLanguage("es")}>ES</button>
            <button className={language === "en" ? "active" : ""} type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
          </div>
          <a className="header-cta" href={whatsappHref} target="_blank" rel="noreferrer">
            <MessageCircle aria-hidden="true" size={18} />
            WhatsApp
          </a>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <p className="eyebrow">{language === "es" ? "Alquiler por días · Poblenou" : "Daily rental · Poblenou"}</p>
            <h1>
              {language === "es" ? <>Tu <em>refugio</em> en Barcelona</> : <>Your <em>calm base</em> in Barcelona</>}
            </h1>
            <div className="hero-note">
              <MapPin aria-hidden="true" size={18} />
              <span>{language === "es" ? `${listing.neighborhood} · a metros del Parque de la Ciutadella` : `${listing.neighborhood} · steps from Parc de la Ciutadella`}</span>
            </div>
            <p className="hero-lede">{localizedText(listing.description, language)}</p>
            <div className="hero-actions">
              <a className="primary-action" href={whatsappHref} target="_blank" rel="noreferrer">
                <MessageCircle aria-hidden="true" size={20} />
                {language === "es" ? "Reservar por WhatsApp" : "Book on WhatsApp"}
              </a>
              <a className="secondary-action" href="#galeria">
                {language === "es" ? "Ver fotos" : "View photos"}
                <ArrowRight aria-hidden="true" size={18} />
              </a>
            </div>
          </div>
          <div className="hero-media" aria-label={language === "es" ? "Fotos destacadas del piso" : "Featured apartment photos"}>
            <img className="hero-image-main" src="/images/room-01.jpg" alt={language === "es" ? "Balcón con vistas verdes" : "Balcony with green views"} />
            <img className="hero-image-overlap" src="/images/room-05.jpg" alt={language === "es" ? "Habitación privada con escritorio" : "Private room with desk"} />
            <div className="price-badge">
              <span>{language === "es" ? "Parejas" : "Couples"}</span>
              <strong>{coupleNightlyPrice}</strong>
              <small>{language === "es" ? "individual: consultar" : "solo: ask us"}</small>
            </div>
          </div>
        </section>

        <section className="quick-nav" aria-label={language === "es" ? "Accesos de la pagina" : "Page shortcuts"}>
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a href={link.href} key={link.href}>
                <Icon aria-hidden="true" size={20} />
                <span>
                  <strong>{localized(link.label, language)}</strong>
                  <small>{localized(link.detail, language)}</small>
                </span>
              </a>
            );
          })}
        </section>

        <section className="stats-strip" aria-label={language === "es" ? "Datos destacados" : "Highlights"}>
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <article className="stat-item" key={item.value}>
                <Icon aria-hidden="true" size={22} />
                <strong>{item.value}</strong>
                <span>{localized(item.label, language)}</span>
              </article>
            );
          })}
        </section>

        <section className="section gallery-section" id="galeria">
          <div className="section-heading">
            <p className="eyebrow">{language === "es" ? "Fotos reales" : "Real photos"}</p>
            <h2>{language === "es" ? "Un piso luminoso para sentirse cerca de casa" : "A bright flat that feels close to home"}</h2>
          </div>
          <div className="gallery-grid">
            {galleryImages.map((image) => (
              <figure className={`gallery-card ${image.layout ?? ""}`} key={image.src}>
                <img src={image.src} alt={localized(image.alt, language)} loading="lazy" />
                <figcaption>{localized(image.label, language)}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="section intro-section" id="estancia">
          <div className="intro-media">
            <img src="/images/room-05.jpg" alt={language === "es" ? "Habitación privada con escritorio" : "Private room with desk"} loading="lazy" />
          </div>
          <div className="intro-copy">
            <p className="eyebrow">{language === "es" ? "La estancia" : "The stay"}</p>
            <h2>{language === "es" ? "Habitación privada con escritorio y ambiente de hogar" : "Private room with a desk and a lived-in home feel"}</h2>
            <p>
              {language === "es"
                ? "Ideal para visitar Barcelona unos días, trabajar en remoto o descansar cerca del mar y del centro. La habitación está en un piso familiar cuidado, con salón, cocina y balcón compartidos."
                : "Ideal for visiting Barcelona for a few days, working remotely or resting close to the sea and the city centre. The room is in a well-kept family flat with a shared living room, kitchen and balcony."}
            </p>
            <div className="soft-list">
              <span><Laptop aria-hidden="true" size={18} />{language === "es" ? "Escritorio para trabajar" : "Desk for remote work"}</span>
              <span><Waves aria-hidden="true" size={18} />{language === "es" ? "Playa a 15 minutos" : "Beach 15 minutes away"}</span>
              <span><Train aria-hidden="true" size={18} />{language === "es" ? "Metro, tranvía y bus cerca" : "Metro, tram and bus nearby"}</span>
            </div>
          </div>
        </section>

        <section className="section services-section" id="servicios">
          <div className="section-heading compact">
            <p className="eyebrow">{language === "es" ? "Servicios" : "Services"}</p>
            <h2>{language === "es" ? "Lo esencial incluido y extras si los necesitas" : "Essentials included, extras when needed"}</h2>
          </div>
          <div className="service-layout">
            <div className="service-panel included-panel">
              <div className="panel-heading">
                <Check aria-hidden="true" size={22} />
                <h3>{language === "es" ? "Incluido" : "Included"}</h3>
              </div>
              <div className="amenity-grid">
                {includedServices.map((service) => {
                  const Icon = serviceIcons[service.id] ?? Check;
                  return (
                    <article className="amenity-card" key={service.id}>
                      <Icon aria-hidden="true" size={22} />
                      <strong>{localizedText(service.name, language)}</strong>
                      <span>{localizedText(service.description, language)}</span>
                    </article>
                  );
                })}
              </div>
            </div>
            <div className="service-panel extras-panel">
              <div className="panel-heading">
                <ArrowRight aria-hidden="true" size={22} />
                <h3>{language === "es" ? "Extras bajo pedido" : "Extras on request"}</h3>
              </div>
              <p className="panel-note">
                {language === "es" ? "Disponibles si los necesitas. Te confirmamos los detalles por WhatsApp." : "Available if needed. We confirm the details on WhatsApp."}
              </p>
              <div className="extra-list">
                {extraServices.map((service) => {
                  const Icon = serviceIcons[service.id] ?? Check;
                  return (
                    <article className="extra-card" key={service.id}>
                      <Icon aria-hidden="true" size={23} />
                      <div>
                        <strong>{localizedText(service.name, language)}</strong>
                        <span>{localizedText(service.description, language)}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="section location-section" id="ubicacion">
          <div className="location-copy">
            <p className="eyebrow">{language === "es" ? "Ubicación" : "Location"}</p>
            <h2>{language === "es" ? "Poblenou: playa, ciudad y transporte a mano" : "Poblenou: beach, city and transport close by"}</h2>
            <p>
              {language === "es"
                ? "La zona de Sardenya y Llull permite moverse fácil por Barcelona: Ciutadella, Bogatell, Glòries y el centro quedan muy cerca."
                : "The Sardenya and Llull area makes Barcelona easy to explore: Ciutadella, Bogatell, Glories and the city centre are close by."}
            </p>
            <div className="transport-grid">
              {transportLocations.map((location) => {
                const Icon = locationIcons[location.mode] ?? MapPin;
                return (
                  <article className="transport-card" key={location.id}>
                    <Icon aria-hidden="true" size={22} />
                    <div>
                      <strong>{localizedText(location.name, language)}</strong>
                      <span>{localizedText(location.detail, language)}</span>
                    </div>
                    <small>{location.minutes} min</small>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="nearby-panel">
            <h3>{language === "es" ? "Cerca de casa" : "Nearby"}</h3>
            <div className="nearby-list">
              {nearbyLocations.map((location) => (
                <article key={location.id}>
                  <span>{localizedText(location.name, language)}</span>
                  <strong>{localizedText(location.detail, language)}</strong>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section rules-section">
          <div className="section-heading compact">
            <p className="eyebrow">{language === "es" ? "Convivencia" : "House rules"}</p>
            <h2>{language === "es" ? "Un ambiente tranquilo para descansar" : "A calm place to rest"}</h2>
          </div>
          <div className="rules-grid">
            {ruleGroups.map((group) => {
              const Icon = group.icon;
              return (
                <article className="rule-card" key={group.title.es}>
                  <Icon aria-hidden="true" size={24} />
                  <h3>{localized(group.title, language)}</h3>
                  <ul>
                    {group.items.map((item) => <li key={item.es}>{localized(item, language)}</li>)}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        <section className="contact-section" id="contacto">
          <div>
            <p className="eyebrow">{language === "es" ? "Reserva directa" : "Direct booking"}</p>
            <h2>{language === "es" ? "Cuéntanos tus fechas y te confirmamos disponibilidad" : "Send your dates and we will confirm availability"}</h2>
            <p>
              {language === "es"
                ? "Te responderemos por WhatsApp con disponibilidad, precio final y cualquier detalle que necesites antes de reservar."
                : "We will reply on WhatsApp with availability, final price and any details you need before booking."}
            </p>
          </div>
          <div className="contact-card">
            <strong>{coupleNightlyPrice}</strong>
            <span>{language === "es" ? "por noche para parejas" : "per night for couples"}</span>
            <small>{language === "es" ? "Precio individual: consultar" : "Solo traveller rate: ask us"}</small>
            <a className="primary-action" href={whatsappHref} target="_blank" rel="noreferrer">
              <MessageCircle aria-hidden="true" size={20} />
              {language === "es" ? "Enviar WhatsApp" : "Send WhatsApp"}
            </a>
            <small>{listing.contactPhone}</small>
          </div>
        </section>
      </main>
    </div>
  );
}