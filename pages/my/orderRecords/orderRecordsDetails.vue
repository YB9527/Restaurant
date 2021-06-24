<template>
	<view class="details">
		<!-- 订单详情 -->
		<order :id="id" v-if="id"></order>
	</view>
</template>

<script>
	import order from '@/components/order'
	export default{
		components:{order},
		data(){
			return{
				id:"",
			}
		},
		onLoad(option) {
			this.id = option.id;
		},
		methods:{
			
		}
	}
</script>

<style lang="scss">
	.details{
		
	}
</style>
