const { mintNFT, uploadToIPFS } = require('./nftMinter.js');
const { readDataStore, writeDataStore } = require('./dataStore.js');
const schedule = require('node-schedule');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomTime() {
    const start = new Date();
    start.setHours(8, 0, 0, 0); // 8 AM EST
    const end = new Date();
    end.setHours(17, 0, 0, 0); // 5 PM EST

    const randomTime = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomTime;
}

async function scheduleMinting() {
    const dataStore = readDataStore();
    const transactions = dataStore.transactions.filter(tx => !tx.minted);
    const shipments = dataStore.shipments.filter(sh => !sh.minted);

    if (transactions.length === 0 || shipments.length === 0) {
        console.log('No data to mint');
        return;
    }

    const batchSize = getRandomInt(1, 5);
    const transactionBatch = transactions.splice(0, batchSize);
    const shipmentBatch = shipments.splice(0, batchSize);

    for (const transaction of transactionBatch) {
        try {
            await mintNFT(process.env.REACT_APP_CONTRACT_ADDRESS_T, "0x7B0B9d0382e98C02bF6Fd0efA4A0A7B7CDBD7288", transaction.id);
            console.log('Transaction NFT minted successfully');
            transaction.minted = true;
        } catch (error) {
            console.error('Error minting transaction NFT', error);
        }
    }

    for (const shipment of shipmentBatch) {
        const metadata = {
            transaction_id: shipment.transaction_id,
            mode_type: shipment.mode_type,
            shipment_type: shipment.load_type
        };

        try {
            const cid = await uploadToIPFS(metadata);
            await mintNFT(process.env.REACT_APP_CONTRACT_ADDRESS_S, "0x7B0B9d0382e98C02bF6Fd0efA4A0A7B7CDBD7288", shipment.id, cid);
            console.log('Shipment NFT minted successfully');
            shipment.minted = true;
        } catch (error) {
            console.error('Error minting shipment NFT', error);
        }
    }

    writeDataStore(dataStore);

    if (transactions.length > 0 || shipments.length > 0) {
        const nextMintTime = getRandomTime();
        schedule.scheduleJob(nextMintTime, scheduleMinting);
    }
}

// Schedule the first minting job for the next day at 8 AM EST
const firstMintTime = new Date();
firstMintTime.setDate(firstMintTime.getDate() + 1);
firstMintTime.setHours(8, 0, 0, 0);
schedule.scheduleJob(firstMintTime, scheduleMinting);

module.exports = scheduleMinting;