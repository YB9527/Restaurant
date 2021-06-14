
import api from './api.js';
var baseURL = api.baseURL+"/canzhuofood";



var findcanzhuofoodbycanzhuoid = function(canzhuoidArray){
	let url = baseURL+"/findcanzhuofoodbycanzhuoid";
	let sb = "";
	
	canzhuoidArray.forEach(item=>{
		sb = sb + "'"+item +"',";
	})
	if(sb){
		sb = sb.substring(1,sb.length-2);
	}
	return api.requestPOST({url,data:{canzhuoidArray:sb}});
}
exports.findcanzhuofoodbycanzhuoid = findcanzhuofoodbycanzhuoid;

var imageURLAddBase = function(canzhuofoods){
	if(canzhuofoods&& !(canzhuofoods instanceof Array)){
		canzhuofoods = [canzhuofoods];
	}
	canzhuofoods.forEach(item=>{
		item.baseimageurl =api.imgpriewurl+"/"+ item.imageurl;
	})
}
exports.imageURLAddBase = imageURLAddBase;

var update =function(food){
	let url = baseURL+"/update";
	return api.requestPOST({url,data:food});
}
exports.update = update;