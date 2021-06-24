<template>
	<!-- 餐桌订单 -->
	<view class="order" v-if="order">
		<view class="top">
			<text class="canzhuonum">{{order.canzhuonum}}号桌</text>
			<text class="date">{{order.date.substring(0,10)}}</text>
		</view>
		<view class="sprow">
			<view v-if="order.finalcharge < order.pricetotal">
				<text>原价：</text>
				<text class="price">￥ {{order.pricetotal}}</text>
			</view>
			<view>
				<text>实付金额：</text>
				<text class="price">￥ {{order.finalcharge}}</text>
			</view>
		</view>
		<view class="list ">
			<view class="item box"  v-for="item in order.canzhuofoodArray" :key="item.id">
				<view class="row">
					<image :src="item.baseimageurl" mode="aspectFill"></image>
					<view class="rightrow">
						<view class="sprow"><text>回锅肉</text><text >￥ {{item.price}}</text></view>
						<view><text>x 1</text></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import canZhuoApi from '@/api/canZhuoApi.js'
	export default{
		props:{
			id:"",
		},
		data(){
			return{
				order:undefined,
			}
		},
		created() {
			let id = this.id;
			this.init(id);
		},
		methods:{
			async init(id){
				//查询这个订单
				let order =await canZhuoApi.findById(id);
				console.log(order);
				this.order = order;
			}
		}
	}
</script>

<style lang="scss">
	.order {
		padding:  20rpx;
		.top{
			display: flex;
			justify-content: space-between;
			.canzhuonum{
				font-weight: 600;
				font-size: $uni-font-size-plus;
			}
			.date{
				color: #999999;
			}
		}
		.box{
			margin-top: 15rpx;
			background-color: #FFFFFF;
		}
		.sprow{
			display: flex;
			justify-content: space-between;
		}
		.price{
			font-weight: 600;
			color: #DD524D;
			font-size: $uni-font-size-plus;
		}
		.item{
			margin-top: 30rpx;
			image{
				width: 200rpx;
				height: 200rpx;
			}
			.row{
				display: flex;
			}
			.rightrow{
				width: 450rpx;
				margin-left: 30rpx;
			}
			.sprow{
				display: flex;
				justify-content: space-between;
			}
			.price{
				font-weight: 600;
			}
		}
	}
</style>
