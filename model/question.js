const {Schema , default: mongoose} = require('mongoose');

const questionSchma = new Schema({
    questionCategory:{type:String,required:true},
    questionText:{type:String , unique:true , required:true},
    options:{type:[String]},
    ans:{type:Number},
    noOfVisit:{type:Number},
    noOfSkips:{type:Number},
    noOfSolved:{type:Number},
    noOfWrong:{type:Number},
    dificulty:{type:Number,default:0},
    userid:{type:mongoose.Schema.Types.ObjectId , ref:'User'}

});

module.exports = questionSchma;