const express = require('express')
const multer = require('multer')
const bodyParser = require('body-parser')
const router = express.Router()
const path = require('path')
const { log } = require('../../../utils/generalUtils')
const Document = require('../../models/documentModel')
const fs = require('fs') // file system needed to manage local documents
const {  createAndStoreDocument, readCsv, getStorageDir, getPrefix, deleteDocFromCsv} = require('../../../utils/fileUtils.js')
router.use(bodyParser.json())

// store generated docs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dirParam = req.params.dir // Get the dirParam from the URL
    const storageDirectory = getStorageDir(dirParam)
    cb(null, storageDirectory)
  },
  
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // Define how uploaded files are named
  },
})
const upload = multer({ storage: storage })



/**
 * Name: doc/upload
 * Desc: 
 * @param {} [variable_name] - 
 * @returns {} [return_name] -
 */
router.post('/upload', upload.single('file'), (req, res) => {
 // TODO
 return true
})



/**
 * Name: doc/create
 * Desc: route to create and store pdf
 * @param {} [variable_name] - 
 * @returns {} [return_name] -
 */
router.post('/create', async (req, res) => {
  console.log("Received body: ", req.body); 
  try {

    if (!req.body || !req.body.category) { // check if category returns
      return res.status(400).json({ error: 'Category must be selected' })
    }
    const { title, description, category } = req.body // access body
    const inputDoc = { // set doc values to be passed
      title: title,
      description: description,
      category: category
    }
    
    const result = await createAndStoreDocument(inputDoc) 
    res.json({ message: `Document ${inputDoc.title} saved successfully`, result })
    
  } catch (error) {
    console.error(`Error creating Document: ${error}`)
    res.status(500).json({ error: 'Error creating Document' })
  }
})

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
 * Name: /doc/display/:id
 * Desc:
 * @param {} [variable_name] - 
 * @returns {} [return_name] - 
 */
router.get('/display/:id', async (req, res) => {
  try {
    const docToDisplay = await Document.findById(req.params.id)
    const dirCategory = getPrefix(docToDisplay)
    const filePath = path.join(__dirname, `../../../Docs/${dirCategory}/${docToDisplay.title}`)
    
    if (fs.existsSync(filePath)) { // check if file exists before sending
      const fileUrl = `/Docs/${dirCategory}/${docToDisplay.title}`
      
      log(`file exists! file path: ${filePath}`)
      
      res.json({fileUrl})
    } else {
      res.status(404).send({ message: 'Document not found' })
    }
  } catch (e) {
    log(`'Error fetching document ${e}`)
    res.status(500).send({ message: 'Internal server error' })
  }
 })
 
 
 
/**
 * Name: doc/update/:id
 * Desc: Route to update a document's details and potentially its associated file
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} res - The response object
 */
router.post('/update/:id', upload.single('file'), async (req, res) => {
  try {
    const docId = req.params.id
    const updateData = req.body

    // Step 1: Update the database record
    let updatedDocument = await Document.findByIdAndUpdate(docId, updateData, { new: true })
    if (!updatedDocument) {
      return res.status(404).json({ error: 'Document not found' })
    }

    // Step 2: If a new file is uploaded, handle the file update
    if (req.file) {
      const dirCategory = getPrefix(updatedDocument)
      const oldFilePath = path.join(__dirname, `../../../Docs/${dirCategory}/${updatedDocument.title}`)
      const newFilePath = path.join(__dirname, `../../../Docs/${dirCategory}/${req.file.filename}`)

      // Remove the old file if exists
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath)
      }

      // Update the new file path in the database
      updatedDocument.fileUrl = `/Docs/${dirCategory}/${req.file.filename}`
      updatedDocument = await updatedDocument.save()
    }

    // Step 3: Update the CSV record (if necessary based on your utils)
    // You might need to add an updateCsv function to your utils
    // updateCsv({ csvFilePath, baseDir, updatedDocument })

    res.json({ message: `Document ${updatedDocument.title} updated successfully`, updatedDocument })
  } catch (error) {
    log(`Error updating document ${docId}: ${error}`)
    res.status(500).json({ error: 'Error updating document' })
  }
})



/**
 * Name: docs/delete/:id
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