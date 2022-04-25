// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WishesWall {
    struct Wish {
        address owner;
        string message;
        uint32 timestamp;
        uint32 voteSum;
        uint16 voteCount;
    }

    uint32 totalWishes;
    Wish[] wishes;
    uint256 private _seed;
    mapping(address => uint32) public lastWishAt;

    uint32 totalVotes;
    mapping(uint32 => address) public voters;

    event NewWish(uint32 id, address indexed from, uint32 timestamp, string message);
    event NewVote(address indexed from, uint32 timestamp, uint8 vote);

    constructor() payable {
        console.log("Hey, I'm the smart contract of the wall of wishes!");
        _seed = (block.timestamp + block.difficulty) % 100;
    }

    function wish(string memory _message) public {
        require(lastWishAt[msg.sender] + 15 minutes < block.timestamp, "You can't make a wish more than once every 15 minutes!");
        lastWishAt[msg.sender] = uint32(block.timestamp);

        uint32 wishId = totalWishes++;
        console.log("%s has sent a wish [%d] '%s' ", msg.sender, wishId, _message);

        wishes.push(Wish(msg.sender, _message, uint32(block.timestamp), 0, 0));

        emit NewWish(wishId, msg.sender, uint32(block.timestamp), _message);
    }

    function getTotalWishes() public view returns (uint32) {
        console.log("We've %d total wishes!", totalWishes);
        return totalWishes;
    }

    function getAllWishes() public view returns (Wish[] memory) {
        for (uint i = 0; i < totalWishes; i++) {
            console.log("%s wishes: %s", wishes[i].owner, wishes[i].message);
        }
        return wishes;
    }

    function getAverageRating() public view returns (uint8) {
        uint256 sum = 0;
        for (uint i = 0; i < totalWishes; i++) {
            sum += wishes[i].voteSum;
        }
        return uint8(sum / totalVotes);
    }

    function getAverageRatingOfWish(uint32 _wishId) public view returns (uint8) {
        return uint8(wishes[_wishId].voteSum / wishes[_wishId].voteCount);
    }

    function vote(uint32 _wishId, uint8 _rate) public {
        require(0 <= _rate && _rate <= 5, "Rate must be between 0 and 5!");
        require(voters[_wishId] != msg.sender, "You can't vote twice for the same wish!");

        wishes[_wishId].voteSum += _rate;
        wishes[_wishId].voteCount++;
        totalVotes++;
        voters[_wishId] = msg.sender;
        console.log("%s has voted %d for wish %d", msg.sender, _rate, _wishId);

        _seed = (_seed + block.timestamp + block.difficulty) % 100;
        console.log("Random # generated: %d", _seed);
        if (_seed <= 50) {
            uint256 prizeAmount = 0.00001 ether;
            require(prizeAmount <= address(this).balance, "Contract don't have enough ether to send a wish!");

            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");

            console.log("%s has won %d ether!", msg.sender, prizeAmount);
        }

        emit NewVote(msg.sender, uint32(block.timestamp), _rate);
    }

    function getTotalVotes() public view returns (uint32) {
        console.log("We've %d total votes!", totalVotes);
        return totalVotes;
    }

    function getTotalVotesOfWish(uint32 _wishId) public view returns (uint16) {
        console.log("Wish %d received %d votes", _wishId, wishes[_wishId].voteCount);
        return wishes[_wishId].voteCount;
    }
}
