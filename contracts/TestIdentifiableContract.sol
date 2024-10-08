// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TestIdentifiableContract {
    string private contractName;
    string private contractDescription;

    constructor(string memory _name, string memory _description) {
        contractName = _name;
        contractDescription = _description;
    }

    function name() public view returns (string memory) {
        return contractName;
    }

    function description() public view returns (string memory) {
        return contractDescription;
    }

    function setName(string memory _newName) public {
        contractName = _newName;
    }

    function setDescription(string memory _newDescription) public {
        contractDescription = _newDescription;
    }
}