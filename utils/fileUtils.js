const csv = require('csv-parser')
const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit') // initialize pdf construction
const { generateNextRomanNumeral } = require('../utils/romanUtils')
require('dotenv').config()
// const newDocument = require('../backend/models/documentModel')

// may need
// async function parseAndSeed(csvFilePath, newDocument) {
//   const documents = []

//   return new Promise((resolve, reject) => {
//     fs.createReadStream(csvFilePath)
//       .pipe(csvParser())
//       .on('data', (row) => {
//         documents.push({
//           name: row.Name,
//           path: row.Path,
//           category: row.Category
//         })
//       })
//       .on('end', async () => {
//         console.log('CSV file parsed successfully')
//         try {
//           for (const document of documents) {
//             await seedDocument(document, newDocument)
//           }
//           resolve(documents)
//         } catch (error) {
//           reject(error)
//         }
//       })
//   })
// }

// send  doc to db - dont really need this | it's logic to inject into db
// async function seedDummyDocument(document, newDocument) {
//   try {
//     const { name, path, category } = document
//     const titleMatch = path.match(/\\([^\\]+\.pdf)$/)
//     if (titleMatch) {
//       const title = titleMatch[1] // Extract title from the path
      
//       const dummyDoc = new Document({
//         title: title,
//         description: name,
//         category: category,
//         fileUrl: path
//       })
//       await dummyDoc.save()
//       console.log(`Document ${title} saved successfully`)
//     } else {
//       console.error(`Error extracting title from path: ${path}`)
//     }
//   } catch (error) {
//     console.error(`Error saving document ${document.name}: ${error}`)
//   }
// }

async function createAndStoreDocument(category) {
  try {
    const docData = await populateDocData(category)
    const filePath = await generateNewDocument(docData.filePath, docData.description)

    const storedDocument = await injectDocument({
      title: docData.fileName,
      description: docData.description,
      category: category,
      fileName: docData.fileName,
    })

    console.log('Document saved successfully', storedDocument)

    const csvFilePath = path.join(__dirname, '..', 'Docs', 'Documents.csv')
    await writeCsv(csvFilePath, storedDocument)

    console.log('CSV Updated!')
  } catch (error) {
    console.error(`Error creating and storing document: ${error}`)
  }
}


async function generateNewDocument(filePath, description){
  const doc = new PDFDocument()
  const pdfStream = fs.createWriteStream(filePath)
  
  doc.text(description)
  doc.pipe(pdfStream)
  doc.end()
  
  return new Promise((resolve, reject) => {
    pdfStream.on('finish', resolve)
    pdfStream.on('error', reject)
  })
}

async function populateDocData(category){
  const storageDir = getStorageDir(category)
  const nextRomanNumeral = generateNextRomanNumeral(storageDir)
  // this is going to give me issues - maybe parse and drop up to final dir (eg /SD)?
  // feels lazy but ternary  for now
  const fileName = `${category === 'supporting documents' ? 'SD' : 'SIG'}-${nextRomanNumeral}.pdf`
  const filePath = path.join(storageDir, fileName)
  const description = `${category === 'supporting documents' ? 'Supporting Document' : 'Signature'} ${nextRomanNumeral}`
  
  return { fileName, filePath, description}
}

async function injectDocument(docData){
  try{
    // instead of passing in multiple args I decided to encapsulate into an obj
    const {title, description, category, fileName} = docData
    const storageCategory = getStorageDir(category) // again, going to need to drop up to dir (eg /SIG)
    
    const doc = new Document({
      title: title,
      description: description,
      category: category,
      fileUrl:`Docs/${storageCategory}/${fileName}`
    })
    
    await doc.save()
    console.log(`Document ${doc.title} saved successfully`)
    return doc
  }catch (e){
    console.error(`Error saving document!!! ${e}`)
  }
}

function getStorageDir(category) {
  let baseDir = ''
  switch (category) {
    case 'supporting documents':
      baseDir = '../../Docs/SD'
      break
    case 'signatures':
      baseDir = '../../Docs/SIG'
      break
    default:
      baseDir = '../../Docs/SD' // Default to SD
      break
  }
  return path.join(__dirname, baseDir)
}

// read and return csv data | going to have to invert the slashes for logic purposes
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

async function writeCsv(csvFilePath, document){
  try{
    const docData = `${document.title}, ${document.description}, ${document.category}, ${document.fileUrl}`
    await fs.promises.appendFile(csvFilePath, docData)
    
    console.log('CSV Updated!')
  }catch(e){
    console.error(`Error updating CSV: ${e}`)
  }
}



module.exports = {
  //parseCsvAndSeedDocuments: parseAndSeed,
  createAndStoreDocument: createAndStoreDocument,
  readCsv: readCsv,
  writeCsv: writeCsv,
}