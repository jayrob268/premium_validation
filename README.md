todo
// scripts/convert-excel.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { readScenarios } from '../src/data/loaders/excelReader.js';
import { EXPECTED_PREMIUM_COLUMN } from '../src/data/schema/columns.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const inputPath = path.join(root, 'src/data/source/rating-batch.xlsx');
const outputDir = path.join(root, 'src/data/converted');
const outputPath = path.join(outputDir, 'scenarios.json');

const rows = readScenarios(inputPath, 'Sheet1');

const scenarios = rows.map((row) => ({
  ...row,
  expectedPremium: row[EXPECTED_PREMIUM_COLUMN],
}));

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(scenarios, null, 2), 'utf8');

console.log(`Wrote ${scenarios.length} scenarios to ${outputPath}`);




