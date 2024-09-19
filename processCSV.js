const initialize = require('./nftMinter');
const readCSV = require('./csvReader');

async function processCSV(startRow, numRows) {
    const { mintNFT, uploadToIPFS } = await initialize();
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
            const transactionTokenURI = `ipfs://${transactionCid}`;
            const transactionReceipt = await mintNFT(process.env.REACT_APP_CONTRACT_ADDRESS_T, "0xD00645635ab16cD8C9d1af5837CFd6b392eB3995", row.transaction_id, transactionTokenURI);
            console.log(`Transaction NFT minted successfully: ${transactionReceipt.transactionHash}`);

            await new Promise(resolve => setTimeout(resolve, 15000)); // 15 seconds pause

            const shipmentCid = await uploadToIPFS(shipmentMetadata);
            const shipmentTokenURI = `ipfs://${shipmentCid}`;
            const shipmentReceipt = await mintNFT(process.env.REACT_APP_CONTRACT_ADDRESS_S, "0xD00645635ab16cD8C9d1af5837CFd6b392eB3995", row.shipment_id, shipmentTokenURI);
            console.log(`Shipment NFT minted successfully: ${shipmentReceipt.transactionHash}`);

            await new Promise(resolve => setTimeout(resolve, 15000)); // 15 seconds pause

            const invoiceCid = await uploadToIPFS(invoiceMetadata);
            const invoiceTokenURI = `ipfs://${invoiceCid}`;
            const invoiceReceipt = await mintNFT(process.env.REACT_APP_CONTRACT_ADDRESS_I, "0xD00645635ab16cD8C9d1af5837CFd6b392eB3995", row.invoice_id, invoiceTokenURI);
            console.log(`Invoice NFT minted successfully: ${invoiceReceipt.transactionHash}`);
        } catch (error) {
            console.error('Error processing row:', error);
            if (error.code === -32000) {
                console.error('RPC error response:', error.message);
                // Additional logging or handling based on the error message
                console.error('Admin wallet key:', process.env.REACT_APP_ADMIN_WALLET_KEY);
            }
        }

        await new Promise(resolve => setTimeout(resolve, 60000)); // 1 minute pause between rows
    }

    const endTime = performance.now();
    console.log("finished");
}

module.exports = processCSV;