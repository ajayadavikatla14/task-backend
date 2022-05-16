const mongoose=require('mongoose');

const User=new mongoose.Schema(
    {
        name:{type:String,required:true},
        email:{type:String,required:true,unique:true},
        pwd:{type:String,required:true},
        pwd2:{type:String,required:true},
    },{collection:'user-data'}
)

const model=mongoose.model('user-data',User);
module.exports=model;