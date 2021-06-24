<template>
	<view v-if="show" class="orderrecords">
		<!-- 订单记录 -->
		<view class="list">
			<view class="item box" 
			v-for="item in orders" :key="item.id"
			@click="gotoDetails(item)">
			<view class="row">
				<view>
					<text class="label">消费日期：</text><text>{{item.date.substring(0,10)}}</text> 
				</view>
			</view>
				<view class="row">
					<view>
						<text class="label">桌号：</text><text>{{item.canzhuonum}}</text> 
					</view>
					<view>
						<text class="label">消费金额：</text><text class="price">￥{{item.finalcharge}}</text>
					</view>
				</view>
				
				
			</view>
		</view>
	</view>
</template>

<script>
	import canZhuoApi from	'@/api/canZhuoApi.js'
	export default {
		data() {
			return {
				show:false,
				orders:[],//消费订单
				checkuserid:"17380646105",
			}
		},
		onLoad(option) {
			this.init(this.checkuserid);
		},
		methods: {
			async init(checkuserid){
				this.show = false;
				//查询出结账时的手机号码
				let orders =await canZhuoApi.findByCheckuserid(this.checkuserid);
				this.orders = orders;
				console.log(orders);
				this.show = true;
			},
			gotoDetails(order){
				let url = "/pages/my/orderRecords/orderRecordsDetails?id="+order.id;
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="scss">
	.orderrecords{
		padding: 20rpx;
		font-size: $uni-font-size-lg;
		.box{
			background-color: #FFFFFF;
		}
		.item{
			.row{
				display: flex;
				justify-content: space-between;
				margin-bottom: 20rpx;
			}
			.label{
				color: #999999;
			}
			.price{
				color: #DD524D;
			}
		}
	}
	
	
</style>
