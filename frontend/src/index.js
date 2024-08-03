import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import PropertyRegistry from './contracts/PropertyRegistry.json';

const App = () => {
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const loadBlockchainData = async () => {
            const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
            const accounts = await web3.eth.requestAccounts();
            setAccount(accounts[0]);

            const networkId = await web3.eth.net.getId();
            const deployedNetwork = PropertyRegistry.networks[networkId];
            const propertyRegistry = new web3.eth.Contract(PropertyRegistry.abi, deployedNetwork && deployedNetwork.address);
            setContract(propertyRegistry);

            const propertyCount = await propertyRegistry.methods.propertyCount().call();
            const propertyArray = [];
            for (let i = 1; i <= propertyCount; i++) {
                const property = await propertyRegistry.methods.getProperty(i).call();
                propertyArray.push(property);
            }
            setProperties(propertyArray);
        };

        loadBlockchainData();
    }, []);

    const registerProperty = async (location, owner, documentHash) => {
        await contract.methods.registerProperty(location, owner, documentHash).send({ from: account });
        const propertyCount = await contract.methods.propertyCount().call();
        const property = await contract.methods.getProperty(propertyCount).call();
        setProperties([...properties, property]);
    };

    return (
        <div>
            <h1>Hao Finder - Property Registry</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                const location = e.target.location.value;
                const owner = e.target.owner.value;
                const documentHash = e.target.documentHash.value;
                registerProperty(location, owner, documentHash);
            }}>
                <input type="text" name="location" placeholder="Property Location" required />
                <input type="text" name="owner" placeholder="Owner Name" required />
                <input type="text" name="documentHash" placeholder="Document Hash" required />
                <button type="submit">Register Property</button>
            </form>
            <h2>Registered Properties</h2>
            <ul>
                {properties.map((property, index) => (
                    <li key={index}>
                        <p>ID: {property.id}</p>
                        <p>Location: {property.location}</p>
                        <p>Owner: {property.owner}</p>
                        <p>Document Hash: {property.documentHash}</p>
                        <p>Verified: {property.isVerified ? 'Yes' : 'No'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
