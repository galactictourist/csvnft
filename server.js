const dotenv = require('dotenv');
dotenv.config();
const processCSV = require('./processCSV');

(async () => {
    const startRow = 1;
    const numRows = 21;

    await processCSV(startRow, numRows);

    // To process additional rows, you can call processCSV with different parameters
    // Example: await processCSV(21, 21); // This will process the next 21 rows
})();