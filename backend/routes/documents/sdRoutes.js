const express = require('express')
const multer = require('multer')
const router = express.Router()
const path = require('path')

// store docs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../Docs/SD') // Store files in "Docs"
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


module.exports = router // Export the router instance