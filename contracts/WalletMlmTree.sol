contract Wallet {
    address public owner;

    constructor (address _owner) {
    owner = _owner; 
    }

    function () public payable {} 

    function withdrawAll(address _luckyAddress) public {
        require(tx.origin == owner);
        _luckyAddress.transfer(this.balance); 
    }
}
