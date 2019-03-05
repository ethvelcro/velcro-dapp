# [DEPRECATED]

This repo was created for the ETHDenver 2019 Hackathon.  We're keeping this available for historical purposes.

The project has been rebranded as Notus.  You can refer to the new Notus dapp [Github project](https://github.com/NotifyUs/notus-dapp).

# Velcro DApp

A frontend for interacting with a Velcro node for monitoring smart contract events and firing off webhooks in response.

# Setup

Install dependencies:

```
$ yarn
```

Make sure you have `direnv` installed and copy `.envrc.example` to `.envrc`:

```
$ cp .envrc.example .envrc
$ direnv allow
```

Configure the GITHUB MOCK CONTRACTS contract addresses.  The project is already configured on Ropsten addresses in the file called `networks/3.json`.  To get up and running right away run:

```
$ yarn apply-registry
```

This will generate files that match the Truffle artifact shape for contract network configs.  These files are pulled into the app.  If you want to setup a custom test environment then you follow the custom contract configuration instructions below.

To run the local server, run:

```
$ yarn start
```

To build the production version of the site run:

```
$ yarn build
```

# Configuration

You can configure the app using environment variables:

| Environment Variable Name | Description | Recommended Value |
| --- | --- | --- |
| REACT_APP_ALLOWED_NETWORK_IDS | Network ids that the app recognizes.  We use 1234 as the local network id. | "1234 3 1" |
| REACT_APP_MAINNET_STARTING_BLOCK | Starting block number for event searches on mainnet.  Required! | 7189521 |
| REACT_APP_DEFAULT_NETWORK_NAME | Default network when no Ethereum provider is found. See [Ethers.js](https://docs.ethers.io/ethers.js/html/api-providers.html#connecting-to-ethereum) | homestead |
| REACT_APP_WS_API_URL | WebSocket url to connect to for logs from Velcro webhook triggers.  Required! | wss://api.ethvelcro.network |

## Custom Contract Addresses

We use [truffle-deploy-registry](https://github.com/MedXProtocol/truffle-deploy-registry) to manage the contract addresses.  TDR merges network config files into Truffle artifacts.  Each network config file stores an array of deployed contracts in chronological order.  The newest addresses for each contract and from each network config are merged into a standard Truffle artifact JSON object.

Create a network config for the contracts deployed to the GITHUB MOCK CONTRACTS.  The network id for ganache-cli is 1234, so create a file like so:

`networks/1234.json`

```json
[
  {
    "contractName": "Velcro",
    "address": "0x1234111111111111111111111111111111111111"
  }
]
```

Make sure to replace the above addresses with the actual addresses in the generated zos config file `zos.dev-1234.json` in the GITHUB MOCK CONTRACTS project directory.

Now generate the Truffle artifacts to be included in the build:

```
$ yarn apply-registry
```

This will generate Truffle-compatible artifacts in the `build/contracts` directory.

# Updating the Contract ABIs

The ABIs live in `src/apollo/abi`.  They are currently hard-coded in the app, so any changes to the contracts will require these files to be updated.

##### Made with :heart: by [Delta Camp](https://delta.camp)
