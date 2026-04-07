import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { CONTRACT_ADDRESS, VOTING_ABI } from "@/lib/abi";
import { createPublicClient, http, parseAbiItem } from "viem";
import { sepolia } from "viem/chains";

const VOTE_CAST_EVENT = parseAbiItem(
  "event VoteCast(address indexed voter, uint256 indexed candidateIndex, string candidateName)"
);

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.SEPOLIA_RPC_URL),
});

export async function GET() {
  try {
    const syncRows = await sql`SELECT last_synced_block, last_sync_at FROM sync_state LIMIT 1`;
    if (syncRows.length === 0) {
      return NextResponse.json({ lastSyncedBlock: 0, lastSyncAt: null, syncedInLastRun: 0 });
    }
    return NextResponse.json({
      lastSyncedBlock: Number(syncRows[0].last_synced_block),
      lastSyncAt: syncRows[0].last_sync_at,
    });
  } catch (error) {
    console.error("GET /api/sync error:", error);
    return NextResponse.json({ error: "Failed to fetch sync state" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = request ? null : null; // consume
  } catch {}

  try {
    const syncRows = await sql`SELECT last_synced_block FROM sync_state LIMIT 1`;
    const lastSyncedBlock = syncRows.length > 0 ? Number(syncRows[0].last_synced_block) : 0;

    const currentBlock = Number(await publicClient.getBlockNumber());

    if (currentBlock <= lastSyncedBlock) {
      return NextResponse.json({ synced: 0, newBlock: currentBlock });
    }

    // For first sync, start from 3000 blocks before current block (fresh contract).
    // This avoids scanning millions of blocks from block 1.
    const from = lastSyncedBlock === 0 ? currentBlock - 3000 : lastSyncedBlock;
    const fromBlock = BigInt(Math.max(0, from));
    const toBlock = BigInt(currentBlock);

    const logs = await publicClient.getLogs({
      address: CONTRACT_ADDRESS as `0x${string}`,
      event: VOTE_CAST_EVENT,
      fromBlock,
      toBlock,
    });

    let synced = 0;

    for (const log of logs) {
      const voter = log.args.voter as string;
      const candidateIndex = log.args.candidateIndex as bigint;

      const existing = await sql`
        SELECT 1 FROM vote_records WHERE tx_hash = ${log.transactionHash}
      `;

      if (existing.length === 0) {
        await sql`
          INSERT INTO vote_records (voter_address, candidate_index, tx_hash, block_number)
          VALUES (${voter}, ${Number(candidateIndex)}, ${log.transactionHash}, ${Number(log.blockNumber)})
        `;

        await sql`
          UPDATE candidates
          SET vote_count_cache = vote_count_cache + 1
          WHERE chain_index = ${Number(candidateIndex)}
        `;

        synced++;
      }
    }

    await sql`
      INSERT INTO sync_state (id, last_synced_block, last_sync_at)
      VALUES (1, ${currentBlock}, NOW())
      ON CONFLICT (id) DO UPDATE SET last_synced_block = EXCLUDED.last_synced_block, last_sync_at = NOW()
    `;

    return NextResponse.json({ synced, newBlock: currentBlock });
  } catch (error) {
    console.error("POST /api/sync error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Sync failed: ${message}`, detail: message }, { status: 500 });
  }
}
