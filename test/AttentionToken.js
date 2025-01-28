const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AttentionToken", function () {
  let AttentionToken, attentionToken, owner, addr1, addr2;

  beforeEach(async function () {
    AttentionToken = await ethers.getContractFactory("AttentionToken");
    [owner, addr1, addr2] = await ethers.getSigners();
    // Deploy with initial supply in wei (1 million tokens with 18 decimals)
    const initialSupply = ethers.parseUnits("1000000", 18);
    attentionToken = await AttentionToken.deploy(initialSupply);
  });

  it("Should assign the total supply to the owner", async function () {
    const ownerBalance = await attentionToken.balanceOf(owner.address);
    expect(await attentionToken.totalSupply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens between accounts and apply fees", async function () {
    await attentionToken.enableTrading();
    
    // First transfer from owner (excluded) to addr1
    const transferAmount = ethers.parseUnits("100", 18);
    await attentionToken.transfer(addr1.address, transferAmount);
    
    // Now test transfer from addr1 (not excluded) to addr2
    await attentionToken.connect(addr1).transfer(addr2.address, transferAmount);
    
    const addr2Balance = await attentionToken.balanceOf(addr2.address);
    const expectedAmount = transferAmount * 9955n / 10000n; // 99.55% (0.45% fee)
    expect(addr2Balance).to.equal(expectedAmount);
  });

  it("Should handle fees correctly", async function () {
    await attentionToken.enableTrading();
    
    // First transfer from owner to addr1 (no fee because owner is excluded)
    const transferAmount = ethers.parseUnits("100", 18);
    await attentionToken.transfer(addr1.address, transferAmount);
    
    // Now transfer from addr1 to addr2 (should have 0.45% fee)
    await attentionToken.connect(addr1).transfer(addr2.address, transferAmount);
    
    const addr2Balance = await attentionToken.balanceOf(addr2.address);
    const expectedAmount = transferAmount * 9955n / 10000n; // 99.55% (0.45% fee)
    expect(addr2Balance).to.equal(expectedAmount);
  });

  describe("Promo Code System", function () {
    beforeEach(async function () {
      await attentionToken.enableTrading();
      // Create promo codes
      await attentionToken.createPromoCode("LAUNCH2025", 100, 1); // 0.15% fee
      await attentionToken.createPromoCode("NOFEE2025", 50, 2);  // No fee
    });

    it("Should apply 0.15% fee for LAUNCH2025 code", async function () {
      // Use LAUNCH2025 promo code
      await attentionToken.connect(addr1).usePromoCode("LAUNCH2025");
      
      const transferAmount = ethers.parseUnits("100", 18);
      await attentionToken.transfer(addr1.address, transferAmount);
      
      // Transfer from addr1 to addr2 should have 0.15% fee
      await attentionToken.connect(addr1).transfer(addr2.address, transferAmount);
      
      const addr2Balance = await attentionToken.balanceOf(addr2.address);
      const expectedBalance = transferAmount * 9985n / 10000n; // 99.85%
      expect(addr2Balance).to.equal(expectedBalance);
    });

    it("Should apply no fee for NOFEE2025 code", async function () {
      // Use NOFEE2025 promo code
      await attentionToken.connect(addr1).usePromoCode("NOFEE2025");
      
      const transferAmount = ethers.parseUnits("100", 18);
      await attentionToken.transfer(addr1.address, transferAmount);
      
      // Transfer from addr1 to addr2 should have no fee
      await attentionToken.connect(addr1).transfer(addr2.address, transferAmount);
      
      const addr2Balance = await attentionToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(transferAmount); // 100%, no fee
    });

    it("Should be case insensitive", async function () {
      // Should work with lowercase
      await attentionToken.connect(addr1).usePromoCode("launch2025");
      
      // Should work with mixed case
      await attentionToken.connect(addr2).usePromoCode("NoFeE2025");
    });

    it("Should track promo code uses", async function () {
      // Get some test signers
      const [owner, addr1, addr2, addr3] = await ethers.getSigners();
      
      // Use the code a few times
      await attentionToken.connect(addr1).usePromoCode("NOFEE2025");
      await attentionToken.connect(addr2).usePromoCode("NOFEE2025");
      await attentionToken.connect(addr3).usePromoCode("NOFEE2025");
      
      // Verify the code still works
      const transferAmount = ethers.parseUnits("100", 18);
      await attentionToken.transfer(addr1.address, transferAmount);
      await attentionToken.connect(addr1).transfer(addr2.address, transferAmount);
      
      // Should have no fee because of NOFEE2025
      const addr2Balance = await attentionToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(transferAmount);
    });
  });
}); 