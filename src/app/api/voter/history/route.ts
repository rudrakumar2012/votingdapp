import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json({ error: "Missing address parameter" }, { status: 400 });
    }

    const rows = await sql`
      SELECT vr.voter_address, vr.candidate_index, vr.tx_hash,
             vr.block_number, vr.voted_at, c.name AS candidate_name
      FROM vote_records vr
      LEFT JOIN candidates c ON vr.candidate_index = c.chain_index
      WHERE vr.voter_address = ${address}
      ORDER BY vr.voted_at DESC
    `;

    const records = (rows as {
      voter_address: string;
      candidate_index: number;
      tx_hash: string;
      block_number: number;
      voted_at: string;
      candidate_name: string | null;
    }[]).map((r) => ({
      voterAddress: r.voter_address,
      candidateIndex: r.candidate_index,
      candidateName: r.candidate_name ?? `Candidate #${r.candidate_index}`,
      txHash: r.tx_hash,
      blockNumber: Number(r.block_number),
      votedAt: r.voted_at,
    }));

    return NextResponse.json({ records });
  } catch (error) {
    console.error("GET /api/voter/history error:", error);
    return NextResponse.json({ error: "Failed to fetch voting history" }, { status: 500 });
  }
}
