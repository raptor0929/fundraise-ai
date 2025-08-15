import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi'
import { useState, useEffect } from 'react'

// SubscriptionNFT contract ABI
const SUBSCRIPTION_NFT_ABI = [
  {
    "inputs": [{"type": "address"}],
    "name": "mint",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "payable",
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
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "subscriptionCost",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "subscriptionDuration",
    "outputs": [{"type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256"}],
    "name": "updateSubscriptionCost",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256"}],
    "name": "updateSubscriptionDuration",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

// Replace with your deployed contract address
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS! as `0x${string}` // Update this

export function useContract() {
  const { address, isConnected } = useAccount()
  const [tokenId, setTokenId] = useState<number | null>(null)
  const [mintedTokenId, setMintedTokenId] = useState<number | null>(null)

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
  const { isLoading: isMintConfirming, isSuccess: isMintSuccess, data: mintReceipt } = useWaitForTransactionReceipt({
    hash: mintHash,
  })

  // Wait for extend transaction
  const { isLoading: isExtendConfirming, isSuccess: isExtendSuccess } = useWaitForTransactionReceipt({
    hash: extendHash,
  })

  // Get total supply to determine the minted token ID
  const { data: totalSupply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SUBSCRIPTION_NFT_ABI,
    functionName: 'totalSupply',
    query: {
      enabled: isConnected,
    },
  })

  // Read current subscription cost
  const { data: currentSubscriptionCost } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SUBSCRIPTION_NFT_ABI,
    functionName: 'subscriptionCost',
    query: {
      enabled: isConnected,
    },
  })

  // Read current subscription duration
  const { data: currentSubscriptionDuration } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SUBSCRIPTION_NFT_ABI,
    functionName: 'subscriptionDuration',
    query: {
      enabled: isConnected,
    },
  })

  // Read subscription status for the minted token
  const { data: isActive, refetch: refetchStatus } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SUBSCRIPTION_NFT_ABI,
    functionName: 'isSubscriptionActive',
    args: mintedTokenId ? [BigInt(mintedTokenId)] : undefined,
    query: {
      enabled: !!mintedTokenId,
    },
  })

  // Read subscription data
  const { data: subscriptionData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SUBSCRIPTION_NFT_ABI,
    functionName: 'getSubscriptionData',
    args: mintedTokenId ? [BigInt(mintedTokenId)] : undefined,
    query: {
      enabled: !!mintedTokenId,
    },
  })

  // Update minted token ID when total supply changes (indicating a new mint)
  useEffect(() => {
    if (totalSupply !== undefined && totalSupply > 0) {
      setMintedTokenId(Number(totalSupply))
    }
  }, [totalSupply])

  // Refetch status when mint is successful
  useEffect(() => {
    if (isMintSuccess && mintedTokenId) {
      refetchStatus()
    }
  }, [isMintSuccess, mintedTokenId, refetchStatus])

  const handleMint = () => {
    if (!isConnected || !address || !currentSubscriptionCost) return
    
    mintNFT({
      address: CONTRACT_ADDRESS,
      abi: SUBSCRIPTION_NFT_ABI,
      functionName: 'mint',
      args: [address],
      value: currentSubscriptionCost,
    })
  }

  const handleExtend = () => {
    if (!isConnected || !tokenId || !currentSubscriptionCost) return
    
    extendSubscription({
      address: CONTRACT_ADDRESS,
      abi: SUBSCRIPTION_NFT_ABI,
      functionName: 'extendSubscription',
      args: [BigInt(tokenId)],
      value: currentSubscriptionCost,
    })
  }

  return {
    // State
    address,
    isConnected,
    tokenId,
    setTokenId,
    mintedTokenId,
    
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
    totalSupply,
    currentSubscriptionCost,
    currentSubscriptionDuration,
    
    // Contract info
    contractAddress: CONTRACT_ADDRESS,
  }
}
