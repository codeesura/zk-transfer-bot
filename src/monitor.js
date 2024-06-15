const { ethers } = require("ethers");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("./config/wallets.json"));
const tokens = JSON.parse(fs.readFileSync("./config/tokens.json"));

const provider = new ethers.providers.JsonRpcProvider(config.providerUrl);

const tokenContract = new ethers.Contract(
  tokens.tokenAddress,
  tokens.abi,
  provider
);

const transferTokens = async (
  wallet,
  contractWithSigner,
  transferToAddress
) => {
  const balance = await contractWithSigner.balanceOf(wallet.address);
  if (balance.gt(ethers.constants.Zero)) {
    const gasLimit = await contractWithSigner.estimateGas.transfer(
      transferToAddress,
      balance
    );
    const tx = await contractWithSigner.transfer(transferToAddress, balance, {
      gasLimit,
    });
    console.log(
      `Transferred ${balance.toString()} tokens to ${transferToAddress}, tx hash: ${
        tx.hash
      }`
    );
  }
};

const monitorWallet = async (privateKey, transferToAddress) => {
  const wallet = new ethers.Wallet(privateKey, provider);
  const contractWithSigner = tokenContract.connect(wallet);
  console.log(`Monitoring wallet: ${wallet.address}`);

  console.log(`Checking initial balance for wallet: ${wallet.address}`);
  await transferTokens(wallet, contractWithSigner, transferToAddress);

  console.log("Waiting for transfer events...");
  tokenContract.on("Transfer", async (from, to, value, event) => {
    if (to.toLowerCase() === wallet.address.toLowerCase()) {
      console.log(`Received ${value.toString()} tokens from ${from}`);
      await transferTokens(wallet, contractWithSigner, transferToAddress);
    }
  });
};

config.wallets.forEach((wallet) => {
  (async function retryMonitor() {
    while (true) {
      try {
        await monitorWallet(wallet.privateKey, wallet.transferToAddress);
        break;
      } catch (error) {
        console.error(
          `Error monitoring wallet ${wallet.transferToAddress}:`,
          error
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  })();
});
