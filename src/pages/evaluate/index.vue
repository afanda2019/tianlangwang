<template>
  <div class="counter-warp">
    <van-tabs :active="active"  @change="onChange">
      <van-tab title="未评价">
        <scroll-view
          scroll-y
          style="height:100vh"
          bindscrolltoupper="upper"
          bindscrolltolower="lower"
          bindscroll="scroll"
          scroll-top="100"
          @scrolltolower='scrollfun'
        >
          <div class='list' v-for='(list,key) in shopList' :key='key' @click="$go('orderinfo',{id:list.id,pingjia:1})">
            <div class='title'>
                <p>{{list.create_time_ymd}}</p>
                <van-icon v-if='list.order_status==1&&list.pay_status==0||list.order_status==255' style='font-size:20px' name="delete" />
              </div>
              <div class='shoplist' v-for='(item,index) in list.goods_list' :key="index">
                <img :src='item.image_uri'>
                <div class='text'>
                  <p class='shoplist_title'>{{item.goods_name}}</p>
                  <p class='shoplist_short'>{{item.sku_name}}</p>
                  <p class='shoplist_price'><span class='price'>￥{{item.sale_price}}</span></p>
                </div>
              </div>
              <p class='allprice'>共{{list.goods_list.length}}件商品 实付款：<span style='font-size:18px'>￥{{list.order_amount}}</span></p>
              <div class='btn'>
                <p  class='active'  @click.stop="$go('evaluateinfo',{id:list.id})">立即评价</p>
              </div>
            </div>
            <van-loading class='jiazaigengduo'  v-if='!onoffMore'/>
            <p class='jiazaigengduotxt' v-if='onoffMore'>没有数据了</p>
        </scroll-view>
      </van-tab>
      <van-tab title="已评价">
        <scroll-view
          scroll-y
          style="height:100vh"
          bindscrolltoupper="upper"
          bindscrolltolower="lower"
          bindscroll="scroll"
          scroll-top="100"
          @scrolltolower='scrollfun'
        >
          <div class='list' v-for='(list,key) in shopList' :key='key'>
           
            <div class='title'>
              <p>{{list.create_time_ymd}}</p>
              <van-icon v-if='list.order_status==1||list.order_status==4' style='font-size:20px' name="delete" />
            </div>

            <div v-for='(item,index) in list.goods_list' :key="index">
              <div class='shoplist' >
              
                <img :src='item.image_uri'>
                <div class='text'>
                  <p class='shoplist_title'>{{item.goods_name}}</p>
                  <p class='shoplist_short'>{{item.sku_name}}</p>
                  <p class='shoplist_price'><span class='price'>￥{{item.sale_price}}</span></p>
                </div>
              </div>
            </div>
            
            <p class='allprice'>共{{list.goods_list.length}}件商品 实付款：<span style='font-size:18px'>￥{{list.order_amount}}</span></p>
          </div>
          <van-loading class='jiazaigengduo'  v-if='!onoffMore'/>
          <p class='jiazaigengduotxt' v-if='onoffMore'>没有数据了</p>
      </scroll-view>
        

      </van-tab>
    
    </van-tabs>
   
  </div>
</template>

<script>
export default {
  data () {
    return {
      active:0,
      shopList:[
      ],
      index:1,
      page:1,
      pagesize:10,
      onoff: false, //是否追加数据
      onoffMore: false,
      type:7
    }
  },
  onShow: function () {   
      this.type = 7;
      this.page=1;
      this.index=1;
      this.shopList=[];
      this.onoff= false; //是否追加数据
      this.onoffMore= false;
      this.shaoplist();
  },
  methods: {
    // 商品列表
    onChange(event) {
      this.page=1;
      this.index=1;
      this.shopList=[];
      this.onoff= false; //是否追加数据
      this.onoffMore= false;
      this.index= event.mp.detail.index;
      if(this.index==0){
        this.type = 7
      }else{
        this.type = 8
      }
      this.shaoplist();
    },
     scrollfun(){
      if (this.onoffMore) {} else {
          this.onoff = true;
          this.page++;
          this.shaoplist(this.index);
      }
    },
    shaoplist(){
      this.$wxAjax('orderList', {
        userToken: this.$getStorage('token'),
        tabIndex:this.type,
        page:this.page,
        limit:this.pagesize
      }).then((data) => {
        console.log(data)
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
          this.$toast(data.message);
        }
      })
    },
    scrollfun(){
      if (this.onoffMore) {} else {
          this.onoff = true;
          this.page++;
          this.shaoplist(0);

      }
    },
  },

}
</script>

<style scoped>
.counter-warp{
  min-height:100vh;
  background:#f8f8f8
}
.list{margin-bottom:10px}
.title{
  display:flex;
  justify-content: space-between ;
  padding:0 10px;
  font-size:14px;
  line-height:40px;
  background:#fff;
}
.shoplist{display:flex;padding:10px 11px;font-size:14px;border-bottom:1px solid #f1f1f1}
.shoplist img{width:23%;height:1.6rem;margin-right:10px}
.shoplist .text{
  width:74%
}
.imglist{

}
.shoplist_title{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  font-size:16px;
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
.allprice{padding:0 10px;line-height:40px;font-size:14px;text-align:right;border-bottom:1px solid #f1f1f1;background:#fff;}
.btn{
  padding:5px 0 ;
  background:#fff;
  height:30px
}
.btn p{width:1.8rem;line-height:20px;float:right;font-size:14px;padding:4px 0;background:#fff;margin:0 5px;border:1rpx solid #f1f1f1;text-align:center;border-radius:5px}
.btn .active{border:1rpx solid red;color:red}
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
