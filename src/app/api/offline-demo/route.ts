import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as { id?: string; message?: string; createdAt?: number };

  console.log("Offline demo API received", body);

  return NextResponse.json({
    ok: true,
    receivedAt: new Date().toISOString(),
    echo: body,
  });
}
