<template>
  <div class="counter-warp">
  <div class='top'>
    <!--轮播图地址 和搜索
    <div class='title' style='padding:0 10px;display:flex;width:92%'>
      <van-checkbox :value="shopchcked[key].checked" @change="onChangeshopcheked(key)" checked-color='#e82c00' style='margin:10px 0' ></van-checkbox>
      <van-cell style='width:100%' title="商铺名头内容名称" is-link />
    </div>-->
    <div class='shoplist' v-for='(list,index) in shoplist' :key="index">
        <van-checkbox  :value="list.checked" @change="onChangeshopcheked(index)" checked-color='#e82c00' style='margin:20px 10px 0 0;' ></van-checkbox>
        <img :src='list.image_uri'>
        <div class='text'>
          <p class='shoplist_title'>{{list.goods_name}}</p>
          <p class='shoplist_short'>{{list.sku_x}}</p>
          <p class='shoplist_price'><span class='price'>￥{{list.sale_price}}</span><van-stepper disable-input='true' min='0' @minus='minus(index,list.id)' @plus="add(index,list.id)" style='height:15px' :value="list.goods_nums"  /></p>
        </div>
    </div>
    <p class='loadmore' v-if='shoplist.length==0'>暂无购物车商品</p>
  </div>
  <div class='footer'>
    <van-submit-bar
      :price="allprice*100"
      button-text="提交订单"
     @submit="onClickButton"
    >
      <van-checkbox style='padding-left:10px' :value="checkedAll" @change="onChange" checked-color='#e82c00' ></van-checkbox>
     
    </van-submit-bar>
  </div>
    
  </div>
</template>

<script>
export default {
  data () {
    return {
      
      checkedAll: false,
      shoplist:[],
      cartId:'',
      allprice:0
    }
  },

  onShow: function () {   
    this.checkedAll=false
    this.listInfo();
  },
  methods: {
     // 商品详情
    listInfo(){
      this.$wxAjax('buycarList', {
        userToken: this.$getStorage('token')
      }).then((data) => {
        if (data.status == 0) {
          this.shoplist = data.data
          for(var i = 0;i<this.shoplist.length;i++){
            this.shoplist[i].checked = false;
            this.checkedAll = false;
          }
          this.priceall()
        } else {
          this.$toast(data.message);
        }
      })
    },
    priceall(){
      this.allprice= 0
      console.log(this.shoplist)
      for(var n =0;n<this.shoplist.length;n++){
          if(this.shoplist[n].checked){
            this.allprice+=this.shoplist[n].sale_price*this.shoplist[n].goods_nums
          }
        }
        console.log(this.allprice)
    },
    //商品选择
     onChangeshopcheked(key) {
        var gouwucenumm = 0;
        this.shoplist[key].checked = !this.shoplist[key].checked
        for(var m =0;m<this.shoplist.length;m++){
          if(this.shoplist[m].checked){
            gouwucenumm++
          }
        }
        if(gouwucenumm==this.shoplist.length){
          this.checkedAll = true
        }else{
          this.checkedAll = false
        }
        this.priceall()
        this.$forceUpdate();
      },
      //购物车数量--
      minus(index,id){
        this.shoplist[index].goods_nums--;
        this.cartnum(this.shoplist[index].goods_nums,id);
        if(this.shoplist[index].goods_nums==0){          
          this.listInfo();
        }
        this.priceall()
      },
      //购物车数量++
      add(index,id){
        this.shoplist[index].goods_nums++;
        this.cartnum(this.shoplist[index].goods_nums,id);
        this.priceall()
      },
     // 商品详情
    cartnum(num,id){
      this.$wxAjax('editCart', {
        userToken:this.$getStorage('token'),
        id:id,
        goods_nums:num

      }).then((data) => {
        if (data.status == 0) {
          
        } else {
          this.$toast(data.message);
        }
      })
    },
      //购物车全选
     onChange(event) {
        this.checkedAll = !this.checkedAll;
        if(this.checkedAll){
          for(var m =0;m<this.shoplist.length;m++){
            this.shoplist[m].checked = true;
          }
        }else{
          for(var m =0;m<this.shoplist.length;m++){
            this.shoplist[m].checked = false;
          }
        }
        this.priceall()
      },
      onClickButton(){
        this.$setStorage('coupon_id','');
        this.$setStorage('offset_price','');
        this.$setStorage('coupon_name','');
        this.cartId = ''
        for(var m =0;m<this.shoplist.length;m++){
          if(this.shoplist[m].checked){
            this.cartId +=this.shoplist[m].id +','
          }
        }
        this.cartId = this.cartId.substr(0, this.cartId.length - 1);  
        if(this.cartId==''){
          this.$toast('您还没有选择商品');
        }else{
          this.$go('placeorder',{type:2,cartId:this.cartId,shopType:1})
        }
        
      }
  },

}
</script>

<style scoped>
.swiper{
  height:4.5rem;
  position:absolute;
  left:0;
  top:0;
  width:100%
}
.slide-image{
  width:100%;
  height:100%
  }
.banner{
  position:relative;
  width:100%;
  height:4.5rem
}
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
.title{font-size:16px;font-weight:600;color:#333;padding:0 2%;margin:10px 0}
.shortcont{
  font-size:14px;color:#aeaeae;
  padding:0 2%;
}
.price{display:flex;justify-content:space-between;padding:5px 2%;color:#929292;font-size:14px;}
.num{ padding:8px 2%;font-size:14px;display:flex;justify-content:space-between;border-top:8px solid #efefef;border-bottom:8px solid #efefef;line-height:30px;font-weight:600;color:#333}
.cont{width:100%}
.cont img{
  width:100%;
  display:block
}
.top{
  height:calc(100vh - 50px);
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
::-webkit-scrollbar {display:none}
.evaluate_title{
  display:flex;justify-content:space-between;
  padding:10px 10px;
  line-height:0.85rem;
}
.headerimg{width:12%;height:0.85rem}
.username{width:55%;font-size:14px;color:#333;padding-left:2%}
.time{width:31%;font-size:12px;color:#ababab;text-align:right}
.evaluate_txt{
  padding:10px 10px;font-size:14px;color:#333;
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
.shoplist{background:#fff;display:flex;padding:15px 11px;font-size:14px;border-bottom:1px solid #f1f1f1}
.shoplist img{width:23%;height:1.6rem;margin-right:10px}
.shoplist .text{
  width:65%
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
  font-size:20px;color:red
}
.loadmore{
  font-size:14px;
  color:#595959;
  text-align:center;
  line-height:40px
}
</style>
