// Connected.jsx
import { useState } from "react";

const Connected = ({
  account,
  RemainingTime,
  candidates,
  selectedCandidateIndex,
  handleNumberChange,
  voteFunction,
  showButton,
}) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl p-8 bg-FFD0EC shadow-lg rounded-lg">
        <h1 className="text-4xl font-extrabold text-center text-1F2544 mb-8">
          You are connected to Metamask
        </h1>
        <p className="mb-4">Metamask Account: {account}</p>
        <p className="mb-4">Remaining Time: {RemainingTime}</p>
        <div className="flex space-x-4">
          {showButton ? (
            <p className="mb-4">You have already voted</p>
          ) : (
            <div className="flex space-x-4">
              <input
                type="number"
                placeholder="Enter Candidate Index"
                value={selectedCandidateIndex}
                onChange={handleNumberChange}
                className="flex-grow p-2 border border-gray-300 rounded"
              />
              <button
                onClick={() => voteFunction(selectedCandidateIndex)}
                className="py-2 px-4 bg-1F2544 hover:bg-474F7A text-white font-bold rounded focus:outline-none focus:ring-2 focus:ring-1F2544 focus:ring-opacity-50"
              >
                Vote
              </button>
            </div>
          )}
        </div>
        <table className="mt-8 w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 bg-474F7A text-white">
                Index
              </th>
              <th className="border border-gray-300 p-2 bg-474F7A text-white">
                Candidate Name
              </th>
              <th className="border border-gray-300 p-2 bg-474F7A text-white">
                Candidate Votes
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(candidates) &&
              candidates.map((candidate, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-100" : ""}
                >
                  <td className="border border-gray-300 p-2">
                    {candidate.index}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {candidate.name}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {candidate.voteCount}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Connected;
