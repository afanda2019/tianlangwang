<template>
  <div class="counter-warp">
  <div class='top'>
    <!--轮播图地址 和搜索-->
      <div class='address' v-if='address'  @click="$go('address')">
        <div class='address_header'>
          <p style='padding:0 20px 0 0'>{{address.name}}</p>
          <p>{{address.mobile}}</p>
        </div>
        <p class='address_cont'>收货地址：{{address.province_h}}-{{address.city_h}}-{{address.district_h}}-{{address.address}}</p>
        <img class='line' src='/static/images/line.png'>
      </div>
      <div class='address' v-else  @click="$go('addaddress')">
        <p class='tianjiadizhi'><van-icon name="location" />添加地址</p>
        <img class='line' src='/static/images/line.png'>
      </div>
      <div class='shoplist' v-if='shoplist' v-for='(list,index) in shoplist' :key="index">
          <img :src='list.image_uri'>
          <div class='text'>
            <p class='shoplist_title'>{{list.goods_name}}</p>
            <p class='shoplist_short'>{{list.sku_x}}</p>
            <p class='shoplist_price'><span class='price'>￥{{list.sale_price}}</span>x{{list.goods_nums}}</p>
          </div>
      </div>
      <van-cell-group>
        <van-field
          :value="message"
          @change="e=>message = e.mp.detail"
          label="买家留言："
          type="text"
          placeholder="选填：对本次交易的说明..."
          border="false"
        />
      </van-cell-group>
     <!-- <van-cell title="配送方式：" :border='false' value="快递名称"/>
          <van-cell title="配送日期：" value="2017-10-11"/>
           <van-cell title="+运费" value="10.00"/>
     -->
      <van-cell title="优惠券：" v-if='couponflg' :border='false' :value="coupon" @click="$go('shiyongcoupon',{goodsArryId:goodsArryId,goodsArryNum:goodsArryNum})"  is-link/>
      
      <div style='height:10px;background:#f8f8f8'></div>
      <van-cell title="商品总额" :border='false' :value="allprice-offset_price"/>
          
      <div style='height:10px'></div>
  </div>
  <div class='footer'>
    <van-submit-bar
      :price="realprice-offset_price*100"
      button-text="提交订单"
      @submit="cfimorder"
    >     
    </van-submit-bar>
  </div>
    
  </div>
</template>

<script>
export default {
  data () {
    return {
      address:[],
      shoplist:[],
      shopinfo:{},
      dizhiflg:true,
      coupon:'选择优惠券',
      allprice:0,
      message:'',
      realprice:0,
      couponflg:false,
      goods:[],
      goodsArry:[],
      goodsArryId:'',
      goodsArryNum:'',
      coupon_id:'',
      offset_price:'',
      buyType:''
    }
  },
  
  onShow() {
    this.message = '';
    this.shoplist = [];
    // this.shopinfo={};
    this.allprice = 0;
    this.realprice = 0
    this.goods = [];
    this.goodsArryId = [];
    this.goodsArryNum = [];
    this.couponflg = false;
    this.orderinfo();
    this.seleaddress();
    this.coupon = this.$getStorage('coupon_name')
    this.coupon_id = this.$getStorage('coupon_id')
    this.offset_price = this.$getStorage('offset_price');
  },
  methods: {
      //查询地址；
    seleaddress(){
      this.$wxAjax('userDefAddr', {
        userToken: this.$getStorage('token')
      }).then((data) => {
        this.address = data.data
      })
    },
    // 商品详情
    couponSelect(){
      this.$wxAjax('couponOrder', {
        userToken: this.$getStorage('token'),
        goods:this.goodsArry
      }).then((data) => {
        if (data.status == 0) {
            if(data.data.length>0){
              this.couponflg = true
            }

        } else {
          this.$toast(data.message);
        }
      })
    },
      // 数据初始化
      orderinfo(){
        //this.$mp.query.type == 1 立即购买；this.$mp.query.type==2 购物车结算
        if(this.$mp.query.type==1){
          this.buyType = 0
          this.shoplist = [{
            "image_uri":this.$mp.query.img,
            "goods_name":this.$mp.query.title,
            "sku_x":this.$mp.query.skuName,
            "sale_price":this.$mp.query.price,
            "num":this.$mp.query.num,
            "goods_nums":this.$mp.query.num,
          }];
          this.allprice = this.shoplist[0].sale_price*this.shoplist[0].num;
          this.realprice = this.allprice*100;
          console.log(this.$mp.query.num)
          this.goods[0] = {"id":this.$mp.query.msid||0,"goods_id":this.$mp.query.id,"goods_sku_id":this.$mp.query.sku,"goods_nums":this.$mp.query.num}
          this.goodsArry[0] = {"goods_id":this.$mp.query.id,"num":this.$mp.query.num};
          this.goodsArryId = this.$mp.query.id;
          this.goodsArryNum = this.$mp.query.num;
          if(this.$mp.query.shopType==1){
            this.couponSelect();
          }else{
            this.couponflg = false
          }
          
        }else{
          this.buyType = 1
          this.$wxAjax('buycarList', {
            userToken: this.$getStorage('token'),
            id:this.$mp.query.cartId
          }).then((data) => {
            if (data.status == 0) {
              this.shoplist = data.data;
              for(var i =0;i<this.shoplist.length;i++){
               this.allprice +=  this.shoplist[i].sale_price*this.shoplist[i].goods_nums;
               this.goods[i] = {"id":this.shoplist[i].id,"goods_id":this.shoplist[i].goods_id,"goods_sku_id":this.shoplist[i].goods_sku_id,"goods_nums":this.shoplist[i].goods_nums}
               this.goodsArry[i] = {"goods_id":this.shoplist[i].goods_id,"num":this.shoplist[i].goods_nums,"goods_sku_id":this.shoplist[i].goods_sku_id}
               this.goodsArryId += this.shoplist[i].goods_id+',';
               this.goodsArryNum += this.shoplist[i].goods_nums+',';
               this.couponSelect();
              }
              this.realprice = this.allprice*100;
            
              
            } else {
              this.$toast(data.message);
            }
          })
        }
      },
      // 提交订单
      cfimorder(){
        if(!this.address){
          this.$toast('请添加地址');
          return;
        }
        //this.$mp.query.type == 1 立即购买；this.$mp.query.type==2 购物车结算
         this.$wxAjax('addOrder', {
            userToken: this.$getStorage('token'),
            pay_type:1,
            user_address_id:this.address.id,
            buyType:this.buyType,
            goods:this.goods,
            coupon_id:this.coupon_id,
            coupon_price:this.offset_price,
            type:this.$mp.query.shopType,
            user_message:this.message
          }).then((data) => {
            if (data.status == 0) {
                let _this = this
                wx.requestPayment(
                {
                  'timeStamp':data.data.wxpay.timeStamp,
                  'nonceStr':data.data.wxpay.nonceStr,
                  'package':data.data.wxpay.package,
                  'signType': 'MD5',
                  'paySign': data.data.wxpay.paySign,
                  'success':function(res){
                     wx.showModal({
                      title: '温馨提示',
                      content: '支付成功',
                      showCancel:false,

                      success(res) {
                        if (res.confirm) {
                           _this.$back();
                        }

                      }
                    })
                  },
                  'fail':function(res){
                     wx.showModal({
                      title: '温馨提示',
                      content: '支付失败，可以在我的订单中继续支付',
                      showCancel:false,

                      success(res) {
                        if (res.confirm) {
                           _this.$back();
                        }

                      }
                    })
                  },
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

.title,.shortcont{
  width:96%;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.title{
  font-size:16px;
  font-weight:600;
  color:#333;
  padding:0 2%;
  margin:10px 0
  }
.shortcont{
  font-size:14px;
  color:#aeaeae;
  padding:0 2%;
}
.price{
  display:flex;
  justify-content:space-between;
  padding:5px 2%;
  color:#929292;
  font-size:14px;
  }

.cont{
  width:100%
  }
.cont img{
  width:100%;
  display:block
}
.top{
  height:calc(100vh - 46px);
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  background:#f8f8f8
}
.footer{
  header:50px
  }
::-webkit-scrollbar {
  display:none
  }
.evaluate_title{
  display:flex;
  justify-content:space-between;
  padding:10px 10px;
  line-height:0.85rem;
}
.headerimg{
  width:12%;
  height:0.85rem
  }
.username{
  width:55%;
  font-size:14px;
  color:#333;
  padding-left:2%
  }
.time{
  width:31%;
  font-size:12px;
  color:#ababab;
  text-align:right
  }
.evaluate_txt{
  padding:10px 10px;
  font-size:14px;
  color:#333;
}
.evaluate_img{
  display:flex;
  padding:10px 10px;
}
.evaluate_img img{
  padding:0 1%;
  width:23%;
  height:1.5rem
}
.shoplist{
  background:#fff;
  display:flex;
  padding:15px 11px;
  font-size:14px;
  border-bottom:1px solid #f1f1f1
  }
.shoplist img{
  width:23%;
  height:1.6rem;
  margin-right:10px
  }
.shoplist .text{
  width:76%
}
.shoplist_title{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  font-size:16px;
  line-height:20px
}
.shoplist_short{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  color:#999999;
   line-height:30px
}
.shoplist_price{
  display:flex;
  justify-content:space-between;
}
.price{
  font-size:20px;
  color:red
}
.tianjiadizhi{
  line-height:40px;
  padding-left:10px
  }



.address{
    background:#fff;
    font-size:16px;
  }
  .line{
    width:100%;
    height:2px;
    display:block;
  }
  .address_header{
    display:flex;
    padding:10px 15px;
  }
  .address_cont{
    padding:0 15px 10px;
    border-bottom:1px solid #f1f1f1;
    color:#313131;
    font-size:14px
  }
</style>
