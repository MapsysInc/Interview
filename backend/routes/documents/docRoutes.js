const express = require('express')
const multer = require('multer')
const router = express.Router()
const path = require('path')
const {  createAndStoreDocument, readCsv, getStorageDir } = require('../../../utils/fileUtils.js')
const { log } = require('../../../utils/generalUtils')
const Document = require('../../models/documentModel')

// store generated docs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Get the dirParam from the URL
    const dirParam = req.params.dir
    const storageDirectory = getStorageDir(dirParam)
    cb(null, storageDirectory)
  },
  
  filename: function (req, file, cb) {
    // Define how uploaded files are named
    cb(null, Date.now() + '-' + file.originalname)
  },
})
const upload = multer({ storage: storage })



// Create an API endpoint for file uploads
router.post('/upload', upload.single('file'), (req, res) => {
 // TODO
 return true
})



// route to create and store pdf
// ERROR ---- THERE'S AN ISSUE WITH THE RETURN OF IX EVERY TIME NO MATTER THE COUNT
router.post('/create', async (req, res) => {
  try {
    const inputDoc = {
      title: 'sample.pdf', // TODO set props to user input values & defaults
      description: 'supporting doc',
      category: 'supporting documents' // TODO refactor category data type
    }
    
    const result = await createAndStoreDocument(inputDoc) // Call the utility function
    res.json({ message: `Document ${inputDoc.title} saved successfully`, result })
    
  } catch (error) {
    console.error(`Error creating Document: ${error}`)
    res.status(500).json({ error: 'Error creating Docuement' })
  }
})



// serve static files from dynamic dirs based off url param
// router.use('/:dir', (req, res, next) => {
//   const dirParam = req.params.dir // default dir
//   let baseDir = ''
  
//   // dir selection logic
//   switch(dirParam){
//     case 'SD':
//       baseDir = '../../Docs/SD'
//       break
//     case 'SIG':
//       baseDir = '../../Docs/SIG'
//       break
//     default:
//       break
//   }
//   const staticRoot = path.join(__dirname, baseDir)
//   req.dirPath = staticRoot
//   next()
// })

// route to display all docs within csv
// TODO: TOLOWER
router.get('/all', async (req, res) => {
  try{
    // read csv
    const baseDir = path.join(__dirname, '../../../Docs') // establish base dir
    const csvFilePath = path.join(baseDir, 'Documents.csv') // set csv file path
    const sdCsvData = await readCsv(csvFilePath, baseDir, 'supporting documents') // pass category (should this not be dynamically passed in?)
    const sigCsvData = await readCsv(csvFilePath, baseDir,'signatures') // is base dir needed?
    
    // query for each row
    // Concatenate relative paths for both types of documents
    const allCsvData = [...sdCsvData, ...sigCsvData]
    const documentPaths = allCsvData.map((row) => row.relativePath)
    const matchingDocuments = await Document.find({ fileUrl: { $in: documentPaths } })
    log(`matching documents: ${matchingDocuments}`)
    // return data
    // console.log('Matching Documents:', matchingDocuments) // debug
    res.json(matchingDocuments)

  }catch (e){
    console.error(e)
    res.status(500).json({ error: 'Error reading csv file'})
  }
})

module.exports = router // Export the router instance