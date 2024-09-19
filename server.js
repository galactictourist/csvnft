const dotenv = require('dotenv');
dotenv.config();
const processCSV = require('./processCSV');

(async () => {
    const startRow = 1;
    const numRows = 3;

    try {
        await processCSV(startRow, numRows);
    } catch (error) {
        console.error('Error in main process:', error);
        console.log('Admin account address:', process.env.REACT_APP_ADMIN_WALLET_ADDRESS);
        console.log('Admin wallet key:', process.env.REACT_APP_ADMIN_WALLET_KEY);
        console.log('Client ID:', process.env.REACT_APP_CLIENT_ID);
        console.log('Thirdweb Secret Key:', process.env.REACT_APP_THREEWEB_SECRET_KEY);
        console.log('Contract Address T:', process.env.REACT_APP_CONTRACT_ADDRESS_T);
        console.log('Contract Address S:', process.env.REACT_APP_CONTRACT_ADDRESS_S);
        console.log('Contract Address I:', process.env.REACT_APP_CONTRACT_ADDRESS_I);
    }

    // To process additional rows, you can call processCSV with different parameters
    // Example: await processCSV(21, 21); // This will process the next 21 rows
})();