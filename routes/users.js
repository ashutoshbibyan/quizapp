var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport  = require('passport');
var LocalStrategy = require('passport-local');
var userSchema = require('../model/user');
var session = require('express-session');
const bcrypt = require('bcrypt');


passport.use(new LocalStrategy(function verify(username,password,done){
  
  let user = mongoose.model('user',userSchema);
  //let username = req.body.username;
  //let password = req.body.password;

  
  user.findOne({username:username}).then((value)=>{
    
    bcrypt.compare(password,value.password).then((result)=>{
      if(result){
        console.log(result);
        return done(null,value);
      }else{
        return done(null,false,"Username and Password Invalid");
      }
    });
  }).
  catch((error)=>{});
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, {username: user.username , phoneno:user.phoneno , _id:user._id});
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/logedin',function(req,res,next){
  if(req.isAuthenticated()){
    let user  = req.session.passport.user;
    
    res.json(user);
  }else{
    res.json({result:false,message:'not authenticated'});
  }
});
router.post('/',function(req,res,next){
   let userModel = mongoose.model('user', userSchema);
   let username=req.body.username;
   let password=req.body.password;
   let phoneno=req.body.phoneno;

   
   
   bcrypt.hash(password,10).then((password)=>{

    
   let user = new userModel({username,password,phoneno});
   
   let obj = user.save().then((result)=>{
     if(result.username == req.body.username){
      res.json({result:true , message:'signup sucessfull'});
     }
   }).catch((error)=>{
    if(error){
      if(error.code == 11000){
        res.json({result:false , message:'user already exist'});
      }
      else{
        if(error._message){
          console.log(error);
          res.json({result:false , message:error._message});
        }
        else{
          res.json({result:false , message:'something went wrong'});
        }
      
      }
    }
   });

   }).catch((error)=>{
    console.log(error);
   });
   

});

router.get('/isauth',function(req,res,next){

  if(req.isAuthenticated()){
    res.json({result:true,message:'user is authenticated'});
  }
  else {
    res.json({result:false,message:'user is not authenticated'});
  }
});

router.get('/signout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

router.post('/signin', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      console.log(err);
      return next(err);
    }
    if (!user) {
      return res.json({ result: false, message: info.message });
    }
    req.logIn(user, function(err) {
      if (err) {
        console.log(err);
        return next(err);
      }
      return res.json({ result: true, message: "Welcome Back" });
    });
  })(req, res, next);
});


router.get('/filters/:one-:two-:three.:four', function (req,res,next){
  res.send(req.params);

})

router.get('/authenticate', function(req,res,next){
  res.send("authentictaion works");
})

module.exports = router;
