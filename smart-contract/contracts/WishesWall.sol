// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract WishesWall is Ownable {
    event NewWish(uint32 id, address indexed from, uint32 timestamp, string message);
    event NewVote(uint32 wishId, address indexed from, uint32 timestamp, uint8 vote);

    struct Wish {
        address owner;
        string message;
        uint32 timestamp;
        uint32 voteSum;
        uint16 voteCount;
    }

    uint32 totalWishes;
    Wish[] wishes;
    mapping(address => uint32) public lastWishAt;

    uint32 totalVotes;
    mapping(uint32 => address) public voters;

    uint32 private _secAfterWhenSendNewWish;
    uint8 private _voteLimitMax;
    uint256 private _seed;
    uint8 private _bonusThresholdPercent;
    uint8 private _bonusVoteThreshold;
    uint256 private _bonusInWei;

    constructor() payable {
        console.log("Hey, I'm the smart contract of the wall of wishes!");
        _secAfterWhenSendNewWish = 900;
        _voteLimitMax = 5;
        _seed = random();
        _bonusThresholdPercent = 50;
        _bonusVoteThreshold = 3;
        _bonusInWei = 10000000000000; // 0.00001 ether
    }

    function random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty, wishes.length))) % 100;
    }

    function setSecAfterWhenSendNewWish(uint32 _valueSet) external onlyOwner {
        _secAfterWhenSendNewWish = _valueSet;
    }

    function setVoteThreshold(uint8 _valueSet) external onlyOwner {
        require(_valueSet > 0 && _valueSet <= 255,"Vote threshold must be between 1 and 255");
        _voteLimitMax = _valueSet;
    }

    function setBonusThresholdPercent(uint8 _valueSet) external onlyOwner {
        require(_valueSet > 0 && _valueSet <= 100,"Bonus threshold must be between 1 and 100");
        _bonusThresholdPercent = _valueSet;
    }

    function setBonusVoteThreshold(uint8 _valueSet) external onlyOwner {
        require(_valueSet > 0 && _valueSet <= 255,"Bonus vote threshold must be between 1 and 255");
        _bonusVoteThreshold = _valueSet;
    }

    function setBonusInWei(uint256 _valueSet) external onlyOwner {
        require(_valueSet > 0,"Bonus must be greater than 0");
        _bonusInWei = _valueSet;
    }

    function wish(string memory _message) public {
        string memory msgError = string(abi.encodePacked("You can't make a wish more than once every ", Strings.toString(_secAfterWhenSendNewWish), " seconds! "));
        require(lastWishAt[msg.sender] + _secAfterWhenSendNewWish < block.timestamp, msgError);
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
        require(totalWishes > 0, "No votes yet!");

        uint32 sum = 0;
        for (uint i = 0; i < totalWishes; i++) {
            sum += wishes[i].voteSum;
        }
        return uint8(sum / totalVotes);
    }

    function getAverageRatingOfWish(uint32 _wishId) public view returns (uint8) {
        require(wishes[_wishId].voteCount > 0, "No votes for this wish yet!");
        return uint8(wishes[_wishId].voteSum / wishes[_wishId].voteCount);
    }

    function vote(uint32 _wishId, uint8 _rate) public payable {
        console.log("0 <= _rate <= %d", _voteLimitMax);
        string memory msgError = string(abi.encodePacked("Rate must be between 0 and ", Strings.toString(_voteLimitMax), "!"));
        require(0 <= _rate && _rate <= _voteLimitMax, msgError);
        require(voters[_wishId] != msg.sender, "You can't vote twice for the same wish!");

        wishes[_wishId].voteSum += _rate;
        wishes[_wishId].voteCount++;
        totalVotes++;
        voters[_wishId] = msg.sender;
        console.log("%s has voted %d for wish %d", msg.sender, _rate, _wishId);

        _seed = random();
        console.log("Random # generated: %d", uint8(_seed));
        console.log("Bonus Threshold Percent: %d", uint8(_bonusThresholdPercent));
        console.log("Bonus Vote Threshold: %d", uint8(_bonusVoteThreshold));
        if (uint8(_seed) <= uint8(_bonusThresholdPercent) && getAverageRatingOfWish(_wishId) > _bonusVoteThreshold) {
            require(_bonusInWei <= address(this).balance, "Contract don't have enough ether to send a wish!");
            (bool success, ) = (msg.sender).call{value: _bonusInWei}("");
            require(success, "Failed to withdraw money from contract.");

            console.log("%s has won %d wei!", msg.sender, _bonusInWei);
        }

        emit NewVote(_wishId, msg.sender, uint32(block.timestamp), _rate);
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
