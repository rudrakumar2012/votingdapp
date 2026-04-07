import { neon, neonConfig } from "@neondatabase/serverless";
import path from "path";
import { CONTRACT_ADDRESS, VOTING_ABI } from "@/lib/abi";

neonConfig.fetchConnectionCache = true;

const connectionString = process.env.DATABASE_URL ?? "";
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const sql = neon(connectionString);

const SCHEMA = `
CREATE TABLE IF NOT EXISTS vote_records (
  id SERIAL PRIMARY KEY,
  voter_address VARCHAR(42) NOT NULL,
  candidate_index INTEGER NOT NULL,
  tx_hash VARCHAR(66) NOT NULL,
  block_number BIGINT NOT NULL,
  voted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS voting_sessions (
  id SERIAL PRIMARY KEY,
  contract_address VARCHAR(42) NOT NULL UNIQUE,
  chain_id INTEGER NOT NULL DEFAULT 11155111,
  candidate_names TEXT[] NOT NULL,
  duration_minutes INTEGER NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS candidates (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES voting_sessions(id),
  name TEXT NOT NULL,
  chain_index INTEGER NOT NULL,
  vote_count_cache BIGINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sync_state (
  id INTEGER PRIMARY KEY DEFAULT 1,
  last_synced_block BIGINT DEFAULT 0,
  last_sync_at TIMESTAMPTZ DEFAULT NOW()
);
`;

async function initDb() {
  // Execute each CREATE TABLE individually
  const statements = SCHEMA.split(";").filter((s) => s.trim().length > 0);
  for (const stmt of statements) {
    await sql`${sql.unsafe(stmt.trim())}`;
  }
  console.log("Schema applied (CREATE TABLE IF NOT EXISTS statements)");

  // Seed voting session if not exists
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";
  const candidateNames = ["Alice", "Bob", "Charlie"];
  const durationMinutes = 60;

  // Seed active_contract with current env contract address
  const ownerAddress = process.env.OWNER_ADDRESS ?? "";
  await sql`
    INSERT INTO active_contract (contract_address, owner_address, candidate_names, duration_minutes)
    VALUES (
      ${contractAddress || "0x0000000000000000000000000000000000000000"},
      ${ownerAddress || "0x0000000000000000000000000000000000000000"},
      ${candidateNames},
      ${durationMinutes}
    )
    ON CONFLICT (id) DO NOTHING
  `;
  console.log("Active contract row seeded (skipped if exists)");

  await sql`
    INSERT INTO voting_sessions (contract_address, chain_id, candidate_names, duration_minutes, started_at)
    VALUES (
      ${contractAddress || "0x0000000000000000000000000000000000000000"},
      11155111,
      ${candidateNames},
      ${durationMinutes},
      NOW()
    )
    ON CONFLICT (contract_address) DO NOTHING
  `;
  console.log("Voting session seeded (skipped if exists)");

  // Seed candidate cache rows
  const sessionResult = await sql`SELECT id FROM voting_sessions WHERE contract_address = ${contractAddress || "0x0000000000000000000000000000000000000000"} LIMIT 1`;
  if (sessionResult.length > 0) {
    const sessionId = sessionResult[0].id;
    for (let i = 0; i < candidateNames.length; i++) {
      await sql`
        INSERT INTO candidates (session_id, name, chain_index, vote_count_cache)
        VALUES (${sessionId}, ${candidateNames[i]}, ${i}, 0)
        ON CONFLICT DO NOTHING
      `;
    }
    console.log("Candidate cache rows seeded");
  }

  console.log("Database initialized successfully!");
}

initDb().catch((err) => {
  console.error("Failed to init DB:", err);
  process.exit(1);
});
