<template>
	<view class="index">
		<view><button type="primary" @click="gotoOrderRecords">历史订单</button> </view>
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
			}
		}
	}
</script>

<style lang="scss">
	.index{
		padding: 20rpx 20rpx;
	}
</style>
