<template>
	<view class="shopMallcontent">
		<view class="shopMall">
			<view class="left">
				 <scroll-view scroll-y="true">
					 <view
					 v-for="(foodtype,index) in foodtypeList"
					 :key="foodtype.id"
					 :class="'foodtype ' + (foodtype.id === currentfoodtypeid?'foodtypeactive':'')" 
					 @click="foodtypeclick(index,foodtype)"
					 >
					 	<text>{{foodtype.label}}</text>
					 </view>
				 </scroll-view>
			</view>
			<view class="right">
				<scroll-view scroll-y="true">
					<view 
					v-for="(food,index) in foodList"
					:key="food.id"
					class="food">
					
						<image :src="food.url" mode="aspectFill"></image>
						<view class="content">
							<view class="top">
								<text class="label">{{food.label}}</text>
							</view>
							<view class="bottom">
								<text class="price">￥{{food.price}}/{{food.unit | foodUnitFilter}}</text>
								<view class="menu-add" v-show="haseCount(food,orderFoodList)" >
									<img mode="scaleToFill" @click="setFoodCount(index,-1,food)" src="/static/images/subtract.png">
								</view>
								{{food | foodCount(orderFoodList)}}
								<view class="menu-add">
									<img mode="scaleToFill" @click="setFoodCount(index,1,food)" src="/static/images/icon_add.png">
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view> 
			
		</view>
		<uni-transition  :duration="500" :mode-class="['fade', 'slide-bottom']"  :show="cartFoodListShow">
			
			<view class="dialogback" @click="cartFoodListShow = false">
				<!-- 购物清单背景遮幕 -->
			</view>
			<view class="cart-food-list" >
				<view class="top">
					<text>已选商品</text> 
					<view><text @click="cartFoodListShow = false">下拉</text></view>
					<view><text @click="clearOrderCart">清空</text></view>
				</view>
				<view class="foodlist">
					<scroll-view  scroll-y="true">
						<view 
						v-for="(orderFood,index) in orderFoodList"
						:key="index"
						class="food">
							<image :src="orderFood.food.url" mode="aspectFill"></image>
							<view class="content">
								<view class="top">
									<text class="label">{{orderFood.food.label}}</text>
								</view>
								<view class="bottom">
									<text class="price">￥{{orderFood.food.price * orderFood.count}}</text>
									
									<view class="menu-add"  >
										<img mode="scaleToFill" @click="setFoodCount(index,-1,orderFood.food)" src="/static/images/subtract.png">
									</view>
									{{orderFood.count }}
									<view class="menu-add">
										<img mode="scaleToFill" @click="setFoodCount(index,1,orderFood.food)" src="/static/images/icon_add.png">
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</uni-transition>
		<view class="fix-cart">
			<view class="cart-part" @click="openCartInfo">
				<view><img src="/static/images/icon_cart.png"></view>
			</view>
			<view class="cart-count"  @click="openCartInfo" ><text v-show="orderFoodCount !== 0"> {{orderFoodCount}}份</text> </view>
			<view class="cart-price">￥<span>{{orderFoodList | computedAmount}}</span></view>
			<view class="cart-btn red" @click="ok">确定</view>
		</view>
	</view>
</template>

<script>
	import foodTypeApi from '@/api/foodTypeApi.js'
	import foodApi from '@/api//foodApi.js'
	import canZhuoApi from '@/api/canZhuoApi.js'
	export default {
		data() {
			return {
				userid:'17380646105',
				peopletotal:5,
				canzhuonum:-1,
				cartFoodListShow:false,
				currentfoodtypeid:"",
				orderFoodCount:0,
				orderFoodList:[],//点的{菜品food、数量count}
				foodtypeList:[],
				foodList:[],
			}
		},
		filters: {
			computedAmount(orderFoodList){
				if(!orderFoodList){
					return 0;
				}
				let amount = 0; 
				for (let orderFood of orderFoodList) {
					amount += orderFood.food.price * orderFood.count;
				}
				
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
			canzhuonum=8;
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
				this.findAllFoodType()
					.then((foodtypeList)=>{
						this.foodtypeList = foodtypeList;
						if(foodtypeList.length > 0 &&!this.currentfoodtypeid ){
							this.currentfoodtypeid = foodtypeList[0].id;
						}
						this.findFoodByTypeId(this.currentfoodtypeid);
					});
			
			},
			findAllFoodType(){
				return foodTypeApi.findAll();
			},
			//根据食物类型获取所有食物
			findFoodByTypeId(typeid){
				foodApi.findFoodByTypeId(typeid)
					.then(foods=>{
						//console.log(foods);
						for (let food of foods) {
							food.url = this.$Api.imgpriewurl+food.imageurl;
							//console.log(food.url);
						}
						if(this.foodList && this.foodList.length > 0){
							this.foodList.splice(0,this.foodList.length);
						}
						this.foodList.push(...foods);
					});
			},
			//清空购物车
			clearOrderCart(){
				let orderFoodList = this.orderFoodList;
				if(orderFoodList.length > 0){
					orderFoodList.splice(0,orderFoodList.length);
				}
				this.cartFoodListShow = false;
			},
			//打开购物清单
			openCartInfo(){
				this.cartFoodListShow = !this.cartFoodListShow;
				
			},
			//此食物有数量吗？
			haseCount(food, orderFoodList){
				for (let orderFood of orderFoodList) {
					if(orderFood.food.id === food.id){
						return true;
					}
				}
				return false;
			},
			//菜类被点击
			foodtypeclick(index,foodtpe){
				if(this.currentfoodtypeid === foodtpe.id){
					return;
				}
				this.currentfoodtypeid = foodtpe.id;
				this.findFoodByTypeId(foodtpe.id);
			},
			//根据食物类型获取所有食物
			/* findFoodByTypeId2(typeid){
				if(typeid === 1){
					this.foodList  = [
						{id:2,label:"羊肉汤",unit:"斤",describe:"",price:100,img:"https://qcloud.dpfile.com/pc/9CTG3egYVhA4qDEGPZysOWm-CMHWxdqKtHOfGwwz2KJ3SQvBEuZcM3cJ5XDTpMvP5g_3Oo7Z9EXqcoVvW9arsw.jpg"},
						{id:1,label:"牛肉",unit:"份",describe:"",price:38,img:"https://qcloud.dpfile.com/pc/EgOYGoX6cUY42YoeOsr3gBzxSl7EJ-GEy_OaLloqJuVzMT5nCQRqO7l_onbFDiHq5g_3Oo7Z9EXqcoVvW9arsw.jpg"},
						{id:3,label:"鸭肠",unit:"份",describe:"",price:22,img:"https://qcloud.dpfile.com/pc/3HHHfRFJIXkCc2NNVj3yENqeSoFGZUw_rfmojNWPSe6umY1XpOkGMGNh02O5O4g-5g_3Oo7Z9EXqcoVvW9arsw.jpg"},
						{id:4,label:"鹅肠",unit:"份",describe:"",price:22,img:"https://p1.meituan.net/poirichness/menu_808644_446406954.jpg@130w_130h_1e_1c"},
						{id:5,label:"金针菇",unit:"份",describe:"",price:10,img:"https://p1.meituan.net/shaitu/99dd843cacf39925b39f8a60058a9c9a1497525.jpg"},
						{id:6,label:"糍粑",unit:"份",describe:"",price:12,img:"https://p1.meituan.net/shaitu/7b9e90a902edef95123d8124c4fe513f2103547.jpg"},
						{id:7,label:"糍粑",unit:"份",describe:"",price:12,img:"https://p1.meituan.net/shaitu/7b9e90a902edef95123d8124c4fe513f2103547.jpg"},
						{id:8,label:"糍",unit:"份",describe:"",price:12,img:"https://p1.meituan.net/shaitu/7b9e90a902edef95123d8124c4fe513f2103547.jpg"},
					];
				}else{
					this.foodList = [];
				}
			}, */
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
				let date = await this.$SysApi.getSystemDateTime();
				let canzhuoid = this.$Tool.uuid();
				let canzhuo ={
					id:canzhuoid,
					canzhuonum : canzhuonum,
					date,
					canzhuo_foodArray:[],
					userid:this.userid,
					peopletotal:this.peopletotal,
				}
				for (let orderfood of this.orderFoodList) {
					let canzhuo_food = {id:this.$Tool.uuid(),canzhuoid,foodid:orderfood.food.id,count:orderfood.count,isfinish:0}
					
					canzhuo.canzhuo_foodArray.push(canzhuo_food)
				}
				let total =await canZhuoApi.addCanZhuo(canzhuo);
				console.log(this.orderFoodList);
				console.log(canzhuo);
				if(total > 0){
					uni.showToast({
						title: '点菜成功',
						duration: 1000
					});
					this.orderFoodList.splice(0,this.orderFoodList.length);
					this.orderFoodCount = 0;
					this.cartFoodListShow = false;
				}
				
			},
			//点菜
			setFoodCount(index,foodcount,food){
				let orderFoodList = this.orderFoodList;
				//设置菜的数量
				let have = false;
				for (var i = 0; i < orderFoodList.length; i++) {
					if(orderFoodList[i].food.id === food.id){
						  orderFoodList[i].count +=  foodcount;
						  have = true;
					}
				}
				if(!have){
					orderFoodList.push({food,count:1});
				}
				this.orderFoodCount = 0;
				//清除不要的菜
				for (var i = 0; i < orderFoodList.length; i++) {
					if(orderFoodList[i].count <= 0){
						orderFoodList.splice(i,1);

					}else{
						this.orderFoodCount += orderFoodList[i].count;
					}
					
				}
			}
			
		}
	}
</script>

<style lang="scss">
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
			position: absolute;
			width: 100%;
			bottom: 0px;
			background:#FFFFFF;
			.foodlist{
				min-height: 300rpx;
				
				/deep/ .uni-scroll-view{
					max-height: 80%;
				}
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
								margin-right: 150rpx;
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
				z-index: 2;
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
		.right{
			
			scroll-view{
				width: 100%;
			}
			width: 550rpx;
			background-color: #FFFFFF;
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
