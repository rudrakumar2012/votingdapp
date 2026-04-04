const hre = require("hardhat");

async function main() {
  const candidateNames = ["BJP", "AAP", "Congress"];
  const durationInMinutes = 90;

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(candidateNames, durationInMinutes);

  await voting.waitForDeployment();

  console.log(`Voting contract deployed to: ${voting.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
