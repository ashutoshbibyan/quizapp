var express = require('express');
var router =  express.Router();
var categorySchema = require('../model/category');
var questionSchema = require('../model/question');
var mongoose = require('mongoose');
const QuestionService = require('../service/questionservice');
const QuestionCategoryService  = require('../service/questioncategoryservice');

/**
 * get list of all question from starting point 
 */
router.get("/all/:start/:quantity/:catid?",function(req , res ,next){
 if(req.isAuthenticated()){

  let questionService = new QuestionService();

  let start =req.params.start;
  let quantity = req.params.quantity;
  let catId =req.params.catid;
  let user = req.session.passport.user;

  (async()=>{
    try{
      let result = await questionService.getAllQuestion(start,quantity,catId,user);
      res.json(result);
    }
    catch(error){
  
      console.log(error);
    }
  })();

}
  
});


/**
 * get the count of question created by a user
 */

router.get("/count",function(req,res,next){

  if(req.isAuthenticated()){
    let user = req.session.passport.user;
    let questionModel = mongoose.model('question', questionSchema);
    let catid = req.params.catid;
    let query = questionModel.find({userid:user._id}).count();
  
   query.exec().then((result)=>{
      res.json(result);
    }).catch((error)=>{
      if(error){
        console.log(error);
      }
    });
  }
  
});

/**
 * get the count of question created by user of a particular category
 */
router.get("/count/cat/:catid",function(req,res,next){
  if(req.isAuthenticated()){
    let user = req.session.passport.user;

    let questionModel = mongoose.model('question', questionSchema);
    let catid = req.params.catid;
   
    query = questionModel.find({questionCategory:catid,userid:user._id}).count();
    
   query.exec().then((result)=>{
      res.json(result);
    }).catch((error)=>{
      if(error){
        console.log(error);
      }
    });
  
  }
 
});

/**
 * 
 */
router.get('/quiz/:catid/:difficulty/:skip?',function(req,res,next){
  
  let questionModel = mongoose.model('question',questionSchema);
  let catId = req.params.catid;
  let difficulty = req.params.difficulty;
  let skip = req.params.skip;
  questionModel.find({questionCategory:catId}).select('questionCategory questionText options').sort({difficulty:1}).skip(skip).limit(1).exec().then((result)=>{
    res.json(result);
  }).catch((error)=>{
    console.log(error);
  });
  
});


/**
 * this will get the ans of a question
 */
router.get('/ans/:qid',function(req,res,next){
 
  let questionModel = mongoose.model('question',questionSchema);
  let qid = req.params.qid;
  questionModel.findById(qid).select('ans').exec().then((result)=>{
    res.json(result);
  }).catch((error)=>{
    console.log(error);
  });
});

/**
 * 
 */
router.get('/next/:catid/:lastqid/:ansStatus',function(req,res,next){
  let questionModel = mongoose.model('question',questionSchema);
  let lastQid = req.params.lastqid;
  let catId = req.params.catid;
  let ansStatus = req.params.ansStatus;

  console.log(ansStatus);
  if(ansStatus==0){

    async function incDiff(){
      let question = await questionModel.findById(lastQid);
      question.dificulty = question.dificulty+1;
      await question.save();
    }
   
    incDiff();

  }  
 
  questionModel.find({questionCategory:catId}).select('questionCategory questionText options').sort({difficulty:1}).exec().then((result)=>{
  let index = 0;
   
  for(let i = 0; i < result.length ; i++){
    if(result[i]._id == lastQid){
      index = i+1;
    }
  }
   res.json(result[index]);
  }).catch((error)=>{
    console.log(error);
  });
});

/**
 * this will skip the question
 */
router.get('/skip/:catid/:lastqid',function(req,res,next){
  let questionModel = mongoose.model('question',questionSchema);
  let lastQid = req.params.lastqid;
  let catId = req.params.catid;

  async function incDiff(){
    let question = await questionModel.findById(lastQid);
    question.dificulty = question.dificulty+1;
    await question.save();
  }
 
  incDiff();
  

  questionModel.find({questionCategory:catId}).select('questionCategory questionText options').sort({difficulty:1}).exec().then((result)=>{
  let index = 0;
   
  for(let i = 0; i < result.length ; i++){
    if(result[i]._id == lastQid){
      index = i+1;
    }
  }
   res.json(result[index]);
  }).catch((error)=>{
    console.log(error);
  });
});



/**
 * this will add a new question
 */
router.post('',function(req,res,next){
  if(req.isAuthenticated()){

    let question = req.body;
    question.userid = req.session.passport.user._id;

    (async()=>{
      let questionService = new QuestionService();

      try{
        let result = await questionService.addQuestion(question);
        res.json(result);
        
      }
      catch(error){
       console.log(error);
      }
    })();
  }
});

/**
 * this will update the question
 */
router.put('',function(req,res,next){
  if(req.isAuthenticated()){

    let questionService = new QuestionService();

    (async()=>{
      
      try {
        
        let question = req.body;

        let result = await questionService.updateQuestion(question);
        if(result){
          res.json({result:true,message:'category edited'});
        }
        
      } catch (error) {
        console.log(error);
      }
    })();
  } 
});
/**
 * this will delete the question 
 */
router.delete("/:id",function(req,res,next){

  if(req.isAuthenticated()){

    let questionService = new QuestionService();

    (async()=>{
      try {
        let id = req.params.id;
        let result = await questionService.deleteQuestion(id);
        if(result._id == id){
          res.json({result:true,message:"question is removed"});
        }
      } catch (error) {
        if(error){
          res.json({result:false,message:"something went wrong"});
        }
        console.log(error);
      }
    })();

  }
});

/**
 * this will get the question category create by user
 */
router.get("/my/category" , function(req, res, next){

  if(req.isAuthenticated()){
    let questionCategoryService = new QuestionCategoryService();

    (async()=>{
      try {
        let user = req.session.passport.user;

        let result = await questionCategoryService.getUserCategories(user._id);
        res.json(result);
      } catch (error) {
        console.log(error);
      }
    })();
 
  }
  
});

/**
 * this will get the category from db
 */
router.get("/category" , function(req, res, next){

  let questionCategoryService = new QuestionCategoryService();
  (async ()=> {
    try{
      let result = await questionCategoryService.getCatetoryies();
      res.json(result);
    }
    catch(error){
      console.log(error);
      res.json({result:false,message:'something went wrong reload the page'});
    }
  })();
    
});

/**
 * this will add new category to db
 */
router.post("/category",function(req,res,next){
  if(req.isAuthenticated()){
    
    let questionCategoryService = new QuestionCategoryService();
    let userid = req.session.passport.user._id;
    (async () => {
      try {
        let result = await questionCategoryService.addNewCategory(req.body, userid);
        res.json(result);
      } catch (error) {
        res.json({ result: false, message: 'something went wrong' });
      }
    })(); // Call
    

 }  
});

/**
 * this will delete the question category
 */
router.delete('/category/:id',function(req,res,next){

  if(req.isAuthenticated()){

    let questionCategoryService = new QuestionCategoryService();
    
    (async () => {
      try {
        let result = await questionCategoryService.deleteCategory(req.body);
        res.json(result);
      } catch (error) {
        res.json({ result: false, message: 'something went wrong' });
      }
    })(); // Call
  }
});

/**
 * this will update the question category
 */
router.put('/category',function(req,res,next){
  if(req.isAuthenticated()){

    let questionCategoryService = new QuestionCategoryService();
    
    (async () => {
      try {
        let result = await questionCategoryService.updateCategory(req.body);
        res.json(result);
      } catch (error) {
        res.json({ result: false, message: 'something went wrong' });
      }
    })(); // Call

  }
});



module.exports = router;