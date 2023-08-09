// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@api3/contracts/v0.8/interfaces/IProxy.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PriceFeed is Ownable {
    address public proxyAddress;

    function setProxyAddress ( address _proxyAddress) public onlyOwner {
        proxyAddress = _proxyAddress;
    }

    function readDataFeed() external view returns (int224 value, uint256 timestamp){
        (value, timestamp) = IProxy(proxyAddress).read();
    }
}