import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../../app.js";
import type { AuthConfig } from "../../application/AuthService.js";
import { MemoryStateRepository } from "../../infrastructure/MemoryStateRepository.js";
import { MemoryUserRepository } from "../../infrastructure/MemoryUserRepository.js";

function makeApp(options: { nodeEnv?: AuthConfig["nodeEnv"]; webDistPath?: string } = {}) {
  const authConfig: AuthConfig = {
    username: "admin",
    password: "admin",
    passwordHash: "",
    jwtSecret: "test-secret",
    cookieName: "app_session",
    ttlSeconds: 604800,
    secureCookie: false,
    corsOrigin: "http://localhost:5173",
    nodeEnv: options.nodeEnv ?? "test"
  };

  return createApp({
    repository: new MemoryStateRepository(),
    userRepository: new MemoryUserRepository(),
    authConfig,
    webDistPath: options.webDistPath
  });
}

async function login(agent: request.SuperAgentTest) {
  await agent.post("/api/auth/register").send({ username: "tester", password: "secret" }).expect(201);
}

describe("API HTTP", () => {
  it("serves health", async () => {
    await request(makeApp()).get("/api/health").expect(200, { ok: true });
  });

  it("serves the built web app in production", async () => {
    const webDistPath = mkdtempSync(join(tmpdir(), "habitacion-web-dist-"));
    writeFileSync(join(webDistPath, "index.html"), '<!doctype html><div id="root"></div>');

    const app = makeApp({ nodeEnv: "production", webDistPath });

    const root = await request(app).get("/").expect(200);
    expect(root.text).toContain('id="root"');

    const nestedRoute = await request(app).get("/reservas").expect(200);
    expect(nestedRoute.text).toContain('id="root"');
  });

  it("handles auth login, me and logout", async () => {
    const agent = request.agent(makeApp());
    await agent.post("/api/auth/login").send({ username: "admin", password: "wrong" }).expect(401);
    await agent.post("/api/auth/register").send({ username: "auth-user", password: "secret" }).expect(201);

    const me = await agent.get("/api/auth/me").expect(200);
    expect(me.body.user.username).toBe("auth-user");

    await agent.post("/api/auth/logout").expect(200);
    await agent.get("/api/auth/me").expect(401);
  });

  it("protects state routes", async () => {
    await request(makeApp()).get("/api/state").expect(401);
  });

  it("keeps state isolated by registered user", async () => {
    const app = makeApp();
    const alice = request.agent(app);
    const bob = request.agent(app);
    await alice.post("/api/auth/register").send({ username: "alice", password: "secret" }).expect(201);
    await bob.post("/api/auth/register").send({ username: "bob", password: "secret" }).expect(201);

    const aliceState = await alice.get("/api/state").expect(200);
    aliceState.body.inquiries = [];
    await alice.put("/api/state").send(aliceState.body).expect(200);

    const bobState = await bob.get("/api/state").expect(200);
    expect(bobState.body.inquiries.length).toBeGreaterThan(0);
  });

  it("supports collection CRUD and validation errors", async () => {
    const agent = request.agent(makeApp());
    await login(agent);

    const created = await agent
      .post("/api/services")
      .send({
        name: { es: "Desayuno", en: "Breakfast" },
        description: { es: "Pedido previo", en: "On request" },
        category: "extra",
        billingType: "perStay",
        price: "12",
        active: true
      })
      .expect(201);

    expect(created.body.price).toBe(12);

    const updated = await agent.put(`/api/services/${created.body.id}`).send({ price: 14 }).expect(200);
    expect(updated.body.price).toBe(14);

    await agent.delete(`/api/services/${created.body.id}`).expect(204);
    await agent.delete(`/api/services/${created.body.id}`).expect(404);
    await agent.get("/api/notACollection").expect(404);

    await agent
      .post("/api/bookings")
      .send({ guestName: "Bad", startDate: "2026-06-30", endDate: "2026-06-27" })
      .expect(422);
  });
});