var categorySchema = require('../model/category');
var mongoose = require('mongoose');


class CategoryRepo{

    constructor(){
      this.categoryModel = mongoose.model('category',categorySchema);

    }

    async addCategory(catdata){
       
        let category = new this.categoryModel(catdata);

        try{
            let result = await category.save();

            if(result.categoryName == catdata.categoryName){
                return {result:true,message:'category is added.'};
              }
        }
        catch(error){
            if(error.code == 11000){
                return {result:false , message:'category already exist'};
              }
              else{
                if(error._message){
                  
                  return {result:false , message:error._message};
                }
                else{
                  return {result:false , message:'something went wrong'};
                }
              
              }
        }
      
        
    }

    async getCategories(){


      try{
        let result = await this.categoryModel.find({}).exec();
        console.log(result);
        return result ;

      }
      catch(error){

        console.log(error);

      }
    
    }


    async updateCategory(category){


      try{
        let result = await this.categoryModel.findByIdAndUpdate(category._id,category).exec();
        if(result){
         return {result:true,message:'category edited'};
        }
      }
      catch (error){
        console.log(error);
      }
     
    }

    async deleteCategory(categoryId){


      try{
        let result = this.categoryModel.findByIdAndRemove(categoryId).exec();
        return result;
      }
      catch(error){
        console.log(error);
      }
    }

    async getUserCategories(userId){

      try {
        let result = await this.categoryModel.find({userid:userId}).exec();
        return result;
      } catch (error) {
        console.log(error);

      }
    }
    
  
  }

module.exports = CategoryRepo;