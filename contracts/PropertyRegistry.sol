// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PropertyRegistry {
    struct Property {
        uint256 id;
        string location;
        string owner;
        string documentHash;
        bool isVerified;
    }

    mapping(uint256 => Property) public properties;
    uint256 public propertyCount;
    address public admin;

    event PropertyRegistered(uint256 id, string location, string owner);
    event PropertyVerified(uint256 id);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function registerProperty(string memory location, string memory owner, string memory documentHash) public onlyAdmin {
        propertyCount++;
        properties[propertyCount] = Property(propertyCount, location, owner, documentHash, false);
        emit PropertyRegistered(propertyCount, location, owner);
    }

    function verifyProperty(uint256 id) public onlyAdmin {
        Property storage property = properties[id];
        require(property.id != 0, "Property does not exist");
        property.isVerified = true;
        emit PropertyVerified(id);
    }

    function getProperty(uint256 id) public view returns (Property memory) {
        return properties[id];
    }
}
