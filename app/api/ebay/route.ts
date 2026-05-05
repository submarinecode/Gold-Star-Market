import { NextRequest, NextResponse } from "next/server";
import {
  EbayApiError,
  EbayConfigError,
  isEbayConfigured,
  searchActiveListings,
} from "@/lib/ebay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q")?.trim();
  const limit = Number(searchParams.get("limit") ?? "12");
  const sort = (searchParams.get("sort") ?? undefined) as
    | "price"
    | "-price"
    | "newlyListed"
    | "endingSoonest"
    | undefined;

  if (!q) {
    return NextResponse.json(
      { error: "Missing required `q` query parameter." },
      { status: 400 },
    );
  }

  if (!isEbayConfigured()) {
    return NextResponse.json(
      {
        configured: false,
        listings: [],
        message:
          "eBay API not configured. Set EBAY_CLIENT_ID and EBAY_CLIENT_SECRET in .env.local.",
      },
      { status: 200 },
    );
  }

  try {
    const listings = await searchActiveListings({
      query: q,
      limit: Math.min(Math.max(limit, 1), 50),
      sort,
      categoryIds: ["183454"],
    });
    return NextResponse.json(
      { configured: true, listings },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    );
  } catch (err) {
    if (err instanceof EbayConfigError) {
      return NextResponse.json(
        { configured: false, listings: [], error: err.message },
        { status: 200 },
      );
    }
    if (err instanceof EbayApiError) {
      return NextResponse.json(
        { configured: true, listings: [], error: err.message },
        { status: err.status >= 400 && err.status < 600 ? err.status : 502 },
      );
    }
    return NextResponse.json(
      {
        configured: true,
        listings: [],
        error: err instanceof Error ? err.message : "Unknown eBay error.",
      },
      { status: 500 },
    );
  }
}
