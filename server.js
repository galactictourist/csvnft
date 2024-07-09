(async () => {
    const { useConnect, useSendTransaction, useSetActiveWallet } = await import("thirdweb/react");
    const { inAppWallet, privateKeyToAccount, createWallet } = await import("thirdweb/wallets");
    const { client } = await import("./twclient.js");
    const { polygonAmoy } = await import("thirdweb/chains");
    const { Address, prepareContractCall, sendAndConfirmTransaction, getContract } = await import("thirdweb");
  
    require('dotenv').config();
  
    const pusher = require('./pusherClient.js');
    // Subscribe to the 'transactions' channel
  
    const txchannel = pusher.subscribe('transactions');
    txchannel.bind('pusher:subscription_succeeded', () => {
        console.log('Subscribed to transactions channel');
    });
    txchannel.bind('TransactionUpdated', (data) => {
        console.log('TransactionUpdated:', data);
        // Perform your actions with the data here
    });
  
    const shipmentchannel = pusher.subscribe('shipments');
    shipmentchannel.bind('pusher:subscription_succeeded', () => {
        console.log('Subscribed to shipments channel');
    });
    shipmentchannel.bind('ShipmentAdded', (data) => {
        console.log('ShipmentAdded:', data);
        // Perform your actions with the data here
    });
  
    const invoicechannel = pusher.subscribe('shipment-invoices');
    invoicechannel.bind('pusher:subscription_succeeded', () => {
        console.log('Subscribed to invoices channel');
    });
    invoicechannel.bind('ShipmentInvoiceCreated', (data) => {
        console.log('Invoice Created:', data);
        // Perform your actions with the data here
    });
    // To gracefully handle shutdowns
    process.on('SIGINT', () => {
        console.log('Shutting down...');
        channel.unbind_all();
        channel.unsubscribe();
        process.exit();
    });
  })();