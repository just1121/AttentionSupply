// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AttentionToken is ERC20, Ownable {
    uint256 public constant STANDARD_FEE = 45; // 0.45% (divide by 10000)
    uint256 public constant PROMO_FEE = 15;    // 0.15% (divide by 10000)
    
    mapping(address => bool) public isExcludedFromFees;
    mapping(address => uint256) public userFeeLevel; // 0 = standard, 1 = promo, 2 = free
    mapping(bytes32 => bool) public validPromoCodes;
    mapping(bytes32 => uint256) public promoCodeUses;
    mapping(bytes32 => uint256) public promoCodeLevel; // 1 = 0.15%, 2 = free
    bool public tradingEnabled = false;
    
    constructor(uint256 initialSupply) ERC20("Attention", "ATTEN") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
        isExcludedFromFees[msg.sender] = true;
    }

    function createPromoCode(string memory code, uint256 maxUses, uint256 level) external onlyOwner {
        require(level == 1 || level == 2, "Invalid promo level");
        bytes32 hashedCode = keccak256(abi.encodePacked(_toUpperCase(code)));
        validPromoCodes[hashedCode] = true;
        promoCodeUses[hashedCode] = maxUses;
        promoCodeLevel[hashedCode] = level;
    }

    function usePromoCode(string memory code) external {
        bytes32 hashedCode = keccak256(abi.encodePacked(_toUpperCase(code)));
        require(validPromoCodes[hashedCode], "Invalid code");
        require(promoCodeUses[hashedCode] > 0, "Code expired");
        promoCodeUses[hashedCode]--;
        userFeeLevel[msg.sender] = promoCodeLevel[hashedCode];
    }

    function _getFeeAmount(address from, uint256 amount) internal view returns (uint256) {
        if (isExcludedFromFees[from]) return 0;
        
        uint256 feeLevel = userFeeLevel[from];
        if (feeLevel == 2) return 0;           // Free
        if (feeLevel == 1) return (amount * PROMO_FEE) / 10000;    // 0.15%
        return (amount * STANDARD_FEE) / 10000; // 0.45%
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        if (from == address(0) || to == address(0)) {
            super._update(from, to, amount);
            return;
        }

        require(tradingEnabled || isExcludedFromFees[from], "Trading not enabled");

        uint256 fee = _getFeeAmount(from, amount);
        if (fee == 0) {
            super._update(from, to, amount);
        } else {
            uint256 remainingAmount = amount - fee;
            super._update(from, owner(), fee);
            super._update(from, to, remainingAmount);
        }
    }

    function enableTrading() external onlyOwner {
        tradingEnabled = true;
    }

    function excludeFromFees(address account, bool excluded) external onlyOwner {
        isExcludedFromFees[account] = excluded;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _toUpperCase(string memory str) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        for (uint i = 0; i < bStr.length; i++) {
            if (bStr[i] >= 0x61 && bStr[i] <= 0x7A) {
                bStr[i] = bytes1(uint8(bStr[i]) - 32);
            }
        }
        return string(bStr);
    }
} 