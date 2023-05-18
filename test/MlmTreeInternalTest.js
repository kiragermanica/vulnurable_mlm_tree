const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("MlmTreeInternal", function () {
  let mlmTreeInternal;

  beforeEach(async function () {
    const MlmTreeInternal = await ethers.getContractFactory("MlmTreeInternal");
    mlmTreeInternal = await MlmTreeInternal.deploy();
    await mlmTreeInternal.deployed();
  });

  it("should calculate tax correctly", async function () {
    const tax1 = await mlmTreeInternal.getTax(1, ethers.utils.parseEther("1.0"));
    const tax2 = await mlmTreeInternal.getTax(2, ethers.utils.parseEther("1.0"));
    const tax3 = await mlmTreeInternal.getTax(3, ethers.utils.parseEther("1.0"));
    const tax4 = await mlmTreeInternal.getTax(4, ethers.utils.parseEther("1.0"));
    const tax5 = await mlmTreeInternal.getTax(5, ethers.utils.parseEther("1.0"));
    expect(tax1).to.equal(ethers.utils.parseEther("0.01"));
    expect(tax2).to.equal(ethers.utils.parseEther("0.007"));
    expect(tax3).to.equal(ethers.utils.parseEther("0.005"));
    expect(tax4).to.equal(ethers.utils.parseEther("0.002"));
    expect(tax5).to.equal(ethers.utils.parseEther("0.001"));
  });

  it("should calculate level correctly", async function () {
    const level1 = await mlmTreeInternal.setLevel(ethers.utils.parseEther("0.001"));
    const level2 = await mlmTreeInternal.setLevel(ethers.utils.parseEther("0.01"));
    const level3 = await mlmTreeInternal.setLevel(ethers.utils.parseEther("0.1"));
    const level4 = await mlmTreeInternal.setLevel(ethers.utils.parseEther("1.0"));
    const level5 = await mlmTreeInternal.setLevel(ethers.utils.parseEther("10.0"));
    const level6 = await mlmTreeInternal.setLevel(ethers.utils.parseEther("100.0"));
    expect(level1).to.equal(0);
    expect(level2).to.equal(1);
    expect(level3).to.equal(2);
    expect(level4).to.equal(3);
    expect(level5).to.equal(4);
    expect(level6).to.equal(5);
  });
});
