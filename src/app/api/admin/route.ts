import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { secret } = await req.json();
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret) {
    return NextResponse.json(
      { error: "Admin not configured" },
      { status: 500 }
    );
  }

  if (secret !== adminSecret) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  // Set admin cookie (httpOnly, 30 days)
  const response = NextResponse.json({ success: true });
  response.cookies.set("turing-admin", adminSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    path: "/",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("turing-admin");
  return response;
}
