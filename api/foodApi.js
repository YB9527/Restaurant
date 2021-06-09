
import api from './api.js';
var baseURL = api.baseURL+"/food";

/**
 * @param {Object} food 食物
 * @param {Object} filePath 图片路径
 */
var saveFood =async function(food,filePath){
	if(filePath){
		let imgfile =await api.uploadFile({filePath:filePath,dir:"食物图片"});
		food.imageurl = imgfile.path.replace(/\\/g,"/");
	}
	let url = baseURL+"/add";
	return api.requestPOST({url,data:food});
	
}
exports.saveFood = saveFood;

var updateFood =async function(food,filePath){

	if(filePath){
		let imgfile =await api.uploadFile({filePath:filePath,dir:"食物图片"});
		food.imageurl = imgfile.path.replace(/\\/g,"/");
	}
	let url = baseURL+"/update";
	console.log(url);
	return api.requestPOST({url,data:food});
}
exports.updateFood = updateFood;


var findAll = function(foodtype){
	let url = baseURL+"/findall";
	console.log(url)
	return api.requestGET({url});
}
exports.findAll = findAll;


var findFoodByTypeId = function(foodtypeid){
	let url = baseURL+"/findfoodbytypeid?foodtypeid="+foodtypeid;
	//console.log(url)
	return api.requestGET({url});
}
exports.findFoodByTypeId = findFoodByTypeId;


var findFoodById = function(id){
	let url = baseURL+"/findfoodbyid?id="+id;
	//console.log(url)
	return api.requestGETOneData({url});
}
exports.findFoodById = findFoodById;

var deleteFood = function(food){
	let url = baseURL+"/delete";
	//console.log(url)
	return api.requestPOST({url,data:food});
}
exports.deleteFood = deleteFood;