const {Schema} = require('mongoose');

const userSchema = new Schema({
    username:{type:String , unique:true , required:true},
    password:{type:String ,required:true},
    phoneno:{type:String , required:true}
});

module.exports = userSchema;