import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // Fast edge runtime

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
      { next: { revalidate: 60 } }
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch price" },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json({ usd: data.ethereum.usd ?? null });
  } catch (e) {
    return NextResponse.json({ error: "Network error" }, { status: 500 });
  }
}
