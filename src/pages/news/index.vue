<template>
  <div class="counter-warp">
   <scroll-view
        scroll-y
        style="height:100vh"
        bindscrolltoupper="upper"
        bindscrolltolower="lower"
        bindscroll="scroll"
        scroll-top="100"
        @scrolltolower='scrollfun'
      > 
        <div class='list' v-for='(list,index) in shopList' :key="index" @click="$go('newinfo',{id:list.id})">
          <div style='height:15px'></div>
          <p class='read' v-if='list.is_flag==0'></p>
         	<div class='cont'>
            <p class='title'>{{list.title}}</p>
            <div class='listcont'>
              <img v-if='list.tags' :src='list.pic'>
              <p>{{list.ftitle}}</p>
            </div>
           </div>
            <p class='time'>{{list.create_time}}</p>            
            <div style='height:30px'></div>
          </div>
         <div style='height:20px;background:#f8f8f8;'></div>
        <van-loading class='jiazaigengduo'  v-if='!onoffMore'/>
        <p class='jiazaigengduotxt' v-if='onoffMore'>没有数据了</p>
      </scroll-view>
   
  </div>
</template>

<script>

export default {
  data () {
    return {
      page:1,
      shopList:[],
      pagesize: 10,
      onoff: false, //是否追加数据
      onoffMore: false,
    }
  },
  onShow: function () {   
      this.page=1;
      this.shopList=[];
      this.onoff= false; //是否追加数据
      this.onoffMore= false;
      this.shaoplist();
  },
  methods: {
   // 商品列表
    shaoplist(){
      this.$wxAjax('contents', {
        userToken:this.$getStorage('token'),
        column_id:1
      }).then((data) => {
        console.log(data.status)
        if (data.status == 0) {
          if (data.data.length <= 0) { //判断显示更多
              this.onoffMore = true;
              return false;
          }
          if (this.onoff) {
              this.shopList.push.apply(this.shopList, data.data);
          } else {
              this.shopList = data.data;
              if(this.shopList.length<this.pagesize){
                this.onoffMore = true;
                return false;
              }
          }
                   
        } else {
          console.log(data)   
          // this.$toast(data.message);
        }
      })
    }
   
    
  },

  created () {

  }
}
</script>

<style scoped>
.counter-warp{
  background:#f8f8f8;
}
.list{
  width:90%;
  margin:0 5% 0;
  }
.cont{
  background:#fff;
  padding:0 10px 10px;
  font-size:14px;
  border-radius:5px
  }
.listcont{
  display:flex;
  }
.title{
  line-height:30px;
  }
.listcont img{
  width:1rem;
  height:1rem;
  padding-right:10px;
  }
.listcont p{
  width:calc(100% - 1rem);
  color:#838383;
  }
.time{
  font-size:10px;
  color:#fff;
  background:#bababa;
  float:right;
  padding:4px 10px;
  margin-top:10px;
  border-radius:5px
  }
.read{
  width:8px;
  height:8px;
  background:red;
  border-radius:50%;
  float:right
  }
.jiazaigengduo{
  margin:0 45%;
  width:10%;

}
.jiazaigengduotxt{
  font-size:14px;
  text-align:center;
  line-height:40px
}
</style>
