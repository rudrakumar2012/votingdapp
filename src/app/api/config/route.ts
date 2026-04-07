import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json(
      { error: "DATABASE_URL not configured" },
      { status: 500 }
    );
  }

  const sql = neon(databaseUrl);

  try {
    const rows = await sql`
      SELECT contract_address, owner_address, candidate_names, duration_minutes
      FROM active_contract
      WHERE id = 1
      LIMIT 1
    `;

    if (rows.length > 0) {
      return NextResponse.json({
        contractAddress: rows[0].contract_address as string,
        owner: (rows[0].owner_address ?? null) as string | null,
        candidates: rows[0].candidate_names as string[],
        durationMinutes: rows[0].duration_minutes as number,
      });
    }

    // Fallback to env var if no DB row
    const envAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? null;
    if (!envAddress) {
      return NextResponse.json(
        { error: "No active contract found in DB or env" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      contractAddress: envAddress,
      owner: null,
      candidates: [],
      durationMinutes: 60,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Failed to fetch config", details: String(err) },
      { status: 500 }
    );
  }
}
