const express = require('express');
const multer = require('multer')
const router = express.Router(); 

// store docs
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'Docs/SD'); // Store files in "Docs"
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

// route to display all docs within csv


module.exports = router; // Export the router instance