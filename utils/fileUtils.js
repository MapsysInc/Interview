const csv = require('csv-parser')
const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit') // initialize pdf construction
const { generateNextRomanNumeral } = require('../utils/romanUtils')
require('dotenv').config()
// const newDocument = require('../backend/models/documentModel')

// may need
async function parseAndSeed(csvFilePath, newDocument) {
  const documents = []

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (row) => {
        documents.push({
          name: row.Name,
          path: row.Path,
          category: row.Category
        })
      })
      .on('end', async () => {
        console.log('CSV file parsed successfully')
        try {
          for (const document of documents) {
            await seedDocument(document, newDocument)
          }
          resolve(documents)
        } catch (error) {
          reject(error)
        }
      })
  })
}
// send  doc to db - dont really need this
async function seedDocument(document, newDocument) {
  try {
    const { name, path, category } = document
    const titleMatch = path.match(/\\([^\\]+\.pdf)$/)
    if (titleMatch) {
      const title = titleMatch[1] // Extract title from the path
      
      const dummyDoc = new Document({
        title: title,
        description: name,
        category: category,
        fileUrl: path
      })
      await dummyDoc.save()
      console.log(`Document ${title} saved successfully`)
    } else {
      console.error(`Error extracting title from path: ${path}`)
    }
  } catch (error) {
    console.error(`Error saving document ${document.name}: ${error}`)
  }
}

async function createAndStorePdf() {
  try {
    // pdf prep
    const directoryPath = path.join(__dirname, '..', 'Docs', 'SD')
    const nextRomanNumeral = generateNextRomanNumeral(directoryPath)
    const fileName = `SD-${nextRomanNumeral}.pdf` // Define the file name using the next Roman numeral
    const filePath = path.join(__dirname, '..', 'Docs', 'SD', fileName) // Define the file path
    const doc = new PDFDocument() // call pdfkit
    
    // TODO: make description an input from user with a default of the fileName
    // const description = `SD-${nextRomanNumeral}`  // set description/content to fileName for now
    const description = `Supporting Document ${currentNumeral}`

    // populate pdf
    doc.text(description)  // add content to pdf
    const pdfStream = fs.createWriteStream(filePath) // create write stream
    doc.pipe(pdfStream) // pipe output to filepath (writable stream)
    doc.end() // finalize pdf - listen for "finish" event on pdfStream

    pdfStream.on('finish', async () => {
      try {
        // Create a new newDocument instance with dummy data now that
        // pdf is generated
        const dummyDoc = new Document({
          title: fileName,
          description: description,
          category: 'supporting documents',
          fileUrl: `/Docs/SD/${fileName}`
        })
        dummyDoc.save()
        console.log('Doc saved successfully', dummyDoc)
      } catch (error) {
        console.error(`Error saving doc: ${error}`)
      }
    })

    pdfStream.on('error', (error) => {
      console.error(`Error writing pdf: ${error}`)
    })
  } catch (error) {
    console.error(`Error creating PDF and storing: ${error}`)
  }
}

// read and return csv data
// going to have to invert the slashes for logic purposes
function readCsv(csvFilePath, baseDir){
  return new Promise((resolve, reject) => {
    const results = []
    fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => {
      const fullPath = path.join(baseDir, data.Path).replace(/\\/g, '/')
      const relativePath = fullPath.replace(baseDir.replace(/\\/g, '/'), '') //erase baseDir by replacing it with empty char
      results.push({ ...data, fullPath, relativePath })
      // results.push({
      //   name: data.Name,
      //   path: data.Path.replace(/\\/g,'/'),
      //   category: data.Category
    })
    .on('end', () => resolve(results))
    .on('error', (error) => reject(error))
  })
}  

module.exports = {
  parseCsvAndSeedDocuments: parseAndSeed,
  createAndStorePdf: createAndStorePdf,
  readCsv: readCsv
}