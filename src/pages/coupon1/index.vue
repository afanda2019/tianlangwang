<template>
  <div class="counter-warp">
    <van-tabs :active="active">
      <van-tab title="领取优惠券">
        <div>
          <div class='list' v-for='(list,key) in coupon' :key='key'>
            <img class='bg' src='/static/images/yh1.jpg'>
            <div class='yhqnr'>
              <div>
                <p class='title'>{{list.coupon_name}}</p>
                <p  class='cont'>{{list.description}}</p>
              </div>
              <p class='price'>{{list.offset_price}}<span style='font-size:16px'>元</span></p>
            </div>
            <p>
              <img class='tib' src='/static/images/yh3.png'>
              <span class='tibtext'>有效期{{list.valid_time}}天</span>
              
              <span class='ljlq' @click='ljlq(list.id)'>立即领取<img style='width:0.4rem;height:0.5rem' src='/static/images/yh4.png'></span>
            </p>
          <!-- <span class='yxqtime'>领取日期<span>{{time[key]}}</span></span>-->
          </div>
          <p class='jiazaigengduotxt'>没有优惠券啦</p>
        </div>
        
      </van-tab>
      <van-tab title="红包口令">
        <img class='yhqbg' src='/static/images/yhqbg.jpg'>
        <van-field
          class='username'
          :value="username"
          @change="e=>username = e.mp.detail"
          input-align='center'
          clearable
          placeholder="请输入口令"
        />
        <div class='button' @click='lqyhq()'>一键领取优惠券</div>
      </van-tab>
    </van-tabs>
   
  </div>
</template>
<script>
export default {
  data () {
    return {
      active:0,
      coupon:[],
      time:[],
      username:''
    }
  },
  onShow: function () {  
      this.coupon=[];
      this.shaoplist();
  },
  methods: {
    // 商品列表
    shaoplist(){
      this.$wxAjax('coupon', {
        userToken: this.$getStorage('token')
      }).then((data) => {
        if (data.status == 0) {
          this.coupon = data.data;       
        } else {
          this.$toast(data.message);
        }
      })
    },
    ljlq(id){
      this.$wxAjax('receiveCoupon', {
        userToken: this.$getStorage('token'),
        coupon_id:id
      }).then((data) => {
        let _this = this
        if (data.status == 0) {
         
          wx.showModal({
            title: '温馨提示',
            content: '领取成功',
            showCancel:false,
            confirmText:'领取成功',
            success (res) {
              if (res.confirm) {
                _this.coupon=[];
                _this.shaoplist();
              } else if (res.cancel) {
                _this.coupon=[];
                _this.shaoplist();
              }
            }
          })
        } else {
          this.$toast(data.message);
        }
      })
    },
    lqyhq(){
      if(this.username){
        this.$wxAjax('gift', {
        userToken:this.$getStorage('token'),
        exchange:this.username
        }).then((data) => {
          console.log(data)
          if (data.status == 0) {
            let _this = this
            wx.showModal({
              title: '温馨提示',
              content: '领取成功',
              showCancel:false,
              confirmText:'去查看',
              success (res) {
                if (res.confirm) {
                  _this.$go('coupon',{type:1})
                }
              }
            })
          } else {
            this.$toast(data.message);
          }
        })

      }else{
        this.$toast('请输入口令');
      }
      
    }
  },

}
</script>

<style scoped>
.counter-warp{
  min-height:100vh;
  background:#f7f8fa
}
.yxqtime{font-size:13px;}
.list{
  margin-top:10px;
  position:relative;
  }
.bg{
  margin:0 5%;
  width:90%;
  height:2.4rem
}
.yhqnr{
  position:absolute;
  display:flex;
  top:0.2rem;
  left:8%
}
.username{
  position:fixed;
  bottom:4.5rem;
  left:0;
  right:0;
  margin:0 auto;
  width:70%
}
.button{
  width:70%;
  background:#fae220;
  color:red;
  position:fixed;
  bottom:3rem;
  left:0;
  right:0;
  margin:0 auto;
  text-align:center;
  font-size:18px;
  font-weight:600;
  padding:10px 0;
}
.yhqnr .title{
  font-size:22px;
  font-weight:600;
  width: 5rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.yhqnr .cont{
  color:#999999;
  font-size:14px;
  width: 5rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.yhqnr .price{
  color:#fb2651;
  font-size:26px;
  font-weight:600;
}
.tib{
  width:2.2rem;
  height:0.4rem;
  position: absolute;
  bottom:15px;
  left:40px;
}
.tibtext{
  color:#fff;
  position:absolute;
  bottom:18px;
  left:110rpx;
  font-size:12px
  }
.ljlq{
  font-size:12px;
  color:#748ac2;
  position: absolute;
  bottom:18px;
  right:110rpx;
}
.yhqbg{
  width:100%;
  height:calc(100vh - 40px);
  display:flex
}
.jiazaigengduotxt{
  font-size:14px;
  text-align:center;
  line-height:40px
}
</style>
