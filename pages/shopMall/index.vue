<template>
	<view class="shopMallcontent" >
		<view class="shopMall" v-if="!cartFoodListShow" >
			<view class="left">
				 <scroll-view scroll-y="true">
					 <view
					 v-for="(foodtype,index) in foodtypeList"
					 :key="foodtype.id"
					 :class="'foodtype ' + (foodtype.id === currentFoodType.id?'foodtypeactive':'')" 
					 @click="foodtypeclick(index,foodtype)"
					 v-if="foodtype.count"
					 >
					 <uni-badge 
						absolute="rightTop"
						:offset="[-10,15]"
						type="warning"
						:text="foodtype.foodcountsum">
						 <text>{{foodtype.label}}</text>
					 </uni-badge>
					 	
					 </view>
				 </scroll-view>
			</view>
			<view class="right">
				<scroll-view scroll-y="true">
					<view 
					v-if="showfood"
					v-for="(food,index) in currentFoodType.foodList"
					:key="food.id"
					class="food">
					
						<image :src="food.url" mode="aspectFill"></image>
						<view class="content">
							<view class="top">
								<text class="label">{{food.label}}</text>
							</view>
							<view class="bottom">
								<text class="price">￥{{food.price}}/{{food.unit | foodUnitFilter}}</text>
								<numcombox v-if="food.state === 1 " :unit="food.unit" @change="foodcountchange" class="countset" :data="food" prop="count"></numcombox>
							</view>
							<view v-if="food.state === 2" style="color: #F0AD4E;margin-top: 20rpx;">
								<text>{{food.state | foodStateFilter}} </text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view> 
			
		</view>
		<!-- <uni-transition  class="cart" :duration="500" :mode-class="['fade', 'slide-bottom']" :show="cartFoodListShow">
			</uni-transition> -->
			<!-- <view class="dialogback" @click="cartFoodListShow = false">
				<!-- 购物清单背景遮幕
			</view> -->
			<view class="cart-food-list" v-if="cartFoodListShow">
				<view class="top">
					<text>已选菜品</text> 
					<view><text  class="cuIcon-unfold xiala" @click="cartFoodListShow = false"></text></view>
					<view><text  class="cuIcon-delete"  @click="clearOrderCart"></text></view>
				</view>
				<view class="foodlist">
					<scroll-view class="foodlist"  scroll-y="true">
						<view 
						v-for="(orderFood,index) in orderFoodList"
						:key="orderFood.id"
						class="food">
							<image :src="orderFood.url" mode="aspectFill"></image>
							<view class="content">
								<view class="top">
									<text class="label">{{orderFood.label}}</text>
								</view>
								<view class="bottom">
									<text class="price">￥{{orderFood.price }}/{{orderFood.unit | foodUnitFilter}}</text>
									
									<numcombox :unit="orderFood.unit" @change="Orderfoodcountchange" class="countset" :data="orderFood" prop="count"></numcombox>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		
		<view class="fix-cart">
			<view class="cart-part" @click="openCartInfo">
				<view><img src="/static/images/icon_cart.png"></view>
			</view>
			<view class="cart-count"  @click="openCartInfo" ><text > {{orderFoodList | allfoodCountSum}}份</text> </view>
			<view class="cart-price">￥<span>{{orderFoodList | computedAmount}}</span></view>
			<view class="cart-btn yellow" v-if="!cartFoodListShow" @click="cartFoodListShow = true">查看</view>
			<view class="cart-btn red" v-else @click="ok">提交</view>
		</view>
	</view>
</template>

<script>
	import foodTypeApi from '@/api/foodTypeApi.js'
	import foodApi from '@/api//foodApi.js'
	import canZhuoApi from '@/api/canZhuoApi.js'
	import numcombox from '@/components/numcombox.vue'
	export default {
		components:{numcombox},
		data() {
			return {
				showfood:false,
				userid:'17380646105',
				peopletotal:3,
				canzhuonum:-1,
				cartFoodListShow:false,
				currentFoodType:"",
				orderFoodList:[],//点的{菜品food、数量count}
				foodtypeList:[],
			}
		},
		filters: {
			test(a){
				console.log(a);
				return a.foodcountsum;
			},
			allfoodCountSum(orderFoodList){
				let sum = 0;
				orderFoodList.forEach(item=>{
					if(item.count){
						sum = (item.count*1 +  sum*1).toFixed(1)*1;
					}
					
				});
				//console.log("sum",sum);
				//console.log("orderFoodList",orderFoodList);
				return sum;
			},
			computedAmount(orderFoodList){
				
				if(!orderFoodList){
					return 0;
				}
				let amount = 0; 
				for (let orderFood of orderFoodList) {
					amount += orderFood.price * orderFood.count;
				}
				amount = amount.toFixed(1)*1;
				
				//console.log("amount",orderFoodList);
				return amount;
			},
			foodCount(food, orderFoodList){
				for (let orderFood of orderFoodList) {
				
					if(orderFood.food.id === food.id){
						return orderFood.count;
					}
				}
				return "";
			}
		},
		onLoad(option) {
			let canzhuonum = option.canzhuonum;
			if(!canzhuonum){
				canzhuonum=4;
			}
			if(canzhuonum){
				this.canzhuonum = canzhuonum;
				uni.setNavigationBarTitle({
				    title: '王氏羊肉（'+canzhuonum+"号桌）"
				});
			}else{
				uni.setNavigationBarTitle({
				    title: '王氏羊肉（ 外卖 ）'
				});
			}
			
		},
		created() {
			this.init();
		},
		
		methods: {
			init(){
				
				uni.showLoading({
					title:"请稍等..."
				});
				this.findAllFoodType()
					.then((foodtypeList)=>{
						if(this.foodtypeList.length > 0){
							this.foodtypeList.splice(0,this.foodtypeList.length);
						}
						this.foodtypeList.push(...foodtypeList);
						if(foodtypeList.length > 0 &&!this.currentfoodtypeid ){
							this.currentfoodtypeid = foodtypeList[0].id;
						}
						this.findFoodByType(this.currentFoodType?this.currentFoodType:foodtypeList[0]);
						uni.hideLoading();
					});
			
			},
			findAllFoodType(){
				return foodTypeApi.findAll();
			},
			//根据食物类型获取所有食物
			async findFoodByType(foodtype){
				this.showfood = false;
				let typeid = foodtype.id;
				if(this.foodList && this.foodList.length > 0){
					this.foodList.splice(0,this.foodList.length);
				}
				if(!foodtype.foodList){
					let foods =await foodApi.findFoodByTypeId(typeid);
					for (let food of foods) {
						food.url = this.$Api.imgpriewurl+food.imageurl;
						//console.log(food.url);
						food.count = 0;
						
					}
					//console.log(1,foods);
					foodtype.foodList = foods;
				}else{
					await setTimeout(()=>{
						
					},100);
				}
				this.currentFoodType = foodtype;
				//foodtype.foodcountsum = 3;
				this.showfood = true;
				//console.log(this.currentFoodType);
					
			},
			//清空购物车
			clearOrderCart(){
				//uni-badge 更新有bug ，要先该包含的文字才有效
				this.orderFoodList.splice(0,this.orderFoodList.length);
				//this.orderFoodCount = 0;
				for(let foodtype of this.foodtypeList){
					//console.log(foodtype.foodcountsum);
					foodtype.foodcountsum = 0;
					foodtype.label = foodtype.label+"a";
					if(foodtype.foodList){
						foodtype.foodList.forEach(food=>{
							food.count = 0;
						})
					}
				}
				for(let foodtype of this.foodtypeList){
					foodtype.label =foodtype.label.substring(0,foodtype.label.length-1);
				}
				this.currentFoodType.foodList.forEach(item=>{
					item.count = 0;
				});
				//console.log(this.currentFoodType.foodList);
				this.cartFoodListShow = false;
			},
			//打开购物清单
			openCartInfo(){

				this.cartFoodListShow = !this.cartFoodListShow;
				
			},
			
			//菜类被点击
			foodtypeclick(index,foodtpe){
				if(this.currentfoodtypeid === foodtpe.id){
					return;
				}
				this.currentfoodtypeid = foodtpe.id;
				this.findFoodByType(foodtpe);
			},
			
			async ok(){
				if(this.orderFoodList.length === 0){
					uni.showToast({
					    title: '你还没有点菜',
						icon:"none",
					    duration: 1000
					});
					return;
				}
				//保存点好的菜到数据库中
				let canzhuonum = this.canzhuonum;
				//根据餐桌号餐桌此桌是否正在用餐
				let canzhuo = await canZhuoApi.findCanChuoingBynum(canzhuonum);
				let date = await this.$SysApi.getSystemDateTime();
				let userid = this.userid;
				let indatabase = false;
				
				if(canzhuo){
					 indatabase = true;
					 canzhuo.canzhuo_foodArray =[];
					 
				}else{
					canzhuo ={
						id:this.$Tool.uuid(),
						canzhuonum : canzhuonum,
						date,
						canzhuo_foodArray:[],
						userid,
						peopletotal:this.peopletotal,
					};
				}
				canzhuo.ischeckout = 0;
				canzhuo.isfinish = 0;
				let canzhuoid = canzhuo.id;
				for (let orderfood of this.orderFoodList) {
					let canzhuo_food = {
						id:this.$Tool.uuid(),
						canzhuoid,
						foodid:orderfood.id,
						count:orderfood.count,
						isfinish:0,
						userid,
						date,
					}
					canzhuo.canzhuo_foodArray.push(canzhuo_food)
				}
				let total = 0;
				if(indatabase){
					total =await canZhuoApi.addCanZhuo_Food(canzhuo.canzhuo_foodArray);
				}else{
					total =await canZhuoApi.addCanZhuo(canzhuo);
				}
				//console.log(this.orderFoodList);
				//console.log(canzhuo);
				if(total > 0){
					uni.showToast({
						title: '点菜成功',
						duration: 1000
					});
				
					//this.cartFoodListShow = false;
					//计算最后结算金额
					await canZhuoApi.computedFinalChargeById(canzhuo.id);
					//清楚菜数量
					this.clearOrderCart();
					
					//this.init();
					
					//this.computedFoodTypeCountAll();
				
					//console.log(this.foodtypeList);
				}
				
			},
			//购物车引起变化
			Orderfoodcountchange(orderFood){
				//console.log(orderFood);
				let foodList =  this.currentFoodType.foodList;
			/* 	for (var i = 0; i <foodList.length; i++) {
					if(foodList[i].id === orderFood.id){
						  foodList.splice(i,1,orderFood);
						  console.log(1111)
					}
				} */
				
				this.foodtypeList.forEach(foodtype=>{
					if(foodtype.foodList){
						foodtype.foodList.forEach(food=>{
							 if(orderFood.id == food.id){
								 food.count = orderFood.count;
								 //console.log(food.count)
							 }
						 })
					}
					
				})
				
				 this.orderFoodList.forEach(food=>{
				 	 if(orderFood.id == food.id){
				 		 food.count = orderFood.count;
				 		 //console.log(food.count)
				 	 }
				  })
				//console.log(this.currentFoodType);
				//console.log(this.orderFoodList);
				this.clearOrderFood0();
				this.computedFoodTypeCountAll();
			},
			//菜单引起变化
			foodcountchange(food){
				
				let orderFoodList = this.orderFoodList;
				//console.log(1,food);
				//设置菜的数量
				let have = false;
				for (var i = 0; i < orderFoodList.length; i++) {
					if(orderFoodList[i].id === food.id){
						  orderFoodList[i].count =  food.count;
						  have = true;
					}
				}
				this.currentFoodType.foodList.forEach(item=>{
					if(item.id === food.id){
						 item.count =  food.count;
					}
				})
				if(!have){
					orderFoodList.push(this.$Tool.copy(food));
				}
				this.clearOrderFood0();
				this.computedFoodTypeCountAll();
				//console.log(2,orderFoodList);
				//console.log(3,this.currentFoodType.foodList);
				
			},
			//计算当前类型总共点了多少餐
			computedFoodTypeCount(food){
				for(let type of this.foodtypeList){
					if(type.id === food.foodtypeid){
						let foodcountsum = 0;
						for(let food of type.foodList){
							if(food.count){
								foodcountsum = food.count *1 + foodcountsum*1;
							}
						}
						type.foodcountsum = foodcountsum.toFixed(1)*1;
						
					}
				}

			},
			//计算当前类型总共点了多少餐
			computedFoodTypeCountAll(){
				for(let type of this.foodtypeList){
					let foodcountsum = 0;
					if(type.foodList){
						for(let food of type.foodList){
							if(food.count){
								foodcountsum = food.count *1 + foodcountsum*1;
							}
						}
					}
					type.foodcountsum = foodcountsum.toFixed(1)*1;
					
				}
			},
			//清除不要的菜
			clearOrderFood0(){
				let orderFoodList = this.orderFoodList;
				for (var i = 0; i < orderFoodList.length; i++) {
					if(orderFoodList[i].count <= 0){
						orderFoodList.splice(i,1);
						
					}
				}
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.countset{
		width: 200rpx;
	}
	.cart{
		height: 100%;
		background-color: #FFFFFF;
	}
	.xiala{
		font-size: 50rpx;
		color: #DD514C;
	}
	.cuIcon-delete{
		font-size: 50rpx;
		color: #F43F3B;
	}
	.foodlist{
		height:calc(100% - 40rpx);
	}
	.shopMallcontent{
		width: 100%;
		height: calc(100% - 50px);
		
		.dialogback{
			position: absolute;
			bottom: 0px;
			height: 15000rpx;
			width: 100%;
			background-color: rgba($color: #7F7F7F, $alpha: 0.5);
		}
		
		.cart-food-list {
			height: calc(100%);
			background:#FFFFFF;
			.foodlist{
				
				.food{
					padding: 20rpx;
					width: 100%;
					display: flex;
					image {
						width: 200rpx;
						height: 200rpx;
						border-radius: 4px;
						margin-right: 10rpx;
					}
					.content{
						width: 400rpx;
						display: flex;
						
						flex-direction: column;
						.top{
							
							text{
								font-size: 32rpx;
								font-weight: 600;
							}
						}
						
						.bottom {
							display:flex;
							justify-content: space-between;
							margin-top: 20rpx;
							
							.price{
								font-weight: 600;
								color: #DE2A34;
								
							}
							img {
								width: 45rpx;
								height: 45rpx;
							
							}
						}
					}
				}
			}
			.top{
				
				padding: 10rpx 20rpx;
				display: flex;
				justify-content: space-between;
			}
		}
		.fix-cart{
			position: absolute;
			bottom: 0;
			display: flex;
			color:#FFFFFF;
			width: 100%;
			height: 50px;
			background: rgba(0,0,0,.9);
			
		}
		.cart-part{
			width: 50px;
			height: 50px;
			line-height: 50px!important;
			flex: 3;
			text-align: center;
		}
		.cart-part view{
			position: relative;
			top:-10px;
			width: 50px;
			height: 50px;
			display: block;
			background: #353535;
			margin:0 auto;
			border-radius: 50%;
			line-height: 50px;
				z-index: 999;
		}
		.cart-part text{
			position: relative;
			top:-67px;
			font-weight: 400;
			font-size: 20px;
			z-index: 2;
			color: #ffffff;
		}
		.cart-part img{
			width: 32px;
			height: 32px;
			vertical-align: middle;
		}
		.cart-btn{
			flex: 3;
			background: #2C2C2C;
			text-align: center;
			font-size: 20px;
			line-height: 50px!important;
		}
		.cart-price{
			flex: 4;
			font-size: 25px;
			line-height: 50px!important;
		}
		.cart-count{
			flex: 2;
			font-size: 16px;
			line-height: 50px!important;
		}
		.red{
			background: #DE2A35;
		}
		.yellow{
			color: #F0AD4E;
			background-color: #808080
		}
	}
	.shopMall{
		display: flex;
		width: 100%;
		height: 100%;
		scroll-view{
			width: 200rpx;
			height: 100%;
			.foodtype{
				text-align: center;
				line-height: 120rpx;
				text{
					font-size: 28rpx;
				}
			}
			.foodtypeactive {
				background-color: #FFFFFF;
			}
		}
		.left{
			width: 200rpx;
		}
		.right{
			
			scroll-view{
				width: 100%;
			}
			width: 750rpx;
			
			.food{
				background:#FFFFFF;
				border-radius: 8rpx;
				margin-bottom: 20rpx;
				width: 100%;
				display: flex;
				image {
					width: 200rpx;
					height: 200rpx;
					border-radius: 4px;
					margin-right: 10rpx;
				}
				.content{
					
					width: 300rpx;
					display: flex;
					
					flex-direction: column;
					.top{
						margin-top: 10rpx;
						text{
							font-size: 32rpx;
							font-weight: 600;
						}
					}
					.bottom {
						margin-top: 20rpx;
						.price{
							width: 200rpx;
							font-weight: 600;
							color: #DE2A34;
						}
						display:flex;
						justify-content: space-between;
						img {
							width: 45rpx;
							height: 45rpx;
						
						}
					}
				}
			}
		}
	
	}
</style>
