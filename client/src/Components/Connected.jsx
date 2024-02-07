// Connected.jsx
import { useState } from 'react';

const Connected = ({ account, RemainingTime, candidates, selectedCandidateIndex, handleNumberChange, voteFunction, showButton }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-8">Welcome to Voting Dapp</h1>
        <p className="mb-4">Metamask Account: {account}</p>
        <p className="mb-4">Remaining Time: {RemainingTime}</p>
        <div className="flex space-x-4">
          {showButton ? (
            <p className="mb-4">Ypu have already voted</p>
          ) : (
            <div>
              <input
                type="number"
                placeholder="Enter Candidate Index"
                value={selectedCandidateIndex}
                onChange={handleNumberChange}
                className="flex-grow p-2 border border-gray-300 rounded"
              />
              <button
                onClick={() => voteFunction(selectedCandidateIndex)}
                className="py-2 px-4 bg-blue-900 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Vote
              </button>
                </div>
          )}
        </div>
        <table className="mt-8 w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Index</th>
              <th className="border border-gray-300 p-2">Candidate Name</th>
              <th className="border border-gray-300 p-2">Candidate Votes</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(candidates) && candidates.map((candidate, index) => (
              <tr key={index} className={index %   2 ===   0 ? 'bg-gray-100' : ''}>
                <td className="border border-gray-300 p-2">{candidate.index}</td>
                <td className="border border-gray-300 p-2">{candidate.name}</td>
                <td className="border border-gray-300 p-2">{candidate.voteCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Connected;
