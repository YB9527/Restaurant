<template>
	<view class="checkOut">
		<view class="xiandiancan" v-if="orderFoodList.length===0">
			<text>...</text>
			<!-- <image mode="aspectFit" :src="$Api.imgpriewurl+'/用餐愉快.jpg'"></image> -->
		</view>
	<!-- 	<view class="title"><text>8号桌</text></view> -->
		<scroll-view v-else scroll-y="true" class="scroll ">
			<view class="chcontent ">
				<view class="foodlist box" v-for="(canzhuo,index) in orderFoodList" :key="index">
					<view class="canzhuodate">
						<text class="diancannum">NO.{{index+1}}点餐</text>
						<text class="date">{{canzhuo.date}}</text>
					</view>
					<view class="food" v-for="(canzhuo_food_linke) in canzhuo.canzhuo_food_linke" :key="canzhuo_food_linke.id">
						<view class="left">
							<image :src="canzhuo_food_linke.food.imageurl" mode="aspectFill"></image>
							<view class="lefttext">
								<text class="foodtname">{{canzhuo_food_linke.food.label}}</text>
								<text> x {{canzhuo_food_linke.count}}</text>
								<text class="date">  {{canzhuo_food_linke.date}}</text>
							</view>
						</view>
						<view class="right">
							<text class="price">￥ {{canzhuo_food_linke.food.price * canzhuo_food_linke.count}}</text>
						</view>
					</view>
				</view>
			
			</view>
		</scroll-view>
		<view class="submit" v-if="orderFoodList.length > 0">
			<view>
				<text v-if="pricetotal !== orderFoodList[0].finalcharge">消费金额:￥</text><text v-if="pricetotal !== orderFoodList[0].finalcharge" style="margin-right: 20rpx; color: #FFFFFF;text-decoration:line-through;"> {{pricetotal}} </text> 
				<text>结算:</text>
			</view>
			<view>
				<text>￥</text>
				<text class="monye"> {{orderFoodList[0].finalcharge}}</text> 
			</view>
			<view  class ="btn"><button type="primary" @click="settlement(orderFoodList)"> 支付</button> </view>
		</view>
	</view>
</template>

<script>
	import canZhuoApi from '@/api/canZhuoApi.js'
	export default {
		data() {
			return {
				userid:'17380646105',
				orderFoodList:[],//餐桌几点点餐
				canzhuonum:"",
				reflush:false,//tab切换时，页面是否要刷新
				pricetotal:0,
			}
		},
		onLoad(option) {
			let canzhuonum = option.canzhuonum;
			canzhuonum=4;
			if(canzhuonum){
				this.canzhuonum = canzhuonum;
				uni.setNavigationBarTitle({
				    title: '王氏羊肉（'+canzhuonum+"号桌）"
				});
			}
			this.init();
		},
		onShow() {
			if(this.reflush){
				this.reflush = false;
				this.init();
			}
			
		},
		onHide() {
			this.reflush = true;
		},
		onPullDownRefresh() {
			this.init();
			uni.stopPullDownRefresh();
		},
		filters: {
			
		},
		methods: {
			//查出用户所有没有结账的订单
			init(){
				canZhuoApi.findOrderFoodByCanZhuoNum(this.canzhuonum).then(orderFoodList=>{
					console.log(orderFoodList);
					for (let order of orderFoodList) {
						
						for (let canzhuo_food_linke of order.canzhuo_food_linke) {
							canzhuo_food_linke.food.imageurl = this.$Api.imgpriewurl +'\\'+canzhuo_food_linke.food.imageurl;
						}
					
					}
					this.pricetotal = this.computedAmount(orderFoodList);
					
					
					this.orderFoodList = orderFoodList;
				});
			},
			computedAmount(orderFoodList){
				if(!orderFoodList){
					return 0;
				}
				let amount = 0; 
				for (let orderFood of orderFoodList) {
					for(let canzhuo_food_linke of orderFood.canzhuo_food_linke){
						let food = canzhuo_food_linke.food;
						amount += food.price * canzhuo_food_linke.count;
					}
					
				}
				return amount;
			},
			//结算账单
			 settlement(orderFoodList){
				uni.showLoading({
					title: '支付中...',
					mask: false
				});
				//支付成功
				setTimeout( ()=>{
				    uni.hideLoading();
					//修改餐桌状态为支付
					 this.$SysApi.getSystemDateTime().then(date=>{
						for (let canzhuo of orderFoodList) {
							canzhuo.ischeckout = 1;
							canzhuo.checkdate= date;
							canzhuo.checkuserid= this.userid;
						}
						this.orderFoodList = [];
						canZhuoApi.saveCanZhuo(orderFoodList);
						uni.showToast({
							title:"支付成功",
						})
					})
				}, 1000);
			}
		}
	}
</script>

<style lang="scss">
	.date{
		margin-top: 20rpx;
		color: #999999;
		font-size: $uni-font-size-sm;
	}
	.checkOut{
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		.xiandiancan{
			height: 100%;
			font-size: $uni-font-size-plus;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 750rpx;
			image{
				
			}
		}
		.scroll{
			width: 700rpx;
			height: calc(100% - 130rpx);
			padding: 0 20rpx 20rpx 20rpx;
			.canzhuodate{
				display: flex;
				align-items: center;
				justify-content: space-between;
				.diancannum{
					font-weight: 600;
					
				}
				.date{
					font-weight: 400;
					color: $uni-text-color-grey;
					font-size: $uni-font-size-sm;
				}
			}
			.box{
				background-color: #FFFFFF;
			}
		}
		.title{
			text-align: center;
			font-size: $uni-font-size-plus;
			font-weight: 600;
			height: 50rpx;
		}
		.foodlist{
			margin-bottom: 30rpx;
			.food{
				display: flex;
				justify-content: space-between;
				margin-bottom: 40rpx;
				image {
					width: 200rpx;
					height: 200rpx;
					border-radius: 4px;
					margin-right: 10rpx;
				}
				.left{
					display: flex;
					
					.lefttext{
						display: flex;
						flex-direction: column;
						.foodtname{
							font-weight: 550;
							font-size: $uni-font-size-lg;
						}
					}
				}
				.right{
					font-weight: 600;
					font-size: $uni-font-size-lg;
					.price{
						color: $uni-color-error;
					}
				}
			}
		}
		.submit{
			height: 150rpx;
			background-color: #999999;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.monye{
				font-size: $uni-font-size-plus;
				color: #DE2A34;
			}
			.btn{
				margin: 0 30rpx;
				width: 200rpx;
			}
		}
	}
</style>
