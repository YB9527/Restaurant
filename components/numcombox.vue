<template>
	<view  class="countset">
		<view class="menu-add"  >
			<!--   -->
			<image v-show="value" mode="aspectFill" @click="setCount(data,-1)" src="/static/images/subtract.png">
		</view>
		
		<input v-if="unit == 0" class="input" v-model="value" type="number" />
		<text v-else>{{value}} </text>
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
			},
			defaultvalue :{
				default :"",
			}
			
		},
		data(){
			return{
				value:"",
			}
		},
		created() {
			if(!this.data[this.prop] === undefined){
				this.data[this.prop] = 0;
			}
			this.value = this.data[this.prop];
		},
		methods:{
			setCount(data,value){
				if(!this.value){
					this.value = 0;
				}
				this.value = this.value*1 +value*1;
				if(this.value < this.min ){
					this.value = this.min;
				}
				if(this.value === this.min){
					this.value = this.defaultvalue;
				}
				this.data[this.prop] = this.value;
				this.$emit("change",data);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.countset{
		width: 100%;
		display: flex;
		justify-content: space-between;
		image{
			width: 40rpx;
			height: 40rpx;
		}
		.input {
			
			border-bottom: 1px solid #333333;
		}
	}
</style>
