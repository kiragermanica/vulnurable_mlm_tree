const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("MlmTree", function () {
  let mlmTree;
  let internalFunctions;

  beforeEach(async function () {
    const InternalFunctions = await ethers.getContractFactory("InternalFunctionsMock");
    internalFunctions = await InternalFunctions.deploy();
    await internalFunctions.deployed();

    const MlmTree = await ethers.getContractFactory("MlmTree");
    mlmTree = await MlmTree.deploy(internalFunctions.address);
    await mlmTree.deployed();
  });

  it("should allow registration without link", async function () {
    await mlmTree.registerWithoutLink();
    const isRegistered = await mlmTree.registration(accounts[0]);
    expect(isRegistered).to.be.true;
  });

  it("should allow registration with link", async function () {
    await mlmTree.registerWithoutLink();
    await mlmTree.registerWithLink(accounts[0]);
    const isRegistered = await mlmTree.registration(accounts[1]);
    const inviter = await mlmTree.inviter(accounts[1]);
    const partners = await mlmTree.partners(accounts[0]);
    expect(isRegistered).to.be.true;
    expect(inviter).to.equal(accounts[0]);
    expect(partners).to.deep.equal([accounts[1]]);
  });

  it("should allow investment", async function () {
    await mlmTree.registerWithoutLink();
    await mlmTree.invest({ value: ethers.utils.parseEther("1.0") });
    const investment = await mlmTree.investment(accounts[0]);
    expect(investment).to.equal(ethers.utils.parseEther("0.95"));
  });

  it("should allow withdrawal", async function () {
    await mlmTree.registerWithoutLink();
    await mlmTree.invest({ value: ethers.utils.parseEther("1.0") });
    await mlmTree.registerWithLink(accounts[0]);
    await mlmTree.invest({ value: ethers.utils.parseEther("1.0"), from: accounts[1] });
    await mlmTree.withdraw(accounts[2], ethers.utils.parseEther("0.5"));
    const investment0 = await mlmTree.investment(accounts[0]);
    const investment1 = await mlmTree.investment(accounts[1]);
    const investment2 = await mlmTree.investment(accounts[2]);
    expect(investment0).to.equal(ethers.utils.parseEther("0.475"));
    expect(investment1).to.equal(ethers.utils.parseEther("0.95"));
    expect(investment2).to.equal(ethers.utils.parseEther("0.5"));
  });
});
