<template>
  <div class="counter-warp">
    <div class='top'>
      <!--轮播图地址 和搜索-->
        <div class='topimg'>
          <span v-if='shoplist.order_status==255' ><van-icon name="passed" style='margin-top:2px;float:left;margin-right:5px' />已完成</span>
          <span v-if='shoplist.order_status==1&&shoplist.pay_status==0'><van-icon name="passed" style='margin-top:2px;float:left;margin-right:5px'  />代付款</span>
          <span v-if='shoplist.order_status==1&&shoplist.pay_status==1&&shoplist.shipping_status==0'><van-icon name="passed" style='margin-top:2px;float:left;margin-right:5px'  />待收货</span>
          <img src='/static/images/dingdanxiangqing.png'>
        </div>
        <div style='height:10px;background:#f8f8f8'></div>
        <van-cell title="感谢您在平台购物，欢迎您再次光临！" :border='false'/>
        <div style='height:10px;background:#f8f8f8'></div>
        <div class='address'>
          <div class='address_header'>
            <p style='padding:0 20px 0 0'>{{addressinfo.receiver_name}}</p>
            <p>{{addressinfo.receiver_mobile}}</p>
          </div>
          <p class='address_cont'>{{addressinfo.receiver_address}}</p>
          <img class='line' src='/static/images/line.png'>
        </div>
        <div class='shoplist' v-for='(list,index) in shoplist.goods_list' :key="index">
            <img :src='list.image_uri'>
            <div class='text'>
              <p class='shoplist_title'>{{list.goods_name}}</p>
              <p class='shoplist_short'>{{list.sku_name}}</p>
              <p class='shoplist_price'><span class='price'>￥{{list.sale_price}}x{{list.goods_nums}}</span></p>
              
            </div>
        </div>
        <van-cell-group>
          <van-field
            :value="shoplist.user_message"
            label="买家留言："
            type="text"
            disabled
            placeholder="选填：对本次交易的说明..."
            border="false"
          />
        </van-cell-group>
        <van-cell title="订单编号" :border='false' :value="shoplist.order_no"/>
        <van-cell title="下单时间" :border='false' :value="shoplist.create_time_frm"/>
        <div style='height:10px;background:#f8f8f8'></div>
        <van-cell title="商品总额" :border='false' :value="shoplist.order_amount"/>
        <van-cell title="优惠券" :border='false' :value="shoplist.coupon.coupon_name"/>
        <van-cell  :border='true' :value="'实付款:'+shoplist.pay_amount"/>
    </div>    
    <div class='footer'>
     <!-- <p>再次购买</p>-->
      <p v-if='pingjia'  @click="$go('evaluateinfo',{id:shoplist.id})">立即评价</p>
    </div>
    <div style='height:20px;background:#f8f8f8'></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      shoplist:[],
      pingjia:false,
      addressinfo:[]
    }
  },
  onShow: function () {   
      this.pingjia = false
      this.shaoplist();
      if(this.$mp.query.pingjia==1){
        this.pingjia = true
      }
  },
  methods: {
     shaoplist(){
      this.$wxAjax('payOrder', {
        userToken:this.$getStorage('token'),
        id:this.$mp.query.id
      }).then((data) => {
        if (data.status == 0) {
          this.shoplist = data.data
          this.addressinfo = this.shoplist.address
                   
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
  height:calc(100vh);
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  background:#f8f8f8
}
.footer{
  header:50px;
  background:#f8f8f8
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
  .topimg{
    background-image: -webkit-linear-gradient(left, #fc7964, #ff4943);
    display:flex;
    color:#fff ;
    height:3rem;
    line-height:3rem;
    }
  .topimg span{
    width:60%;
    padding-left:10%
    }
  .topimg img{
    width:20%;
    padding-right:10%;
    height:1.4rem;
    margin-top:0.8rem
    }
.footer{
  display:flex;
  justify-content:flex-end;
  padding:10px 0
  }
.footer p{
  padding:5px 10px;
  font-size:14px;
  margin:0 5px;
  border:1px solid #f1f1f1;
  border-radius:6px
  }
</style>
