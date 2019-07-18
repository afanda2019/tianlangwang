<template>
  <div class="counter-warp">
    <div style='height:0.4rem;background:#f0eff5'></div>
      
      <van-field
        :value="mobile"
        center
        clearable
        label="短信验证码"
        placeholder="请输入短信验证码"
        border="false"
        @change="e=>mobile = e.mp.detail"
        use-button-slot
      >
        <van-button slot="button" size="small">发送验证码</van-button>
      </van-field>
      <van-field
        v-model="code"
        label="填写验证码"
        placeholder="202020"
        border='false'
        @change="e=>code = e.mp.detail"
      />
    <button class='btn' @click='bangMobile'>更改手机号</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      mobile:'',
      code:''
    }
  },
  onShow: function () {   
     
  },
  methods: {
    bangMobile(){
      this.$wxAjax('bang_mobile', {
        userToken: this.$getStorage('token'),
        mobile:this.mobile,
        code:this.code
      }).then((data) => {
        if (data.status == 0) {

        } else {
          this.$toast(data.message);
        }
      })
    },
  },

}
</script>

<style scoped>
.counter-warp{
  background:#f0eff5;
  height:100vh;
}
.top{
  padding:10px 20px;
  color:#2c3e50;
  font-size:16px;
  background:#fff
  }
.price{
  font-size:32px;
  font-weight:600
  }
.allprice{
  line-height:30px;
  display:flex;
  justify-content: space-between;
}
.btn{
  width:90%;
  line-height:40px;
  height:40px;
  background:red;
  color:#fff;
  margin:20px 5% 0;
  border-radius:8px;
  font-size:14px;
  border:none
  }

.imglist{
   padding-bottom:10px 
}
.img{
  display:flex;
  flex-wrap:wrap 
}
.imglist img{
  width:80px;
  height:80px;
  margin:0.2rem 0.1rem 0;
  display:block
}
</style>
