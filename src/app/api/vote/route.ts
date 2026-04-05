import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export type VoteRequest = {
  voterAddress: string;
  candidateIndex: number;
  txHash: string;
  blockNumber: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VoteRequest;
    const { voterAddress, candidateIndex, txHash, blockNumber } = body;

    if (!voterAddress || candidateIndex == null || !txHash || !blockNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Record the vote
    await sql`
      INSERT INTO vote_records (voter_address, candidate_index, tx_hash, block_number)
      VALUES (${voterAddress}, ${candidateIndex}, ${txHash}, ${blockNumber})
      ON CONFLICT (tx_hash) DO NOTHING
    `;

    // Increment cached vote count
    await sql`
      UPDATE candidates
      SET vote_count_cache = vote_count_cache + 1
      WHERE chain_index = ${candidateIndex}
    `;

    console.log(`Vote recorded: ${voterAddress} -> candidate ${candidateIndex} (${txHash})`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/vote error:", error);
    return NextResponse.json({ error: "Failed to record vote" }, { status: 500 });
  }
}
