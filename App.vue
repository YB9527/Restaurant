<script>
	export default {
		onLaunch: function() {
			uni.vue = this;
		},
		onShow: function() {
		},
		onHide: function() {
		}
	}
</script>

<style lang="scss">
	// 导入colorUI
	@import '/static/css/colorui/main.css';
	@import '/static/css/colorui/icon.css';
	@import '/static/css/colorui/animation.css';
	// 导入阿里巴巴矢量图标库
	/*#ifdef MP*/
	@import './static/css/iconfont/iconfont.css';
	/*#endif*/
	/*#ifndef MP*/
	@import url('https://at.alicdn.com/t/font_1823374_98c45zxwb3c.css');
	/*#endif*/
	@import './static/css/reset.scss';
	@import './static/css/uni.scss';
	
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
	.row{
		display: flex;
	}
	.sprow{
		display: flex;
		justify-content: space-between;
	}
</style>
