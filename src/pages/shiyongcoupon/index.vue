<template>
  <div class="counter-warp">
    <div style='height:0.4rem'></div>
    <div class='list' v-for='(list,key) in shopList' :key='key' @click='goback(list.id,list.offset_price,list.coupon_name)' >
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
        <span class='tibtext'>到期至{{time[key]}}</span>
        <span class='ljlq' style='font-weight:600;'>可使用</span>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      active:0,
      goodsArryId:[],
      goodsArryNum:[],
      goodsArry:[],
      shopList:[],
      time:[],
      couponid:'',
      couponPrice:'',

    }
  },
  onShow() {
    if(this.$mp.query.goodsArryId.length==1){
      this.goodsArry[0] = {"goods_id":this.$mp.query.goodsArryId,"num":this.$mp.query.goodsArryNum}
    }else{
      this.goodsArryId = this.$mp.query.goodsArryId.substr(0,this.$mp.query.goodsArryId.length - 1).split(",");
      this.goodsArryNum = this.$mp.query.goodsArryNum.substr(0,this.$mp.query.goodsArryNum.length - 1).split(",");
      for(var i = 0; i<this.goodsArryId.length;i++){
        this.goodsArry[i] = {"goods_id":this.goodsArryId[i],"num":this.goodsArryNum[i]}
      }
    }
   
   
    this.couponSelect()
  },
  
  methods: {
     // 商品详情
    couponSelect(){
      this.$wxAjax('couponOrder', {
        userToken: this.$getStorage('token'),
        goods:this.goodsArry
      }).then((data) => {
        if (data.status == 0) {
          this.shopList = data.data
          for(var i = 0;i<this.shopList.length;i++){
            this.getLocalTime(this.shopList[i].pend,i);
          } 
        } else {
          this.$toast(data.message);
        }
      })
    },
    goback(coupon_id,offset_price,coupon_name){
      this.$setStorage('coupon_id',coupon_id);
      this.$setStorage('offset_price',offset_price);
      this.$setStorage('coupon_name',coupon_name);
      this.$back();
    },
    getLocalTime(nS,i) {
     this.time[i] = new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
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
</style>
