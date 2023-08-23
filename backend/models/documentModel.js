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
    fileUrl:{
        type: String,
        required: true
    }
    },
    {
        collection:'pdfStorage'  
    }
)

// set storage url
docSchema.pre('save', function(next){
    this.fileUrl = `/Docs/SD/${this.title}`
    next()
})

// compile model
const Document = mongoose.model('Document', docSchema)

// export
module.exports = Document