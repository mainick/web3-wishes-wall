import * as path from "path";
import * as fs from "fs";

const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  const wishContractFactory = await hre.ethers.getContractFactory("WishesWall");
  const wishContract = await wishContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.001"),
  });
  await wishContract.deployed();
  console.log("WishesWall contract address: ", wishContract.address);
};

const copyArtifacts = async () => {
  const abi_name_contract = "WishesWall.json";
  const dir_backend = path.resolve(__dirname, "..");
  const dir_frontend = path.resolve(__dirname, "../../frontend");

  const path_contract_abi = dir_backend + "/artifacts/contracts/WishesWall.sol";
  const dir_dest = dir_frontend + "/src";

  if (fs.existsSync(path_contract_abi)) {
    const statSrc = fs.statSync(path_contract_abi);
    if (statSrc.isDirectory()) {
      const files = fs.readdirSync(path_contract_abi);
      for (const file of files) {
        if (file === abi_name_contract) {
          const path_src = path_contract_abi + "/" + file;
          const path_dest = dir_dest + "/" + file;
          fs.copyFileSync(path_src, path_dest);
        }
      }
    }
  }
};

const runMain = async () => {
  try {
    await main();
    await copyArtifacts();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
