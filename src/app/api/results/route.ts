import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { CONTRACT_ADDRESS, VOTING_ABI } from "@/lib/abi";
import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.SEPOLIA_RPC_URL),
});

export async function GET() {
  try {
    const rows = await sql`SELECT name, vote_count_cache FROM candidates ORDER BY chain_index`;

    const candidates = (rows as { name: string; vote_count_cache: number }[]).map((r) => ({
      name: r.name,
      voteCount: Number(r.vote_count_cache),
    }));

    const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

    let winner: { name: string; voteCount: number } | null = null;
    let maxVotes = 0;

    for (const c of candidates) {
      if (c.voteCount > maxVotes) {
        maxVotes = c.voteCount;
        winner = { name: c.name, voteCount: c.voteCount };
      }
    }

    // Percentages
    const results = candidates.map((c) => ({
      name: c.name,
      voteCount: c.voteCount,
      percentage: totalVotes > 0 ? ((c.voteCount / totalVotes) * 100).toFixed(1) : "0.0",
    }));

    return NextResponse.json({
      candidates: results,
      totalVotes,
      winner: winner ?? null,
      final: false,
    });
  } catch (error) {
    console.error("GET /api/results error:", error);
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}
