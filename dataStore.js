const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'dataStore.json');

function readDataStore() {
    if (!fs.existsSync(dataFilePath)) {
        fs.writeFileSync(dataFilePath, JSON.stringify({ transactions: [], shipments: [] }, null, 2));
    }
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
}

function writeDataStore(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

module.exports = {
    readDataStore,
    writeDataStore
};