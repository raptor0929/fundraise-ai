import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { useState } from 'react'

// SubscriptionNFT contract ABI
const SUBSCRIPTION_NFT_ABI = [
  {
    "inputs": [],
    "name": "mint",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256"}],
    "name": "extendSubscription",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256"}],
    "name": "isSubscriptionActive",
    "outputs": [{"type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256"}],
    "name": "getSubscriptionData",
    "outputs": [
      {"type": "uint256"},
      {"type": "bool"},
      {"type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Replace with your deployed contract address
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000' // Update this

export function useContract() {
  const { address, isConnected } = useAccount()
  const [tokenId, setTokenId] = useState<number | null>(null)

  // Mint NFT
  const { 
    data: mintHash, 
    writeContract: mintNFT, 
    isPending: isMinting,
    error: mintError 
  } = useWriteContract()

  // Extend subscription
  const { 
    data: extendHash, 
    writeContract: extendSubscription, 
    isPending: isExtending,
    error: extendError 
  } = useWriteContract()

  // Wait for mint transaction
  const { isLoading: isMintConfirming, isSuccess: isMintSuccess } = useWaitForTransactionReceipt({
    hash: mintHash,
  })

  // Wait for extend transaction
  const { isLoading: isExtendConfirming, isSuccess: isExtendSuccess } = useWaitForTransactionReceipt({
    hash: extendHash,
  })

  // Read subscription status
  const { data: isActive, refetch: refetchStatus } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SUBSCRIPTION_NFT_ABI,
    functionName: 'isSubscriptionActive',
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: !!tokenId,
    },
  })

  // Read subscription data
  const { data: subscriptionData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SUBSCRIPTION_NFT_ABI,
    functionName: 'getSubscriptionData',
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: !!tokenId,
    },
  })

  const handleMint = () => {
    if (!isConnected) return
    
    mintNFT({
      address: CONTRACT_ADDRESS,
      abi: SUBSCRIPTION_NFT_ABI,
      functionName: 'mint',
      args: [],
    })
  }

  const handleExtend = () => {
    if (!isConnected || !tokenId) return
    
    extendSubscription({
      address: CONTRACT_ADDRESS,
      abi: SUBSCRIPTION_NFT_ABI,
      functionName: 'extendSubscription',
      args: [BigInt(tokenId)],
      value: BigInt('1000000000000000000'), // 1 MNT
    })
  }

  return {
    // State
    address,
    isConnected,
    tokenId,
    setTokenId,
    
    // Mint functions
    handleMint,
    isMinting,
    isMintConfirming,
    isMintSuccess,
    mintError,
    mintHash,
    
    // Extend functions
    handleExtend,
    isExtending,
    isExtendConfirming,
    isExtendSuccess,
    extendError,
    extendHash,
    
    // Read functions
    isActive,
    subscriptionData,
    refetchStatus,
    
    // Contract info
    contractAddress: CONTRACT_ADDRESS,
  }
}
