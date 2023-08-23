const fs = require('fs')
const path = require('path')
const csvParser = require('csv-parser')
const mongoose = require('mongoose')
const SupportingDoc = require('./models/documentModel') // Import your Mongoose model
require('dotenv').config()

const csvFilePath = path.join(__dirname, '..', 'Docs', 'Documents.csv')
const documents = []

fs.createReadStream(csvFilePath)
  .pipe(csvParser())
  .on('data', (row) => {
    documents.push({
      name: row.Name,
      path: row.Path,
      category: row.Category
    })
  })
  .on('end', async () => {
    console.log('CSV file parsed successfully')
    
    try {
      await mongoose.connect('mongodb://localhost:27017/pdfStorage')
      // await mongoose.connect(process.env.DB_URL)
      await seedDatabase(documents)
      mongoose.disconnect()
    } catch (error) {
      console.error(`Error connecting to database or seeding: ${error}`)
    }
  })

  async function seedDatabase(documents) {
    for (const document of documents) {
      try {
        const { name, path, category } = document
        const titleMatch = path.match(/\\([^\\]+\.pdf)$/)
        if (titleMatch) {
          const title = titleMatch[1] // Extract title from the path
          const dummyDoc = new SupportingDoc({
            title: title,
            description: name,
            category: category,
            fileUrl: path
          })
          await dummyDoc.save()
          console.log(`Document ${title} saved successfully`)
        } else {
          console.error(`Error extracting title from path: ${path}`)
        }
      } catch (error) {
        console.error(`Error saving document ${document.name}: ${error}`)
      }
    }
  }
  
