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
    const [active, remainingTime, ended] = await Promise.all([
      publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: VOTING_ABI,
        functionName: "getVotingStatus",
      }),
      publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: VOTING_ABI,
        functionName: "getRemainingTime",
      }),
      publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: VOTING_ABI,
        functionName: "isEnded",
      }),
    ]);

    return NextResponse.json({
      active: !!active,
      remainingSeconds: Number(remainingTime),
      isEnded: !!ended,
    });
  } catch (error) {
    console.error("GET /api/voting-status error:", error);
    return NextResponse.json({ error: "Failed to fetch voting status" }, { status: 500 });
  }
}
