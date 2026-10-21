# premium_validation

import XLSX from 'xlsx';
import { COLUMNS } from '../schema/columns.js';

/**
 * Reads every row of the workbook as strings, keyed by header name.
 * No type conversion or value validation happens here.
 */
export function readScenarios(filePath, sheetName = 'Sheet1') {
  const workbook = XLSX.readFile(filePath, { cellText: true, cellDates: false });
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found in ${filePath}`);

  // raw: false returns the displayed text, so leading zeros in Small Area survive
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    raw: false,
    defval: '',
    blankrows: false,
  });

  const [headerRow, ...dataRows] = rows;
  const headers = headerRow.map((h) => String(h).trim());

  // Structural check only: every expected column must exist in the sheet
  const missing = COLUMNS.filter((c) => !headers.includes(c));
  if (missing.length > 0) {
    throw new Error(`Missing columns in ${sheetName}: ${missing.join(', ')}`);
  }

  return dataRows
    .filter((row) => row.some((cell) => String(cell).trim() !== ''))
    .map((row) => {
      const record = {};
      headers.forEach((header, i) => {
        record[header] = String(row[i] ?? '').trim();
      });
      return record;
    });
}
