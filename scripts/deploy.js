const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.deployContract("Voting");

  await lock.waitForDeployment(["BJP","AAP","Congress"], 90);

  console.log(
    `Contract deployed to ${Voting.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
