import { useConnect, useSendTransaction, useSetActiveWallet } from "thirdweb/react";
import { inAppWallet, privateKeyToAccount, createWallet } from "thirdweb/wallets";
import { client } from "./twclient.js";
import { polygonAmoy } from "thirdweb/chains";
import { Address, prepareContractCall, sendAndConfirmTransaction, getContract } from "thirdweb";
import dotenv from 'dotenv';
import Pusher from './pusherClient.js';

dotenv.config();

// Subscribe to the 'transactions' channel
const pusher = new Pusher();
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
    txchannel.unbind_all();
    shipmentchannel.unbind_all();
    invoicechannel.unbind_all();
    txchannel.unsubscribe();
    shipmentchannel.unsubscribe();
    invoicechannel.unsubscribe();
    process.exit();
});