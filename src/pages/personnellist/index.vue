<template>
  <div class="counter-warp">
    <div class='list' v-for='(list,index) in userinfo' :key="index">
      <div class='left'>
        <img :src='list.headimgurl'>
        <span>{{list.nickname}}</span>
      </div>
      <span class='fontcolor'>{{list.rank_time}}</span>
    </div>
    
  </div>
</template>
<script>
export default {
  data () {
    return {
      message:'',
      phone:'',
      username:'',
      userinfo:[]
    }
  },
  onShow: function () {   
    this.getUserInfo()
  },
  methods: {
     getUserInfo() {
      this.$wxAjax('fenxiaos', {
        userToken: this.$getStorage('token')
      }).then((data) => {
        if (data.status == 0) {          
          this.userinfo = data.data;          
        } else {
          this.$toast(data.message);
        }
      })
    },
  },

  created () {
  }
}
</script>

<style scoped>

.counter-warp{
  background:#f8f8f8;
  height:100vh
  }
.header{
  height:1.8rem;
  position:relative;
  background:#fff
  }
.bg{
  width:100%;
  height:100%;
  position:absolute;
  left:0;
  right:0
  }
.header_left{
  position:absolute;
  left:20px;
  top:10px;
  font-size:16px;
  color:#333;
  display:flex
  }
.header_left img{
  width:1.2rem;
  height:1.2rem;
  
  } 
.username{
  margin:5px 10px 10px
}
.header_right{
  position:absolute;
  right:10px;
  top:35px;
  font-size:14px;
  padding:5px 10px;
  background:rgba(0,0,0,0.5);
  color:#fff;
  border-radius:12px
  }
.dengji{
  font-size:12px;
  border:1px solid #fd8800;
  padding:4px 10px;
  border-radius:10px;
  text-align:center;
  color:#fd8800;
  margin:8px 0 0 0;
}
.list{
  background:#fff;
  font-size:14px;
  padding:20px 15px 20px;
  height:20px;
  border-bottom:1px solid #f1f1f1
  }
.bianji{
  width:60px;
  float:left;
  height:20px;
  line-height:20px
  }
.list img{
  width:40px;
  height:40px;
  margin:-10px 10px 0 10px;
  float:left;
  border-radius:50%;
  border:2px solid #f1f1f1
  }
.bianjiinput{
  height:20px;
  line-height:20px;
  float:left;
  display:block;
  min-height:20px;
  width:calc(100% - 115px);
  text-align:right;
}
.list{
  display: flex;
  justify-content:space-between
}
.fontcolor{
  color:#d2d2d2
}
</style>
