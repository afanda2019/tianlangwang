<template>
  <div class="counter-warp">
  <div class='top'>
    <!--轮播图地址 和搜索-->
    <div class='banner'>
      <swiper class="swiper" :indicator-dots="true"  autoplay="true" interval="5000" duration="1000">
          <block v-for="(item, index) in shop.goods_album_detail" :index="index" :key="key">
              <swiper-item class='wiperitem'>
                  <image :src="item.value" class="slide-image" mode="aspectFill"/>
              </swiper-item>
          </block>
      </swiper>
    </div>
    <p class='title'>{{shop.goods_name}}</p>
    <p class='shortcont'>{{shop.goods_intro}}</p>
    <p class='price'>
      <span style='font-size:20px;color:red'>￥{{sale_price}}</span><span><van-icon style='margin-top:2px;float:left' name="orders-o" />{{shop.total_sale_nums}}</span>
    </p>
    <van-cell title="选择规格：" :value="fenleiName" @click='changsku()' is-link />
    <!--<p class='num'>
      <span>购买数量</span>
      <van-stepper :value="1" bind:change="onChange" />
    </p>-->
    <van-tabs :active="active">
      <van-tab title="详情">
        <div class='cont' v-html='productcont'>
        </div>
      </van-tab>
      <van-tab title="评价">
        <div class='evaluate' v-for='(list,key) in evaluates_list' :key="key">
          <div class='evaluate_title'>
            <img class='headerimg' :src='list.headimgurl'>
            <p class='username'>{{list.nickname}}</p>
            <p class='time'>{{list.create_time}}</p>
          </div>
          <p class='evaluate_txt'>{{list.content}}</p>
          <div class='evaluate_img'>
            <img :src='evaluateimg.attach_uri'  v-for='(evaluateimg,picindex) in list.pics' :key='picindex'>   
          </div>
        </div>
        <p class='jiazaigengduotxt'>没有数据啦;</p>
      </van-tab>
    </van-tabs>
    <div style='height:10px'></div>
  </div>
  
  <div class='footer'></div>
    <van-goods-action>
      <navigator
        url="/pages/index/main"
        open-type="switchTab"
      >
        <van-goods-action-icon icon="wap-home" text="首页" />
      </navigator>
      
      <navigator
        url="/pages/shopdcart/main"
        open-type="switchTab"
      >
        <van-goods-action-icon @click="$go('shopdcart',{id:index})" icon="cart-o" text="购物车" :info="cartnum" />
      </navigator>
      
      <van-goods-action-icon icon="star-o" v-if='!collectflg' @click='changeCollect(0)' text="收藏" />
      <van-goods-action-icon icon-class='activeclolle ' v-else text-class='activeclolle'  icon="star-o" @click='changeCollect(1)' text="取消收藏" />
      <van-goods-action-button text="加入购物车" @click="addShopCart()" v-if='skunum > 0'  type="warning" />
      <van-goods-action-button text="立即购买" @click="allligm()" v-if='skunum > 0' />
      <van-goods-action-button text="库存不足" style='background:#f1f1f1;color:#333'  v-if='skunum==0' />
    </van-goods-action>
    <van-popup :show="show" @close="onClose" position='bottom'>
      <div class='sku_shop'>
        <img :src='shop.image_uri'>
        
        <div style='width:60%'>
          <p style='color:red;font-size:20px;line-height:40px'>￥{{sale_price}}</p>
          <div style='display:flex'>
            <p style='color:#aeaeae;width:100%'>销量<van-icon style='margin:2px 5px 0px;float:left' name="orders-o" />{{shop.total_sale_nums}}</p>
            <p style='color:#aeaeae;width:100%'>库存<van-icon style='margin:2px 5px 0px;float:left' name="orders-o" />{{skunum}}</p>
          </div>
          
        </div>
      </div>
      <div class='sku_category'>
        <div v-for='(sku_cat,key) in sku' :key="key" >
          <van-cell :title="sku_cat.spec_name"/>
          <div style='height:5px'></div>
          <div class='skulist'>
            <p v-for='(sku_cat_list,index) in sku_cat.spec_value' :key="index"  :class='{"addclass":sku_cat_list.checken} ' @click='changskuActive(sku_cat.spec_id,sku_cat_list.spec_value_id,key,index)'>{{sku_cat_list.spec_value_name}}</p>
          </div>
        </div>
        <p class='num'>
          <span>购买数量</span>
          <van-stepper v-model="num" @minus='minus()' @plus='plus()' />
        </p>
        <div class='sku_foot'>
          <p class='addcart' @click="addShopCart()" v-if='skunum > 0'  >加入购物车</p>
          <p class='ljgm' style='background:#f1f1f1;color:#333;width:100%' v-if='skunum==0'>库存不足</p>
          <p class='ljgm' @click='allligm' v-if='skunum > 0' >立即购买</p>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  data () {
    return {
      shop:[],
      productcont:[],
      show:false,
      fenleiid:'',
      fenleiName:'选择规格',
      sku:[],
      skulist:[],
      num:1,
      collectflg:true,
      cartnum:'0',
      evaluates_list:[],//评价
      sale_price:0,
      skunum:0,

    }
  },
  onLoad() {
      this.fenleiid='';
      this.fenleiName='选择规格';
      this.shaopInfo();
      
  },
  methods: {
    minus(index){
      this.num--
    },
    plus(index){
      this.num++
    },
    //加入购物车
    addShopCart(){
      if(this.fenleiid||this.shop.goods_spec_format_array.length==0){
        this.$wxAjax('buycar', {
          userToken:this.$getStorage('token'),
          goods_id:this.$mp.query.id,
          goods_sku_id:this.fenleiid,
          goods_nums:this.num
          // goods_id:5

        }).then((data) => {
          console.log(data)
          if (data.status == 0) {
            this.show = false
            this.cartnum++
            this.$toast('加入购物车成功');
          } else {
            this.$toast(data.message);
          }
        })
      }else{
        this.$toast('选择规格');
        this.show = true
      }
      
    },
    //收藏取消收藏
   
    changeCollect(index){
      this.$wxAjax('collect', {
        userToken: this.$getStorage('token'),
        goodsId:this.$mp.query.id
        // goods_id:5

      }).then((data) => {
        if (data.status == 0) {
          if(index==0){
            this.collectflg = true;
            this.$toast('收藏成功');
          }else{
            this.collectflg = false;
            this.$toast('取消收藏');
          }
        } else {
          this.$toast(data.message);
        }
      })
    },
    //立即购买 
    allligm(){
      if(this.fenleiid||this.shop.goods_spec_format_array.length==0){
        this.show = false
        this.$setStorage('coupon_id','');
        this.$setStorage('offset_price','');
        this.$setStorage('coupon_name','');
        this.$go('placeorder',{type:1,id:this.shop.id,sku:this.fenleiid,num:this.num,shopType:1,title:this.shop.goods_name,skuName:this.fenleiName,skuName:this.fenleiName,img:this.shop.image_uri,price:this.sale_price})
       
      }else{
        this.show = true
      }
    },
     // 商品详情
    shaopInfo(){
      this.$wxAjax('detail', {
        userToken: this.$getStorage('token'),
        goods_id:this.$mp.query.id,
        num:1
        // goods_id:5
      }).then((data) => {
        if (data.status == 0) {
          this.shop = data.data;
          this.sku = this.shop.goods_spec_format_array;//商品规格
          this.productcont = this.formatImg(this.shop.goods_detail)
          this.collectflg = this.shop.is_collect;//是否收藏
          this.cartnum = this.shop.buycar_count//购物车数量
          this.evaluates_list =  this.shop.evaluates_list//评价
          this.skulist = this.shop.sku;
          this.sale_price = this.shop.sale_price;
          this.skunum = this.shop.goods_stock
          console.log(this.collectflg)
          for(var i = 0;i<this.sku.length;i++){
            for(var m = 0;m<this.sku[i].spec_value.length;m++){
              this.sku[i].spec_value[m].checken = false
            }
          }
          console.log(this.sku)
        } else {
          this.$toast(data.message);
        }
      })
    },
    //选择规格 ；获取规格id
    changskuActive(catid,id,smallkey,bigkey){
      this.fenleiid ='';
      this.fenleiName = '';
      for(var s = 0;s< this.sku[smallkey].spec_value.length;s++){
        this.sku[smallkey].spec_value[s].checken = false;
      }
      this.sku[smallkey].spec_value[bigkey].checken = true
      for(var p = 0;p<this.sku.length;p++){
        for(var n= 0 ;n<this.sku[p].spec_value.length;n++){
          if(this.sku[p].spec_value[n].checken){
            this.fenleiName +=this.sku[p].spec_value[n].spec_value_name+','
            this.fenleiid +=this.sku[p].spec_id+':'+this.sku[p].spec_value[n].spec_value_id+';'
          }
        }
      }
      this.fenleiName = this.fenleiName.substr(0, this.fenleiName.length - 1);  
      this.fenleiid = this.fenleiid.substr(0, this.fenleiid.length - 1);  
      for(var index = 0;index<this.skulist.length;index++){
        if(this.fenleiid ==this.skulist[index].sku_id ){
          this.sale_price = this.skulist[index].sale_price;
          this.skunum = this.skulist[index].stock;
        }
      }
     
    },
    changsku(){
      this.show = true
    },
    //详情图片截取 图片显示100%
    formatImg(html){
            var newContent= html.replace(/<img[^>]*>/gi,function(match,capture){
            var match = match.replace(/<img/gi,'<img style="width:100%;display:block"');
            return match;
        });
        return newContent;
      },
    onClose(){
      this.show = false
    }
  },

}
</script>
<style>

.activeclolle{
  color: red;
}
</style>
<style scoped>
.swiper{height:4.5rem;position:absolute;left:0;top:0;width:100%
}
.slide-image{width:100%;height:100%}
.banner{
  position:relative;
  width:100%;
  height:4.5rem
}
.skulist p.addclass{
   color: #c00;
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
.num{ padding:8px 15px;font-size:14px;display:flex;justify-content:space-between;line-height:30px;color:#333}
.cont{width:100%}
.cont img{
  width:100%;
  display:block
}
.top{
  height:calc(100vh - 46px);
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
::-webkit-scrollbar {display:none}
.evaluate{border-bottom:1px solid #f1f1f1}
.evaluate_title{
  display:flex;justify-content:space-between;
  padding:10px 10px;
  line-height:0.85rem;
}
.headerimg{width:12%;height:0.85rem;border-radius:50%}
.username{width:35%;font-size:14px;color:#333;padding-left:2%}
.time{width:51%;font-size:12px;color:#ababab;text-align:right}
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
.sku_shop{display:flex;padding:10px 10px;font-size:14px}
.sku_shop img{width:80px;height:80px;border-radius:5px;margin-right:15px}
.skulist {
   display:flex;
   flex-wrap:wrap ;
   padding-left:10px;
   font-size:12px;
}
.skulist p{
  padding:4px 10px;
  border:1px solid #f1f1f1;
  margin:5px;
  color:#ababab
}
.sku_foot{
  display:flex;
  color:#fff;
  font-size:16px;
  text-align:center;
  line-height:40px
}
.addcart,.ljgm{width:50%}
.addcart{
  background:#ff976a;
}
.ljgm{background:red}
.jiazaigengduotxt{
  font-size:14px;
  text-align:center;
  line-height:40px
}
</style>
