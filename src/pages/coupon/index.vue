<template>
  <div class="counter-warp">
    <van-tabs v-model="active" @change="onClick">
      <van-tab title="可使用">
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
            <!--<span class='tibtext'>到期至{{time[key]}}</span>-->
            <span class='tibtext'>至{{list.pend}}</span>
            <span class='ljlq' style='font-weight:600;'>可使用</span>
          </p>
        </div>
       
      </van-tab>
      <van-tab title="已使用">
        <div class='list' v-for='(list,key) in coupon' :key='key'>
          <img class='bg' src='/static/images/yh1.jpg'>
          <div class='yhqnr'>
            <div>
              <p class='title'>{{list.coupon_name}}</p>
              <p  class='cont'>{{list.description}}</p>
            </div>
            <p class='price' style='color:#999999'>{{list.offset_price}}<span style='font-size:16px'>元</span></p>
          </div>
          <p>
            <img class='tib' src='/static/images/yh3end.jpg'>
            <span class='tibtext'>到期至{{list.pend}}</span>
            <span class='ljlq' style='color:#999;font-weight:600;'>已使用</span>              
          </p>
        </div>
        
      </van-tab>
      <van-tab title="已过期">
        <div class='list' v-for='(list,key) in coupon' :key='key'>
          <img class='bg' src='/static/images/yh1.jpg'>
          <div class='yhqnr'>
            <div>
              <p class='title'>{{list.coupon_name}}</p>
              <p  class='cont'>{{list.description}}</p>
            </div>
            <p class='price' style='color:#999999'>{{list.offset_price}}<span style='font-size:16px'>元</span></p>
          </div>
          <p>
            <img class='tib' src='/static/images/yh3end.jpg'>
            <span class='tibtext'>到期至{{list.pend}}</span>
            <span class='ljlq' style='color:#999;font-weight:600;'>已过期</span>              
          </p>
        </div>
       
      </van-tab>
    </van-tabs>
     <p class='jiazaigengduotxt'>没有优惠券啦</p>
  </div>
</template>
<script>
export default {
  data () {
    return {
      active:0,
      coupon:[],
      time:[]
    }
  },
  onShow:function () {  
    this.coupon=[];
    this.shaoplist(1);
  },
  methods: {
    // 商品列表
    shaoplist(type){
      this.$wxAjax('meCoupon', {
        userToken: this.$getStorage('token'),
        type:type
      }).then((data) => {
        if (data.status == 0) {
          this.coupon = data.data;  
          for(var i = 0;i<this.coupon.length;i++){
            this.getLocalTime(this.coupon[i].pend,i);
          }        
        } else {
          this.$toast(data.message);
        }
      })
    },
    onClick(index) {
      this.active = index.mp.detail.index;
      this.coupon=[];
      this.shaoplist(this.active+1);
    },
    getLocalTime(nS,i) {
     this.time[i] = new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
     console.log(this.time)
    }
  },

}
</script>

<style scoped>
.counter-warp{
  min-height:100vh;
  background:#f7f8fa
}
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
  left:104rpx;
  font-size:12px
  }
.ljlq{
  font-size:12px;
  color:#748ac2;
  position: absolute;
  bottom:18px;
  right:110rpx;
}
.jiazaigengduotxt{
  font-size:14px;
  text-align:center;
  line-height:40px
}
</style>
