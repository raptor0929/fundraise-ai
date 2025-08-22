# FundraiseAgent 🚀

An AI-powered fundraising assistant that combines blockchain technology with intelligent automation to revolutionize the fundraising process for startups and entrepreneurs.

## 🌟 Vision & Concept

FundraiseAgent addresses the critical pain points in the fundraising ecosystem:

- **Information Asymmetry**: Startups often lack access to comprehensive VC databases and market intelligence
- **Manual Processes**: Traditional fundraising involves repetitive, time-consuming tasks
- **Limited Resources**: Small teams struggle to scale their fundraising efforts effectively
- **Access Barriers**: High-quality fundraising tools are often expensive and inaccessible

Our solution leverages AI to democratize access to institutional-grade fundraising intelligence while using blockchain technology to create a sustainable, subscription-based business model.

## 🎯 Core Features

### 🤖 AI-Powered Intelligence
- **Pitch Deck Analysis**: Automated assessment of Series A readiness with actionable insights
- **VC Matching**: Intelligent identification of investors aligned with your industry and stage
- **Email Automation**: AI-generated follow-up emails and outreach campaigns
- **Market Intelligence**: Real-time analysis of fundraising trends and investor preferences
- **Outreach Agent Co-pilot**: Integrated Relevance AI assistant providing personalized fundraising advice and guidance for new founders

### 📊 CRM & Database Management
- **Investor Database**: Comprehensive database of VCs, angels, and institutional investors
- **Relationship Tracking**: Monitor interactions and follow-ups with potential investors
- **Pipeline Management**: Visualize and track your fundraising pipeline
- **Google Sheets Integration**: Seamless export and collaboration via Google Sheets

### 🔗 Blockchain Integration
- **Subscription NFTs**: Unique NFTs that grant access to premium features
- **Transparent Pricing**: On-chain subscription management with clear cost structure
- **Decentralized Access**: No centralized authority controlling access to tools
- **Immutable Records**: Permanent record of subscription status and payments

### 💼 Professional Dashboard
- **Meeting Management**: Track upcoming investor meetings and calls
- **Message Center**: Centralized communication hub for investor interactions
- **Email Integration**: Monitor and manage investor email communications
- **File Management**: Organize pitch decks, financials, and supporting documents

## 🏗️ Technical Architecture

### Frontend Stack
- **Next.js 15**: React framework with App Router and Server Components
- **TypeScript**: Type-safe development for better code quality
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Radix UI**: Accessible component primitives
- **RainbowKit**: Professional wallet connection interface
- **Supabase**: Backend-as-a-Service for database and file storage
- **Relevance AI**: Integrated chat widget for fundraising guidance

### Blockchain Integration
- **Wagmi**: React hooks for Ethereum interactions
- **Viem**: Type-safe Ethereum client
- **Solidity**: Smart contract development
- **Foundry**: Development and testing framework

### Smart Contract Features
- **ERC-721 NFTs**: Unique subscription tokens
- **Dynamic Pricing**: Updatable subscription costs and durations
- **Owner Controls**: Administrative functions for contract management
- **Event Logging**: Comprehensive on-chain event tracking

## 📋 Smart Contract Details

### Deployed Contract
- **Network**: Mantle Sepolia Testnet
- **Address**: [`0x9D73D78EFdfDa6b101f2caA0aE220e3C698D0309`](https://sepolia.mantlescan.xyz/address/0x9D73D78EFdfDa6b101f2caA0aE220e3C698D0309)
- **Explorer**: [Mantle Sepolia Explorer](https://sepolia.mantlescan.xyz/)

### Contract Functions

#### User Functions
- `mint(address recipient)` - Mint subscription NFT with immediate activation
- `extendSubscription(uint256 tokenId)` - Extend existing subscription
- `isSubscriptionActive(uint256 tokenId)` - Check subscription status
- `getSubscriptionData(uint256 tokenId)` - Get detailed subscription info

#### Owner Functions
- `updateSubscriptionCost(uint256 newCost)` - Update subscription price
- `updateSubscriptionDuration(uint256 newDuration)` - Update subscription period
- `withdrawFees()` - Withdraw collected subscription fees
- `emergencyUpdateSubscription()` - Emergency subscription management

### Subscription Model
- **Cost**: 10 MNT (configurable)
- **Duration**: 30 days (configurable)
- **Activation**: Immediate upon minting
- **Extension**: Stackable 30-day periods

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or compatible wallet
- Mantle Sepolia testnet configured
- Supabase project with storage buckets configured
- Backend service for file processing webhooks

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fundraise-agen-3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your configuration:
   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x9D73D78EFdfDa6b101f2caA0aE220e3C698D0309
   NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_BACKEND_HOST=your_backend_host_url
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Connect your wallet
   - Subscribe to access features

### Smart Contract Deployment

1. **Navigate to contracts directory**
   ```bash
   cd contracts
   ```

2. **Install Foundry dependencies**
   ```bash
   forge install
   ```

3. **Deploy the contract**
   ```bash
   forge script script/DeploySubscriptionNFT.s.sol --rpc-url <mantle-sepolia-rpc> --private-key <your-private-key> --broadcast
   ```

## 💡 Business Model

### Revenue Streams
- **Subscription Fees**: 10 MNT per 30-day subscription
- **Premium Features**: Advanced analytics and automation tools
- **Enterprise Plans**: Custom solutions for larger organizations

### Value Proposition
- **Cost Efficiency**: Fraction of traditional fundraising tool costs
- **Time Savings**: Automated processes save hundreds of hours
- **Access to Intelligence**: Institutional-grade insights for all users
- **Transparency**: Clear, on-chain pricing and access management

### Target Market
- **Early-stage startups** seeking Series A funding
- **Entrepreneurs** looking to scale their fundraising efforts
- **Investment teams** managing multiple portfolio companies
- **Consultants** providing fundraising advisory services

## 🔮 Future Roadmap

### Phase 1: Core Platform (Current)
- ✅ Basic AI-powered analysis
- ✅ Subscription NFT system
- ✅ CRM database integration
- ✅ Professional dashboard
- ✅ Supabase integration for file storage and database
- ✅ Outreach Agent Co-pilot with Relevance AI

### Phase 2: Advanced Features
- 🔄 AI-powered investor matching
- 🔄 Automated outreach campaigns
- 🔄 Advanced analytics dashboard
- 🔄 Multi-chain support

### Phase 3: Ecosystem Expansion
- 📋 Marketplace for fundraising services
- 📋 Integration with major CRM platforms
- 📋 Mobile application
- 📋 API for third-party integrations

### Phase 4: Decentralization
- 🌐 DAO governance structure
- 🌐 Community-driven feature development
- 🌐 Token-based incentive system
- 🌐 Decentralized data marketplace

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests for smart contracts
- Maintain accessibility standards
- Document all major features

### Areas for Contribution
- UI/UX improvements
- Smart contract optimizations
- AI model enhancements
- Documentation updates
- Bug fixes and feature requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Website**: [FundraiseAgent](https://fundraiseagent.com)
- **Documentation**: [Docs](https://docs.fundraiseagent.com)
- **Smart Contract**: [Mantle Sepolia Explorer](https://sepolia.mantlescan.xyz/address/0x9D73D78EFdfDa6b101f2caA0aE220e3C698D0309)
- **Discord**: [Community](https://discord.gg/fundraiseagent)
- **Twitter**: [@FundraiseAgent](https://twitter.com/FundraiseAgent)

## 🙏 Acknowledgments

- **OpenZeppelin** for secure smart contract libraries
- **RainbowKit** for professional wallet integration
- **Vercel** for hosting and deployment infrastructure
- **Mantle Network** for scalable blockchain infrastructure

---

**Built with ❤️ for the startup ecosystem**
