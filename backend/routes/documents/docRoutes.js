const express = require('express')
const multer = require('multer')
const router = express.Router()
const path = require('path')
const fs = require('fs') // initialize file system for csvParser
const csv = require('csv-parser') // initialize csv-parser to read csv data

/**
 * TODO
 * - move all routes to respective files to be called in
 * - ensure things are being set dynamically (eg url params of static files)
 */

// store docs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../Docs/SD'); // Store files in "Docs"
  },
  filename: function (req, file, cb) {
    // Define how uploaded files are named
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const upload = multer({ storage: storage })

// Create an API endpoint for file uploads
router.post('/uploadSD', upload.single('file'), (req, res) => {
  // Handle the uploaded file, e.g., save its metadata to a database
  res.json({ message: 'File uploaded successfully' })
})

// serve static files from dynamic dirs based off url param
router.use('/docs/:dir', (req, res, next) => {
  const dirParam = req.params.dir // default dir
  let baseDir = ''
  
  // dir selection logic
  switch(dirParam){
    case 'SD':
      baseDir = '../../Docs/SD'
      break
    case 'SIG':
      baseDir = '../../Docs/SIG'
      break
    default:
      alert('NO DIR')
      break
  }
  const staticRoot = path.join(__dirname, baseDir)
  req.dirPath = staticRoot
  next()
})

// route to display all docs within csv
router.get('/fetchCsv', async (req, res) => {
  try{
    const data = await readCsv(path.join(__dirname, '../../Docs/Documents.csv'))
    res.json(data)
  }catch (e){
    console.error(e)
    res.status(500).json({ error: 'Error reading csv file'})
  }
})


// read and return csv data
function readCsv(filePath){
  return new Promise((resolve, reject) => {
    const results = []
    fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => resolve(results))
    .on('error', (error) => reject(error))
  })
}
module.exports = router; // Export the router instance