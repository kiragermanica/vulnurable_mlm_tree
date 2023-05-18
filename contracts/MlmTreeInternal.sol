//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import "hardhat/console.sol";
import "./IMlmTreeInternal.sol";

contract MlmTreeInternal{

    function getTax(uint _depth, uint _amount) public pure returns(uint) {
        if (_depth > 5) _depth = 5;
        uint[5] memory taxPercent = [
            _amount / 100, (_amount * 7) / 1000, _amount / 200, _amount / 500, _amount / 1000
        ]; 
        return taxPercent[_depth - 1];
    }

    function setLevel(uint _investment) public pure returns(uint8) {
        uint64[10] memory level = [
            0.005 ether, 0.01 ether, 0.02 ether, 0.05 ether, 0.1 ether,
            0.2 ether, 0.5 ether, 1 ether, 2 ether, 5 ether
        ];
        for(uint8 i = 0; i < 10; i++) {
            if (_investment < level[i]) {
                return i;
            }
        }
        return 10;
    }
}