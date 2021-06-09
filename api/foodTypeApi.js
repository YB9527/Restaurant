
import api from './api.js';
var baseURL = api.baseURL+"/foodtype";


var saveFoodType = function(foodtype){
	let url = baseURL+"/add";
	return api.requestPOST({url,data:foodtype});
}
exports.saveFoodType = saveFoodType;


var findAll = function(){
	let url = baseURL+"/findall";
	return api.requestGET({url});
}
exports.findAll = findAll;


var deleteFoodType = function(foodtype){
	let url = baseURL+"/delete";
	return api.requestPOST({url,data:foodtype});
}
exports.deleteFoodType = deleteFoodType;