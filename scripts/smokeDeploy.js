const { ethers } = require("ethers");

async function main() {
  const RPC = "http://127.0.0.1:8545";
  const provider = new ethers.JsonRpcProvider(RPC);

  // Use a known Hardhat account private key (local node)
  const pk = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"; // account #1
  const wallet = new ethers.Wallet(pk, provider);

  const factoryAddress = require("../deployment-latest.json").tokenFactory;
  const artifact = require("../deployment-latest.json").abi;

  console.log("Using factory:", factoryAddress);

  const factory = new ethers.Contract(factoryAddress, artifact, wallet);

  console.log("Calling createToken via wallet", wallet.address);
  const supply = ethers.parseUnits("123", 18);
  const tx = await factory.createToken("SmokeToken", "SMK", supply);
  console.log("Tx submitted:", tx.hash);
  const receipt = await tx.wait();
  console.log("Tx confirmed. Block:", receipt.blockNumber);

  // find TokenCreated event
  for (const log of receipt.logs) {
    try {
      const parsed = factory.interface.parseLog(log);
      if (parsed.name === 'TokenCreated') {
        console.log('TokenCreated event:', parsed.args);
      }
    } catch (e) {
      // ignore
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
