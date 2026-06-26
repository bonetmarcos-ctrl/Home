import { createInitialState } from "@habitacion/domain";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { JsonStateRepository } from "./JsonStateRepository.js";

describe("JsonStateRepository", () => {
  it("starts missing owners from initial state instead of default owner state", async () => {
    const filePath = join(await mkdtemp(join(tmpdir(), "habitacion-state-")), "state.json");
    const repository = new JsonStateRepository(filePath);
    const defaultState = await repository.read();
    await repository.write({ ...defaultState, inquiries: [] });

    const ownerState = await repository.read("new-owner");
    expect(ownerState.inquiries).toEqual(createInitialState().inquiries);

    const stored = JSON.parse(await readFile(filePath, "utf8")) as { owners: Record<string, unknown> };
    expect(stored.owners["new-owner"]).toBeDefined();
  });
});