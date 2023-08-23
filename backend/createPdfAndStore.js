const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')
const {  createAndStorePdf, readCsv } = require('../utils/fileUtils')
const {generateNextRomanNumeral} = require('../utils/romanUtils.js')
const SupportingDoc = require('./models/documentModel')

async function createPdfAndStore() {
  try {
    // pdf prep
    const directoryPath = path.join(__dirname, '..', 'Docs', 'SD')
    const nextRomanNumeral = generateNextRomanNumeral(directoryPath);
    const fileName = `SD-${nextRomanNumeral}.pdf`; // Define the file name using the next Roman numeral
    const filePath = path.join(__dirname, '..', 'Docs', 'SD', fileName); // Define the file path
    const doc = new PDFDocument(); // call pdfkit
    const description = `SD-${nextRomanNumeral}`;  // set description/content to fileName for now

    // populate pdf
    doc.text(description);  // add content to pdf
    const pdfStream = fs.createWriteStream(filePath); // create write stream
    doc.pipe(pdfStream); // pipe output to filepath (writable stream)
    doc.end(); // finalize pdf - listen for "finish" event on pdfStream

    pdfStream.on('finish', async () => {
      try {
        // Create and store the PDF document
        await createAndStorePdf(SupportingDoc, fileName, description);
        console.log('PDF created and document saved successfully');
      } catch (error) {
        console.error(`Error creating PDF and storing: ${error}`);
      }
    });

    pdfStream.on('error', (error) => {
      console.error(`Error writing pdf: ${error}`);
    });
  } catch (error) {
    console.error(`Error creating PDF and storing: ${error}`);
  }
}

// Call the function to create and store the PDF
createPdfAndStore()