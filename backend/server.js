/**
 * Title: server.js
 * Description: This file serves as the main entry point for my Express server. I set up middleware such as CORS and Morgan logger,
 * establish a connection to the database using Mongoose, and import and use defined routes like airBnbRoutes and farmRoutes.
 * These routes are connected to specific URL prefixes.
 */

// THIS IS MY EXPRESS SERVER -> how to write all this in c#?
const express = require('express')
require('dotenv').config() // access env

// Initialize helpers
const cookieParser = require('cookie-parser') // initialize parser
const cors = require('cors') // initialize CORS (for all routes on Express server)
const morgan = require('morgan') // initialize morgan logger
const mongoose = require('mongoose') // initialize mongoose

// execute express
const app = express() // set as var

// execute helpers
app.use(cors()) // execute cors
app.use(morgan('tiny')) // execute morgan
app.use(cookieParser()) // execute cookieParser

// set connection vars
const url = process.env.DB_URL || 'mongodb://localhost:27017/test'

// Import routes


/**
 * CONNECT TO MONGOOSE DB
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
app.use('/docs', documentRoutes)