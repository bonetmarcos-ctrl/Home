import {
  appStateSchema,
  collectionSchemas,
  createInitialState,
  findBookingConflicts,
  isCollectionName,
  type AppState,
  type Booking,
  type CollectionName
} from "@habitacion/domain";
import { randomUUID } from "node:crypto";
import { AppError } from "./AppError.js";
import type { StateRepository } from "./repositories.js";

type Entity = { id: string };

export class AppStateService {
  constructor(private readonly repository: StateRepository) {}

  async getState(ownerId?: string): Promise<AppState> {
    return appStateSchema.parse(await this.repository.read(ownerId));
  }

  async replaceState(input: unknown, ownerId?: string): Promise<AppState> {
    const state = appStateSchema.parse(input);
    this.assertStateRules(state);
    await this.repository.write(state, ownerId);
    return state;
  }

  async reset(ownerId?: string): Promise<AppState> {
    const state = createInitialState();
    await this.repository.write(state, ownerId);
    return state;
  }

  async list(collection: string | undefined, ownerId?: string): Promise<unknown[]> {
    const collectionName = this.assertCollection(collection);
    const state = await this.getState(ownerId);
    return state[collectionName];
  }

  async create(collection: string | undefined, input: unknown, ownerId?: string): Promise<unknown> {
    const collectionName = this.assertCollection(collection);
    const state = await this.getState(ownerId);
    const item = this.parseCollectionItem(collectionName, this.withGeneratedId(input));
    const items = state[collectionName] as Entity[];

    if (items.some((existing) => existing.id === item.id)) {
      throw new AppError(409, "Item id already exists", "ITEM_EXISTS");
    }

    const nextState = {
      ...state,
      [collectionName]: [...items, item]
    } as AppState;
    this.assertStateRules(nextState);
    await this.repository.write(nextState, ownerId);
    return item;
  }

  async update(collection: string | undefined, id: string | undefined, input: unknown, ownerId?: string): Promise<unknown> {
    const collectionName = this.assertCollection(collection);
    if (!id) {
      throw new AppError(404, "Item not found", "ITEM_NOT_FOUND");
    }

    const state = await this.getState(ownerId);
    const items = state[collectionName] as Entity[];
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new AppError(404, "Item not found", "ITEM_NOT_FOUND");
    }

    const current = items[index]!;
    const item = this.parseCollectionItem(collectionName, {
      ...current,
      ...(typeof input === "object" && input !== null ? input : {}),
      id
    });
    const nextItems = [...items];
    nextItems[index] = item;

    const nextState = {
      ...state,
      [collectionName]: nextItems
    } as AppState;
    this.assertStateRules(nextState);
    await this.repository.write(nextState, ownerId);
    return item;
  }

  async delete(collection: string | undefined, id: string | undefined, ownerId?: string): Promise<void> {
    const collectionName = this.assertCollection(collection);
    if (!id) {
      throw new AppError(404, "Item not found", "ITEM_NOT_FOUND");
    }

    const state = await this.getState(ownerId);
    const items = state[collectionName] as Entity[];
    const nextItems = items.filter((item) => item.id !== id);

    if (nextItems.length === items.length) {
      throw new AppError(404, "Item not found", "ITEM_NOT_FOUND");
    }

    const nextState = {
      ...state,
      [collectionName]: nextItems
    } as AppState;
    this.assertStateRules(nextState);
    await this.repository.write(nextState, ownerId);
  }

  private assertCollection(collection: string | undefined): CollectionName {
    if (!collection || !isCollectionName(collection)) {
      throw new AppError(404, "Unknown collection", "UNKNOWN_COLLECTION");
    }

    return collection;
  }

  private withGeneratedId(input: unknown): unknown {
    if (typeof input !== "object" || input === null) {
      return input;
    }

    return {
      id: randomUUID(),
      ...input
    };
  }

  private parseCollectionItem(collectionName: CollectionName, input: unknown): Entity {
    return collectionSchemas[collectionName].parse(input) as Entity;
  }

  private assertStateRules(state: AppState): void {
    const listing = state.listings[0];
    const bookingIds = new Set<string>();
    const availabilityDates = new Set<string>();

    for (const day of state.availabilityDays) {
      if (availabilityDates.has(day.date)) {
        throw new AppError(409, `Duplicated availability date ${day.date}`, "DUPLICATED_AVAILABILITY_DATE");
      }
      availabilityDates.add(day.date);
    }

    for (const booking of state.bookings) {
      if (bookingIds.has(booking.id)) {
        throw new AppError(409, "Duplicated booking id", "DUPLICATED_BOOKING_ID");
      }
      bookingIds.add(booking.id);

      if (booking.endDate <= booking.startDate) {
        throw new AppError(422, "Booking endDate must be after startDate", "INVALID_BOOKING_DATES");
      }

      if (listing && booking.guests > listing.maxGuests) {
        throw new AppError(422, "Booking exceeds listing max guests", "MAX_GUESTS_EXCEEDED");
      }

      const conflicts = findBookingConflicts(state.bookings as Booking[], booking);
      if (conflicts.length > 0) {
        throw new AppError(409, "Booking overlaps another active booking", "BOOKING_CONFLICT");
      }
    }
  }
}