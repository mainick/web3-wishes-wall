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

    constructor() {
        console.log("Hey, I'm the smart contract of the wall of wishes!");
    }

    event newWish(address indexed from, uint256 timestamp, string message);

    function wish(string memory _message) public {
        totalWishes++;
        console.log("%s has sent a wish %s", msg.sender, _message);

        wishes.push(Wish(msg.sender, _message, block.timestamp));

        emit newWish(msg.sender, block.timestamp, _message);

        uint256 priceAmount = 0.0001 ether;
        require(priceAmount <= address(this).balance, "You don't have enough ether to send a wish!");

        (bool success, ) = (msg.sender).call{value: priceAmount}("");
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
