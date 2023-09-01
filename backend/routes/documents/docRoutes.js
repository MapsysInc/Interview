const express = require('express')
const multer = require('multer')
const bodyParser = require('body-parser')
const router = express.Router()
const path = require('path')
const {  createAndStoreDocument, readCsv, getStorageDir, getPrefix, deleteDocFromCsv, writeFromData} = require('../../../utils/fileUtils.js')
const { log } = require('../../../utils/generalUtils')
const Document = require('../../models/documentModel')
const fs = require('fs') // file system needed to manage local documents
router.use(bodyParser.json())
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
/**
 * Name: 
 * Desc: 
 * @param {} [variable_name] - The document object with properties like category, title, etc.
 * @returns {} [return_name] - A Promise that resolves after the document is created and stored.
 */
router.post('/upload', upload.single('file'), (req, res) => {
 // TODO
 return true
})



// route to create and store pdf
/**
 * Name: 
 * Desc:
 * @param {} [variable_name] - The document object with properties like category, title, etc.
 * @returns {} [return_name] - A Promise that resolves after the document is created and stored.
 */
router.post('/create', async (req, res) => {
  console.log("Received body: ", req.body); 
  try {
    // const inputDoc = {
    //   title: '', // TODO set props to user input values & defaults
    //   description: 'signature document',
    //   category: 'signatures' // TODO refactor category data type
    // }
    const defaultValues = {
      'signatures': {
        title: 'default signature document title',
        description: 'signatures'
      },
      'supporting documents': {
        title: 'default supporting document title',
        description: 'supporting documents'
      },
    }
    
    if (!req.body || !req.body.category) {
      return res.status(400).json({ error: 'Category must be selected' })
    }
    const { title, description, category } = req.body;

    const defaultTitle = defaultValues[category] ? defaultValues[category].title : 'Untitled';
    const defaultDescription = defaultValues[category] ? defaultValues[category].description : 'No Description';

    const inputDoc = {
      title: title || defaultTitle,
      description: description || defaultDescription,
      category: category
    }
    
    const result = await createAndStoreDocument(inputDoc) 
    res.json({ message: `Document ${inputDoc.title} saved successfully`, result })
    
  } catch (error) {
    console.error(`Error creating Document: ${error}`)
    res.status(500).json({ error: 'Error creating Document' })
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

/**
 * Name: 
 * Desc:
 * @param {} [variable_name] - 
 * @returns {} [return_name] - 
 */
router.get('/all', async (req, res) => {
  try{
    // read csv
    const baseDir = path.join(__dirname, '../../../Docs') // establish base dir
    const csvFilePath = path.join(baseDir, 'Documents.csv') // set csv file path
    const sdCsvData = await readCsv(csvFilePath, baseDir, 'supporting documents') // pass category (should this not be dynamically passed in?)
    const sigCsvData = await readCsv(csvFilePath, baseDir,'signatures') // is base dir needed?
    
    const allCsvData = [...sdCsvData, ...sigCsvData]
    const documentPaths = allCsvData.map((row) => row.relativePath)
    const matchingDocuments = await Document.find({ fileUrl: { $in: documentPaths } })

    // return data
    res.json(matchingDocuments)

  }catch (e){
    console.error(e)
    res.status(500).json({ error: 'Error reading csv file'})
  }
})



/**
 * Name: delete
 * Desc:
 * @param {} [variable_name] - 
 * @returns {} [return_name] -
 */
router.delete('/delete/:id', async (req, res) =>{
  try{
    const docToDelete = await Document.findById(req.params.id)
    if(!docToDelete){
      return res.status(404).json({
        message: `Document not found`
      })
    }
    
    log(`Document: ${docToDelete}`)
    const dirCategory = getPrefix(docToDelete)
    
    //delete local file
    const filePath = path.join(__dirname, `../../../Docs/${dirCategory}/${docToDelete.title}`)
    log(`filepath: ${filePath}`)
    log(`title: ${docToDelete.title}`)

    fs.unlinkSync(filePath) // delete from local
    
    await Document.findByIdAndRemove(req.params.id) // delete from db
    
    const baseDir = path.join(__dirname, '../../../Docs') // establish base dir
    const csvFilePath = path.join(baseDir, 'Documents.csv') // set csv file path
    
    deleteDocFromCsv({csvFilePath, baseDir, docToDelete}) // delete from csv

    return res.json({ message: `Docuemnt deleted` })
    
  }catch(e){
    log(`Error deleting document ${req.params.id}`)
    return res.status(500).json({
      error: 'Error in deletion route'
    })
  }
})


module.exports = router // Export the router instance