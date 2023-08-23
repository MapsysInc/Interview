const mongoose = require('mongoose');
const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');
const newDocument = require('../backend/models/documentModel'); // Import your Mongoose model
const PDFDocument = require('pdfkit');// initialize pdf construction
const { generateNextRomanNumeral } = require('./utils/fileUtils');

require('dotenv').config();


async function parseAndSeed(csvFilePath, newDocument) {
  const documents = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        documents.push({
          name: row.Name,
          path: row.Path,
          category: row.Category
        });
      })
      .on('end', async () => {
        console.log('CSV file parsed successfully');
        try {
          for (const document of documents) {
            await seedDocument(document, newDocument);
          }
          resolve(documents);
        } catch (error) {
          reject(error);
        }
      });
  });
}

async function seedDocument(document, newDocument) {
  try {
    const { name, path, category } = document;
    const titleMatch = path.match(/\\([^\\]+\.pdf)$/);
    if (titleMatch) {
      const title = titleMatch[1]; // Extract title from the path
      
      const dummyDoc = new newDocument({
        title: title,
        description: name,
        category: category,
        fileUrl: path
      });
      await dummyDoc.save();
      console.log(`Document ${title} saved successfully`);
    } else {
      console.error(`Error extracting title from path: ${path}`);
    }
  } catch (error) {
    console.error(`Error saving document ${document.name}: ${error}`);
  }
}

async function createAndStorePdf(newDocument) {
    try {
    // pdf prep
    const directoryPath = path.join(__dirname, '..', 'Docs', 'SD');
    const nextRomanNumeral = generateNextRomanNumeral(directoryPath);
    const fileName = `SD-${nextRomanNumeral}.pdf`; // Define the file name using the next Roman numeral
    const filePath = path.join(__dirname, '..', 'Docs', 'SD', fileName); // Define the file path
    const doc = new pdfkit(); // call pdfkit
    const description = `SD-${nextRomanNumeral}`;  // set description/content to fileName for now

    // populate pdf
    doc.text(description);  // add content to pdf
    const pdfStream = fs.createWriteStream(filePath); // create write stream
    doc.pipe(pdfStream); // pipe output to filepath (writable stream)
    doc.end(); // finalize pdf - listen for "finish" event on pdfStream
    pdfStream.on('finish', async () => {
    try {
        // Create a new newDocument instance with dummy data now that
        // pdf is generated
        const dummyDoc = new newDocument({
          title: fileName,
          description: description,
          category: 'supporting documents',
          fileUrl: `/Docs/SD/${fileName}`
        });
        const savedDoc = await dummyDoc.save();
        console.log('Doc saved successfully', savedDoc);
    } catch (error) {
        console.error(`Error saving doc: ${error}`);
    }
    });

      pdfStream.on('error', (error) => {
        console.error(`Error writing pdf: ${error}`);
      });
    } catch (error) {
      console.error(`Error creating PDF and storing: ${error}`);
    }
}

// read and return csv data
function readCsv(csvFilePath){
  return new Promise((resolve, reject) => {
    const results = []
    fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => resolve(results))
    .on('error', (error) => reject(error))
  })
}  

module.exports = {
  parseCsvAndSeedDocuments: parseAndSeed,
  createAndStorePdf: createAndStorePdf,
  readCsv: readCsv
};
