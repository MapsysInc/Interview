/**
 * Title: server.js
 * Description: This file serves as the main entry point for my Express server. It sets up middleware for handling CORS, request logging with Morgan,
 * parses cookies with cookie-parser, and serves static files from different directories based on URL parameters. It also establishes a connection
 * to the MongoDB database using Mongoose and imports and uses defined routes for managing documents. 
 * These routes are associated with specific URL prefixes.
 */

// initialize express server and allow env access
const express = require('express')
require('dotenv').config() // access env

// initialize helpers
const cookieParser = require('cookie-parser') // initialize parser
const cors = require('cors') // initialize CORS (for all routes on Express server)
const morgan = require('morgan') // initialize morgan logger
const mongoose = require('mongoose') // initialize mongoose
const path = require('path') // initialize file hosting

// execute express
const app = express() // set as var

// execute helpers
app.use(cors()) // execute cors
app.use(morgan('tiny')) // execute morgan
app.use(cookieParser()) // execute cookieParser

// dynamically serve files from different dirs
// Custom middleware to determine the directory path based on a URL parameter
app.use((req, res, next) => {
  const dirParam = req.params.dir
  let baseDir = '' // Default base directory

  switch (dirParam) {
    case 'SD':
      baseDir = 'Docs/SD' // Serve from SD
      break
    case 'SIG':
      baseDir = 'Docs/SIG' // Serve from SIG
      break
    default:
      // Handle other cases or provide a default behavior
      break
  }
  
  // Update request object with resolved dir
  // Define the root path for serving static files
  const staticRoot = path.join(__dirname, baseDir)
  console.log('Static File Root Path:', staticRoot)
  
  req.dirPath = staticRoot
  next() // Continue to the next middleware or route
})


// Serve files from the dynamically determined directory
app.use('/docs/:dir', express.static(path.join(__dirname, 'Docs')))



// set connection vars
const url = process.env.DB_URL || 'mongodb://localhost:27017/test'

// import routes
const docRoutes = require('./routes/docRoutes.js')


/**
 * CONNECT TO MONGO DB via MONGOOSE
*/
mongoose.connect(url)
  .then(()=>{
    console.log("connection is now open")
    // start express server & listen for requests
    app.listen(3000, () => {
      console.log('app is listening on port 3000')
    })
  })
  .catch(e =>{
    console.log(`failed to connect: ${e}`)
  })

// Define API endpoint
app.use('/docRoutes', docRoutes)