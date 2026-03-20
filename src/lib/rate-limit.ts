// In-memory rate limiter (resets on cold starts, but good enough for basic protection)
// For production, upgrade to Upstash Redis: https://upstash.com/

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key);
  }
}

interface RateLimitConfig {
  maxRequests: number; // max requests per window
  windowMs: number; // window size in milliseconds
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanup();

  const now = Date.now();
  const entry = store.get(key);

  // No entry or expired — allow and create new window
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: now + config.windowMs,
    };
  }

  // Within window — check count
  if (entry.count < config.maxRequests) {
    entry.count++;
    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetAt: entry.resetAt,
    };
  }

  // Rate limited
  return {
    allowed: false,
    remaining: 0,
    resetAt: entry.resetAt,
  };
}

export function peekRateLimit(
  key: string,
  config: RateLimitConfig
): { used: number; max: number; resetAt: number } {
  cleanup();
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    return { used: 0, max: config.maxRequests, resetAt: 0 };
  }

  return {
    used: entry.count,
    max: config.maxRequests,
    resetAt: entry.resetAt,
  };
}

export function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export function isAdmin(req: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;

  // Check Authorization header
  const auth = req.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  // Check cookie
  const cookies = req.headers.get("cookie") || "";
  const match = cookies.match(/turing-admin=([^;]+)/);
  if (match && match[1] === secret) return true;

  return false;
}
