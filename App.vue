<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			uni.vue = this;
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	page, uni-page-body {
		height: 100%;
		background-color: #F1F1F1;
	}
	
	.box {
		padding: 10px;
		width: calc(94%);
		border-radius: 15upx;
		margin: 20px auto;
		box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
	
	}
</style>
