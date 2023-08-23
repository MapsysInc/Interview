const express = require('express')
const multer = require('multer')
const router = express.Router()
const path = require('path')
const fs = require('fs') // initialize file system for csvParser
const csv = require('csv-parser') // initialize csv-parser to read csv data


// store generated docs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Get the dirParam from the URL
    const dirParam = req.params.dir;

    // dynamically store
    let storageDirectory = ''
    switch (dirParam) {
      case 'SD':
        storageDirectory = '../../Docs/SD'
        break;
      case 'SIG':
        storageDirectory = '../../Docs/SIG'
        break;
      default:
        storageDirectory = '../../Docs/SD' // Default to SD
        break;
    }
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
router.post('/createAndStorePdf', async (req, res) => {
  try {
    const result = await createAndStorePdf(document); // Call the utility function
    res.json({ message: 'PDF created and document saved successfully', result });
  } catch (error) {
    console.error(`Error creating PDF and storing: ${error}`);
    res.status(500).json({ error: 'Error creating PDF and storing' });
  }
});

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

module.exports = router; // Export the router instance