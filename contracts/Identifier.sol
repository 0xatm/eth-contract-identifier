// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Generic contract interface with name() and description()
interface IdentifiableContract {
    function name() external view returns (string memory);
    function description() external view returns (string memory);
}

contract ContractIdentifier {
    uint256 private constant GAS_LIMIT = 100000;
    uint256 private constant MAX_BATCH_SIZE = 100;

    error PaymentNotAccepted();
    error BatchSizeTooLarge(uint256 size);

    receive() external payable {
        revert PaymentNotAccepted();
    }

    fallback() external {
        revert("Function does not exist");
    }

    function callName(address contractAddress) public view returns (string memory result) {
        return _callContractFunction(contractAddress, abi.encodeWithSignature("name()"));
    }

    function callDescription(address contractAddress) public view returns (string memory result) {
        return _callContractFunction(contractAddress, abi.encodeWithSignature("description()"));
    }

    function multiName(address[] calldata contracts) external view returns (string[] memory results) {
        return _multiCall(contracts, abi.encodeWithSignature("name()"));
    }

    function multiDescription(address[] calldata contracts) external view returns (string[] memory results) {
        return _multiCall(contracts, abi.encodeWithSignature("description()"));
    }

    function _callContractFunction(address contractAddress, bytes memory data) private view returns (string memory result) {
        if (contractAddress.code.length == 0) {
            return "";
        }

        (bool callSuccess, bytes memory returnData) = contractAddress.staticcall(data);

        if (!callSuccess) {
            return "";
        }

        if (returnData.length == 0) {
            return "";
        }

        return abi.decode(returnData, (string));
    }

    function _multiCall(address[] calldata contracts, bytes memory data) private view returns (string[] memory results) {
        if (contracts.length > MAX_BATCH_SIZE) revert BatchSizeTooLarge(contracts.length);

        results = new string[](contracts.length);
        
        for(uint i = 0; i < contracts.length; i++) {
            results[i] = _callContractFunction(contracts[i], data);
        }
    
        return results;
    }
}
