const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const dataFilePath = path.join(__dirname, 'data.csv');

function readCSV(startRow, numRows) {
    return new Promise((resolve, reject) => {
        const results = [];
        let currentRow = 0;

        fs.createReadStream(dataFilePath)
            .pipe(csv())
            .on('data', (data) => {
                if (currentRow >= startRow && currentRow < startRow + numRows) {
                    results.push(data);
                }
                currentRow++;
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

module.exports = readCSV;