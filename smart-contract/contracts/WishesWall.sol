// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WishesWall {
    struct Wish {
        address owner;
        string message;
        uint256 timestamp;
    }

    uint256 totalWishes;
    Wish[] wishes;
    uint256 private _seed;
    mapping(address => uint256) public lastWishAt;

    event NewWish(address indexed from, uint256 timestamp, string message);

    constructor() payable {
        console.log("Hey, I'm the smart contract of the wall of wishes!");
        _seed = (block.timestamp + block.difficulty) % 100;
    }

    function wish(string memory _message) public {
        require(lastWishAt[msg.sender] + 15 minutes < block.timestamp, "You can't make a wish more than once every 15 minutes!");
        lastWishAt[msg.sender] = block.timestamp;

        totalWishes++;
        console.log("%s has sent a wish %s", msg.sender, _message);

        wishes.push(Wish(msg.sender, _message, block.timestamp));

        _seed = (_seed + block.timestamp + block.difficulty) % 100;
        console.log("Random # generated: %d", _seed);
        if (_seed <= 50) {
            uint256 prizeAmount = 0.0001 ether;
            require(prizeAmount <= address(this).balance, "You don't have enough ether to send a wish!");

            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");

            console.log("%s has won %d ether!", msg.sender, prizeAmount);
        }

        emit NewWish(msg.sender, block.timestamp, _message);
    }

    function getTotalWishes() public view returns (uint256) {
        console.log("We've %d total wishes!", totalWishes);
        return totalWishes;
    }

    function getAllWishes() public view returns (Wish[] memory) {
        for (uint i = 0; i < totalWishes; i++) {
            console.log("%s wishes: %s", wishes[i].owner, wishes[i].message);
        }
        return wishes;
    }
}
