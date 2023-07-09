var questionSchema = require('../model/question');
var mongoose = require('mongoose');

class QuestionRepo{

    constructor(){
      this.questionModel = mongoose.model('question',questionSchema);
    
    }

  
       

    async addQuestion(questionData){
        
        let question = new this.questionModel(questionData);
        try{

            let result = await question.save();
            return result;
        
            
        }
        catch(error){
            return error;
            
        }
    }

    async getQuestions(start,quantity,catId,user){
        let questionModel = mongoose.model('question',questionSchema);

        let query = this.questionModel.find({userid:user._id}).skip(start).limit(quantity);
        if(catId!=undefined){
          query = questionModel.find({questionCategory:catId,userid:user._id}).skip(start).limit(quantity);
        }
        try{
          let result = await query.exec();
          return result;
        }
        catch(error){
          console.log(error);
        }
        

    }

    async updateQuestion(question){

      try {
        let result = await this.questionModel.findByIdAndUpdate(question._id,question).exec();
        return result;
      } catch (error) {
        console.log(error);
      }
    }

    async deleteQuestion(id){
      try {
        let result = await this.questionModel.findByIdAndDelete(id).exec();
        return result;
      } catch (error) {
        console.log(error);
      }
    }
  }


module.exports = QuestionRepo;