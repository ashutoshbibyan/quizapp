const {Schema, default: mongoose} = require('mongoose');

const categorySchma = new Schema({
    categoryName:{type:String , unique:true, required:true},
    categoryDiscription:{type:String , required:true},
    userid:{type:mongoose.Schema.Types.ObjectId , ref:'User'}
});

module.exports = categorySchma;