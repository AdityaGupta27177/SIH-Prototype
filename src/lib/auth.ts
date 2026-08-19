import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dtvn-prototype-jwt-secret-change-me"
);

const COOKIE_NAME = "dtvn-session";

export interface SessionPayload extends JWTPayload {
  userId: string;
  phone: string;
  role: "tenant" | "landowner" | "official";
  name: string;
  kycVerified: boolean;
}

export async function signJwt(payload: Omit<SessionPayload, keyof JWTPayload>): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifyJwt(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyJwt(token);
}

export function getSessionCookieName(): string {
  return COOKIE_NAME;
}
