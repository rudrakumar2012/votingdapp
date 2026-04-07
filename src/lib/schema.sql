-- vote_records: every confirmed vote, for analytics
CREATE TABLE IF NOT EXISTS vote_records (
  id SERIAL PRIMARY KEY,
  voter_address VARCHAR(42) NOT NULL,
  candidate_index INTEGER NOT NULL,
  tx_hash VARCHAR(66) NOT NULL,
  block_number BIGINT NOT NULL,
  voted_at TIMESTAMPTZ DEFAULT NOW()
);

-- voting_sessions: what session this contract belongs to
CREATE TABLE IF NOT EXISTS voting_sessions (
  id SERIAL PRIMARY KEY,
  contract_address VARCHAR(42) NOT NULL UNIQUE,
  chain_id INTEGER NOT NULL DEFAULT 11155111,
  candidate_names TEXT[] NOT NULL,
  duration_minutes INTEGER NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ
);

-- candidates: cached vote counts for fast reads
CREATE TABLE IF NOT EXISTS candidates (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES voting_sessions(id),
  name TEXT NOT NULL,
  chain_index INTEGER NOT NULL,
  vote_count_cache BIGINT DEFAULT 0
);

-- sync tracking: last block scanned
CREATE TABLE IF NOT EXISTS sync_state (
  id INTEGER PRIMARY KEY DEFAULT 1,
  last_synced_block BIGINT DEFAULT 0,
  last_sync_at TIMESTAMPTZ DEFAULT NOW()
);

-- active_contract: single-row config storing the current deployed contract
CREATE TABLE IF NOT EXISTS active_contract (
  id INTEGER PRIMARY KEY DEFAULT 1,
  contract_address VARCHAR(42) NOT NULL,
  owner_address VARCHAR(42),
  candidate_names TEXT[] NOT NULL DEFAULT '{}',
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  deployed_at TIMESTAMPTZ DEFAULT NOW()
);
