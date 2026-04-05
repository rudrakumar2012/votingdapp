"use client";

interface Candidate {
  name: string;
  voteCount: number;
}

export default function VotingTable({ candidates }: { candidates: Candidate[] }) {
  const maxVotes = Math.max(...candidates.map((c) => c.voteCount), 1);

  return (
    <div className="w-full space-y-3">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-muted-blue/30">
            <th className="py-2 px-4 text-sm font-semibold text-muted-blue">
              #
            </th>
            <th className="py-2 px-4 text-sm font-semibold text-muted-blue">
              Candidate
            </th>
            <th className="py-2 px-4 text-sm font-semibold text-muted-blue text-right">
              Votes
            </th>
            <th className="py-2 px-4 text-sm font-semibold text-muted-blue w-1/3">
              Share
            </th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c, i) => {
            const pct = maxVotes > 0 ? (c.voteCount / maxVotes) * 100 : 0;
            return (
              <tr
                key={i}
                className="border-b border-muted-blue/10 hover:bg-muted-blue/10 transition"
              >
                <td className="py-3 px-4 text-light-pink">{i + 1}</td>
                <td className="py-3 px-4 text-white font-medium">{c.name}</td>
                <td className="py-3 px-4 text-right text-soft-purple font-mono">
                  {c.voteCount}
                </td>
                <td className="py-3 px-4">
                  <div className="w-full bg-muted-blue/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-soft-purple to-light-pink h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
