const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const ToDoList = await hre.ethers.getContractFactory("ToDoList");

  // Deploy the contract
  const toDoList = await ToDoList.deploy();
  
  // Wait for the contract to be deployed
  await toDoList.waitForDeployment();

  // Log the address of the deployed contract
  console.log("ToDoList deployed to:", toDoList.target);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
