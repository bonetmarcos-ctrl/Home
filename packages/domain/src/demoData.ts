import { appStateSchema, type AppState, type AvailabilityStatus } from "./schemas.js";

export const BASE = {
  listingId: "room-poblenou",
  currency: "EUR",
  defaultNightlyRate: 68,
  cleaningFee: 22,
  todayFixture: "2026-06-18"
} as const;

function availabilityRange(
  month: string,
  days: number[],
  status: AvailabilityStatus,
  nightlyRate = 0
) {
  return days.map((day) => {
    const date = `${month}-${String(day).padStart(2, "0")}`;
    return {
      id: date,
      date,
      status,
      nightlyRate,
      note: ""
    };
  });
}

function text(es: string, en = es) {
  return { es, en };
}

export function createInitialState(): AppState {
  const state: AppState = {
    listings: [
      {
        id: BASE.listingId,
        name: text("Habitacion en Poblenou", "Room in Poblenou"),
        tagline: text("Alquiler por dias cerca de Ciutadella", "Daily rental near Ciutadella"),
        description: text(
          "Habitacion acogedora en piso familiar tranquilo, con estetica nordica-natural, balcon con vistas verdes y acceso a los servicios del hogar.",
          "Cosy room in a quiet family flat with a natural Nordic feel, green balcony views and access to home amenities."
        ),
        neighborhood: "Poblenou",
        city: "Barcelona",
        addressHint: "Sardenya y Llull",
        currency: BASE.currency,
        baseNightlyRate: BASE.defaultNightlyRate,
        cleaningFee: BASE.cleaningFee,
        maxGuests: 2,
        minNights: 1,
        checkOutTime: "11:00",
        quietHoursStart: "22:00",
        quietHoursEnd: "08:00",
        contactPhone: "+34 664 158 678",
        languages: ["es", "en", "it"],
        active: true
      }
    ],
    availabilityDays: [
      ...availabilityRange("2026-05", [12, 13, 14, 15, 16, 17], "available"),
      ...availabilityRange("2026-05", [18, 19, 20, 21, 22, 23, 24], "booked"),
      ...availabilityRange("2026-05", [25, 26, 27, 28, 29], "available"),
      ...availabilityRange("2026-05", [30, 31], "blocked"),
      ...availabilityRange("2026-06", [1, 2, 3, 4, 5, 6, 7], "available"),
      ...availabilityRange("2026-06", [8, 9, 10, 11, 12, 13, 14], "booked"),
      ...availabilityRange("2026-06", [15, 16, 17, 18, 19, 20, 21], "available", 72),
      ...availabilityRange("2026-06", [22, 23, 24, 25, 26], "blocked"),
      ...availabilityRange("2026-06", [27, 28, 29, 30], "available", 74)
    ],
    bookings: [
      {
        id: "booking-may-family",
        guestName: "Reserva mayo",
        guestEmail: "",
        guestPhone: "",
        startDate: "2026-05-18",
        endDate: "2026-05-25",
        guests: 1,
        status: "completed",
        source: "direct",
        nightlyRate: 68,
        cleaningFee: 22,
        serviceIds: [],
        notes: "Bloque historico migrado del calendario HTML.",
        createdAt: "2026-05-01T09:00:00.000Z"
      },
      {
        id: "booking-june-confirmed",
        guestName: "Reserva junio",
        guestEmail: "",
        guestPhone: "",
        startDate: "2026-06-08",
        endDate: "2026-06-15",
        guests: 1,
        status: "confirmed",
        source: "whatsapp",
        nightlyRate: 70,
        cleaningFee: 22,
        serviceIds: ["airport-pickup"],
        notes: "Bloque activo migrado del calendario HTML.",
        createdAt: "2026-06-01T12:00:00.000Z"
      }
    ],
    inquiries: [
      {
        id: "inquiry-demo",
        guestName: "Consulta demo",
        guestEmail: "guest@example.com",
        guestPhone: "",
        startDate: "2026-06-27",
        endDate: "2026-06-30",
        guests: 1,
        message: "Me interesa confirmar disponibilidad para una estancia corta.",
        status: "new",
        createdAt: "2026-06-18T09:00:00.000Z"
      }
    ],
    services: [
      {
        id: "wifi",
        name: text("WiFi", "WiFi"),
        description: text("Alta velocidad", "High speed"),
        category: "included",
        billingType: "included",
        price: 0,
        active: true
      },
      {
        id: "linen",
        name: text("Ropa de cama y toallas", "Bed linen and towels"),
        description: text("Incluido en la estancia", "Included in the stay"),
        category: "included",
        billingType: "included",
        price: 0,
        active: true
      },
      {
        id: "coffee-tea",
        name: text("Cafe y te", "Coffee and tea"),
        description: text("Gratuito", "Complimentary"),
        category: "included",
        billingType: "included",
        price: 0,
        active: true
      },
      {
        id: "kitchen",
        name: text("Cocina compartida", "Shared kitchen"),
        description: text("Acceso completo", "Full access"),
        category: "included",
        billingType: "included",
        price: 0,
        active: true
      },
      {
        id: "balcony",
        name: text("Balcon", "Balcony"),
        description: text("Vistas verdes", "Green views"),
        category: "included",
        billingType: "included",
        price: 0,
        active: true
      },
      {
        id: "climate",
        name: text("Clima", "Climate"),
        description: text("Ventilador y calefaccion", "Fan and heating"),
        category: "included",
        billingType: "included",
        price: 0,
        active: true
      },
      {
        id: "elevator",
        name: text("Ascensor", "Elevator"),
        description: text("Acceso facil", "Easy access"),
        category: "included",
        billingType: "included",
        price: 0,
        active: true
      },
      {
        id: "safe-area",
        name: text("Zona segura", "Safe area"),
        description: text("Barrio tranquilo", "Quiet neighbourhood"),
        category: "included",
        billingType: "included",
        price: 0,
        active: true
      },
      {
        id: "airport-pickup",
        name: text("Recogida en aeropuerto", "Airport pickup"),
        description: text("Te recogemos y llevamos comodamente al piso", "We pick you up and bring you comfortably to the flat"),
        category: "extra",
        billingType: "perStay",
        price: 35,
        active: true
      },
      {
        id: "car-rental-help",
        name: text("Gestion de alquiler de coche", "Car rental help"),
        description: text("Ayuda para organizar un vehiculo", "Help arranging a vehicle"),
        category: "extra",
        billingType: "perStay",
        price: 15,
        active: true
      },
      {
        id: "laundry",
        name: text("Lavanderia", "Laundry"),
        description: text("Lavado y secado bajo pedido", "Wash and dry on request"),
        category: "extra",
        billingType: "perStay",
        price: 10,
        active: true
      }
    ],
    houseRules: [
      {
        id: "quiet-hours",
        category: text("Normas generales", "General rules"),
        rule: text("Silencio de 22:00 a 08:00", "Quiet hours from 22:00 to 08:00"),
        severity: "important",
        active: true
      },
      {
        id: "no-parties",
        category: text("Normas generales", "General rules"),
        rule: text("No se permiten fiestas ni eventos", "No parties or events"),
        severity: "important",
        active: true
      },
      {
        id: "no-smoking",
        category: text("Normas generales", "General rules"),
        rule: text("Prohibido fumar en el interior", "No smoking inside"),
        severity: "important",
        active: true
      },
      {
        id: "shoes-off",
        category: text("Normas generales", "General rules"),
        rule: text("Quitarse los zapatos al entrar; hay pantuflas disponibles", "Remove shoes when entering; slippers are available"),
        severity: "info",
        active: true
      },
      {
        id: "clean-common-areas",
        category: text("Normas generales", "General rules"),
        rule: text("Mantener limpias las zonas comunes", "Keep common areas clean"),
        severity: "info",
        active: true
      },
      {
        id: "respect-neighbours",
        category: text("Normas generales", "General rules"),
        rule: text("Respeto hacia los vecinos y la comunidad", "Respect neighbours and the community"),
        severity: "important",
        active: true
      },
      {
        id: "visits-authorization",
        category: text("Visitas", "Visitors"),
        rule: text("No se permiten visitas sin autorizacion previa", "No visitors without prior authorization"),
        severity: "important",
        active: true
      },
      {
        id: "registered-guests-only",
        category: text("Visitas", "Visitors"),
        rule: text("Solo pueden alojarse las personas registradas en la reserva", "Only guests listed in the booking may stay"),
        severity: "important",
        active: true
      },
      {
        id: "dishes",
        category: text("Limpieza y cuidado", "Cleaning and care"),
        rule: text("Lavar platos y utensilios tras usarlos", "Wash dishes and utensils after use"),
        severity: "info",
        active: true
      },
      {
        id: "furniture-care",
        category: text("Limpieza y cuidado", "Cleaning and care"),
        rule: text("Cuidar el mobiliario y los objetos del apartamento", "Take care of furniture and apartment items"),
        severity: "info",
        active: true
      },
      {
        id: "checkout",
        category: text("Check-in / Check-out", "Check-in / Check-out"),
        rule: text("Check-out antes de las 11:00 salvo acuerdo previo", "Check-out before 11:00 unless agreed otherwise"),
        severity: "info",
        active: true
      },
      {
        id: "key-loss",
        category: text("Check-in / Check-out", "Check-in / Check-out"),
        rule: text("La perdida de llaves puede implicar coste de reposicion", "Lost keys may involve replacement cost"),
        severity: "important",
        active: true
      },
      {
        id: "no-pets",
        category: text("Mascotas", "Pets"),
        rule: text("No se permiten mascotas", "No pets allowed"),
        severity: "important",
        active: true
      },
      {
        id: "switch-off",
        category: text("Informacion adicional", "Additional info"),
        rule: text("Apagar luces, AC y calefaccion al salir", "Turn off lights, AC and heating when leaving"),
        severity: "info",
        active: true
      }
    ],
    locations: [
      {
        id: "metro-l4",
        kind: "transport",
        name: text("Metro L4", "Metro L4"),
        detail: text("Llacuna, Bogatell y Poblenou", "Llacuna, Bogatell and Poblenou"),
        minutes: 8,
        mode: "metro",
        active: true
      },
      {
        id: "metro-l1",
        kind: "transport",
        name: text("Metro L1", "Metro L1"),
        detail: text("Glories y Marina", "Glories and Marina"),
        minutes: 12,
        mode: "metro",
        active: true
      },
      {
        id: "tram-wellington",
        kind: "transport",
        name: text("Tranvia T4, T5 y T6", "Tram T4, T5 and T6"),
        detail: text("Parada Wellington a metros del piso", "Wellington stop steps from the flat"),
        minutes: 4,
        mode: "tram",
        active: true
      },
      {
        id: "bus-lines",
        kind: "transport",
        name: text("Bus diurno y nocturno", "Day and night buses"),
        detail: text("Por Sardenya, Pujades y Marina", "Along Sardenya, Pujades and Marina"),
        minutes: 3,
        mode: "bus",
        active: true
      },
      {
        id: "rodalies",
        kind: "transport",
        name: text("Rodalies", "Regional Rail"),
        detail: text("Clot-Arago y Arc de Triomf", "Clot-Arago and Arc de Triomf"),
        minutes: 16,
        mode: "train",
        active: true
      },
      {
        id: "ciutadella",
        kind: "distance",
        name: text("Parc de la Ciutadella", "Parc de la Ciutadella"),
        detail: text("10 min a pie", "10 min walk"),
        minutes: 10,
        mode: "walk",
        active: true
      },
      {
        id: "bogatell",
        kind: "distance",
        name: text("Playa de Bogatell", "Bogatell Beach"),
        detail: text("15 min a pie", "15 min walk"),
        minutes: 15,
        mode: "walk",
        active: true
      },
      {
        id: "nova-icaria",
        kind: "distance",
        name: text("Playa Nova Icaria", "Nova Icaria Beach"),
        detail: text("18 min a pie", "18 min walk"),
        minutes: 18,
        mode: "walk",
        active: true
      },
      {
        id: "sagrada-familia",
        kind: "landmark",
        name: text("Sagrada Familia", "Sagrada Familia"),
        detail: text("15 min en metro", "15 min by metro"),
        minutes: 15,
        mode: "metro",
        active: true
      },
      {
        id: "placa-catalunya",
        kind: "landmark",
        name: text("Placa Catalunya", "Placa Catalunya"),
        detail: text("20 min en metro", "20 min by metro"),
        minutes: 20,
        mode: "metro",
        active: true
      },
      {
        id: "born-gotic",
        kind: "landmark",
        name: text("El Born y Barrio Gotico", "El Born and Gothic Quarter"),
        detail: text("25 min a pie", "25 min walk"),
        minutes: 25,
        mode: "walk",
        active: true
      },
      {
        id: "torre-glories",
        kind: "landmark",
        name: text("Torre Glories", "Torre Glories"),
        detail: text("10 min a pie", "10 min walk"),
        minutes: 10,
        mode: "walk",
        active: true
      },
      {
        id: "sants",
        kind: "landmark",
        name: text("Estacion de Sants", "Barcelona Sants Station"),
        detail: text("25 min en metro", "25 min by metro"),
        minutes: 25,
        mode: "metro",
        active: true
      },
      {
        id: "airport",
        kind: "landmark",
        name: text("Aeropuerto de Barcelona", "Barcelona Airport"),
        detail: text("60 min en transporte publico", "60 min by public transport"),
        minutes: 60,
        mode: "other",
        active: true
      }
    ],
    siteSettings: [
      {
        id: "main",
        brandName: "Habitacion Poblenou",
        defaultLanguage: "es",
        whatsappTemplate: text(
          "Hola, me interesa reservar la habitacion en Poblenou.",
          "Hi, I am interested in booking the room in Poblenou."
        ),
        updatedAt: "2026-06-18T00:00:00.000Z"
      }
    ]
  };

  return appStateSchema.parse(state);
}