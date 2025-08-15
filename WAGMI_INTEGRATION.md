# Wagmi Integration for FundraiseAgent

This document describes the wagmi integration that has been added to the FundraiseAgent project to enable wallet connections and smart contract interactions.

## Features Added

### 1. Wallet Connection
- **ConnectWallet Component**: Replaces the "Get Early Access" button with a wallet connection button
- **MetaMask Support**: Primary wallet connector for easy integration
- **Injected Wallet Support**: Supports any browser-injected wallet
- **Connection Status**: Shows connected address and disconnect option

### 2. Smart Contract Integration
- **TransactionHandler Component**: Provides UI for smart contract interactions
- **Mint NFT**: Allows users to mint subscription NFTs
- **Extend Subscription**: Enables subscription extension with MNT payment
- **Read Contract State**: Displays subscription status

### 3. Network Support
- **Mantle Network**: Primary network for the application
- **Ethereum Mainnet**: Secondary network support
- **Custom Chain Configuration**: Properly configured for Mantle RPC endpoints

## Components

### ConnectWallet (`components/connect-wallet.tsx`)
```tsx
// Features:
- Wallet connection dropdown
- Address display with truncation
- Disconnect functionality
- Loading states
- Error handling
```

### TransactionHandler (`components/transaction-handler.tsx`)
```tsx
// Features:
- Mint subscription NFT
- Extend subscription (1 MNT)
- Read subscription status
- Transaction confirmation states
- Error handling
```

### Wagmi Configuration (`lib/wagmi.ts`)
```tsx
// Features:
- Mantle network configuration
- MetaMask and injected connectors
- HTTP transport setup
- Chain ID: 5000 (Mantle)
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install wagmi @tanstack/react-query viem --legacy-peer-deps
```

### 2. Update Contract Address
In `components/transaction-handler.tsx`, update the `CONTRACT_ADDRESS`:
```tsx
const CONTRACT_ADDRESS = '0xYOUR_DEPLOYED_CONTRACT_ADDRESS'
```

### 3. Deploy Smart Contract
Use the existing Foundry setup to deploy the SubscriptionNFT contract:
```bash
cd contracts
forge script script/DeploySubscriptionNFT.s.sol --rpc-url https://rpc.mantle.xyz --broadcast --verify
```

### 4. Update ABI (if needed)
If the contract ABI changes, update the `SUBSCRIPTION_NFT_ABI` in `components/transaction-handler.tsx`.

## Usage

### Connecting Wallet
1. Click the "Connect Wallet" button in the header
2. Select MetaMask from the dropdown
3. Approve the connection in MetaMask
4. The button will show your truncated address

### Minting NFT
1. Ensure wallet is connected
2. Click "Mint NFT" in the Smart Contract Actions section
3. Approve the transaction in MetaMask
4. Wait for confirmation

### Extending Subscription
1. Enter your token ID in the input field
2. Click "Extend Subscription (1 MNT)"
3. Approve the transaction with 1 MNT payment
4. Wait for confirmation

## Wagmi Hooks Used

- `useAccount`: Get connected account information
- `useConnect`: Handle wallet connections
- `useDisconnect`: Handle wallet disconnection
- `useWriteContract`: Write to smart contracts
- `useReadContract`: Read from smart contracts
- `useWaitForTransactionReceipt`: Wait for transaction confirmations

## Network Configuration

### Mantle Network
- **Chain ID**: 5000
- **RPC URL**: https://rpc.mantle.xyz
- **Native Token**: MNT
- **Block Explorer**: https://explorer.mantle.xyz

### Ethereum Mainnet
- **Chain ID**: 1
- **RPC URL**: Default HTTP transport
- **Native Token**: ETH

## Error Handling

The integration includes comprehensive error handling:
- Connection errors
- Transaction failures
- Network issues
- User rejection of transactions

## Future Enhancements

1. **Multi-chain Support**: Add support for more networks
2. **Transaction History**: Display user's transaction history
3. **Gas Estimation**: Show gas estimates before transactions
4. **Batch Transactions**: Support for multiple operations
5. **WalletConnect**: Add WalletConnect v2 support

## Troubleshooting

### Common Issues

1. **MetaMask not detected**: Ensure MetaMask is installed and unlocked
2. **Wrong network**: Switch to Mantle network in MetaMask
3. **Transaction fails**: Check if you have sufficient MNT for gas fees
4. **Contract not found**: Verify the contract address is correct

### Debug Mode
Enable debug logging by adding to your environment:
```bash
NEXT_PUBLIC_WAGMI_DEBUG=true
```

## Security Considerations

1. **Contract Verification**: Always verify smart contracts on block explorer
2. **Address Validation**: Validate contract addresses before use
3. **User Education**: Inform users about transaction risks
4. **Error Messages**: Provide clear, non-technical error messages

## Resources

- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)
- [Mantle Network Documentation](https://docs.mantle.xyz/)
- [MetaMask Documentation](https://docs.metamask.io/)
