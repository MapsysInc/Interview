const csv = require('csv-parser')
const csvW = require('csv-writer')
const createCsvWriter = csvW.createObjectCsvWriter
const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit') // initialize pdf construction
const { generateNextRomanNumeral, romanToNumeric} = require('../utils/romanUtils')
const { log } = require('../utils/generalUtils')
const Document = require('../backend/models/documentModel')
require('dotenv').config()

// global vars
const csvFilePath = path.join(__dirname, '..', 'Docs', 'Documents.csv')

/**
 * Name: createAndStoreDocument
 * Desc: Creates and stores a document with the given input doc information.
 * @param {Object} inputDoc - The document object with properties like category, title, etc.
 * @returns {Promise<void>} - A Promise that resolves after the document is created and stored.
 */
async function createAndStoreDocument(inputDoc) {
  try {
    log("creating and storing document")
    const docData = await populateDocData(inputDoc) // generate doc data
    
    await generateNewDocument(docData) // generate new doc with doc data
    
    const storedDocument = await injectDocument({ // store new doc in db
      title: docData.fileTitle,
      description: docData.description,
      category: inputDoc.category,
      fileName: docData.fileName,
    })

    await writeCsv(csvFilePath, storedDocument)
    
  } catch (e) {
    log(`Error creating and storing document: ${e}`)
  }
}



/**
 * Name: populateDocData 
 * Desc: Populates document data based on the specified category
 * @param {Object} inputDoc -
 * @returns {Object} An object containing the populated document data: fileName, filePath, and description.
 */
async function populateDocData(inputDoc){
  try{
    log("----- populating document data -----")

    const fileName = setFileName(inputDoc)
    const description = setDescription(inputDoc)
    const fileTitle = setFileTitle(inputDoc)
    const filePath = path.join(getStorageDir(inputDoc.category.toLowerCase()), fileName) // sidestep scoping issue
    log(`file path established: ${filePath}`)
  
    return { 
      fileName, 
      description,
      fileTitle,
      filePath
    }
  }catch(e){
    log(`Error in populateDocData(): ${e}`)
    throw e
  }
}

function setFileTitle(inputDoc){
  let fileTitle = inputDoc.title ? inputDoc.title : setFileName(inputDoc)
  return fileTitle
}

/**
 * Name: setFileName
 * Desc: 
 * @param {}  - 
 * @returns {}  - 
 */
function setFileName(inputDoc){
  let fileName
  
  if(inputDoc.fileName){
    fileName = inputDoc.fileName
  }
  else{
    const nextRomanNumeral = getGeneratedRoman(inputDoc)
    
    fileName = `${inputDoc.category === 'supporting documents' ? 'SD' : 'SIG'}-${nextRomanNumeral}.pdf`
  }
  log(`fileName: ${fileName}`)
  return fileName
}



/**
 * Name: setDescription
 * Desc: 
 * @param {}  - 
 * @returns {}  - 
 */
function setDescription(inputDoc){
  let description // description translates to "Name" in the csv
  
  if(inputDoc.description){
    description = inputDoc.description
  }
  else{
    const nextRomanNumeral = getGeneratedRoman(inputDoc)
    let descriptionID = romanToNumeric(nextRomanNumeral)
    
    description = `${inputDoc.category === 'supporting documents' ? 'Supporting Document' : 'Signature'} ${descriptionID}`
  }
  return description
}



/**
 * Name: layupNextRomanParams
 * Desc: 
 * @param {}  - 
 * @returns {}  - 
 */
function layupNextRomanParams(inputDoc){
  const storageDir = getStorageDir(inputDoc.category)
  const prefix = getPrefix(inputDoc)
  
  return {storageDir, prefix}
}


/**
 * Name: 
 * Desc: 
 * @param {}  - 
 * @returns {}  - 
 */
function getGeneratedRoman(inputDoc){
  const { storageDir, prefix } = layupNextRomanParams(inputDoc)
  const nextRomanNumeral = generateNextRomanNumeral(storageDir, prefix)
  
  return nextRomanNumeral
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
    
    const {title, description, category, fileName} = docData// encapsulate into obj instead of multiple args
    const prefix = getPrefix(docData)
    const fileUrl = `/Docs/${prefix}/${fileName}`

    const doc = new Document({
      title: title,
      description: description,
      category: category,
      fileUrl: fileUrl
    })
    
    await doc.save()
    log(`Document ${doc.title} saved successfully`)
    return doc
  }catch (e){
    log(`Error saving document!!! ${e}`)
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
        const fullPath = path.join(baseDir || '', data.Path).replace(/\\/g, '/')
        const relativePath = fullPath.replace((baseDir || '').replace(/\\/g, '/'), '')
        results.push({ ...data, fullPath, relativePath })
    })
    .on('end', () => resolve(results))
    .on('error', (error) => reject(error))
  })
}



/**
 * Name: writeCsv
 * Desc: Writes document data to a CSV file from document passed in, writer tool reflects use case
 * @param {string} csvFilePath - The path to the CSV file.
 * @param {Document} document - The Document object to write to the CSV.
 * @returns {Promise} - A Promise that resolves after writing to the CSV.
 */ 
async function writeCsv(csvFilePath, document){
  try{
    const csvW = createCsvWriter({ // new writer instance: configure header, enable append etc
      path: csvFilePath,
      header: [// we use these headers to match document's properties
        { id: 'Description', title: 'Description' },
        { id: 'FileURL', title: 'FileURL' },
        { id: 'Category', title: 'Category' },
      ],
      append: true,
    })

    let category = document.category.toLowerCase() // get category and normalize
    const removedSlashUrl = document.fileUrl.replace(/^\//, '') // normalize slash structure again

    const record = { // record object to store doc data
      Description: document.description || '', // set default
      FileURL: removedSlashUrl.replace(/\//g, '\\'),
      Category: category,
    }

    await csvW.writeRecords([record]) // write all record data
  }catch(e){
    log(`Error updating CSV: ${e}`)
  }
}



/**
 * Name: deleteDocFromCsv
 * Desc: Deletes a specific document from the CSV file and returns the updated data.
 * @param {String} csvFilePath - Path to the CSV file
 * @param {String} baseDir - Base directory path
 * @param {String} category - Category of the document
 * @param {Object} docToDelete - Document object to delete
 * @returns {Array} updatedCsvData - Updated CSV data after the document is deleted
 */
async function deleteDocFromCsv({csvFilePath, baseDir, docToDelete}){
  try {
    const csvData = await readCsv(csvFilePath, baseDir)
    const normalizePath = (url) => url.replace(/^\//, '').replace(/\\/g, '/')
    
    const updatedCsvData = csvData.filter(
      (row) => {
        return normalizePath(row.Path) !== normalizePath(docToDelete.fileUrl)} // ensure slashes match - remove leading slash from fileUrl
    )
    
    await refreshCsvData(csvFilePath, updatedCsvData)
    return updatedCsvData

  } catch (e) {
    log(`Error deleting document from CSV: ${e}`)
    throw e
  }
}



/**
 * Name: refreshCsvData
 * Desc: removes row in csv that matches the meta-data of document
 * @param {string} csvFilePath - 
 * @param {} csvData -
 * @returns {promise} -
 */ 
async function refreshCsvData(csvFilePath, csvData){
  log("deleting row and writing new data to csv ")
  
  try {
    const csvW = createCsvWriter({ // create writer instance 
      path: csvFilePath, // set file path & header
      header: [
        {id: 'Name', title: 'Name'},
        {id: 'Path', title: 'Path'},
        {id: 'Category', title: 'Category'},
      ]
    })

    const formattedData = csvData.map(row => ({ // map array with new formatted data
      Name: row.Name,
      Path: row.Path.replace(/^\//, ""), // fix url issues
      Category: formatCategory(row.Category)
    }))
    .filter(row => row !== null && row.Name && row.Path) // filter to remove blank lines
    // log("Data to be written:", formattedData)

    await csvW.writeRecords(formattedData) // await writeRecords
    
  }catch(e){
    log(`Error re-writing CSV: ${e}`)
    throw e
  }
}



/**
 * Name: 
 * Desc: 
 * @param {}  - 
 * @returns {}  - 
 */
function formatCategory(category) {
  return category.toLowerCase() === 'supporting documents' ? 'Supporting Documents' : category
}



/**
 * Name: getPrefix
 * Desc: 
 * @param {object} inputDoc - 
 * @returns {string} prefix - 
 */
function getPrefix(inputDoc){
  let prefix = ''
  let category = inputDoc.category
  if (category === 'supporting documents'){
    prefix = 'SD'
  }
  else if (category === 'signatures'){
    prefix = 'SIG'
  }
  
  return prefix
}



/**
 * Name: getStorageDir
 * Desc: Gets the storage directory based on the category.
 * @param {string} category - The category of the document ('supporting documents' or 'signatures').
 * @returns {string} - The storage directory path.
 */
function getStorageDir(category) {
  // log("establishing directory")
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



module.exports = {
  createAndStoreDocument,
  getStorageDir,
  getPrefix,
  readCsv: readCsv,
  writeCsv: writeCsv,
  deleteDocFromCsv,
  refreshCsvData,
}