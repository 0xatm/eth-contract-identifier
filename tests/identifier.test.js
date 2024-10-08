/* eslint-disable no-undef */
// Right click on the script name and hit "Run" to execute
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ContractIdentifier", function () {
  let ContractIdentifier;
  let TestIdentifiableContract;
  let TestUnidentifiableContract;
  let contractIdentifier;
  let identifiableContract1;
  let identifiableContract2;
  let unidentifiableContract;

  before(async function () {
    ContractIdentifier = await ethers.getContractFactory("ContractIdentifier");
    TestIdentifiableContract = await ethers.getContractFactory("TestIdentifiableContract");
    TestUnidentifiableContract = await ethers.getContractFactory("TestUnidentifiableContract");

    contractIdentifier = await ContractIdentifier.deploy();
    identifiableContract1 = await TestIdentifiableContract.deploy("Contract1", "Description1");
    identifiableContract2 = await TestIdentifiableContract.deploy("Contract2", "Description2");
    unidentifiableContract = await TestUnidentifiableContract.deploy(42);

    await Promise.all([
      contractIdentifier.deployed(),
      identifiableContract1.deployed(),
      identifiableContract2.deployed(),
      unidentifiableContract.deployed()
    ]);

    console.log("All contracts deployed successfully");
  });

  describe("Single Address Calls", function () {
    it("should correctly call name() on an identifiable contract", async function () {
      const name = await contractIdentifier.callName(identifiableContract1.address);
      expect(name).to.equal("Contract1");
    });

    it("should correctly call description() on an identifiable contract", async function () {
      const description = await contractIdentifier.callDescription(identifiableContract1.address);
      expect(description).to.equal("Description1");
    });

    it("should return empty string when calling name() on an unidentifiable contract", async function () {
      const name = await contractIdentifier.callName(unidentifiableContract.address);
      expect(name).to.equal("");
    });

    it("should return empty string when calling description() on an unidentifiable contract", async function () {
      const description = await contractIdentifier.callDescription(unidentifiableContract.address);
      expect(description).to.equal("");
    });

    it("should return empty string when calling name() on a non-existent contract", async function () {
      const nonExistentAddress = ethers.constants.AddressZero;
      const name = await contractIdentifier.callName(nonExistentAddress);
      expect(name).to.equal("");
    });
  });

  describe("Multi Address Calls", function () {
    it("should correctly call name() on multiple identifiable contracts", async function () {
      const names = await contractIdentifier.multiName([identifiableContract1.address, identifiableContract2.address]);
      expect(names).to.deep.equal(["Contract1", "Contract2"]);
    });

    it("should correctly call description() on multiple identifiable contracts", async function () {
      const descriptions = await contractIdentifier.multiDescription([identifiableContract1.address, identifiableContract2.address]);
      expect(descriptions).to.deep.equal(["Description1", "Description2"]);
    });

    it("should handle a mix of identifiable and unidentifiable contracts for name()", async function () {
      const names = await contractIdentifier.multiName([identifiableContract1.address, unidentifiableContract.address, identifiableContract2.address]);
      expect(names).to.deep.equal(["Contract1", "", "Contract2"]);
    });

    it("should handle a mix of identifiable and unidentifiable contracts for description()", async function () {
      const descriptions = await contractIdentifier.multiDescription([identifiableContract1.address, unidentifiableContract.address, identifiableContract2.address]);
      expect(descriptions).to.deep.equal(["Description1", "", "Description2"]);
    });

    it("should revert when batch size exceeds MAX_BATCH_SIZE", async function () {
      const MAX_BATCH_SIZE = 100;
      const largeAddressArray = Array(MAX_BATCH_SIZE + 1).fill(identifiableContract1.address);
      
      await expect(contractIdentifier.multiName(largeAddressArray))
        .to.be.revertedWith(
          "BatchSizeTooLarge"
        );
    });
  });

  // Times out in Remix?
  describe("Edge Cases", function () {
    it("should reject direct payments", async function () {
      const [signer] = await ethers.getSigners();
      await expect(signer.sendTransaction({
        to: contractIdentifier.address,
        value: ethers.utils.parseEther("1.0"),
        gasLimit: 100000
      })).to.be.reverted;
    });

    it("should reject calls to non-existent functions", async function () {
      const [signer] = await ethers.getSigners();
      await expect(signer.sendTransaction({
        to: contractIdentifier.address,
        data: "0x12345678",
        gasLimit: 100000
      })).to.be.reverted;
    });
  });
});