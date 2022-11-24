const mongoose =require('mongoose');
const path=require('path');
const uploads = path.join('/Uploads/avtar');
const bcrypt=require('bcryptjs');
const multer=require('multer');
const userSchema =mongoose.Schema({
    
    name:{
        type:String,
        require:true
    },
    email:{ 
        type:String,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    avtar:{
        type:String,
        default:'https://aui.atlassian.com/aui/8.8/docs/images/avatar-person.svg'
    }
    
})


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',uploads))
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
})



  // static methods
  userSchema.statics.uploadedAvtar= multer({storage: storage}).single('avtar');
  userSchema.statics.avtarPath=uploads   


  userSchema.pre('save',async function(next){
      if(!this.isModified){
        next();
      }
      if(this.password.length<15){
        const salt = await bcrypt.genSaltSync(10);
        this.password= await bcrypt.hash(this.password,salt);
      }
  })


  userSchema.methods.matchPassword=async function(enteredPassword){

     return  await bcrypt.compare(enteredPassword,this.password);
      
  }


const user = mongoose.model("user", userSchema)

module.exports= user;

