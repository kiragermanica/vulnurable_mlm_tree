//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//import "hardhat/console.sol";
import "./IMlmTreeInternal.sol";

contract MlmTree {

    IMlmTreeInternal internalFunctions;

    constructor(address _internalFunctions) {
        internalFunctions = IMlmTreeInternal(_internalFunctions);
    }

    modifier onlyRegistered() {
        require(registration[msg.sender] == true, "You are not registered");
        _;
    }

    mapping(address => bool) registration;
    mapping(address => uint) investment;
    mapping(address => address) inviter;
    mapping(address => address[]) partners;

    function registerWithoutLink() external {
        require(registration[msg.sender] == false, "You are already registered");
        registration[msg.sender] = true;
    }

    function registerWithLink(address _inviter) external {
        require(registration[msg.sender] == false, "You are already registered");
        require(registration[_inviter] == true, "You can't specify an unregistered address as the inviter");
        require(msg.sender != _inviter, "You can't invite yourself =)");
        registration[msg.sender] = true;
        inviter[msg.sender] = _inviter;
        partners[_inviter].push(msg.sender);
    }

    function getLevel() external view onlyRegistered returns(uint8) {
        return internalFunctions.setLevel(investment[msg.sender]);
    } 

    function getPartners() external view onlyRegistered returns(uint, uint[] memory) {
        uint[] memory levels = new uint[](partners[msg.sender].length);
        for(uint i = 0; i < partners[msg.sender].length; i++) {
            levels[i] = internalFunctions.setLevel(investment[msg.sender]);
        }
        return (partners[msg.sender].length, levels);
    }

    function invest() external payable onlyRegistered {
        investment[msg.sender] += ((msg.value * 95) / 100);
    }

    function getInviter(uint _depth, address _addr) internal view returns(address) {
        for(uint i = 1; i <= _depth; i++) {
            _addr = inviter[_addr];
        }
        return _addr;
    }

    function withdraw(address _to, uint _amount) external payable onlyRegistered() {
        require(investment[msg.sender] >= _amount, "Not enough ether");
        investment[msg.sender] -= _amount;
        uint taxSum;
        for(uint i = 1; i <= 10; i++){
            address ancestor = getInviter(i, msg.sender);
            if(ancestor == address(0)) break; 
            if(internalFunctions.setLevel(investment[ancestor]) >= i) {
                uint tax = internalFunctions.getTax(i, _amount);
                taxSum += tax;               
                investment[ancestor] += tax; 
            }
        }
        (bool success, ) = _to.call{value:(_amount - taxSum)}("");
        require(success, "Failed to send ether");
    } 

}