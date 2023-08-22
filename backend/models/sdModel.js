// init mongoose
const mongoose = require('mongoose') 

// define schema
const sdSchema = new mongoose.Schema({
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
})
// set storage url
sdSchema.pre('save', function(next){
    this.fileUrl = `/Docs/SD/${this.title}`
    next()
})
// compile model
const SupportingDoc = mongoose.model('SupportingDoc', sdSchema)

// export
module.exports = SupportingDoc