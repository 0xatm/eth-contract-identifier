# Eth Contract Identifier

A smart contract that allows you to retrieve name and/or description information from multiple contracts (tokens, price feeds, etc.) in a single RPC call.

## `ContractIdentifier.sol`

Enables querying multiple contracts for their name and description in a single call.

### Features:
- Query a single contract's name or description
- Batch query multiple contracts' names or descriptions
- Handles contracts that don't implement the required interface


#### Available Functions:
- `callName(address contractAddress)`: Retrieves the name of a single contract.
- `callDescription(address contractAddress)`: Retrieves the description of a single contract.
- `multiName(address[] contracts)`: Retrieves names of multiple contracts in one call.
- `multiDescription(address[] contracts)`: Retrieves descriptions of multiple contracts in one call.

## Usage

Deploy the contract on-chain to interact with other contracts that can be identified via `name()` or `description()`. Query single or multiple contracts in one transaction, reducing gas costs and simplifying data retrieval. 

For example, applicable contracts deployed by the AAVE and ether.fi protocols generally implement the ERC20Detailed interface or similar, and by extension, `name()`:

- [eth.fi Governance Token](https://etherscan.io/token/0xfe0c30065b384f05761f15d0cc899d4f9f9cc0eb#readContract)
- [AAVE: Ethereum USDT](https://etherscan.io/address/0x23878914efe38d27c4d67ab83ed1b93a74d4086a#readProxyContract)

Chainlink Off-chain Reporting contracts implement `description()`:

- [Chainlink: ETH/USD Price Feed](https://etherscan.io/address/0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419#readContract)

## Credits

- Inspired by [@wbobeirne](https://github.com/wbobeirne) whose eth-balance-checker I copied; and thanks [@henrynguyen5](https://github.com/henrynguyen5) for letting me use your desk