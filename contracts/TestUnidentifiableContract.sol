// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TestUnidentifiableContract {
    uint256 private value;

    constructor(uint256 _initialValue) {
        value = _initialValue;
    }

    function getValue() public view returns (uint256) {
        return value;
    }

    function setValue(uint256 _newValue) public {
        value = _newValue;
    }

    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }
}
