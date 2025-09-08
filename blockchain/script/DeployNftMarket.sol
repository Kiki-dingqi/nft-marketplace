// SPDX-Lisense-Identifier: MIT

pragma solidity ^0.8.0;
import {Script} from "forge-std/Script.sol";
import {NftMarket} from "../src/NftMarket.sol";

contract DeployNftMarket is Script {
    function run() external returns (address) {
        vm.startBroadcast();

        NftMarket nftMarket = new NftMarket();

        vm.stopBroadcast();

        return address(nftMarket);
    }
}