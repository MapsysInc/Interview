const csv = require('csv-parser')
const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit') // initialize pdf construction
const { generateNextRomanNumeral } = require('../utils/romanUtils')
const { log } = require('../utils/generalUtils')
const Document = require('../backend/models/documentModel')
require('dotenv').config()



/**
 * Name: createAndStoreDocument
 * Desc: Creates and stores a document with the given information.
 * @param {Object} inputDoc - The document object with properties like category, title, etc.
 * @returns {Promise<void>} - A Promise that resolves after the document is created and stored.
 */
async function createAndStoreDocument(inputDoc) {
  try {
    log("creating and storing document")
    const docData = await populateDocData(inputDoc) // generate doc data
    log("document data populated")
    const filePath = await generateNewDocument(docData) // generate new doc with doc data
    log("document generated")
    const storedDocument = await injectDocument({ // store new doc in db
      title: docData.fileName,
      description: docData.description,
      category: inputDoc.category,
      fileName: docData.fileName,
    })
    log("document injected into db")
    const csvFilePath = path.join(__dirname, '..', 'Docs', 'Documents.csv')
    await writeCsv(csvFilePath, storedDocument) // update csv
    log("csv updated")
    
  } catch (error) {
    console.error(`Error creating and storing document: ${error}`)
  }
}



/**
 * Name: populateDocData 
 * Desc: Populates document data based on the specified category
 * @param {Object} inputDoc -
 * @returns {Object} An object containing the populated document data: fileName, filePath, and description.
 * TODO encapsulate ternary logic
 */
async function populateDocData(inputDoc){
  log("populating document data")
  const storageDir = getStorageDir(inputDoc.category)
  log("directory established")
  const prefix = getPrefixForDocParse(inputDoc) // hmm, calling before needed data is populated
  const nextRomanNumeral = generateNextRomanNumeral(storageDir, prefix)
  // feels lazy but ternary  for now
  const fileName = `${inputDoc.category === 'supporting documents' ? 'SD' : 'SIG'}-${nextRomanNumeral}.pdf`
  const filePath = path.join(storageDir, fileName)
  const description = `${inputDoc.category === 'supporting documents' ? 'Supporting Document' : 'Signature'} ${nextRomanNumeral}`
  
  return { fileName, filePath, description}
}



/**
 * Name: getPrefixForDocParse
 * Desc: 
 * @param {object} inputDoc - 
 * @returns {substr} prefix - 
 */
function getPrefixForDocParse(inputDoc){
  let baseDir = getStorageDir(inputDoc.category)
  // const filePath = baseDir
  // log(`FAILURE AT: FILE PATH`)
  const fullPath = path.join(baseDir, inputDoc.filePath).replace(/\\/g, '/')
  // log(`FAILURE AT: FULL PATH`)
  const relativePath = fullPath.replace(baseDir.replace(/\\/g, '/'), '')
  // log(`FAILURE AT: RELATIVE PATH`)
  const prefix = relativePath.substr(0,3)
  log(`prefix is ${prefix}`)
  return prefix
}



/**
 * Name: getStorageDir
 * Desc: Gets the storage directory based on the category.
 * @param {string} category - The category of the document ('supporting documents' or 'signatures').
 * @returns {string} - The storage directory path.
 */
function getStorageDir(category) {
  log("establishing directory")
  let baseDir = ''
  switch (category) {
    case 'supporting documents':
      baseDir = '../Docs/SD'
      break
    case 'signatures':
      baseDir = '../Docs/SIG'
      break
    default:
      baseDir = '../Docs/SD' // Default to SD
      break
  }
  log(`directory established: ${baseDir}`)
  return path.join(__dirname, baseDir)
}



/**
 * Name: generateNewDocument
 * Desc: Generates a new PDF document using provided data.
 * @param {Object} docData - The data to be used for generating the PDF.
 * @returns {Promise<void>} - A Promise that resolves after the PDF is generated.
 */
async function generateNewDocument(docData){
  const doc = new PDFDocument()
  log("generating document")
  const pdfStream = fs.createWriteStream(docData.filePath)
  
  doc.text(docData.description)
  doc.pipe(pdfStream)
  doc.end()
  
  return new Promise((resolve, reject) => {
    pdfStream.on('finish', resolve)
    pdfStream.on('error', reject)
  })
}



/**
 * Name: injectDocument
 * Desc: Injects a document into the database.
 * @param {Object} docData - The data of the document to be injected.
 * @returns {Promise<Document>} - A Promise that resolves with the injected Document object.
 */
async function injectDocument(docData){
  log("injecting document into db")
  try{
    // instead of passing in multiple args I decided to encapsulate into an obj
    const {title, description, category, fileName} = docData
    const storageCategory = getStorageDir(docData.category)
    
    // debug
    log("data to be injected:")
    log(`Title: ${title}`)
    log(`Description: ${description}`)
    log(`Category: ${category}`)
    log(`FileName: ${fileName}`)

    const doc = new Document({
      title: title,
      description: description,
      category: category,
      fileUrl:`Docs/${storageCategory}/${fileName}`
    })
    
    await doc.save()
    log(`Document ${doc.title} saved successfully`)
    return doc
  }catch (e){
    console.error(`Error saving document!!! ${e}`)
  }
}




/**
 * Name: readCsv
 * Desc: Reads and returns CSV data for a specific category.
 * @param {string} csvFilePath - The path to the CSV file.
 * @param {string} baseDir - The base directory path.
 * @param {string} category - The category to filter CSV data for.
 * @returns {Promise<Array>} - A Promise that resolves with an array of CSV data rows.
 */
function readCsv(csvFilePath, baseDir, category){
  return new Promise((resolve, reject) => {
    const results = []
    fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (data) => {
      if (data.Category === category) {
        const fullPath = path.join(baseDir, data.Path).replace(/\\/g, '/')
        const relativePath = fullPath.replace(baseDir.replace(/\\/g, '/'), '')
        results.push({ ...data, fullPath, relativePath })
      }
    })
    .on('end', () => resolve(results))
    .on('error', (error) => reject(error))
  })
}



/**
 * Name: writeCsv
 * Desc: Writes document data to a CSV file.
 * @param {string} csvFilePath - The path to the CSV file.
 * @param {Document} document - The Document object to write to the CSV.
 * @returns {Promise<void>} - A Promise that resolves after writing to the CSV.
 */
async function writeCsv(csvFilePath, document){
  log(" writing to csv ")
  try{
    const docData = `${document.title}, ${document.description}, ${document.category}, ${document.fileUrl}\n`
    
    // handle initial line break
    const isEmpty = !(await fs.promises.stat(csvFilePath).size > 0)
    const dataToAppend = isEmpty ?docData :`\n${docData}`
    
    await fs.promises.appendFile(csvFilePath, dataToAppend)
    
  }catch(e){
    log("ERROR IN WRITE")
    console.error(`Error updating CSV: ${e}`)
  }
}



module.exports = {
  createAndStoreDocument: createAndStoreDocument,
  readCsv: readCsv,
  writeCsv: writeCsv,
}