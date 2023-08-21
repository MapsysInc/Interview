// SEED FILE - BUT ALSO A PRACTICE FILE //
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const SupportingDoc = require('./models/sdModel') // Import your Mongoose model
const PDFDocument = require('pdfkit') // initialize pdf construction
const romanize = require('romanize') // initialize roman numeral conversion
require('dotenv').config()

// Connect to MongoDB (if not already connected)
mongoose.connect(process.env.DB_URL)
const directoryPath = path.join(__dirname, '..', 'Docs', 'SD')

function getHighestRoman(directoryPath) {
  const files = fs.readdirSync(directoryPath)
  const romanNumerals = files
    .filter((fileName) => fileName.startsWith('SD-'))
    .map((fileName) => {
      const match = fileName.match(/SD-(.*?).pdf/)
      return match ? match[1] : null
    })
    .filter((numeral) => numeral !== null)

  if (romanNumerals.length === 0) {
    return 'VIII' // Start from VIII if no existing files
  }

  // Sort the Roman numerals and get the highest one
  const highestNumeral = romanNumerals
    .sort((a, b) => romanize(b) - romanize(a))[0]

  return highestNumeral // Return the highest numeral as-is
}

// Determine the next Roman numeral
// const nextRomanNumeral = getHighestRoman(
//   path.join(__dirname, '..', 'Docs', 'SD')
// )

const nextRomanNumeral = romanize(romanize(getHighestRoman(directoryPath)) + 1)
// let currentRomanNumeral = 8 // since we are staring with sd7, we will hardcode this count

const romanNumeral = romanize(nextRomanNumeral)
const fileName = `SD-${romanNumeral}.pdf` // Define the file name using the next Roman numeral
const filePath = path.join(__dirname, '..', 'Docs', 'SD', fileName) // Define the file path
const doc = new PDFDocument() // call pdfkit
const description = 'this is a dummy document for testing purposes and is hard coded for now.'
doc.text(fileName) // add content to pdf

const pdfStream = fs.createWriteStream(filePath) // create write stream

doc.pipe(pdfStream) // pipe output to filepath (writeable stream)
doc.end() // finalize pdf - listen for "finish" even on pdfStream

pdfStream.on('finish', () => {
  // Create a new SupportingDoc instance with dummy data now that
  // pdf is generated 
  const dummyDoc = new SupportingDoc({
    title: fileName,
    description: fileName,
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
