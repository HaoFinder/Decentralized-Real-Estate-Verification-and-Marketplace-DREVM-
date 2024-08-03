// truffle-config.js

const path = require("path");

module.exports = {
  contracts_build_directory: path.join(__dirname, "frontend/src/contracts"),
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
    },
    trontestnet: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://api.shasta.trongrid.io`),
      network_id: '*', // Match any network id
      gas: 2000000,
      gasPrice: 20000000000,
      from: process.env.DEPLOYER_ADDRESS,
    },
  },
  compilers: {
    solc: {
      version: "0.8.0", // Fetch exact version from solc-bin (default: truffle's version)
    },
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY,
    bscscan: process.env.BSCSCAN_API_KEY,
    polygonscan: process.env.POLYGONSCAN_API_KEY,
  }
};
