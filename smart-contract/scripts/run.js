const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();

  const wishContractFactory = await hre.ethers.getContractFactory("WishesWall");
  const wishContract = await wishContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await wishContract.deployed();
  console.log("WishesWall contract address: ", wishContract.address);
  console.log("Contract deployed by", owner.address);

  contractBalance = await hre.ethers.provider.getBalance(wishContract.address);
  console.log(
    "Contract balance: ",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let wishCount;
  wishCount = await wishContract.getTotalWishes();
  console.log("Total wishes: ", wishCount.toNumber());

  let wishTxn = await wishContract.wish("first wish");
  await wishTxn.wait();

  wishCount = await wishContract.getTotalWishes();
  console.log("Total wishes: ", wishCount.toNumber());

  contractBalance = await hre.ethers.provider.getBalance(wishContract.address);
  console.log(
    "Contract balance: ",
    hre.ethers.utils.formatEther(contractBalance)
  );

  wishTxn = await wishContract.connect(randomPerson).wish("second wish");
  await wishTxn.wait();

  wishCount = await wishContract.getTotalWishes();
  console.log("Total wishes: ", wishCount.toNumber());

  wishTxn = await wishContract.connect(randomPerson).wish("third wish");
  await wishTxn.wait();

  contractBalance = await hre.ethers.provider.getBalance(wishContract.address);
  console.log(
    "Contract balance: ",
    hre.ethers.utils.formatEther(contractBalance)
  );

  const wishesAll = await wishContract.getAllWishes();
  console.log("Wishes: ", wishesAll);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

runMain();
