const express = require('express');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const PropertyRegistry = require('./build/contracts/PropertyRegistry.json');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
let propertyRegistry;

const init = async () => {
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = PropertyRegistry.networks[networkId];
    propertyRegistry = new web3.eth.Contract(PropertyRegistry.abi, deployedNetwork && deployedNetwork.address);
};

init();

app.post('/registerProperty', async (req, res) => {
    const { location, owner, documentHash, account } = req.body;
    await propertyRegistry.methods.registerProperty(location, owner, documentHash).send({ from: account });
    const propertyCount = await propertyRegistry.methods.propertyCount().call();
    const property = await propertyRegistry.methods.getProperty(propertyCount).call();
    res.send(property);
});

app.get('/properties', async (req, res) => {
    const propertyCount = await propertyRegistry.methods.propertyCount().call();
    const properties = [];
    for (let i = 1; i <= propertyCount; i++) {
        const property = await propertyRegistry.methods.getProperty(i).call();
        properties.push(property);
    }
    res.send(properties);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
