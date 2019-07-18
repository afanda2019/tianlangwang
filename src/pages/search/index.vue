<template>
  <div class="counter-warp">
    <van-search
      :value="value"
      placeholder="请输入搜索关键词"
      show-action
      @change="e=>value = e.mp.detail"
      @search="onSearch"
      @cancel="onCancel"
    />
  </div>
</template>

<script>

export default {
  data () {
    return {
      value:''
    }
  },
  onShow: function () {   
    
  },
  methods: {
   // 商品列表
    onSearch(){
      this.$go('shoplist',{searchkey:this.value})
    },
   onCancel(){
     console.log('取消')
   }
    
  },
  created () {

  }
}
</script>

<style scoped>
.counter-warp{
  background:#f8f8f8;
  height:100vh;
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
  height:1rem
  }
.listcont p{
  width:calc(100% - 1rem);
  padding-left:10px;
  color:#838383;
  }
.time{
  font-size:12px;
  color:#fff;
  background:#bababa;
  float:right;
  padding:4px 10px;
  margin-top:10px;
  border-radius:5px
  }
</style>
