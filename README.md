# AttentionToken (ATTEN)

A custom ERC20 token with promotional fee structures and trading controls.

## Features
- Base fee: 0.45%
- Promotional codes:
  - LAUNCH2025: 0.15% fee
  - NOFEE2025: No fee
- Owner controls for trading and fees
- Case-insensitive promo codes

## Contract Details
- Network: Sepolia Testnet
- Address: 0x42D06E88bbD092Da0c5Cc515ce030042E1888F08
- Token Symbol: ATTEN
- Decimals: 18

## Test Instructions
1. Clone repository
2. Install dependencies: `npm install`
3. Create `.env` file with:
   ```
   PRIVATE_KEY=your_private_key
   ALCHEMY_API_KEY=your_alchemy_key
   ```
4. Run tests: `npx hardhat test`

## Scripts
- `deploy.js`: Deploy contract
- `test-promos.js`: Test promo codes
- `check-promos.js`: Check promo status
- `test-transfers.js`: Test transfers with fees

## Security Review Focus Areas
1. Promo code implementation
2. Fee calculations
3. Trading controls
4. Owner privileges
5. Transfer mechanisms

## Questions for Reviewers
1. Are there potential vulnerabilities in the promo code system?
2. Could the fee calculations be exploited?
3. Are there edge cases we haven't considered?
4. How can we improve gas efficiency?

## Contact
[Your contact info or preferred method of communication] 