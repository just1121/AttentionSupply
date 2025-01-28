const hre = require("hardhat");

async function main() {
    // Updated with new deployment address
    const contractAddress = "0x42D06E88bbD092Da0c5Cc515ce030042E1888F08";
    const AttentionToken = await hre.ethers.getContractFactory("AttentionToken");
    const token = AttentionToken.attach(contractAddress);

    // Check if we're the owner
    const [signer] = await hre.ethers.getSigners();
    const contractOwner = await token.owner();
    console.log("Contract owner:", contractOwner);
    console.log("Our address:", signer.address);

    if (contractOwner.toLowerCase() !== signer.address.toLowerCase()) {
        console.error("Error: We're not the contract owner!");
        return;
    }

    try {
        // Enable trading first
        console.log("Enabling trading...");
        const tradingTx = await token.enableTrading();
        await tradingTx.wait();
        console.log("Trading enabled!");
        
        // Create first promo code
        console.log("Creating LAUNCH2025 code...");
        const tx = await token.createPromoCode("LAUNCH2025", 100, 1, {
            gasLimit: 500000
        });
        await tx.wait();
        console.log("LAUNCH2025 created successfully!");
        
        // Create second promo code
        console.log("Creating NOFEE2025 code...");
        const tx2 = await token.createPromoCode("NOFEE2025", 50, 2, {
            gasLimit: 500000
        });
        await tx2.wait();
        console.log("NOFEE2025 created successfully!");

        // Test using a code
        console.log("Testing LAUNCH2025 code...");
        const tx3 = await token.usePromoCode("LAUNCH2025", {
            gasLimit: 500000
        });
        await tx3.wait();
        console.log("Successfully used LAUNCH2025 code!");

    } catch (error) {
        console.error("Detailed error:", error);
        if (error.data) {
            console.error("Error data:", error.data);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => console.error(error)); 