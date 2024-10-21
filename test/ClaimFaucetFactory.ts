import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect, should } from "chai";
import { ethers } from "hardhat"; // Import ethers directly
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";

describe("Claim_Faucet_Factory", function () {

  const token1:{name:string, symbol:string}= {
    name: "SoliuToken",
    symbol: "SLT"
  }
  const token2:{name:string, symbol:string}= {
    name: "AfulannyToken",
    symbol: "ALT"
  }

  async function deployClaimFaucetFactoryFixture() {
    const  ClaimFaucetFactory = await ethers.getContractFactory("ClaimFaucetFactory");
    const claimFaucetFactory = await ClaimFaucetFactory.deploy();

    const [deployer, otherAccount] = await ethers.getSigners(); // Get signers


    return { claimFaucetFactory, deployer, otherAccount};
  }
  
  describe('Deploy', () => {
    it("Should deploy claimaFaucetFactory correctly", async function name() {

      const {claimFaucetFactory} =  await loadFixture(deployClaimFaucetFactoryFixture);

      expect( await claimFaucetFactory.getAddress()).to.be.properAddress;
      
    });


    
  });

  describe('Functions', () => {
    it("should deploy ClaimFaucet contract correctly", async function () {
      
    
      const {claimFaucetFactory, deployer} = await loadFixture(deployClaimFaucetFactoryFixture);
      const deployedAddress =  await claimFaucetFactory.connect(deployer).deployClaimFaucet(token1.name, token1.symbol);

       expect(deployedAddress).to.not.undefined;
        expect((await claimFaucetFactory.connect(deployer).getUserDeployedContracts()).length).to.be.greaterThan(0);

    });

    
    it("should be able to get a deployed contract deployed by a user", async function () {

      const {claimFaucetFactory, deployer} = await loadFixture(deployClaimFaucetFactoryFixture);

      await claimFaucetFactory.connect(deployer).deployClaimFaucet(token1.name, token1.symbol);

      const [deployerAddr] = await claimFaucetFactory.connect(deployer).getUserDeployedContractByIndex(0);

      expect(deployerAddr).to.be.equal(deployer)
      
    }) 

    it("should be able to get info", async function () {
      const { claimFaucetFactory, deployer } = await loadFixture(deployClaimFaucetFactoryFixture);
    
      await claimFaucetFactory.connect(deployer).deployClaimFaucet(token1.name, token1.symbol);
    
     const [deployerAddr, deployedContractAddr] = await claimFaucetFactory.connect(deployer).getUserDeployedContractByIndex(0);
    
      const [fetchedName, fetchedSymbol] = await claimFaucetFactory.connect(deployer).getInfoFromContract(deployedContractAddr);
    
      expect(fetchedName).to.equal(token1.name);
      expect(fetchedSymbol).to.equal(token1.symbol);
    });


    it("user should be able to claim token and confirm if it claimed", async function () {
      const { claimFaucetFactory, deployer, otherAccount } = await loadFixture(deployClaimFaucetFactoryFixture);
    
      await claimFaucetFactory.deployClaimFaucet(token1.name, token1.symbol);

      const [deployerAddr, deployedContractAddr] = await claimFaucetFactory.connect(deployer).getUserDeployedContractByIndex(0);

      const initialClaimerBal = await claimFaucetFactory.connect(otherAccount).getBalanceFromDeployedContract(deployedContractAddr)


       const claimAmount = await claimFaucetFactory.connect(otherAccount).claimFaucetFromContract(deployedContractAddr)

       expect(claimAmount).to.not.undefined;

       expect(await claimFaucetFactory.connect(otherAccount).getBalanceFromDeployedContract(deployedContractAddr)).to.be.greaterThan(initialClaimerBal)
    
      
    });

    it("should get all the deployed contracts on this  platform", async function () {
      const { claimFaucetFactory, deployer, otherAccount } = await loadFixture(deployClaimFaucetFactoryFixture);
    
      await claimFaucetFactory.connect(deployer).deployClaimFaucet(token1.name, token1.symbol);
      await claimFaucetFactory.connect(otherAccount).deployClaimFaucet(token2.name, token2.symbol);

      const AllDeployedContracts = await claimFaucetFactory.getAllContractsDeployed();

      expect(AllDeployedContracts.length).to.be.equal(2)

      
      
    });


    it("should get all the deployed contracts by a user", async function () {
      const { claimFaucetFactory, otherAccount } = await loadFixture(deployClaimFaucetFactoryFixture);
    
      await claimFaucetFactory.connect(otherAccount).deployClaimFaucet(token1.name, token1.symbol);
      await claimFaucetFactory.connect(otherAccount).deployClaimFaucet(token2.name, token2.symbol);

      const AllDeployedContractsByAUSer = await claimFaucetFactory.connect(otherAccount).getUserDeployedContracts();

      expect(AllDeployedContractsByAUSer.length).to.be.equal(2)

      
      
    });
    
    
  })
  


 

 



 


});
