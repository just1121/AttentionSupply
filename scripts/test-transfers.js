const hre = require("hardhat");

async function main() {
    const contractAddress = "0x42D06E88bbD092Da0c5Cc515ce030042E1888F08";
    const AttentionToken = await hre.ethers.getContractFactory("AttentionToken");
    const token = AttentionToken.attach(contractAddress);

    try {
        // Get test accounts
        const [owner, user1, user2] = await hre.ethers.getSigners();
        
        // Send tokens to user1
        console.log("Sending tokens to user1...");
        const amount = hre.ethers.parseUnits("1000", 18);
        await token.transfer(user1.address, amount);
        
        // User1 uses LAUNCH2025 code (0.15% fee)
        console.log("User1 using LAUNCH2025 code...");
        await token.connect(user1).usePromoCode("LAUNCH2025");
        
        // User1 transfers to user2 (should have 0.15% fee)
        console.log("Testing transfer with promo rate...");
        await token.connect(user1).transfer(user2.address, hre.ethers.parseUnits("100", 18));
        
        // Check balances
        const user2Balance = await token.balanceOf(user2.address);
        console.log("User2 balance:", hre.ethers.formatUnits(user2Balance, 18));
    } catch (error) {
        console.error("Error:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => console.error(error)); 