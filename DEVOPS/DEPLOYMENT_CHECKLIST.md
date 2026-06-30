# Deployment Checklist — AYICOIN Platform

This checklist covers local, testnet (Sepolia/Polygon Mumbai), and mainnet deployment steps.

## Local (Hardhat)
- Start Hardhat node: `npx hardhat node`
- Deploy contracts: `npx hardhat run scripts/deployFactory.js --network localhost`
- Verify deployment: check `deployment-latest.json` and `frontend/src/config/contracts.js`
- Run smoke tests: `node scripts/smokeDeploy.js` and `node scripts/e2e.js`

## Sepolia / Polygon Mumbai (Testnets)
- Create `.env` with `PRIVATE_KEY` (deployer) and `ALCHEMY_API_KEY` / `INFURA_KEY`.
- Update `hardhat.config.js` networks with Sepolia and Polygon Mumbai RPC endpoints.
- Fund deployer address on Sepolia/Mumbai.
- Deploy: `npx hardhat run scripts/deployFactory.js --network sepolia` (or `polygonMumbai`).
- Verify contract on block explorer (Etherscan/Polygonscan) using `hardhat-etherscan` plugin.

## Mainnet (Preparation)
- Perform security audit or internal review.
- Update gas and optimization settings in `hardhat.config.js`.
- Get multi-sig and treasury addresses ready.
- Prepare migration plan and rollback instructions.

## Frontend
- Update `frontend/src/config/contracts.js` after each deployment (deploy script auto-updates this file).
- Ensure `ethers` version compatibility (v6) — use `BrowserProvider` and `JsonRpcProvider` as needed.
- Test wallet flows manually: connect MetaMask, switch network, deploy token, validate events.

## CI / Testing
- Add unit tests under `test/` for token mint/burn/transfer and factory edge cases.
- Add GitHub Actions workflow to run `npm test` and `npx hardhat test` on PRs.

## Rollout
- Staged rollouts: deploy to Sepolia → collect QA feedback → Polygon Mumbai → mainnet.
- Post-deployment: monitor for errors and collect user reports.
