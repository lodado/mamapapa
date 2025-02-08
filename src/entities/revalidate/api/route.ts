import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: any) {
  const body = await request.json();
  const { tagName } = body;

  // 캐시 무효화
  revalidateTag(tagName);

  return NextResponse.json({ revalidated: true });
}
