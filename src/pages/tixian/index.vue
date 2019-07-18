<template>
  <div class="counter-warp">
    <div class='top'>
      <p>佣金提现</p>
      <p class='price'>{{price}}</p>
      <div class='allprice'>
        <span>可提现金额{{allprice}}</span>
        <span style='color:#f44' @click='allTurnOut'>全部提出</span>
      </div>
    </div>
    <div style='height:0.4rem;background:#f0eff5'></div>
    
    <p style='color:#a4a4a4;font-size:12px;padding:10px 15px'>注：1佣金等于1元</p>
    <button class='btn' @click='turnOut'>提现</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
     price:0,
     allprice:0

    }
  },
  onShow: function () {   
     this.allprice = 0;
     this.shaoplist();
  },
  methods: {
    shaoplist(){
      this.$wxAjax('users', {
        userToken: this.$getStorage('token'),
      }).then((data) => {
        if (data.status == 0) {
          this.price = data.data.userInfo.balance
        } else {
          this.$toast(data.message);
        }
      })
    },
    allTurnOut(){
      this.allprice = this.price;
    },
    turnOut(){
      this.$wxAjax('cash', {
        userToken: this.$getStorage('token'),
        money:this.allprice
      }).then((data) => {
        console.log(data)
       
        if (data.status == 0) {
          let _this = this
          wx.showModal({
            title: '温馨提示',
            content: '提现成功',
            showCancel:false,
            success (res) {
              _this.$back();
            }
          })
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
.top{padding:10px 20px;color:#2c3e50;font-size:16px;background:#fff}
.price{font-size:32px;font-weight:600}
.allprice{
  line-height:30px;
  display:flex;
  justify-content: space-between;
}
.btn{width:90%;line-height:40px;height:40px;background:red;color:#fff;margin:20px 5% 0; border-radius:8px;font-size:14px;border:none}
</style>
