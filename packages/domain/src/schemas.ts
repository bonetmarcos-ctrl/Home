import { z } from "zod";

export const idSchema = z.union([z.string().min(1), z.number()]).transform(String);
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");
export const monthSchema = z
  .string()
  .regex(/^\d{4}-\d{2}$/, "Expected YYYY-MM");

export const bilingualTextSchema = z
  .object({
    es: z.string().optional().default(""),
    en: z.string().optional().default("")
  })
  .default({ es: "", en: "" });

const moneySchema = z.coerce.number().finite().nonnegative().default(0);
const optionalText = z.string().optional().default("");

export const listingSchema = z.object({
  id: idSchema,
  name: bilingualTextSchema,
  tagline: bilingualTextSchema,
  description: bilingualTextSchema,
  neighborhood: z.string().optional().default("Poblenou"),
  city: z.string().optional().default("Barcelona"),
  addressHint: z.string().optional().default(""),
  currency: z.string().optional().default("EUR"),
  baseNightlyRate: moneySchema,
  cleaningFee: moneySchema,
  maxGuests: z.coerce.number().int().positive().default(1),
  minNights: z.coerce.number().int().positive().default(1),
  checkOutTime: z.string().optional().default("11:00"),
  quietHoursStart: z.string().optional().default("22:00"),
  quietHoursEnd: z.string().optional().default("08:00"),
  contactPhone: z.string().optional().default(""),
  languages: z.array(z.string()).default(["es", "en"]),
  active: z.coerce.boolean().default(true)
});

export const availabilityStatusSchema = z.enum(["available", "booked", "blocked"]);

export const availabilityDaySchema = z.object({
  id: idSchema,
  date: dateSchema,
  status: availabilityStatusSchema.default("available"),
  nightlyRate: moneySchema,
  note: optionalText
});

export const bookingStatusSchema = z.enum([
  "pending",
  "confirmed",
  "cancelled",
  "completed"
]);

export const bookingSchema = z.object({
  id: idSchema,
  guestName: z.string().min(1),
  guestEmail: z.string().email().optional().or(z.literal("")).default(""),
  guestPhone: optionalText,
  startDate: dateSchema,
  endDate: dateSchema,
  guests: z.coerce.number().int().positive().default(1),
  status: bookingStatusSchema.default("pending"),
  source: z.enum(["direct", "whatsapp", "airbnb", "other"]).default("direct"),
  nightlyRate: moneySchema,
  cleaningFee: moneySchema,
  serviceIds: z.array(z.string()).default([]),
  notes: optionalText,
  createdAt: z.string().optional().default("")
});

export const inquirySchema = z.object({
  id: idSchema,
  guestName: z.string().min(1),
  guestEmail: z.string().email().optional().or(z.literal("")).default(""),
  guestPhone: optionalText,
  startDate: dateSchema.optional().or(z.literal("")).default(""),
  endDate: dateSchema.optional().or(z.literal("")).default(""),
  guests: z.coerce.number().int().positive().default(1),
  message: optionalText,
  status: z.enum(["new", "contacted", "converted", "archived"]).default("new"),
  createdAt: z.string().optional().default("")
});

export const serviceSchema = z.object({
  id: idSchema,
  name: bilingualTextSchema,
  description: bilingualTextSchema,
  category: z.enum(["included", "extra"]).default("included"),
  billingType: z.enum(["included", "perStay", "perNight"]).default("included"),
  price: moneySchema,
  active: z.coerce.boolean().default(true)
});

export const houseRuleSchema = z.object({
  id: idSchema,
  category: bilingualTextSchema,
  rule: bilingualTextSchema,
  severity: z.enum(["info", "important"]).default("info"),
  active: z.coerce.boolean().default(true)
});

export const locationSchema = z.object({
  id: idSchema,
  kind: z.enum(["transport", "distance", "landmark"]).default("landmark"),
  name: bilingualTextSchema,
  detail: bilingualTextSchema,
  minutes: z.coerce.number().int().nonnegative().default(0),
  mode: z.enum(["walk", "metro", "tram", "bus", "train", "other"]).default("other"),
  active: z.coerce.boolean().default(true)
});

export const siteSettingSchema = z.object({
  id: idSchema,
  brandName: z.string().optional().default("Habitacion Poblenou"),
  defaultLanguage: z.enum(["es", "en"]).default("es"),
  whatsappTemplate: bilingualTextSchema,
  updatedAt: z.string().optional().default("")
});

export const collectionSchemas = {
  listings: listingSchema,
  availabilityDays: availabilityDaySchema,
  bookings: bookingSchema,
  inquiries: inquirySchema,
  services: serviceSchema,
  houseRules: houseRuleSchema,
  locations: locationSchema,
  siteSettings: siteSettingSchema
} as const;

export const collectionNames = Object.keys(collectionSchemas) as Array<
  keyof typeof collectionSchemas
>;

export const appStateSchema = z.object({
  listings: z.array(listingSchema).default([]),
  availabilityDays: z.array(availabilityDaySchema).default([]),
  bookings: z.array(bookingSchema).default([]),
  inquiries: z.array(inquirySchema).default([]),
  services: z.array(serviceSchema).default([]),
  houseRules: z.array(houseRuleSchema).default([]),
  locations: z.array(locationSchema).default([]),
  siteSettings: z.array(siteSettingSchema).default([])
});

export type Listing = z.infer<typeof listingSchema>;
export type AvailabilityDay = z.infer<typeof availabilityDaySchema>;
export type AvailabilityStatus = z.infer<typeof availabilityStatusSchema>;
export type Booking = z.infer<typeof bookingSchema>;
export type BookingStatus = z.infer<typeof bookingStatusSchema>;
export type Inquiry = z.infer<typeof inquirySchema>;
export type Service = z.infer<typeof serviceSchema>;
export type HouseRule = z.infer<typeof houseRuleSchema>;
export type LocationPoint = z.infer<typeof locationSchema>;
export type SiteSetting = z.infer<typeof siteSettingSchema>;
export type AppState = z.infer<typeof appStateSchema>;
export type CollectionName = keyof typeof collectionSchemas;

export function isCollectionName(value: string): value is CollectionName {
  return collectionNames.includes(value as CollectionName);
}

export function parseAppState(input: unknown): AppState {
  return appStateSchema.parse(input);
}