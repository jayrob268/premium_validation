// scripts/combine-files.js
// Usage: node scripts/combine-files.js <input-folder> [output-file.csv]
import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

const [inputDir, outputPath = 'combined.csv'] = process.argv.slice(2);
if (!inputDir) {
  console.error('Usage: node scripts/combine-files.js <input-folder> [output-file.csv]');
  process.exit(1);
}

const files = fs
  .readdirSync(inputDir)
  .filter((f) => /\.(xlsx|csv)$/i.test(f))
  .sort()
  .map((f) => path.join(inputDir, f));

if (files.length === 0) {
  console.error(`No .xlsx or .csv files found in ${inputDir}`);
  process.exit(1);
}

let headers = null;
const combined = [];

for (const file of files) {
  const workbook = XLSX.readFile(file, { cellDates: false });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  // raw: true keeps each cell's own type: text stays text, numbers stay numbers
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    raw: true,
    defval: '',
    blankrows: false,
  });

  if (rows.length === 0) {
    console.warn(`Skipping empty file: ${path.basename(file)}`);
    continue;
  }

  const [fileHeaders, ...dataRows] = rows;
  const normalised = fileHeaders.map((h) => String(h).trim());

  if (headers === null) {
    headers = normalised;
    combined.push(headers);
  } else if (normalised.length !== headers.length ||
             normalised.some((h, i) => h !== headers[i])) {
    throw new Error(
      `Header mismatch in ${path.basename(file)}. Columns must match the first file exactly and in the same order.`
    );
  }

  const nonEmpty = dataRows.filter((row) => row.some((cell) => String(cell).trim() !== ''));
  combined.push(...nonEmpty);
  console.log(`${path.basename(file)}: ${nonEmpty.length} rows`);
}

// Write CSV: header row once, then every data row from every file
const outSheet = XLSX.utils.aoa_to_sheet(combined, { cellDates: false });
const csv = XLSX.utils.sheet_to_csv(outSheet);
fs.writeFileSync(outputPath, csv, 'utf8');

console.log(`Wrote ${combined.length - 1} rows to ${outputPath}`);
