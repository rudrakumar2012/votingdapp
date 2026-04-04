const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("Voting", function () {
  const CANDIDATES = ["Alice", "Bob", "Charlie"];
  const DURATION = 180; // 3 hours in minutes

  async function deployVotingFixture() {
    const Voting = await ethers.getContractFactory("Voting");
    const voting = await Voting.deploy(CANDIDATES, DURATION);
    const [owner, voter1, voter2, voter3] = await ethers.getSigners();

    return { voting, owner, voter1, voter2, voter3 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { voting, owner } = await loadFixture(deployVotingFixture);
      expect(await voting.owner()).to.equal(owner.address);
    });

    it("Should initialize candidates with zero votes", async function () {
      const { voting } = await loadFixture(deployVotingFixture);
      const candidates = await voting.getAllVotesOfCandiates();
      expect(candidates.length).to.equal(3);
      for (let i = 0; i < 3; i++) {
        expect(candidates[i].name).to.equal(CANDIDATES[i]);
        expect(candidates[i].voteCount).to.equal(0);
      }
    });

    it("Should set the correct voting start and end times", async function () {
      const { voting } = await loadFixture(deployVotingFixture);
      const start = await voting.votingStart();
      const end = await voting.votingEnd();
      expect(end - start).to.equal(DURATION * 60);
    });

    it("Should revert with no candidates", async function () {
      const Voting = await ethers.getContractFactory("Voting");
      await expect(Voting.deploy([], 90)).to.be.revertedWith(
        "Must have at least one candidate"
      );
    });

    it("Should revert with zero duration", async function () {
      const Voting = await ethers.getContractFactory("Voting");
      await expect(Voting.deploy(CANDIDATES, 0)).to.be.revertedWith(
        "Duration must be positive"
      );
    });
  });

  describe("Voting", function () {
    it("Should accept a valid vote and increment vote count", async function () {
      const { voting, voter1 } = await loadFixture(deployVotingFixture);
      await voting.connect(voter1).vote(0);
      const candidates = await voting.getAllVotesOfCandiates();
      expect(candidates[0].voteCount).to.equal(1);
    });

    it("Should mark a voter as having voted", async function () {
      const { voting, voter1 } = await loadFixture(deployVotingFixture);
      await voting.connect(voter1).vote(0);
      expect(await voting.voters(voter1.address)).to.equal(true);
    });

    it("Should prevent double voting", async function () {
      const { voting, voter1 } = await loadFixture(deployVotingFixture);
      await voting.connect(voter1).vote(0);
      await expect(voting.connect(voter1).vote(1)).to.be.revertedWith(
        "You have already voted."
      );
    });

    it("Should revert on invalid candidate index", async function () {
      const { voting, voter1 } = await loadFixture(deployVotingFixture);
      await expect(voting.connect(voter1).vote(99)).to.be.revertedWith(
        "Invalid candidate index."
      );
    });

    it("Should emit VoteCast event on vote", async function () {
      const { voting, voter1 } = await loadFixture(deployVotingFixture);
      await expect(voting.connect(voter1).vote(1))
        .to.emit(voting, "VoteCast")
        .withArgs(voter1.address, 1, "Bob");
    });
  });

  describe("Voting Status & Time", function () {
    it("Should report voting is active", async function () {
      const { voting } = await loadFixture(deployVotingFixture);
      expect(await voting.getVotingStatus()).to.equal(true);
    });

    it("Should return correct remaining time", async function () {
      const { voting } = await loadFixture(deployVotingFixture);
      const remaining = await voting.getRemainingTime();
      expect(remaining).to.be.greaterThan(0);
    });

    it("Should report 0 remaining time after voting ends", async function () {
      const { voting } = await loadFixture(deployVotingFixture);
      const durationSecs = DURATION * 60;
      await time.increase(durationSecs + 1);
      const remaining = await voting.getRemainingTime();
      expect(remaining).to.equal(0);
    });
  });

  describe("Get Winner", function () {
    it("Should return the correct winner after voting ends", async function () {
      const { voting, voter1, voter2, voter3 } = await loadFixture(deployVotingFixture);

      await voting.connect(voter1).vote(0); // Alice: 1
      await voting.connect(voter2).vote(1); // Bob: 1
      await voting.connect(voter3).vote(1); // Bob: 2

      const durationSecs = DURATION * 60;
      await time.increase(durationSecs + 1);

      const [winnerName, winningVotes] = await voting.getWinner();
      expect(winnerName).to.equal("Bob");
      expect(winningVotes).to.equal(2);
    });

    it("Should revert if voting has not ended", async function () {
      const { voting } = await loadFixture(deployVotingFixture);
      await expect(voting.getWinner()).to.be.revertedWith(
        "Voting has not ended yet"
      );
    });
  });

  describe("Add Candidate (owner only)", function () {
    it("Should allow owner to add candidate during voting", async function () {
      const { voting, owner } = await loadFixture(deployVotingFixture);
      await voting.connect(owner).addCandidate("Diana");
      const candidates = await voting.getAllVotesOfCandiates();
      expect(candidates.length).to.equal(4);
      expect(candidates[3].name).to.equal("Diana");
    });

    it("Should prevent non-owner from adding candidates", async function () {
      const { voting, voter1 } = await loadFixture(deployVotingFixture);
      await expect(voting.connect(voter1).addCandidate("Eve")).to.be.revertedWith(
        "Only owner can call this function"
      );
    });

    it("Should prevent adding empty name", async function () {
      const { voting, owner } = await loadFixture(deployVotingFixture);
      await expect(voting.connect(owner).addCandidate("")).to.be.revertedWith(
        "Name cannot be empty"
      );
    });
  });

  describe("End Voting", function () {
    it("Should allow owner to end voting early", async function () {
      const { voting, owner, voter1 } = await loadFixture(deployVotingFixture);
      await voting.connect(voter1).vote(0);
      await time.increase(60); // Advance 1 minute

      await voting.connect(owner).endVoting();

      const ended = await voting.isEnded();
      expect(ended).to.equal(true);
    });

    it("Should prevent voting after voting ended", async function () {
      const { voting, owner } = await loadFixture(deployVotingFixture);
      await voting.connect(owner).endVoting();
      const voter3 = (await ethers.getSigners())[3];
      await expect(voting.connect(voter3).vote(0)).to.be.revertedWith(
        "Voting has ended"
      );
    });

    it("Should prevent double end", async function () {
      const { voting, owner } = await loadFixture(deployVotingFixture);
      await voting.connect(owner).endVoting();
      await expect(voting.connect(owner).endVoting()).to.be.revertedWith(
        "Voting already ended"
      );
    });
  });
});
