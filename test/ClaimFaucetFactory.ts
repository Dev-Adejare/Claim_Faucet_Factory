const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ClaimFaucetFactory", function () {
  let ClaimFaucetFactory;
  let claimFaucetFactory: { deployed: () => any; connect: (arg0: any) => { (): any; new(): any; deployClaimFaucet: { (arg0: string, arg1: string): any; new(): any; }; getUserDeployedContracts: { (): any; new(): any; }; getUserDeployedContractByIndex: { (arg0: number): [any, any] | PromiseLike<[any, any]>; new(): any; }; claimFaucetFromContract: { (arg0: any): any; new(): any; }; }; deployClaimFaucet: (arg0: string, arg1: string) => any; getAllContractDeployed: () => any; getLengthOfDeployedContracts: () => any; getInfoFromContract: (arg0: any) => [any, any] | PromiseLike<[any, any]>; };
  let owner, user1: { address: any; }, user2: { address: any; };
  
  // Assume ClaimFaucet and MockERC20 are other contract mocks we will need to test this contract
  let ClaimFaucet;
  let MockERC20;
  let mockToken: { deployed: () => any; transfer: (arg0: any, arg1: number) => any; balanceOf: (arg0: any) => any; };

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    ClaimFaucetFactory = await ethers.getContractFactory("ClaimFaucetFactory");
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy the factory contract
    claimFaucetFactory = await ClaimFaucetFactory.deploy();
    await claimFaucetFactory.deployed();

    // Deploy ClaimFaucet contract (assumed) and a mock token for tests
    ClaimFaucet = await ethers.getContractFactory("ClaimFaucet");
    MockERC20 = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20.deploy("TestToken", "TST", 1000);
    await mockToken.deployed();
  });

  it("Should deploy a new ClaimFaucet contract", async function () {
    const tx = await claimFaucetFactory.connect(user1).deployClaimFaucet("TestFaucet", "TFT");
    const receipt = await tx.wait();
    const event = receipt.events.find((event: { event: string; }) => event.event === "Deployed");
    
    expect(event).to.not.be.undefined;
    expect(event.args.deployer).to.equal(user1.address);
    expect(event.args.deployedContract).to.not.equal(ethers.constants.AddressZero);

    // Verify contract stored
    const userDeployedContracts = await claimFaucetFactory.connect(user1).getUserDeployedContracts();
    expect(userDeployedContracts.length).to.equal(1);
  });

  it("Should revert on zero address deployment attempt", async function () {
    await expect(
      claimFaucetFactory.deployClaimFaucet("TestFaucet", "TFT")
    ).to.be.revertedWith("Zero not allowed");
  });

  it("Should return all deployed contracts", async function () {
    // Deploy multiple contracts
    await claimFaucetFactory.connect(user1).deployClaimFaucet("TestFaucet1", "TFT1");
    await claimFaucetFactory.connect(user1).deployClaimFaucet("TestFaucet2", "TFT2");

    const allContracts = await claimFaucetFactory.getAllContractDeployed();
    expect(allContracts.length).to.equal(2);
  });

  it("Should return user's deployed contracts", async function () {
    await claimFaucetFactory.connect(user1).deployClaimFaucet("TestFaucet1", "TFT1");
    await claimFaucetFactory.connect(user2).deployClaimFaucet("TestFaucet2", "TFT2");

    const user1Contracts = await claimFaucetFactory.connect(user1).getUserDeployedContracts();
    const user2Contracts = await claimFaucetFactory.connect(user2).getUserDeployedContracts();

    expect(user1Contracts.length).to.equal(1);
    expect(user2Contracts.length).to.equal(1);
    expect(user1Contracts[0].deployer).to.equal(user1.address);
    expect(user2Contracts[0].deployer).to.equal(user2.address);
  });

  it("Should return user contract info by index", async function () {
    await claimFaucetFactory.connect(user1).deployClaimFaucet("TestFaucet", "TFT");

    const [deployer, deployedContract] = await claimFaucetFactory.connect(user1).getUserDeployedContractByIndex(0);
    expect(deployer).to.equal(user1.address);
    expect(deployedContract).to.not.equal(ethers.constants.AddressZero);
  });

  it("Should return length of deployed contracts", async function () {
    await claimFaucetFactory.connect(user1).deployClaimFaucet("TestFaucet1", "TFT1");
    await claimFaucetFactory.connect(user1).deployClaimFaucet("TestFaucet2", "TFT2");

    const length = await claimFaucetFactory.getLengthOfDeployedContracts();
    expect(length).to.equal(2);
  });

  it("Should return token info from a deployed contract", async function () {
    const tx = await claimFaucetFactory.connect(user1).deployClaimFaucet("TestFaucet", "TFT");
    const receipt = await tx.wait();
    const deployedAddress = receipt.events.find((event: { event: string; }) => event.event === "Deployed").args.deployedContract;

    const [name, symbol] = await claimFaucetFactory.getInfoFromContract(deployedAddress);
    expect(name).to.equal("TestFaucet");
    expect(symbol).to.equal("TFT");
  });

  it("Should allow users to claim faucet tokens", async function () {
    // Deploy a mock faucet contract
    const tx = await claimFaucetFactory.connect(user1).deployClaimFaucet("TestFaucet", "TFT");
    const receipt = await tx.wait();
    const deployedAddress = receipt.events.find((event: { event: string; }) => event.event === "Deployed").args.deployedContract;

    // Mint tokens to the ClaimFaucet (mock)
    await mockToken.transfer(deployedAddress, 100);

    // User1 claims tokens
    await claimFaucetFactory.connect(user1).claimFaucetFromContract(deployedAddress);

    const balance = await mockToken.balanceOf(user1.address);
    expect(balance).to.be.above(0);
  });

  it("Should return user's token balance from a deployed contract", async function () {
    const tx = await claimFaucetFactory.connect(user1).deployClaimFaucet("TestFaucet", "TFT");
    const receipt = await tx.wait();
    const deployedAddress = receipt.events.find((event: { event: string; }) => event.event === "Deployed")}
