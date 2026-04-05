"use client";

interface Candidate {
  name: string;
  voteCount: number;
}

export default function ResultsPage({ candidates }: { candidates: Candidate[] }) {
  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
  const maxVotes = Math.max(...candidates.map((c) => c.voteCount), 0);
  const winner = candidates.find((c) => c.voteCount === maxVotes && c.voteCount > 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-1">Election Results</h2>
        <p className="text-muted-blue text-sm">
          Total votes cast: <span className="text-soft-purple font-mono">{totalVotes}</span>
        </p>
      </div>

      {/* Winner card — only show if there are votes */}
      {winner && (
        <div className="max-w-sm mx-auto bg-gradient-to-br from-soft-purple/30 to-muted-blue/20 rounded-2xl p-6 border border-soft-purple/40 text-center">
          <p className="text-xs uppercase tracking-widest text-light-pink mb-2">Winner</p>
          <h3 className="text-3xl font-bold text-white">{winner.name}</h3>
          <p className="text-xl font-mono text-soft-purple mt-1">{winner.voteCount} votes</p>
          <p className="text-sm text-muted-blue mt-1">
            {totalVotes > 0 ? ((winner.voteCount / totalVotes) * 100).toFixed(1) : 0}% of total
          </p>
        </div>
      )}

      {/* Bar chart */}
      <div className="space-y-3">
        {candidates.map((c, i) => {
          const pct = totalVotes > 0 ? (c.voteCount / totalVotes) * 100 : 0;
          return (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${winner?.name === c.name ? "text-soft-purple" : "text-white"}`}>
                  {c.name}
                </span>
                <span className="text-sm font-mono text-muted-blue">
                  {c.voteCount} ({pct.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-muted-blue/20 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    winner?.name === c.name
                      ? "bg-gradient-to-r from-soft-purple to-light-pink"
                      : "bg-muted-blue"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Voter stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted-blue/10 rounded-xl p-4 text-center border border-muted-blue/20">
          <p className="text-xs text-muted-blue uppercase tracking-wider">Candidates</p>
          <p className="text-2xl font-bold text-white mt-1">{candidates.length}</p>
        </div>
        <div className="bg-muted-blue/10 rounded-xl p-4 text-center border border-muted-blue/20">
          <p className="text-xs text-muted-blue uppercase tracking-wider">Total Votes</p>
          <p className="text-2xl font-bold text-white mt-1">{totalVotes}</p>
        </div>
      </div>
    </div>
  );
}
