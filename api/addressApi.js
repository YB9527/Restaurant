
import api from './api.js';
var baseURL = api.ip+"/address";

/**
 * 获取个人收货地址地址
 */
var findByUserid = function(userid){
	let url =baseURL+"/findbyuserid";
	return api.requestGET({url});
	
}
exports.findByUserid = findByUserid;

var findById = function(userid){
	let url =baseURL+"/findbyid";
	return api.requestGET({url});
	
}
exports.findById = findById;

var add = function(data){
	let url = baseURL+"/add";
	return api.requestPOST({url,data});
	
}
exports.add = add;

var edit = function(data){
	let url = baseURL+"/edit";
	return api.requestPOST({url,data});
	
}
exports.edit = edit;

var deleteByPo = function(data){
	let url = baseURL+"/delete";
	return api.requestPOST({url,data});
}
exports.deleteByPo = deleteByPo;