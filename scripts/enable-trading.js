const hre = require("hardhat");

async function main() {
    // Get the deployed contract address
    const contractAddress = "0xc1B6c512199016FB3Ef1608eCA801E7E919758a8";
    const AttentionToken = await hre.ethers.getContractFactory("AttentionToken");
    const token = AttentionToken.attach(contractAddress);

    console.log("Enabling trading...");
    await token.enableTrading();
    console.log("Trading enabled successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 