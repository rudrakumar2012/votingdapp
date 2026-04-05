"use client";

interface Candidate {
  name: string;
  voteCount: number;
}

export default function CandidateSelector({
  candidates,
  onSelect,
  selected,
}: {
  candidates: Candidate[];
  onSelect: (name: string) => void;
  selected: string | null;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {candidates.map((c, i) => (
        <button
          key={i}
          onClick={() => onSelect(c.name)}
          className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
            selected === c.name
              ? "bg-soft-purple border-soft-purple shadow-lg shadow-soft-purple/30"
              : "border-muted-blue/40 bg-muted-blue/10 hover:border-soft-purple/60"
          }`}
        >
          <h3 className="text-lg font-bold text-white">{c.name}</h3>
          <p className="text-sm text-muted-blue mt-1">{c.voteCount} votes</p>
        </button>
      ))}
    </div>
  );
}
