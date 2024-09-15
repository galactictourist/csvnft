const readCSV = require('./csvReader');
const initializeNFTMinter = require('./nftMinter');
const { performance } = require('perf_hooks');

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function processCSV(startRow, numRows) {
    const { mintNFT, uploadToIPFS } = await initializeNFTMinter();
    const data = await readCSV(startRow, numRows);

    const startTime = performance.now();

    for (const row of data) {
        const transactionMetadata = {
            company_id: row.company_id,
            created_by: row.created_by,
            shipment_id: row.shipment_id,
            location_id: row.location_id,
            status: row.status,
            source_id: row.source_id,
            validated_by: row.validated_by,
        };

        const shipmentMetadata = {
            transaction_id: row.transaction_id,
            company_id: row.company_id,
            created_by: row.created_by,
            mode: row.mode,
            shipment_type: row.shipment_type,
            location_id: row.location_id,
            status: row.status,
            source_id: row.source_id,
            product_id: null,
            package_id: null,
            pallet_id: null,
            validated_by: row.validated_by,
        };

        const invoiceMetadata = {
            transaction_id: row.transaction_id,
            shipment_id: row.shipment_id,
            created_by: row.created_by,
            invoice_date: null,
            due_date: null,
            payment_terms: null,
            invoice_amount: row.invoice_amount,
            status: row.status,
            source_id: row.source_id,
            validated_by: row.validated_by,
        };

        try {
            const transactionCid = await uploadToIPFS(transactionMetadata);
            const transactionReceipt = await mintNFT(process.env.REACT_APP_CONTRACT_ADDRESS_T, "0xD00645635ab16cD8C9d1af5837CFd6b392eB3995", row.transaction_id, transactionCid);
            console.log(`Transaction NFT minted successfully: ${transactionReceipt.transactionHash}`);

            const shipmentCid = await uploadToIPFS(shipmentMetadata);
            const shipmentReceipt = await mintNFT(process.env.REACT_APP_CONTRACT_ADDRESS_S, "0xD00645635ab16cD8C9d1af5837CFd6b392eB3995", row.shipment_id, shipmentCid);
            console.log(`Shipment NFT minted successfully: ${shipmentReceipt.transactionHash}`);

            const invoiceCid = await uploadToIPFS(invoiceMetadata);
            const invoiceReceipt = await mintNFT(process.env.REACT_APP_CONTRACT_ADDRESS_I, "0xD00645635ab16cD8C9d1af5837CFd6b392eB3995", row.invoice_id, invoiceCid);
            console.log(`Invoice NFT minted successfully: ${invoiceReceipt.transactionHash}`);
        } catch (error) {
            console.error('Error processing row:', error);
        }

        const pauseTime = getRandomInt(3, 7) * 60000; // Random pause between 3, 5, or 7 minutes
        await new Promise(resolve => setTimeout(resolve, pauseTime));
    }

    const endTime = performance.now();
    const elapsedTime = (endTime - startTime) / 60000; // Convert to minutes
    console.log(`Elapsed time: ${elapsedTime.toFixed(2)} minutes`);
    console.log("finished");
}

module.exports = processCSV;