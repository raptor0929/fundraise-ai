// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SubscriptionNFT
 * @dev A subscription-based NFT contract for the Mantle network
 * Features:
 * - Anyone can mint their NFT
 * - Deposit MNT tokens to extend subscription by 30 days
 * - Active/Inactive states based on expiration
 * - 10 MNT per subscription payment
 */
contract SubscriptionNFT is ERC721, Ownable {
    // Events
    event NFTMinted(address indexed owner, uint256 indexed tokenId);
    event SubscriptionExtended(address indexed owner, uint256 indexed tokenId, uint256 newExpiration);
    event SubscriptionExpired(address indexed owner, uint256 indexed tokenId);
    event Withdrawal(address indexed owner, uint256 amount);
    event SubscriptionCostUpdated(uint256 oldCost, uint256 newCost);
    event SubscriptionDurationUpdated(uint256 oldDuration, uint256 newDuration);
    
    // State variables
    uint256 private _tokenIds;
    uint256 public subscriptionCost = 10 ether; // 10 MNT - updatable
    uint256 public subscriptionDuration = 30 days; // updatable
    
    // Mapping from tokenId to subscription data
    mapping(uint256 => SubscriptionData) public subscriptions;
    
    // Struct to store subscription information
    struct SubscriptionData {
        uint256 expirationTime;
        bool isActive;
        uint256 totalPaid;
    }
    
    // Mapping to track total collected fees
    uint256 public totalCollectedFees;
    
    constructor() ERC721("Subscription NFT", "SUBNFT") Ownable(msg.sender) {}
    
    /**
     * @dev Mint a new NFT with immediate subscription activation - anyone can mint
     * @param recipient The address to receive the NFT
     */
    function mint(address recipient) external payable returns (uint256) {
        require(recipient != address(0), "Invalid recipient address");
        require(msg.value == subscriptionCost, "Incorrect payment amount");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _mint(recipient, newTokenId);
        
        // Initialize subscription data with immediate activation
        subscriptions[newTokenId] = SubscriptionData({
            expirationTime: block.timestamp + subscriptionDuration,
            isActive: true,
            totalPaid: msg.value
        });
        
        totalCollectedFees += msg.value;
        
        emit NFTMinted(recipient, newTokenId);
        emit SubscriptionExtended(recipient, newTokenId, block.timestamp + subscriptionDuration);
        return newTokenId;
    }
    
    /**
     * @dev Extend subscription by depositing MNT tokens
     * @param tokenId The NFT token ID to extend subscription for
     */
    function extendSubscription(uint256 tokenId) external payable {
        require(tokenId > 0 && tokenId <= _tokenIds, "Token does not exist");
        require(msg.value == subscriptionCost, "Incorrect payment amount");
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");
        
        SubscriptionData storage subscription = subscriptions[tokenId];
        
        // Calculate new expiration time
        uint256 newExpiration;
        if (subscription.expirationTime == 0 || block.timestamp > subscription.expirationTime) {
            // First time subscription or expired - start from now
            newExpiration = block.timestamp + subscriptionDuration;
        } else {
            // Extend existing subscription
            newExpiration = subscription.expirationTime + subscriptionDuration;
        }
        
        // Update subscription data
        subscription.expirationTime = newExpiration;
        subscription.isActive = true;
        subscription.totalPaid += msg.value;
        
        totalCollectedFees += msg.value;
        
        emit SubscriptionExtended(msg.sender, tokenId, newExpiration);
    }
    
    /**
     * @dev Check if a token's subscription is active
     * @param tokenId The NFT token ID to check
     * @return bool True if subscription is active
     */
    function isSubscriptionActive(uint256 tokenId) external view returns (bool) {
        require(tokenId > 0 && tokenId <= _tokenIds, "Token does not exist");
        
        SubscriptionData storage subscription = subscriptions[tokenId];
        
        if (!subscription.isActive) {
            return false;
        }
        
        return block.timestamp <= subscription.expirationTime;
    }
    
    /**
     * @dev Get subscription data for a token
     * @param tokenId The NFT token ID
     * @return expirationTime The expiration timestamp
     * @return isActive Whether the subscription is currently active
     * @return totalPaid Total amount paid for this subscription
     */
    function getSubscriptionData(uint256 tokenId) external view returns (
        uint256 expirationTime,
        bool isActive,
        uint256 totalPaid
    ) {
        require(tokenId > 0 && tokenId <= _tokenIds, "Token does not exist");
        
        SubscriptionData storage subscription = subscriptions[tokenId];
        
        // Check if subscription has expired
        bool expired = block.timestamp > subscription.expirationTime;
        bool currentActive = subscription.isActive && !expired;
        
        return (
            subscription.expirationTime,
            currentActive,
            subscription.totalPaid
        );
    }
    
    /**
     * @dev Get time remaining for subscription
     * @param tokenId The NFT token ID
     * @return uint256 Time remaining in seconds, 0 if expired or inactive
     */
    function getTimeRemaining(uint256 tokenId) external view returns (uint256) {
        require(tokenId > 0 && tokenId <= _tokenIds, "Token does not exist");
        
        SubscriptionData storage subscription = subscriptions[tokenId];
        
        if (!subscription.isActive || block.timestamp >= subscription.expirationTime) {
            return 0;
        }
        
        return subscription.expirationTime - block.timestamp;
    }
    
    /**
     * @dev Update subscription cost (owner only)
     * @param newCost New subscription cost in wei
     */
    function updateSubscriptionCost(uint256 newCost) external onlyOwner {
        require(newCost > 0, "Cost must be greater than 0");
        uint256 oldCost = subscriptionCost;
        subscriptionCost = newCost;
        emit SubscriptionCostUpdated(oldCost, newCost);
    }
    
    /**
     * @dev Update subscription duration (owner only)
     * @param newDuration New subscription duration in seconds
     */
    function updateSubscriptionDuration(uint256 newDuration) external onlyOwner {
        require(newDuration > 0, "Duration must be greater than 0");
        require(newDuration <= 365 days, "Duration cannot exceed 1 year");
        uint256 oldDuration = subscriptionDuration;
        subscriptionDuration = newDuration;
        emit SubscriptionDurationUpdated(oldDuration, newDuration);
    }
    
    /**
     * @dev Withdraw collected fees (owner only)
     */
    function withdrawFees() external onlyOwner {
        uint256 amount = address(this).balance;
        require(amount > 0, "No fees to withdraw");
        
        totalCollectedFees = 0;
        
        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit Withdrawal(owner(), amount);
    }
    
    /**
     * @dev Get total number of NFTs minted
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIds;
    }
    
    /**
     * @dev Check if a token's subscription is active (internal version)
     */
    function _isSubscriptionActive(uint256 tokenId) internal view returns (bool) {
        if (tokenId == 0 || tokenId > _tokenIds) {
            return false;
        }
        
        SubscriptionData storage subscription = subscriptions[tokenId];
        
        if (!subscription.isActive) {
            return false;
        }
        
        return block.timestamp <= subscription.expirationTime;
    }
    
    /**
     * @dev Override _update to check subscription status
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting and burning regardless of subscription status
        if (from == address(0) || to == address(0)) {
            return super._update(to, tokenId, auth);
        }
        
        // Check if subscription is active for transfers
        require(_isSubscriptionActive(tokenId), "Subscription not active");
        
        return super._update(to, tokenId, auth);
    }
    
    /**
     * @dev Emergency function to update subscription state (owner only)
     * @param tokenId The NFT token ID
     * @param isActive New active state
     * @param expirationTime New expiration time
     */
    function emergencyUpdateSubscription(
        uint256 tokenId,
        bool isActive,
        uint256 expirationTime
    ) external onlyOwner {
        require(tokenId > 0 && tokenId <= _tokenIds, "Token does not exist");
        
        subscriptions[tokenId].isActive = isActive;
        subscriptions[tokenId].expirationTime = expirationTime;
    }
    
    /**
     * @dev Receive function to accept MNT payments
     */
    receive() external payable {
        // Accept payments for subscription extensions
    }
}
