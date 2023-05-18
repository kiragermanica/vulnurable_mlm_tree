//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import "hardhat/console.sol";

interface IMlmTreeInternal {
    function getTax(uint _depth, uint _amount) external pure returns(uint);
    function setLevel(uint _investment) external pure returns(uint8);
}