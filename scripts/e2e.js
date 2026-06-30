const { ethers } = require("ethers");

async function main() {
  const RPC = "http://127.0.0.1:8545";
  const provider = new ethers.JsonRpcProvider(RPC);

  // Use Hardhat account #0 as deployer
  const pk = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const wallet = new ethers.Wallet(pk, provider);

  const deployment = require("../deployment-latest.json");
  const factoryAddress = deployment.tokenFactory;
  const abi = deployment.abi;

  console.log("E2E: factory", factoryAddress);

  const factory = new ethers.Contract(factoryAddress, abi, wallet);

  // Create token via factory
  const supply = ethers.parseUnits("42", 18);
  const tx = await factory.createToken("E2EToken", "E2E", supply);
  console.log("Submitted tx:", tx.hash);
  const receipt = await tx.wait();
  console.log("Confirmed in block", receipt.blockNumber);

  // Read user tokens and token info
  const tokens = await factory.getUserTokens(wallet.address);
  console.log("User tokens count:", tokens.length);

  if (tokens.length > 0) {
    const tokenAddr = tokens[0];
    console.log("Fetching token info for", tokenAddr);
    const info = await factory.getTokenInfo(tokenAddr);
    console.log("TokenInfo:", info.name, info.symbol, info.initialSupply.toString());
  }
}

main().catch(err => { console.error(err); process.exit(1); });
