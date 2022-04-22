const { expect } = require("chai");
const { ethers } = require("hardhat");

const deployContract = async () => {
  const wishContractFactory = await ethers.getContractFactory("WishesWall");
  const wishContract = await wishContractFactory.deploy();
  await wishContract.deployed();
  return wishContract;
};

describe("WishesWall Test Suite", function () {
  it("Should return 0 wishes", async function () {
    const wishContract = await deployContract();

    const wishCount = await wishContract.getTotalWishes();
    expect(wishCount.toNumber()).to.equal(0);
  });

  it("Should send new wish", async function () {
    const wishContract = await deployContract();

    let wishTxn = await wishContract.wish("first wish");
    await wishTxn.wait();

    const wishCount = await wishContract.getTotalWishes();
    expect(wishCount.toNumber()).to.equal(1);
  });

  it("Should return all the wishes", async function () {
    const [, randomPerson] = await ethers.getSigners();
    const wishContract = await deployContract();

    let wishTxn = await wishContract.wish("first wish");
    await wishTxn.wait();

    wishTxn = await wishContract.connect(randomPerson).wish("second wish");
    await wishTxn.wait();

    const wishesAll = await wishContract.getAllWishes();
    expect(wishesAll.length).to.equal(2);
  });
});
