// SEED FILE - BUT ALSO A PRACTICE FILE //
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const SupportingDoc = require('./models/sdModel') // Import your Mongoose model
const PDFDocument = require('pdfkit')             // initialize pdf construction
const romanize = require('romanize')              // initialize roman numeral conversion
require('dotenv').config()

// Connect to MongoDB (if not already connected)
// mongoose.connect(process.env.DB_URL)
mongoose.connect('mongodb://localhost:27017/test')
const directoryPath = path.join(__dirname, '..', 'Docs', 'SD')

function getHighestRoman(directoryPath) {
   // read dir using node built in file system's readdirSync. This blocks code from running 
   // until all contents are read and processed
  const currentNumerals = fs.readdirSync(directoryPath)
    .filter((fileName) => fileName.startsWith('SD-'))
    .map((fileName) => { // process array
      const match = fileName.match(/SD-(.*?).pdf/) // regex (regular expression) pattern to match filenames
      return match ? match[1] : null // match attempts to match regex pattern
    })
    .filter((numeral) => numeral !== null)

  if (currentNumerals.length === 0) {
    return 'VIII' // Start from VIII if no existing files
  }
  console.log('Current Numerals:', currentNumerals)
  
  // Sort numerals in desc order and return the highest one
  const currentHighest = currentNumerals
    .sort((a, b) => romanize(b) - romanize(a))[0]
    
  return currentHighest // Return the highest numeral as-is
}
// temp helper function to incriment roman numeral titles
function romanToNumeric(roman) {
  const romanValues = {
    I: 1,
    IV: 4,
    V: 5,
    IX: 9,
    X: 10,
    XL: 40,
    L: 50,
    XC: 90,
    C: 100,
    CD: 400,
    D: 500,
    CM: 900,
    M: 1000
  }

  let numericValue = 0
  let i = 0

  while (i < roman.length) {
    if (i + 1 < roman.length && romanValues[roman.substring(i, i + 2)]) {
      numericValue += romanValues[roman.substring(i, i + 2)]
      i += 2
    } else {
      numericValue += romanValues[roman[i]]
      i++
    }
  }

  return numericValue
}

// take highest numeral, add one then romanize
const highestNumeral = getHighestRoman(directoryPath)
const numericValue = romanToNumeric(highestNumeral)
const nextNumericValue = numericValue + 1
const nextRomanNumeral = romanize(nextNumericValue)


// PDF PREP
const fileName = `SD-${nextRomanNumeral}.pdf` // Define the file name using the next Roman numeral
const filePath = path.join(__dirname, '..', 'Docs', 'SD', fileName) // Define the file path
const doc = new PDFDocument() // call pdfkit
const description = `SD-${nextRomanNumeral}`  // set description/content to fileName for now

doc.text(description)  // add content to pdf

const pdfStream = fs.createWriteStream(filePath) // create write stream

doc.pipe(pdfStream) // pipe output to filepath (writeable stream)
doc.end() // finalize pdf - listen for "finish" even on pdfStream

pdfStream.on('finish', () => {
  // Create a new SupportingDoc instance with dummy data now that
  // pdf is generated 
  const dummyDoc = new SupportingDoc({
    title: fileName,
    description: description,
    category: 'supporting documents',
    fileUrl: `/Docs/SD/${fileName}`
  })
  dummyDoc.save()
  .then((result) => {
    console.log('Doc saved successfully', result)
  })
  .catch((e) => {
    console.error(`Error saving doc: ${e}`)
  })
})

pdfStream.on('error', (e) => {
  console.error(`Error writing pdf: ${e}`)
})
