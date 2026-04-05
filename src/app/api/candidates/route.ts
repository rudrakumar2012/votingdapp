import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { CONTRACT_ADDRESS, VOTING_ABI } from "@/lib/abi";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

const CACHE_MAX_AGE_SECONDS = 30;

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.SEPOLIA_RPC_URL),
});

export async function GET() {
  try {
    // Check cache staleness
    const syncRows = await sql`SELECT last_sync_at FROM sync_state LIMIT 1`;
    let isStale = true;

    if (syncRows.length > 0) {
      const lastSync = new Date(syncRows[0].last_sync_at);
      const ageMs = Date.now() - lastSync.getTime();
      isStale = ageMs > CACHE_MAX_AGE_SECONDS * 1000;
    }

    let candidates = [];

    // Always try DB first
    const dbRows = await sql`SELECT name, vote_count_cache FROM candidates ORDER BY chain_index`;

    candidates = (dbRows as { name: string; vote_count_cache: number }[]).map((r) => ({
      name: r.name,
      voteCount: Number(r.vote_count_cache),
    }));

    // If stale or empty, refetch from chain
    if (isStale || candidates.length === 0) {
      try {
        const chainCandidates = await publicClient.readContract({
          address: CONTRACT_ADDRESS as `0x${string}`,
          abi: VOTING_ABI,
          functionName: "getAllVotesOfCandiates",
        });

        candidates = (chainCandidates as { name: string; voteCount: bigint }[]).map(
          (c) => ({
            name: c.name,
            voteCount: Number(c.voteCount),
          })
        );

        // Update DB cache
        for (let i = 0; i < candidates.length; i++) {
          await sql`
            UPDATE candidates
            SET vote_count_cache = ${candidates[i].voteCount}
            WHERE name = ${candidates[i].name}
          `;
        }

        await sql`
          INSERT INTO sync_state (id, last_synced_block, last_sync_at)
          VALUES (1, 0, NOW())
          ON CONFLICT (id) DO UPDATE SET last_sync_at = NOW(), last_synced_block = EXCLUDED.last_synced_block
        `;
      } catch {
        // Chain fetch failed — return cached data anyway
      }
    }

    return NextResponse.json({ candidates, stale: isStale });
  } catch (error) {
    console.error("GET /api/candidates error:", error);
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 });
  }
}
