import bcrypt from "bcryptjs";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { AppError } from "./AppError.js";
import type { UserRecord, UserRepository } from "./repositories.js";

export interface AuthConfig {
  username: string;
  password: string;
  passwordHash: string;
  jwtSecret: string;
  cookieName: string;
  ttlSeconds: number;
  secureCookie: boolean;
  corsOrigin: string;
  nodeEnv: string;
}

export interface AuthSession {
  ownerId: string;
  username: string;
}

function timingSafeStringEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    const maxLength = Math.max(leftBuffer.length, rightBuffer.length, 1);
    timingSafeEqual(Buffer.alloc(maxLength), Buffer.alloc(maxLength));
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export class AuthService {
  constructor(
    private readonly config: AuthConfig,
    private readonly userRepository?: UserRepository
  ) {}

  async login(username: string, password: string): Promise<AuthSession> {
    const normalizedUsername = username.trim();
    const user = await this.userRepository?.findByUsername(normalizedUsername);

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      return { ownerId: user.id, username: user.username };
    }

    if (await this.verifyFallbackUser(normalizedUsername, password)) {
      return { ownerId: `env:${this.config.username}`, username: this.config.username };
    }

    throw new AppError(401, "Invalid username or password", "INVALID_CREDENTIALS");
  }

  async register(username: string, password: string): Promise<AuthSession> {
    const normalizedUsername = username.trim();
    if (!this.userRepository) {
      throw new AppError(400, "Registration is not enabled", "REGISTER_DISABLED");
    }

    if (normalizedUsername.length < 3 || password.length < 6) {
      throw new AppError(422, "Username or password is too short", "WEAK_CREDENTIALS");
    }

    const existing = await this.userRepository.findByUsername(normalizedUsername);
    if (existing) {
      throw new AppError(409, "Username already exists", "USER_EXISTS");
    }

    const user: UserRecord = {
      id: randomUUID(),
      username: normalizedUsername,
      passwordHash: await bcrypt.hash(password, 12),
      createdAt: new Date().toISOString()
    };
    const created = await this.userRepository.create(user);
    return { ownerId: created.id, username: created.username };
  }

  private async verifyFallbackUser(username: string, password: string): Promise<boolean> {
    if (!this.config.username || !timingSafeStringEqual(username, this.config.username)) {
      return false;
    }

    if (this.config.passwordHash) {
      return bcrypt.compare(password, this.config.passwordHash);
    }

    if (this.config.nodeEnv === "production") {
      return false;
    }

    return timingSafeStringEqual(password, this.config.password);
  }
}