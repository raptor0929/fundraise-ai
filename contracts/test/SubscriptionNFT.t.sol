// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Test.sol";
import "../src/SubscriptionNFT.sol";

contract SubscriptionNFTTest is Test {
    SubscriptionNFT public subscriptionNFT;
    
    address public owner = address(this);
    address public user1 = address(0x1);
    address public user2 = address(0x2);
    
    uint256 public constant SUBSCRIPTION_COST = 10 ether;
    uint256 public constant SUBSCRIPTION_DURATION = 30 days;
    
    event NFTMinted(address indexed owner, uint256 indexed tokenId);
    event SubscriptionExtended(address indexed owner, uint256 indexed tokenId, uint256 newExpiration);
    event Withdrawal(address indexed owner, uint256 amount);
    
    function setUp() public {
        subscriptionNFT = new SubscriptionNFT();
        
        // Fund test accounts
        vm.deal(user1, 100 ether);
        vm.deal(user2, 100 ether);
    }
    
    function testMint() public {
        vm.startPrank(user1);
        
        uint256 tokenId = subscriptionNFT.mint(user1);
        
        assertEq(tokenId, 1);
        assertEq(subscriptionNFT.ownerOf(tokenId), user1);
        assertEq(subscriptionNFT.totalSupply(), 1);
        
        vm.stopPrank();
    }
    
    function testMintMultiple() public {
        vm.startPrank(user1);
        
        uint256 tokenId1 = subscriptionNFT.mint(user1);
        uint256 tokenId2 = subscriptionNFT.mint(user1);
        
        assertEq(tokenId1, 1);
        assertEq(tokenId2, 2);
        assertEq(subscriptionNFT.totalSupply(), 2);
        
        vm.stopPrank();
    }
    
    function testInitialSubscriptionState() public {
        vm.startPrank(user1);
        
        uint256 tokenId = subscriptionNFT.mint(user1);
        
        (uint256 expirationTime, bool isActive, uint256 totalPaid) = subscriptionNFT.getSubscriptionData(tokenId);
        
        assertEq(expirationTime, 0);
        assertEq(isActive, false);
        assertEq(totalPaid, 0);
        assertEq(subscriptionNFT.isSubscriptionActive(tokenId), false);
        assertEq(subscriptionNFT.getTimeRemaining(tokenId), 0);
        
        vm.stopPrank();
    }
    
    function testExtendSubscription() public {
        vm.startPrank(user1);
        
        uint256 tokenId = subscriptionNFT.mint(user1);
        
        // Extend subscription
        subscriptionNFT.extendSubscription{value: SUBSCRIPTION_COST}(tokenId);
        
        (uint256 expirationTime, bool isActive, uint256 totalPaid) = subscriptionNFT.getSubscriptionData(tokenId);
        
        assertGt(expirationTime, block.timestamp);
        assertEq(isActive, true);
        assertEq(totalPaid, SUBSCRIPTION_COST);
        assertEq(subscriptionNFT.isSubscriptionActive(tokenId), true);
        assertGt(subscriptionNFT.getTimeRemaining(tokenId), 0);
        
        vm.stopPrank();
    }
    
    function testExtendSubscriptionIncorrectAmount() public {
        vm.startPrank(user1);
        
        uint256 tokenId = subscriptionNFT.mint(user1);
        
        // Try to extend with wrong amount
        vm.expectRevert("Incorrect payment amount");
        subscriptionNFT.extendSubscription{value: 0.5 ether}(tokenId);
        
        vm.stopPrank();
    }
    
    function testExtendSubscriptionNotOwner() public {
        vm.startPrank(user1);
        uint256 tokenId = subscriptionNFT.mint(user1);
        vm.stopPrank();
        
        vm.startPrank(user2);
        vm.expectRevert("Not the token owner");
        subscriptionNFT.extendSubscription{value: SUBSCRIPTION_COST}(tokenId);
        vm.stopPrank();
    }
    
    function testExtendSubscriptionMultipleTimes() public {
        vm.startPrank(user1);
        
        uint256 tokenId = subscriptionNFT.mint(user1);
        
        // First extension
        subscriptionNFT.extendSubscription{value: SUBSCRIPTION_COST}(tokenId);
        (uint256 expirationTime1, , ) = subscriptionNFT.getSubscriptionData(tokenId);
        
        // Second extension
        subscriptionNFT.extendSubscription{value: SUBSCRIPTION_COST}(tokenId);
        (uint256 expirationTime2, , ) = subscriptionNFT.getSubscriptionData(tokenId);
        
        assertEq(expirationTime2, expirationTime1 + SUBSCRIPTION_DURATION);
        
        vm.stopPrank();
    }
    
    function testSubscriptionExpiration() public {
        vm.startPrank(user1);
        
        uint256 tokenId = subscriptionNFT.mint(user1);
        subscriptionNFT.extendSubscription{value: SUBSCRIPTION_COST}(tokenId);
        
        (uint256 expirationTime, , ) = subscriptionNFT.getSubscriptionData(tokenId);
        
        // Fast forward past expiration
        vm.warp(expirationTime + 1);
        
        assertEq(subscriptionNFT.isSubscriptionActive(tokenId), false);
        assertEq(subscriptionNFT.getTimeRemaining(tokenId), 0);
        
        vm.stopPrank();
    }
    
    function testReactivateExpiredSubscription() public {
        vm.startPrank(user1);
        
        uint256 tokenId = subscriptionNFT.mint(user1);
        subscriptionNFT.extendSubscription{value: SUBSCRIPTION_COST}(tokenId);
        
        (uint256 expirationTime, , ) = subscriptionNFT.getSubscriptionData(tokenId);
        
        // Fast forward past expiration
        vm.warp(expirationTime + 1);
        assertEq(subscriptionNFT.isSubscriptionActive(tokenId), false);
        
        // Reactivate subscription
        subscriptionNFT.extendSubscription{value: SUBSCRIPTION_COST}(tokenId);
        
        (uint256 newExpirationTime, bool isActive, ) = subscriptionNFT.getSubscriptionData(tokenId);
        
        assertEq(isActive, true);
        assertGt(newExpirationTime, block.timestamp);
        assertEq(subscriptionNFT.isSubscriptionActive(tokenId), true);
        
        vm.stopPrank();
    }
    
    function testTransferWithActiveSubscription() public {
        vm.startPrank(user1);
        uint256 tokenId = subscriptionNFT.mint(user1);
        subscriptionNFT.extendSubscription{value: SUBSCRIPTION_COST}(tokenId);
        vm.stopPrank();
        
        vm.startPrank(user1);
        subscriptionNFT.transferFrom(user1, user2, tokenId);
        assertEq(subscriptionNFT.ownerOf(tokenId), user2);
        vm.stopPrank();
    }
    
    function testTransferWithExpiredSubscription() public {
        vm.startPrank(user1);
        uint256 tokenId = subscriptionNFT.mint(user1);
        subscriptionNFT.extendSubscription{value: SUBSCRIPTION_COST}(tokenId);
        
        (uint256 expirationTime, , ) = subscriptionNFT.getSubscriptionData(tokenId);
        vm.warp(expirationTime + 1);
        vm.stopPrank();
        
        vm.startPrank(user1);
        vm.expectRevert("Subscription not active");
        subscriptionNFT.transferFrom(user1, user2, tokenId);
        vm.stopPrank();
    }
    
    function testWithdrawFees() public {
        vm.startPrank(user1);
        uint256 tokenId = subscriptionNFT.mint(user1);
        subscriptionNFT.extendSubscription{value: SUBSCRIPTION_COST}(tokenId);
        vm.stopPrank();
        
        uint256 initialBalance = address(this).balance;
        
        subscriptionNFT.withdrawFees();
        
        uint256 finalBalance = address(this).balance;
        assertEq(finalBalance, initialBalance + SUBSCRIPTION_COST);
        assertEq(subscriptionNFT.totalCollectedFees(), 0);
    }
    
    // Add receive function to accept ETH
    receive() external payable {}
    
    function testWithdrawFeesNotOwner() public {
        vm.startPrank(user1);
        uint256 tokenId = subscriptionNFT.mint(user1);
        subscriptionNFT.extendSubscription{value: SUBSCRIPTION_COST}(tokenId);
        vm.stopPrank();
        
        vm.startPrank(user1);
        vm.expectRevert();
        subscriptionNFT.withdrawFees();
        vm.stopPrank();
    }
    
    function testEmergencyUpdateSubscription() public {
        vm.startPrank(user1);
        uint256 tokenId = subscriptionNFT.mint(user1);
        vm.stopPrank();
        
        uint256 newExpiration = block.timestamp + 60 days;
        subscriptionNFT.emergencyUpdateSubscription(tokenId, true, newExpiration);
        
        (uint256 expirationTime, bool isActive, ) = subscriptionNFT.getSubscriptionData(tokenId);
        assertEq(expirationTime, newExpiration);
        assertEq(isActive, true);
    }
    
    function testEmergencyUpdateSubscriptionNotOwner() public {
        vm.startPrank(user1);
        uint256 tokenId = subscriptionNFT.mint(user1);
        vm.stopPrank();
        
        vm.startPrank(user1);
        vm.expectRevert();
        subscriptionNFT.emergencyUpdateSubscription(tokenId, true, block.timestamp + 60 days);
        vm.stopPrank();
    }
    
    function testMintToZeroAddress() public {
        vm.expectRevert("Invalid recipient address");
        subscriptionNFT.mint(address(0));
    }
    
    function testGetSubscriptionDataNonExistentToken() public {
        vm.expectRevert("Token does not exist");
        subscriptionNFT.getSubscriptionData(999);
    }
    
    function testIsSubscriptionActiveNonExistentToken() public {
        vm.expectRevert("Token does not exist");
        subscriptionNFT.isSubscriptionActive(999);
    }
    
    function testGetTimeRemainingNonExistentToken() public {
        vm.expectRevert("Token does not exist");
        subscriptionNFT.getTimeRemaining(999);
    }
    
    function testExtendSubscriptionNonExistentToken() public {
        vm.startPrank(user1);
        vm.expectRevert("Token does not exist");
        subscriptionNFT.extendSubscription{value: SUBSCRIPTION_COST}(999);
        vm.stopPrank();
    }
    
    function testConstants() public view {
        assertEq(subscriptionNFT.subscriptionCost(), 10 ether);
        assertEq(subscriptionNFT.subscriptionDuration(), 30 days);
    }
    
    function testEvents() public {
        vm.startPrank(user1);
        
        vm.expectEmit(true, true, false, true);
        emit NFTMinted(user1, 1);
        uint256 tokenId = subscriptionNFT.mint(user1);
        
        vm.expectEmit(true, true, false, true);
        emit SubscriptionExtended(user1, tokenId, block.timestamp + SUBSCRIPTION_DURATION);
        subscriptionNFT.extendSubscription{value: SUBSCRIPTION_COST}(tokenId);
        
        vm.stopPrank();
    }
}
