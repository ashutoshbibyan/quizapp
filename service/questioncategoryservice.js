const CategoryRepo = require('../repository/categoryrepo');

class QuestionCategoryService{

    constructor(){
        this.categoryRepo = new CategoryRepo();
    }

    async addNewCategory(category,userid){


        category.userid = userid;

        try{
            let result = await this.categoryRepo.addCategory(category);
            return result;
        }
        catch(error){
            if(error){
                return {result:false , message:'something went wrong'};
            }
        }



    }


    async getCatetoryies(){

        try{
            let result = await this.categoryRepo.getCategories();
            return result;
        }
        catch(error){
            console.log(error);
        }
    }

    async updateCategory(categoryData){

        try{
            let result = await this.categoryRepo.updateCategory(categoryData);
            return result;
        }
        catch(error){
            console.log(error);
        }
    }


    async deleteCategory(categoryId){

        try{
            let result = await this.categoryRepo.deleteCategory(categoryId);
            return result;
        }
        catch(error){
            console.log(error);
        }
    }

    async getUserCategories(userId){

        try {
            let result = await this.categoryRepo.getUserCategories(userId);
            return result;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = QuestionCategoryService;