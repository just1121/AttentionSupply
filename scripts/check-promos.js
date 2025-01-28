const hre = require("hardhat");

async function main() {
    const contractAddress = "0x42D06E88bbD092Da0c5Cc515ce030042E1888F08";
    const AttentionToken = await hre.ethers.getContractFactory("AttentionToken");
    const token = AttentionToken.attach(contractAddress);

    try {
        // Check LAUNCH2025
        console.log("\nChecking LAUNCH2025 code:");
        const launch2025Hash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("LAUNCH2025"));
        const isLaunchValid = await token.validPromoCodes(launch2025Hash);
        const launchUses = await token.promoCodeUses(launch2025Hash);
        const launchLevel = await token.promoCodeLevel(launch2025Hash);
        console.log("- Valid:", isLaunchValid);
        console.log("- Uses left:", launchUses.toString());
        console.log("- Level:", launchLevel.toString(), "(1 = 0.15% fee, 2 = no fee)");

        // Check NOFEE2025
        console.log("\nChecking NOFEE2025 code:");
        const nofeeHash = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("NOFEE2025"));
        const isNofeeValid = await token.validPromoCodes(nofeeHash);
        const nofeeUses = await token.promoCodeUses(nofeeHash);
        const nofeeLevel = await token.promoCodeLevel(nofeeHash);
        console.log("- Valid:", isNofeeValid);
        console.log("- Uses left:", nofeeUses.toString());
        console.log("- Level:", nofeeLevel.toString(), "(1 = 0.15% fee, 2 = no fee)");

        // Check owner's fee level
        const [owner] = await hre.ethers.getSigners();
        console.log("\nChecking owner fee level:");
        console.log("Owner address:", owner.address);
        const ownerLevel = await token.userFeeLevel(owner.address);
        console.log("Owner fee level:", ownerLevel.toString(), "(0 = standard, 1 = 0.15%, 2 = free)");
        
    } catch (error) {
        console.error("Error:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch(error => console.error(error)); 