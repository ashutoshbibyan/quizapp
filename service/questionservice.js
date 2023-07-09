const QuestionRepo = require("../repository/questionrepo");

class QuestionService{

    constructor(){

        this.questionRepo = new QuestionRepo;
    }

    async addQuestion(questionData){

        try{
            let result = await this.questionRepo.addQuestion(questionData);

            if(result.questionText == questionData.questionText){
                return {result:true,message:"Question is added"};
              }
            
            
        }
        catch(error){
            if(error.code==11000){
                return {result:false,message:"Question already exist"};
              }
              else{
                if(error._message){
                  return {result:false,message:error._message};
                }
                else{
                  return {result:false,message:"something went wrong"};
                }
              }

        }

    }

    async getAllQuestion(start,quantity,catId,user){


        try{
            let result = await this.questionRepo.getQuestions(start,quantity,catId,user);
            return result;
        }
        catch(error){
            console.log(error);
        }
    }

    async updateQuestion(question){

        try{
            let result = await this.questionRepo.updateQuestion(question);
            return result;
        }
        catch(error){
            console.log(error);
        }
    }

    async deleteQuestion(id){
        try {
            let result = await this.questionRepo.deleteQuestion(id);
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    

}


module.exports = QuestionService;