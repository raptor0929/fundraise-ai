# Wallet Connection Setup

## Required Configuration

To enable wallet connections, you need to set up a WalletConnect project ID:

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy your project ID
4. Create a `.env.local` file in the root directory with:
   ```
   NEXT_PUBLIC_WC_PROJECT_ID=your_project_id_here
   ```

## Supported Wallets

The application now supports:
- MetaMask
- Rainbow Wallet
- Coinbase Wallet
- And many more through WalletConnect

## Network

The application is configured to use Mantle Sepolia testnet by default.

## Troubleshooting

If you see "unsupported" wallets, make sure:
1. You have a valid WalletConnect project ID in your environment variables
2. Your browser has wallet extensions installed
3. The wallet extensions are properly configured for the Mantle Sepolia network
