const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const AttentionToken = await hre.ethers.getContractFactory("AttentionToken");

  // Deploy the contract with initial supply (1 million tokens with 18 decimals)
  const initialSupply = hre.ethers.parseUnits("1000000", 18);
  const attentionToken = await AttentionToken.deploy(initialSupply);

  // Wait for deployment to finish
  await attentionToken.waitForDeployment();

  // Get the contract address
  const address = await attentionToken.getAddress();
  console.log("AttentionToken deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 