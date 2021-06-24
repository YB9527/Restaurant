import api from './api.js';
var baseURL = api.baseURL;
import canZhuoFoodApi from './canZhuoFoodApi.js';

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

var findCanChuoingBynum =function(canzhuonum){
	let url = baseURL+"/canzhuo/findcanzhuoingbyzanzhuonum?canzhuonum="+canzhuonum;
	return api.requestGETOneData({url});
}
exports.findCanChuoingBynum = findCanChuoingBynum;



var addCanZhuo_Food =function(canzhuo_foodArray){
	let url = baseURL+"/canzhuo/addfood";
	return api.requestPOST({url,data:canzhuo_foodArray});
}
exports.addCanZhuo_Food = addCanZhuo_Food;

var findById = function(id){
	let url = baseURL+"/canzhuo/findbyid?id="+id;
	return api.requestGETOneData({url}).then(canzhuo=>{
		 return  canZhuoFoodApi.findcanzhuofoodbycanzhuoid([id])
		 .then(canzhuofoodarray =>{
			 computedCanZhuoFood(canzhuo,canzhuofoodarray);
			 return canzhuo;
		 })
	})
}
exports.findById = findById;


/**
 * 计算餐桌上的食物
 * @param {Object} canzhuoArraye 可以是单个也可是数组
 * @param {Object} canfoodarray
 */
var computedCanZhuoFood = function (canzhuoArray,canfoodarray){

	if(canzhuoArray&& !(canzhuoArray instanceof Array)){
		canzhuoArray = [canzhuoArray];
	}
	//console.log("canzhuoArray",canzhuoArray);
	let canzhuofoodidMap = uni.vue.$Tool.groupByAttribute(canfoodarray,"canzhuoid");
	//console.log("canzhuofoodidMap",canzhuofoodidMap);
	canzhuoArray.forEach(canzhuo=>{
		let canzhuofoods = canzhuofoodidMap[canzhuo.id];
		canZhuoFoodApi.imageURLAddBase(canzhuofoods);
		if(canzhuofoods){
			canzhuo.isfoodover = 1;
			canzhuo.pricetotal = 0;
			canzhuo.canzhuofoodArray = canzhuofoods;
			for(let canzhuofood of canzhuofoods){
				if(!canzhuofood.isfinish){
					canzhuo.isfoodover = 0;
				}
				canzhuofood.pricetotal =canzhuofood.price* canzhuofood.count;
				canzhuo.pricetotal += canzhuofood.price* canzhuofood.count;
			}
			
		}
	});
	//console.log("canzhuoArray",canzhuoArray);
}
exports.computedCanZhuoFood = computedCanZhuoFood;

var update = function(canzhuo){
	let url = baseURL+"/canzhuo/update";
	return api.requestPOST({url,data:canzhuo});
}
exports.update = update;

 var computedFinalChargeById =async function(id){
	let canzhuo =await findById(id);
	canzhuo.finalcharge =  canzhuo.pricetotal;
	await update(canzhuo);
}
exports.computedFinalChargeById = computedFinalChargeById;

//根据消费用户的id查询除消费记录
 var findByCheckuserid =async function(checkuserid){
	let url = baseURL+"/canzhuo/findbycheckuserid?checkuserid="+checkuserid;
	return api.requestGET({url});
	
}
exports.findByCheckuserid = findByCheckuserid;