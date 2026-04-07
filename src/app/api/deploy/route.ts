import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, http, createPublicClient } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { sql } from "@/lib/db";

const VOTING_ABI_JSON = require("../../../../artifacts/contracts/Voting.sol/Voting.json");

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.SEPOLIA_RPC_URL),
});

export async function POST(req: NextRequest) {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    return NextResponse.json(
      { error: "PRIVATE_KEY not configured" },
      { status: 500 }
    );
  }

  let body: { candidates: string[]; durationMinutes: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { candidates, durationMinutes } = body;
  if (
    !Array.isArray(candidates) ||
    candidates.length === 0 ||
    typeof durationMinutes !== "number" ||
    durationMinutes <= 0
  ) {
    return NextResponse.json(
      { error: "candidates (string[]) and durationMinutes (number > 0) required" },
      { status: 400 }
    );
  }

  try {
    const rawKey = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;
    const account = privateKeyToAccount(rawKey as `0x${string}`);

    const walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport: http(process.env.SEPOLIA_RPC_URL),
    });

    // Deploy Voting contract
    const hash = await walletClient.deployContract({
      abi: VOTING_ABI_JSON.abi,
      bytecode: VOTING_ABI_JSON.bytecode as `0x${string}`,
      args: [candidates, BigInt(durationMinutes)],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    if (!receipt.contractAddress) {
      return NextResponse.json(
        { error: "Contract deployment failed — no address returned" },
        { status: 500 }
      );
    }

    const contractAddress = receipt.contractAddress;

    // Upsert active_contract (replaces existing row)
    await sql`
      INSERT INTO active_contract (id, contract_address, owner_address, candidate_names, duration_minutes)
      VALUES (1, ${contractAddress}, ${account.address}, ${candidates}, ${durationMinutes})
      ON CONFLICT (id) DO UPDATE SET
        contract_address = EXCLUDED.contract_address,
        owner_address = EXCLUDED.owner_address,
        candidate_names = EXCLUDED.candidate_names,
        duration_minutes = EXCLUDED.duration_minutes,
        deployed_at = NOW()
    `;

    // Update voting_sessions
    const session = await sql`
      INSERT INTO voting_sessions (contract_address, chain_id, candidate_names, duration_minutes, started_at)
      VALUES (${contractAddress}, 11155111, ${candidates}, ${durationMinutes}, NOW())
      ON CONFLICT (contract_address) DO UPDATE SET
        candidate_names = EXCLUDED.candidate_names,
        duration_minutes = EXCLUDED.duration_minutes,
        started_at = NOW(),
        ended_at = NULL
      RETURNING id
    `;

    const sessionId = session[0]?.id;

    // Seed candidates cache
    if (sessionId) {
      for (let i = 0; i < candidates.length; i++) {
        await sql`
          INSERT INTO candidates (session_id, name, chain_index, vote_count_cache)
          VALUES (${sessionId}, ${candidates[i]}, ${i}, 0)
          ON CONFLICT DO NOTHING
        `;
      }
    }

    // Reset sync state
    await sql`
      INSERT INTO sync_state (id, last_synced_block, last_sync_at)
      VALUES (1, 0, NOW())
      ON CONFLICT (id) DO UPDATE SET
        last_synced_block = 0,
        last_sync_at = NOW()
    `;

    return NextResponse.json({
      address: contractAddress,
      owner: account.address,
      candidates,
      durationMinutes,
      txHash: hash,
    });
  } catch (err: unknown) {
    console.error("Deploy error:", err);
    return NextResponse.json(
      { error: "Deployment failed", details: String(err) },
      { status: 500 }
    );
  }
}
