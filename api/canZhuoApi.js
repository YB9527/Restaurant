import api from './api.js';
var baseURL = api.baseURL;


var getCanZhuoCount = function(){
	let url = baseURL+"/config/getzhuoshu";
	//console.log(url);
	return api.requestGETOneData({url}).then(data=>{
		return data.value;
	})
	
}
exports.getCanZhuoCount = getCanZhuoCount;

var setCanZhuoCount = function(canzhuocount){
	
	let url = baseURL+"/config/getzhuoshu";
	//console.log(url);
	return api.requestGETOneData({url}).then(data=>{
		url = baseURL+"/config/setzhuoshuo";
		data.value = canzhuocount;
		//sdebugger
		return api.requestPOST({url,data}).then(res=>{
			return res
		})
	})
}
exports.setCanZhuoCount = setCanZhuoCount;


var addCanZhuo = function(data){
	let url = baseURL+"/canzhuo/add";
	//console.log(url);
	return api.requestPOST({url,data});
	
}
exports.addCanZhuo = addCanZhuo;

var findOrderFoodByCanZhuoNum = function(canzhuonum){
	let url = baseURL+"/canzhuo/orderlist?canzhuonum="+canzhuonum;
	return api.requestPOST({url});
}
exports.findOrderFoodByCanZhuoNum = findOrderFoodByCanZhuoNum;

var saveCanZhuo =function(canzhuoArray){
	let url = baseURL+"/canzhuo/savecanzhuo";
	return api.requestPOST({url,data:canzhuoArray});
}
exports.saveCanZhuo = saveCanZhuo;