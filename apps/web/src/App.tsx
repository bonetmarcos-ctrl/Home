import { createInitialState } from "@habitacion/domain";
import {
  ArrowRight,
  Bath,
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
    src: "/images/room-double.jpg",
    alt: {
      es: "Habitación preparada con cama doble y escritorio",
      en: "Room arranged with a double bed and desk"
    },
    label: { es: "Cama simple o doble", en: "Single or double bed" },
    layout: "wide"
  },
  {
    src: "/images/room-04.jpg",
    alt: {
      es: "Salón compartido con sofá y salida al balcón",
      en: "Shared living room with sofa and balcony access"
    },
    label: { es: "Salón compartido", en: "Shared living room" }
  },
  {
    src: "/images/room-03.jpg",
    alt: {
      es: "Comedor y zona de estar compartidos",
      en: "Shared dining and sitting area"
    },
    label: { es: "Comedor compartido", en: "Shared dining area" },
    layout: "wide"
  },
  {
    src: "/images/room-05.jpg",
    alt: {
      es: "Detalle de escritorio y cama en la habitación",
      en: "Desk and bed detail in the room"
    },
    label: { es: "Habitación con escritorio", en: "Room with desk" }
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

const statItems = [
  {
    icon: CalendarDays,
    value: { es: "Consultar", en: "Ask us" },
    label: { es: "disponibilidad", en: "availability" }
  },
  {
    icon: BedDouble,
    value: { es: `${listing.maxGuests} max.`, en: `${listing.maxGuests} max.` },
    label: { es: "huéspedes", en: "guests" }
  },
  {
    icon: Clock,
    value: { es: `${listing.minNights}+`, en: `${listing.minNights}+` },
    label: { es: "noche mínima", en: "minimum night" }
  },
  {
    icon: Languages,
    value: { es: listing.languages.map((language) => language.toUpperCase()).join(" / "), en: listing.languages.map((language) => language.toUpperCase()).join(" / ") },
    label: { es: "idiomas", en: "languages" }
  }
];

const quickLinks: QuickLink[] = [
  {
    href: "#galeria",
    icon: Home,
    label: { es: "Fotos", en: "Photos" },
    detail: { es: "balcón, habitación y zonas comunes", en: "balcony, room and shared spaces" }
  },
  {
    href: "#estancia",
    icon: BedDouble,
    label: { es: "La estancia", en: "The stay" },
    detail: { es: "cama simple o doble y escritorio", en: "single or double bed and desk" }
  },
  {
    href: "#anfitriones",
    icon: ShieldCheck,
    label: { es: "Anfitriones", en: "Hosts" },
    detail: { es: "Marcos y Sofi te reciben", en: "Marcos and Sofi welcome you" }
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
    detail: { es: "fechas y disponibilidad por WhatsApp", en: "dates and availability on WhatsApp" }
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
          <a href="#anfitriones">{language === "es" ? "Anfitriones" : "Hosts"}</a>
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
              <article className="stat-item" key={item.label.es}>
                <Icon aria-hidden="true" size={22} />
                <strong>{localized(item.value, language)}</strong>
                <span>{localized(item.label, language)}</span>
              </article>
            );
          })}
        </section>

        <section className="section gallery-section" id="galeria">
          <div className="section-heading">
            <p className="eyebrow">{language === "es" ? "Fotos" : "Photos"}</p>
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
            <img src="/images/room-double.jpg" alt={language === "es" ? "Habitación preparada con cama doble" : "Room prepared with a double bed"} loading="lazy" />
          </div>
          <div className="intro-copy">
            <p className="eyebrow">{language === "es" ? "La estancia" : "The stay"}</p>
            <h2>{language === "es" ? <>Habitación privada con cama <em>simple o doble</em></> : <>Private room with a <em>single or double bed</em></>}</h2>
            <p>
              {language === "es"
                ? "Ideal para visitar Barcelona unos días, descansar cerca del mar y moverse fácil por el centro. La habitación puede prepararse con cama simple o doble según la estancia, dentro de un piso familiar cuidado con salón, cocina, baño y balcón compartidos."
                : "Ideal for visiting Barcelona for a few days, resting close to the sea and moving easily around the city centre. The room can be prepared with a single or double bed depending on the stay, inside a well-kept family flat with a shared living room, kitchen, bathroom and balcony."}
            </p>
            <div className="soft-list">
              <span><Laptop aria-hidden="true" size={18} />{language === "es" ? "Escritorio para trabajar" : "Desk for remote work"}</span>
              <span><BedDouble aria-hidden="true" size={18} />{language === "es" ? "Cama simple o doble" : "Single or double bed"}</span>
              <span><Bath aria-hidden="true" size={18} />{language === "es" ? "Baño compartido" : "Shared bathroom"}</span>
              <span><Waves aria-hidden="true" size={18} />{language === "es" ? "Playa a 15 minutos" : "Beach 15 minutes away"}</span>
              <span><Train aria-hidden="true" size={18} />{language === "es" ? "Metro, tranvía y bus cerca" : "Metro, tram and bus nearby"}</span>
            </div>
          </div>
        </section>

        <section className="section hosts-section" id="anfitriones">
          <div className="hosts-copy">
            <p className="eyebrow">{language === "es" ? "Tus anfitriones" : "Your hosts"}</p>
            <h2>{language === "es" ? <>Hola, somos <em>Marcos y Sofi</em></> : <>Hi, we are <em>Marcos and Sofi</em></>}</h2>
            <p>
              {language === "es"
                ? "Nos encanta conocer gente de diferentes partes del mundo. Queremos que quienes se alojan en casa se sientan cómodos, relajados y bien acompañados durante su estancia."
                : "We love meeting people from different parts of the world. We want guests at home to feel comfortable, relaxed and well looked after during their stay."}
            </p>
            <p>
              {language === "es"
                ? "Mantenemos un ambiente tranquilo, limpio y respetuoso, ideal tanto para descansar como para trabajar o disfrutar de la ciudad. También podemos ayudarte con recomendaciones locales de transporte, restaurantes, playas y rincones para descubrir."
                : "We keep a calm, clean and respectful atmosphere, ideal for resting, working or enjoying the city. We can also share local recommendations for transport, restaurants, beaches and places to discover."}
            </p>
            <div className="host-signature">{language === "es" ? "Esperamos darte la bienvenida pronto." : "We hope to welcome you soon."}</div>
          </div>
          <figure className="hosts-photo">
            <img src="/images/hosts.jpg" alt={language === "es" ? "Los anfitriones en un paisaje de viñedos" : "The hosts in a vineyard landscape"} loading="lazy" />
          </figure>
        </section>

        <section className="section services-section" id="servicios">
          <div className="section-heading compact">
            <p className="eyebrow">{language === "es" ? "Servicios" : "Services"}</p>
            <h2>{language === "es" ? <>Incluido y <em>servicios extra</em></> : <>Included and <em>optional extras</em></>}</h2>
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
            <h2>{language === "es" ? <>Conectado con <em>toda Barcelona</em></> : <>Connected to <em>all of Barcelona</em></>}</h2>
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
              {nearbyLocations.map((location) => {
                const locationDetail = localizedText(location.detail, language);
                return (
                  <article key={location.id}>
                    <span>{localizedText(location.name, language)}</span>
                    {locationDetail ? <strong>{locationDetail}</strong> : null}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section rules-section">
          <div className="section-heading compact">
            <p className="eyebrow">{language === "es" ? "Convivencia" : "House rules"}</p>
            <h2>{language === "es" ? <>Para una estancia <em>agradable</em></> : <>For a <em>pleasant</em> stay</>}</h2>
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
                ? "Te responderemos por WhatsApp con disponibilidad y cualquier detalle que necesites antes de reservar."
                : "We will reply on WhatsApp with availability and any details you need before booking."}
            </p>
          </div>
          <div className="contact-card">
            <strong>{language === "es" ? "Consultar" : "Ask us"}</strong>
            <span>{language === "es" ? "disponibilidad y condiciones" : "availability and details"}</span>
            <small>{language === "es" ? "Te respondemos por WhatsApp" : "We reply on WhatsApp"}</small>
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