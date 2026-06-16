// src/utils/export.js
/**
 * Utility functions for exporting data in CSV, Excel, and PDF formats.
 * Dependencies: json2csv, exceljs, pdfkit, fs, path
 */
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv'); // CSV
const ExcelJS = require('exceljs'); // Excel
const PDFDocument = require('pdfkit'); // PDF

/**
 * Export an array of objects to a CSV file.
 * @param {Array<Object>} data - Data to export.
 * @param {string} filename - Destination filename (without path).
 * @returns {string} Full path of written CSV file.
 */
function exportToCSV(data, filename) {
  const parser = new Parser();
  const csv = parser.parse(data);
  const outPath = path.resolve(__dirname, '../../exports', filename);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, csv, 'utf8');
  return outPath;
}

/**
 * Export an array of objects to an Excel (.xlsx) file.
 * @param {Array<Object>} data - Data to export.
 * @param {string} filename - Destination filename (without path).
 * @returns {Promise<string>} Promise resolving to full path of written Excel file.
 */
async function exportToExcel(data, filename) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Data');

  if (data.length) {
    // Add header row based on keys of first object
    worksheet.columns = Object.keys(data[0]).map((key) => ({ header: key, key }));
    worksheet.addRows(data);
  }

  const outPath = path.resolve(__dirname, '../../exports', filename);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await workbook.xlsx.writeFile(outPath);
  return outPath;
}

/**
 * Generate a simple PDF report.
 * @param {string} title - Title of the PDF document.
 * @param {Array<string>} lines - Text lines to include in the body.
 * @param {string} filename - Destination filename (without path).
 * @returns {Promise<string>} Promise resolving to full path of written PDF file.
 */
function exportToPDF(title, lines, filename) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const outPath = path.resolve(__dirname, '../../exports', filename);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    const stream = fs.createWriteStream(outPath);
    doc.pipe(stream);
    doc.fontSize(20).text(title, { align: 'center' }).moveDown();
    doc.fontSize(12);
    lines.forEach((ln) => doc.text(ln));
    doc.end();
    stream.on('finish', () => resolve(outPath));
    stream.on('error', reject);
  });
}

module.exports = {
  exportToCSV,
  exportToExcel,
  exportToPDF,
};
