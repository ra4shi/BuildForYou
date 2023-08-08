const  mongoose = require('mongoose');

const companySchema = mongoose.Schema({

    companyname: {
        type : String,
        required : true,
    },
    companyusername:{
        type : String,
        required : true
    },
    companycategories: { 
        type:String,
        required : true,
    },
    aboutcompany: {
        type : String,
        required : true
    },
    certifications: {
        type:[String],
        required : true
    },
    license: {
        type:[String],
        required : true
    },
    company : {
        type : String , 
        required : true
    }
})

const company = mongoose.model('company',companySchema)

module.exports = company
