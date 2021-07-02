<template>
	<view class="index">
		<view class="item"><button type="primary" @click="gotoOrderRecords">历史订单</button> </view>
		<view class="item"><button type="primary" @click="gotoAddress">外卖地址</button> </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			gotoOrderRecords(){
				let url = "/pages/my/orderRecords/orderRecords";
				uni.navigateTo({
					url
				})
			},
			//到外卖地址
			gotoAddress(){
				let url = "/pages/my/orderRecords/orderRecords";
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="scss">
	.index{
		padding: 20rpx 20rpx;
		.item{
			margin-bottom: 20rpx;
		}
	}
</style>
