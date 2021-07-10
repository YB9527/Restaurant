<template>
	<view  :class="selfdata[prop]?'self':'countsetendflex'" >
		<view class="menu-add"  v-if="selfdata && selfdata[prop]">
			<image v-show="selfdata[prop] !== min" mode="aspectFill" @click="setCount(selfdata,-1)" src="/static/images/subtract.png">
		</view>
		
		<input v-if="unit == 0 &&  selfdata[prop]" @input="change" type="digit" class="input" v-model="selfdata[prop]"  />
		
		<text v-else-if="selfdata[prop]"> {{selfdata[prop]}}</text>
		<view class="menu-add">
			<image mode="aspectFill" @click="setCount(selfdata,1)" src="/static/images/icon_add.png">
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
			//console.log(111);
			//console.log(this.unit);
			//this.test();
		},
		methods:{
			setCount(data,value){
				
				data[this.prop] = data[this.prop]*1 +value*1;
				if(data[this.prop] < this.min ){
					data[this.prop] = this.min;
				}
				data[this.prop] =data[this.prop].toFixed(1)*1;
				this.data[this.prop] =data[this.prop];
				this.$emit("change",data);
				
				//console.log(11,this.data);
				//console.log(12,this.selfdata);
			},
			change(val){
				//console.log(val);
				let data = this.selfdata;
				 val = data[this.prop]*1;
				data[this.prop] =val.toFixed(1)*1;
				//data[this.prop] = val*1;
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
		padding-left: 20rpx;
		border-bottom: 1px solid #333333;
	}
</style>
