const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenFactory", function () {
  it("deploys factory and creates a token", async function () {
    const [deployer] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("TokenFactory");
    const factory = await Factory.deploy();
    await factory.waitForDeployment();

    const tx = await factory.createToken("Test Token", "TST", 100);
    await tx.wait();

    const tokens = await factory.getUserTokens(deployer.address);
    expect(tokens.length).to.equal(1);

    const tokenAddress = tokens[0];
    const Token = await ethers.getContractAt("AyicoinToken", tokenAddress);

    expect(await Token.name()).to.equal("Test Token");
    expect(await Token.symbol()).to.equal("TST");

    const total = await Token.totalSupply();
    const expected = ethers.parseUnits("100", 18);
    expect(total).to.equal(expected);
  });
});
