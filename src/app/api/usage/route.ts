import { NextResponse } from "next/server";
import { peekRateLimit, getClientIP, isAdmin } from "@/lib/rate-limit";

// 20 messages per day per IP
const RATE_LIMIT = { maxRequests: 20, windowMs: 24 * 60 * 60 * 1000 };

export async function GET(req: Request) {
  if (isAdmin(req)) {
    return NextResponse.json({
      used: 0,
      max: RATE_LIMIT.maxRequests,
      remaining: RATE_LIMIT.maxRequests,
      percentage: 0,
      isAdmin: true,
      resetAt: 0,
    });
  }

  const ip = getClientIP(req);
  const { used, max, resetAt } = peekRateLimit(`chat:${ip}`, RATE_LIMIT);
  const remaining = max - used;
  const percentage = Math.round((used / max) * 100);

  return NextResponse.json({
    used,
    max,
    remaining,
    percentage,
    isAdmin: false,
    resetAt,
  });
}
