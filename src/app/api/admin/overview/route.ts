import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const totalVotes = await sql`SELECT SUM(vote_count_cache) AS total FROM candidates`;
    const syncRows = await sql`SELECT last_synced_block, last_sync_at FROM sync_state LIMIT 1`;
    const lastSyncBlock = syncRows.length > 0 ? Number(syncRows[0].last_synced_block) : 0;
    const lastSyncAt = syncRows.length > 0 ? new Date(syncRows[0].last_sync_at).toISOString() : null;

    return NextResponse.json({
      totalVotes: Number(totalVotes[0]?.total ?? 0),
      lastSyncBlock,
      lastSyncAt,
    });
  } catch (error) {
    console.error("GET /api/admin/overview error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin overview" },
      { status: 500 }
    );
  }
}
