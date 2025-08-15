// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "forge-std/Script.sol";
import "../src/SubscriptionNFT.sol";

contract DeploySubscriptionNFT is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        SubscriptionNFT subscriptionNFT = new SubscriptionNFT();
        
        vm.stopBroadcast();
        
        console.log("SubscriptionNFT deployed at:", address(subscriptionNFT));
        console.log("Deployer:", vm.addr(deployerPrivateKey));
    }
}
