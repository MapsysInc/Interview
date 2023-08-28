// init mongoose
const mongoose = require('mongoose') 

// define schema
const docSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    category:{
        type: String,
        enum:['supporting documents','signatures'],
        lowercase: true
    },
    },
    {
        collection:'pdfStorage'  
    }
)



// set storage url - changed fileUrl to a virtual prop and dynamically allocated it
// don't need the pre-save hook to set the fileUrl anymore, since it's calculated on-the-fly 
// ONLY WHEN property is accessed
docSchema.virtual('fileUrl').get(function() {
    // Define the base directory based on the category - ternary for now?
    let dir = this.category === 'signatures' ? 'SIG' : 'SD'
    return `/Docs/${dir}/${this.fileName.replace(/\\/g, '/')}`
  })

// compile model
const Document = mongoose.model('Document', docSchema)

// export
module.exports = Document