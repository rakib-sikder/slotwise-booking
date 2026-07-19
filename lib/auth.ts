import crypto from "crypto";

export const SESSION_COOKIE = "slotwise_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

// Demo-scoped defaults so the deployed preview is usable without configuring env vars
// first — both are printed on the login screen. Set real values via env vars for any
// non-demo use.
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || "demo1234";
const SESSION_SECRET = process.env.SESSION_SECRET || "slotwise-demo-secret-change-me";

export function checkPassword(password: string): boolean {
  const a = Buffer.from(password);
  const b = Buffer.from(OWNER_PASSWORD);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function getDemoPassword(): string {
  return OWNER_PASSWORD;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
}

export function createSessionToken(): string {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  return Date.now() < Number(payload);
}
