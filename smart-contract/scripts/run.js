const getContractBalance = async (contract) => {
  return await hre.ethers.provider.getBalance(contract.address);
};

const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();

  const wishContractFactory = await hre.ethers.getContractFactory("WishesWall");
  const wishContract = await wishContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await wishContract.deployed();
  console.log("WishesWall contract address: ", wishContract.address);
  console.log("Contract deployed by", owner.address);

  let contractBalance = await getContractBalance(wishContract);
  console.log(
    "Contract balance: ",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let wishCount;
  wishCount = await wishContract.getTotalWishes();
  console.log("Total wishes: ", wishCount);

  let wishTxn = await wishContract.wish("first wish", {
    gasLimit: 210000,
  });
  await wishTxn.wait();

  wishCount = await wishContract.getTotalWishes();
  console.log("Total wishes: ", wishCount);

  wishTxn = await wishContract.connect(randomPerson).wish("second wish", {
    gasLimit: 210000,
  });
  await wishTxn.wait();

  wishCount = await wishContract.getTotalWishes();
  console.log("Total wishes: ", wishCount);

  const wishesAll = await wishContract.getAllWishes();
  console.log("Wishes: ", wishesAll);

  let voteCount;
  voteCount = await wishContract.getTotalVotes();
  console.log("Total votes: ", voteCount);

  let voteCountWish;
  voteCountWish = await wishContract.getTotalVotesOfWish(0);
  console.log("Total votes for wish 0: ", voteCountWish);

  let voteTnx = await wishContract.vote(0, 2, {
    gasLimit: 210000,
  });
  await voteTnx.wait();

  contractBalance = await getContractBalance(wishContract);
  console.log(
    "Contract balance: ",
    hre.ethers.utils.formatEther(contractBalance)
  );

  voteCount = await wishContract.getTotalVotes();
  console.log("Total votes: ", voteCount);

  voteCountWish = await wishContract.getTotalVotesOfWish(0);
  console.log("Total votes for wish 0: ", voteCountWish);

  voteTnx = await wishContract.connect(randomPerson).vote(0, 5, {
    gasLimit: 210000,
  });
  await voteTnx.wait();

  contractBalance = await getContractBalance(wishContract);
  console.log(
    "Contract balance: ",
    hre.ethers.utils.formatEther(contractBalance)
  );

  voteTnx = await wishContract.connect(randomPerson).vote(1, 4, {
    gasLimit: 210000,
  });
  await voteTnx.wait();

  contractBalance = await getContractBalance(wishContract);
  console.log(
    "Contract balance: ",
    hre.ethers.utils.formatEther(contractBalance)
  );

  voteCount = await wishContract.getTotalVotes();
  console.log("Total votes: ", voteCount);

  voteCountWish = await wishContract.getTotalVotesOfWish(0);
  console.log("Total votes for wish 0: ", voteCountWish);

  voteCountWish = await wishContract.getTotalVotesOfWish(1);
  console.log("Total votes for wish 1: ", voteCountWish);

  const wishesAll2 = await wishContract.getAllWishes();
  console.log("Wishes: ", wishesAll2);

  let avgRating = await wishContract.getAverageRating();
  console.log("average rating: ", avgRating);

  let avgRatingWish = await wishContract.getAverageRatingOfWish(0);
  console.log("average rating of wish 0: ", avgRatingWish);

  avgRatingWish = await wishContract.getAverageRatingOfWish(1);
  console.log("average rating of wish 1: ", avgRatingWish);
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
