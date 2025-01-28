const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const AttentionToken = await hre.ethers.getContractFactory("AttentionToken");

  // Estimate gas for deployment
  const initialSupply = hre.ethers.parseUnits("1000000", 18);
  
  // Get the deployment transaction
  const deployTx = await AttentionToken.getDeployTransaction(initialSupply);
  
  // Get provider
  const provider = await hre.ethers.provider;
  
  // Estimate gas
  const deploymentGas = await provider.estimateGas(deployTx);
  
  // Get current gas price
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice;

  // Calculate cost in ETH
  const costInWei = deploymentGas * gasPrice;
  const costInEth = hre.ethers.formatEther(costInWei);

  console.log(`Estimated deployment cost: ${costInEth} ETH`);
  console.log(`Gas units needed: ${deploymentGas}`);
  console.log(`Current gas price: ${hre.ethers.formatUnits(gasPrice, 'gwei')} gwei`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  }); 