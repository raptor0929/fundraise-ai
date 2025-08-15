"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { useContract } from '@/hooks/use-contract'

export function TransactionHandler() {
  const {
    isConnected,
    tokenId,
    setTokenId,
    handleMint,
    isMinting,
    isMintConfirming,
    isMintSuccess,
    mintError,
    handleExtend,
    isExtending,
    isExtendConfirming,
    isExtendSuccess,
    extendError,
    isActive,
    subscriptionData,
  } = useContract()

  if (!isConnected) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-white">Connect Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300">Please connect your wallet to interact with the smart contract.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-lg">
      <CardHeader>
        <CardTitle className="text-white">Smart Contract Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mint NFT */}
        <div className="space-y-2">
          <h3 className="text-white font-medium">Mint Subscription NFT</h3>
          <Button 
            onClick={handleMint}
            disabled={isMinting || isMintConfirming}
            className="w-full"
          >
            {isMinting || isMintConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isMinting ? 'Minting...' : 'Confirming...'}
              </>
            ) : (
              'Mint NFT'
            )}
          </Button>
          {mintError && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <XCircle className="w-4 h-4" />
              {mintError.message}
            </div>
          )}
          {isMintSuccess && (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              NFT minted successfully!
            </div>
          )}
        </div>

        {/* Token ID Input */}
        <div className="space-y-2">
          <label className="text-white text-sm">Token ID:</label>
          <input
            type="number"
            value={tokenId || ''}
            onChange={(e) => setTokenId(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400"
            placeholder="Enter token ID"
          />
        </div>

        {/* Extend Subscription */}
        <div className="space-y-2">
          <h3 className="text-white font-medium">Extend Subscription (10 MNT)</h3>
          <Button 
            onClick={handleExtend}
            disabled={isExtending || isExtendConfirming || !tokenId}
            className="w-full"
          >
            {isExtending || isExtendConfirming ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isExtending ? 'Extending...' : 'Confirming...'}
              </>
            ) : (
              'Extend Subscription'
            )}
          </Button>
          {extendError && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <XCircle className="w-4 h-4" />
              {extendError.message}
            </div>
          )}
          {isExtendSuccess && (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle className="w-4 h-4" />
              Subscription extended successfully!
            </div>
          )}
        </div>

        {/* Subscription Status */}
        {tokenId && (
          <div className="space-y-2">
            <h3 className="text-white font-medium">Subscription Status</h3>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-white text-sm">
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
