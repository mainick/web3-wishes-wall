const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();

  const wishContractFactory = await hre.ethers.getContractFactory("WishesWall");
  const wishContract = await wishContractFactory.deploy();
  await wishContract.deployed();
  console.log("WishesWall contract address: ", wishContract.address);
  console.log("Contract deployed by", owner.address);

  let wishCount;
  wishCount = await wishContract.getTotalWishes();

  let wishTxn = await wishContract.wish("ciao");
  await wishTxn.wait();

  wishCount = await wishContract.getTotalWishes();

  wishTxn = await wishContract.connect(randomPerson).wish("ciao 2");
  await wishTxn.wait();

  wishCount = await wishContract.getTotalWishes();

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
