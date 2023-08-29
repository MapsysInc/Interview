const express = require('express');
const mongoose = require('mongoose');
const Document = require('./models/documentModel')
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/pdfStorage')
  .then(async () => {
    try {
      // Get the Document model
      const modelDocument = mongoose.model('Document');
      // Delete documents with the value "No field" in the fileUrl field
      const deletedResult = await modelDocument.deleteMany({
        fileUrl: 'No field'
      });
      console.log(`Deleted ${deletedResult.deletedCount} documents with "No field" in the fileUrl field.`);
    } catch (deleteError) {
      console.error(`Error deleting documents: ${deleteError}`);
    }
  })
  .catch(connectError => {
    console.error(`Failed to connect to MongoDB: ${connectError}`);
  });
