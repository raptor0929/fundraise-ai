# Subscription NFT - Mantle Network

A subscription-based NFT contract for the Mantle network that allows users to mint NFTs and maintain active subscriptions by paying MNT tokens.

## Features

- **Anyone can mint**: No restrictions on who can mint an NFT
- **Subscription-based activation**: NFTs require active subscriptions to be transferable
- **MNT payments**: 10 MNT per 30-day subscription period
- **Flexible renewal**: Expired NFTs can be reactivated with new payments
- **State management**: Clear active/inactive states based on expiration
- **Owner controls**: Contract owner can withdraw collected fees and manage subscriptions

## Contract Overview

### Core Functions

- `mint(address recipient)` - Mint a new NFT (anyone can call)
- `extendSubscription(uint256 tokenId)` - Extend subscription by 30 days (requires 10 MNT)
- `isSubscriptionActive(uint256 tokenId)` - Check if subscription is active
- `getSubscriptionData(uint256 tokenId)` - Get detailed subscription information
- `getTimeRemaining(uint256 tokenId)` - Get time remaining until expiration
- `withdrawFees()` - Withdraw collected fees (owner only)

### Key Constants

- `SUBSCRIPTION_COST`: 10 MNT (1 ether)
- `SUBSCRIPTION_DURATION`: 30 days

## Installation & Setup

### Prerequisites

- [Foundry](https://getfoundry.sh/) installed
- Node.js and npm (for additional tooling if needed)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd subscriptionNFT
```

2. Install dependencies:
```bash
forge install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your private key and RPC URLs
```

## Testing

Run the test suite:

```bash
forge test
```

Run tests with verbose output:

```bash
forge test -vv
```

Run specific test:

```bash
forge test --match-test testMint
```

## Deployment

### Local Development

Deploy to local Anvil instance:

```bash
anvil
# In another terminal
forge script script/DeploySubscriptionNFT.s.sol --rpc-url http://localhost:8545 --broadcast
```

### Mantle Testnet

Deploy to Mantle testnet:

```bash
forge script script/DeploySubscriptionNFT.s.sol --rpc-url https://rpc.testnet.mantle.xyz --broadcast --verify
```

### Mantle Mainnet

Deploy to Mantle mainnet:

```bash
forge script script/DeploySubscriptionNFT.s.sol --rpc-url https://rpc.mantle.xyz --broadcast --verify
```

## Usage Examples

### Minting an NFT

```solidity
// Anyone can mint
uint256 tokenId = subscriptionNFT.mint(userAddress);
```

### Extending Subscription

```solidity
// Extend subscription by 30 days (requires 10 MNT)
subscriptionNFT.extendSubscription{value: 10 ether}(tokenId);
```

### Checking Subscription Status

```solidity
// Check if subscription is active
bool isActive = subscriptionNFT.isSubscriptionActive(tokenId);

// Get detailed subscription data
(uint256 expirationTime, bool isActive, uint256 totalPaid) = subscriptionNFT.getSubscriptionData(tokenId);

// Get time remaining
uint256 timeRemaining = subscriptionNFT.getTimeRemaining(tokenId);
```

## Contract Architecture

### State Variables

- `_tokenIds`: Counter for NFT token IDs
- `subscriptions`: Mapping from tokenId to subscription data
- `totalCollectedFees`: Total fees collected by the contract

### Events

- `NFTMinted`: Emitted when a new NFT is minted
- `SubscriptionExtended`: Emitted when subscription is extended
- `SubscriptionExpired`: Emitted when subscription expires
- `Withdrawal`: Emitted when fees are withdrawn

### Security Features

- Reentrancy protection on payment functions
- Owner-only access for fee withdrawal
- Input validation for all public functions
- Transfer restrictions for expired subscriptions

## Network Configuration

The contract is configured for the Mantle network:

- **Mainnet RPC**: `https://rpc.mantle.xyz`
- **Testnet RPC**: `https://rpc.testnet.mantle.xyz`
- **Native Token**: MNT (Mantle)

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## Support

For questions or support, please open an issue on GitHub or contact the development team.
