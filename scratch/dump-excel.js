const XLSX = require('xlsx');
const fs = require('fs');
const workbook = XLSX.readFile('e:/frame/EXCEL CATALOGUE.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);
fs.writeFileSync('e:/frame/scratch/excel-dump.json', JSON.stringify(data.slice(0, 20), null, 2));
console.log("Dumped 20 rows to scratch/excel-dump.json");
