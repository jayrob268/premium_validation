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


// All 97 columns from the rating-batch workbook, in the order listed on Sheet2.
// Headers are kept exactly as they appear in the source, including typos,
// so they match the spreadsheet. Column order does not matter for loading.

export const COLUMNS = [
  'test_id',
  'QuoteID',
  'Cover',
  'Class of Use',
  'Company Code',
  'Policy Duration',
  'Payment Method',
  'Payment History',
  'NCD',
  'Voluntary Excess',
  'Eircode Routing Key',
  'Small Area',
  'Previous Insurance',
  'Quote Lag',
  'Optimisation Multiplier',
  'Vehicle Make',
  'Vehicle Group',
  'Vehicle Age',
  'Vehicle Age when Bought',
  'Vehicle Value',
  'Fuel Type',
  'Transmission',
  'Number of Doors',
  'Engine CC',
  'Acceleration',
  'Left Hand Drive',
  'Import',
  'Mileage',
  'Currently Taxed',
  'Tax Status',
  'Currently NCT',
  'NCT Status',
  'Number of Previous Owners',
  'Mechanical Faults',
  'Age',
  'Licence Years',
  'Provisional Licence',
  'Country of Licence',
  'Penalty Points',
  'Employment Status',
  'Occupation',
  'Part-Time Occupation',
  'Work from Home',
  'Homeowner',
  'Drv 1: Add driver?',
  'Drv 1: Age',
  'Drv 1: Provisional Licence',
  'Drv 1: Relationship',
  'Drv 1: Do they have own car?',
  'Drv 1: Penalty Points',
  'Drv 2: Add driver?',
  'Drv 2: Age',
  'Drv 2: Provisional Licence',
  'Drv 2: Relationship',
  'Drv 2: Do they have own car?',
  'Drv 2: Penalty Points',
  'Drv 3: Add driver?',
  'Drv 3: Age',
  'Drv 3: Provisional Licence',
  'Drv 3: Relationship',
  'Drv 3: Do they have own car?',
  'Drv 3: Penalty Points',
  'Drv 4: Add driver?',
  'Drv 4: Age',
  'Drv 4: Provisional Licence',
  'Drv 4: Relationship',
  'Drv 4: Do they have own car?',
  'Drv 4: Penalty Points',
  'Windsreen/Glass Breakage',
  'Protected NCD',
  'Open Driving',
  'Third Party Driver Other Cars',
  'Comprehensive Drive Other Cars',
  'Replacement Car',
  'Injury to Driver',
  'Breakdown Assistance',
  'Personal Belongings',
  'Jewellery Type',
  'Jewellery Value',
  'Is is an electric bike?',
  'Bicycle value',
  'Claims Free Years',
  'Policy',
  'Mobility',
  'PP',
  'Test bed Flag',
  'Test Bed Number',
  'Claims Load',
  'Convictions Load',
  'AURA Load',
  'UW Load',
  'Manual Discount',
  'Key',
  'Veh_Model',
  'Veh_Specific_Type',
  'Eircode',
  'P4 Inc Levy and Stamp Duty',   // expected premium (last column)
];

export const EXPECTED_PREMIUM_COLUMN = 'P4 Inc Levy and Stamp Duty';
