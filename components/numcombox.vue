<template>
	<view  :class="data[prop]?'self':'countsetendflex'" >
		<view class="menu-add"  v-if="selfdata && selfdata[prop]">
			<image v-show="selfdata[prop] !== min" mode="aspectFill" @click="setCount(data,-1)" src="/static/images/subtract.png">
		</view>
		
		<input v-if="unit == 0 &&  selfdata[prop]" class="input" v-model="data[prop]" type="number" />
		<text v-else-if="selfdata[prop]"> {{selfdata[prop]}}</text>
		<view class="menu-add">
			<image mode="aspectFill" @click="setCount(data,1)" src="/static/images/icon_add.png">
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			data:{},
			prop:"",
			step:{
				default:1
			},
			min:{
				default:0,
			},
			unit:{
				default:"1",//int
			}
		},
		data(){
			return{
				selfdata:"",
			}
			
		},
		created() {
			this.selfdata = this.data;
			//console.log(this.unit);
		},
		methods:{
			setCount(data,value){
				
				data[this.prop] = data[this.prop]*1 +value*1;
				if(data[this.prop] < this.min ){
					data[this.prop] = this.min;
				}
				this.$emit("change",data);
			}
		}
	}
</script>

<style lang="scss">
	.countsetendflex{
		width: 100%;
		display: flex;
		justify-content: flex-end;
	}
	.self{
		width: 100%;
		display: flex;
		justify-content:space-between
	}
	image{
		width: 40rpx;
		height: 40rpx;
	}
	.input {
		
		border-bottom: 1px solid #333333;
	}
</style>
