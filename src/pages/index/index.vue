<template>
  <div class="counter-warp">
  <!--轮播图地址 和搜索-->
    <div class='banner'>
      <p class='address'><van-icon name="location-o" style='float:left;margin:2px 0 0 0;' />{{city}}</p>
      <swiper class="swiper"  autoplay="true" interval="5000" duration="1000">
          <block v-for="(item,index) in uploadImgUrl" :index="index" :key="key">
            <swiper-item class='wiperitem'>
              <image :src="item.image_uri" class="slide-image" mode="aspectFill"/>
            </swiper-item>
          </block>
      </swiper>
      <div class='seach'>
        <van-icon style='font-size:24px;margin:2px 0 0;width:10%' name="search"/>
        <p style='width:74%' @click="$go('search')" >输入商品名称</p>
        <navigator style='width:10%;padding-left:6%;border-left:1px solid #f1f1f1;'
          url="/pages/news/main"
          open-type="switchTab"
          >
          <van-icon style='font-size:28px;color:#333;' name="more-o"/>
        </navigator>
      </div>
    </div>
    <div style='height:40px'></div>
    <!--导航-->
    <div class='indexnav'>
      <div class='item' v-for='(navlist,key) in navlists' :key='key' @click="$go('shoplist',{id:navlist.url,name:navlist.name})">
        <img :src='navlist.image_uri'>
        <p>{{navlist.name}}</p>
      </div>
    </div>
    <!--秒杀专区-->
    <div class='xsmiaosha'>
      <img class='mstitle' @click="$go('miaoshashoplist',{id:index})" src='/static/images/miaosha.jpg'>
      <div class='mslist'>
        <div class='item' v-for='(item,index) in list' :key="index"  @click="$go('shopdetails1',{id:item.goods_id,msid:item.id,price:item.promotion_price})">
          <p class='time' v-html="times2[index]"></p>
          <img :src='item.image_uri'>
          <p><span class='qingfou'>抢购价</span>￥{{item.promotion_price}}</p>
          <p style='color:#999;line-height:25px'>￥{{item.sale_price}}</p>
        </div>
      </div>
    </div>
    <!--好评专区、积分专区、优惠券专区-->
    <div class='hpzq'>
      <div  @click="$go('shoplist',{id:goodNavs[0].url,name:goodNavs[0].title})" ><img :src='goodNavs1'></div>
      <div  @click="$go('integral',{id:goodNavs[1].url,name:goodNavs[1].title})" ><img :src='goodNavs2'></div>
      <div  @click="$go('coupon1',{id:goodNavs[2].url,name:goodNavs[2].title})"><img :src='goodNavs3'></div>
    </div>
    <!--最美季节-->
    <div class='zm'>
      <div class='img0' v-if='twoNavs'>
        <img :src='twoNavs[0].image_uri'>
      </div>
      <div class='img1'  @click="$go('shoplist',{id:oneNavs[0].url,name:oneNavs[0].title})">
        <img :src='oneNav0img'>
      </div>
      <div  class='zm' style='width:66.66%'>
        <div class='img2'  @click="$go('shoplist',{id:oneNavs[1].url,name:oneNavs[1].title})">
          <img :src='oneNav1img'>
        </div>
        <div class='img2'  @click="$go('shoplist',{id:oneNavs[2].url,name:oneNavs[2].title})">
          <img :src='oneNav2img'>
        </div>
        <div class='img2'  @click="$go('shoplist',{id:oneNavs[3].url,name:oneNavs[3].title})">
          <img :src='oneNav3img'>
        </div>
        <div class='img2'  @click="$go('shoplist',{id:oneNavs[4].url,name:oneNavs[4].title})">
          <img :src='oneNav4img'>
        </div>
      </div>
    </div>
    <div class='xsmiaosha'>
      <img class='mstitle' src='/static/images/hp0.jpg'>
      <div class='hp' style='overflow:scroll;padding-left:10px'>
        <div style='min-width:120000px;'>
          <div class='item' v-for='(goodswellitem,index) in goodswell' :key="index"  @click="$go('shopdetails',{id:goodswellitem.id})">
            <img :src='goodswellitem.image_uri'>
            <div style='width:53%;padding-left:2%'>
              <p class='title1'>{{goodswellitem.goods_name}}</p>
              <p class='title2'>{{goodswellitem.goods_intro}}</p>
              <p class='title3'>新品上架</p>
              <p class='title4'>￥{{goodswellitem.sale_price}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--商品-->
    <img class='titlebanan' v-if='threeNavs' @click="$go('shoplist',{id:threeNavs[0].id})" :src='threeNavs[0].image_uri'>
    <img class='titlebanan1' src='/static/images/shoptitle.jpg'>
    <div class='shop'>
      <div class='shopbox' v-for='(categorie,key) in categories' :key="key">
        <img class='shopbanner' @click="$go('shoplist',{id:categorie.id})" :src='categorie.image_uri'>
        <div class='shoplist'>
          <div class='shopitem' v-for='(list,index) in categorie.goods' :key="index"  @click="$go('shopdetails',{id:list.id})">
            <img :src='list.goods_thumb'>
            <p class='shoptext'>{{list.goods_name}}</p>
            <p class='shopprice'>¥{{list.sale_price}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import QQMapWX from '@/utils/qqmap-wx-jssdk.js'; 
export default {
  data () {
    return {
      qqmapsdk:'',
      uploadImgUrl: [],
      navlists:[],
      times1:[],
      list:[
      ], 
      goodNavs:'',
      oneNavs:'',//不规则广告位
      oneNav0img:'',//不规则广告位
      oneNav1img:'',//不规则广告位
      oneNav2img:'',//不规则广告位
      oneNav3img:'',//不规则广告位
      oneNav4img:'',//不规则广告位
      goodNavs1:'',
      goodNavs2:'',
      goodNavs3:'',
      times2: [],
      twoNavs:'',
      goodswell:[],
      threeNavs:'',
      categories:[],
      city:'',
      cityid:'',
      parent_id:this.$getStorage('parent_id')||0
    }
  },
  onShow() {
      this.qqmapsdk = new QQMapWX({
          key: 'VQMBZ-P3R3X-4CV4F-TMOS6-DDFRS-6NBT6'
      });
      this.getIndexInfo();
      this.getlocation();
      // 
  },
  methods: {
    bindViewTap () {
      const url = '../logs/main'
      if (mpvuePlatform === 'wx') {
        mpvue.switchTab({ url });
      } else {
        mpvue.navigateTo({ url });
      }
    },
    //获取位置信息
    getlocation(){
      let _this = this
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          var latitude = res.latitude;
          var longitude = res.longitude;
          var speed = res.speed;
          var accuracy = res.accuracy;
          console.log(latitude)
          console.log(longitude)
          _this.getLocal(latitude,longitude);
        }
      })
    },
    // 获取当前地理位置
    getLocal: function (latitude,longitude) {
      let _this = this
      this.qqmapsdk.reverseGeocoder({
        location: {
          latitude: latitude,
          longitude: longitude
        },
        success: function (res) {
           
          let province = res.result.ad_info.province;
          console.log(province)
          _this.city = res.result.ad_info.city;
          console.log( _this.city)
        },
        fail: function (res) {

        },
        complete: function (res) {

        }
      });
    },
    countDown:function(i) {
      let _this = this
      setInterval(function(){
        var nowTime = parseInt(new Date().getTime() / 1000);
        for (var a = 0; a < i; a++) {
            var endtimes = _this.times1[a];
            var leftimes = endtimes - nowTime;
            var d, h, m, s;
            if (leftimes > 0) {
              h = Math.floor(leftimes / 60 / 60);
              m = Math.floor(leftimes / 60 % 60);
              s = Math.floor(leftimes % 60);
              if (h < 10) {
                  h = '0' + h;
              }
              if (m < 10) {
                  m = '0' + m;
              }
              if (s < 10) {
                  s = '0' + s
              }
              var hjdhj = '<span style="background:rgba(0,0,0,0.5);border-radius:4px;color:#fff;padding:1px 4px">' + h + '</span><span>:</span><span style="background:rgba(0,0,0,0.5);border-radius:4px;color:#fff;padding:1px 4px">' + m + '</span><span>:</span><span style="background:rgba(0,0,0,0.5);border-radius:4px;color:#fff;padding:1px 4px">' + s + '</span>';
              _this.times2.splice(a, 1, hjdhj);
            } 
        }
      },1000)
    },
    getIndexInfo(type_id) {
      
      let _this = this;
      console.log(777+_this.parent_id)
      if (!_this.$getStorage('token')) {
        
        wx.login({
          async success(res) {
            wx.request({
              url: 'https://jiazhuang.ccpingtai.cn/api/v1/code2Session?code='+res.code,
              method:"GET",
              header: {
                'Content-Type': 'json'
              },
              success: function (ret) {
                  _this.$wxAjax('login', {
                    openid: ret.data.data.openid,
                    nickname:_this.$getStorage('userInfo').nickName,
                    headimgurl:_this.$getStorage('userInfo').avatarUrl,
                    parent_id:_this.parent_id
                    }).then((data) => {
                      if (data.status == 0) {
                        _this.$setStorage('token',data.data.userToken);
                        _this.indexinfo(data.data.userToken)
                      } else {
                        _this.$toast(data.message);
                      }
                    })
                },
              fail: function () {
                _this.indexinfo()
              }
            })
          }
        });
      }else{
        _this.indexinfo()
      }
    },
    indexinfo(token){
      console.log(777+this.parent_id)
      this.$wxAjax('index', {
        userToken: this.$getStorage('token')||token,
        parent_id:this.parent_id
        }).then((data) => {
          if (data.status == 0) {
            this.uploadImgUrl = data.data.slides;
            this.navlists = data.data.subNavs;
            this.goodNavs = data.data.goodNavs;
            this.goodNavs1 = this.goodNavs[0].image_uri
            this.goodNavs2 = this.goodNavs[1].image_uri
            this.goodNavs3 = this.goodNavs[2].image_uri
            this.oneNavs = data.data.oneNavs;
            this.oneNav0img = data.data.oneNavs[0].image_uri;
            this.oneNav1img = data.data.oneNavs[1].image_uri;
            this.oneNav2img = data.data.oneNavs[2].image_uri;
            this.oneNav3img = data.data.oneNavs[3].image_uri;
            this.oneNav4img = data.data.oneNavs[4].image_uri;
            this.twoNavs = data.data.twoNavs;
            this.threeNavs = data.data.threeNavs;
            this.goodswell = data.data.goodswell;
            this.categories = data.data.categories;
            this.list = data.data.spikewell;
            for(var i = 0;i < this.list.length; i++){
              this.times1.push(this.list[i].pend)
            }
            
          } else {
            this.$toast(data.message);
          }
        })
    }
  },
  created () {
    this.countDown(5);
  }
}
</script>

<style scoped>
.swiper{height:4.5rem;position:absolute;left:0;top:0;width:100%;
}
.slide-image{width:100%}
.banner{
  position:relative;
  width:100%;
  height:4.5rem;
}
.address{
  position:absolute;left:15px;top:15px;
  z-index:999;
  background:rgba(0,0,0,0.5);
  font-size:12px;
  padding:4px 10px;
  border-radius:18px;
  color:#fff;
  line-height:15px;
}
.seach{ 
  position:absolute;left:5%;bottom:-25px;
  width:80%;
  background:#fff;
  display: flex;
  height:25px;
  line-height:25px;
  box-shadow: 0 0 15px #ddd;
  padding:10px 5%;
  font-size:16px;
  color:#626262;
}
.indexnav{
  display: flex;
  padding:10px 10px 15px;
  border-bottom:8px solid #f5f5f5
}
.indexnav .item{
  width:20%;
  text-align:center;
  font-size:14px;
  color:#000;
  font-weight:bold;
  line-height:20px
}
.indexnav .item img{
  width:0.8rem;
  height:0.8rem;
  margin:0 20%;
}
.xsmiaosha{border-bottom:1px solid #f3f5f9;}
.mstitle{width:100%;height:1.25rem}
.mslist{
  padding:10px;
  display:flex
}
.mslist .item{
  font-size:12px;
  width:25%;
}
.mslist .item img{width:96%;height:1.65rem;margin:12px 2% 0;}
.mslist .time{font-size:12px;text-align:center;color:#868686}
.qingfou{
  background:#e82c00;
  color:#fff;
  font-size:10px;
  padding:1px 4px
}
.hpzq{
  display:flex;
  padding:15px 8px 8px;
  border-bottom:8px solid #f5f5f5
}
.hpzq div{width:33.33%}
.hpzq div img{width:100%;height:1.5rem}
.img0{width:100%;}
.img0 img{width:100%;height:1.79rem}
.zm{display:flex;flex-wrap:wrap }
.img1{width:33%}
.img2{width:50%}
.img1{height:5rem}
.img2{height:2.5rem}
.img1 img{width:100%;height:100%}
.img2 img{width:100%;height:100%}
.hp{width:100%;padding-bottom:20px;border-bottom:8px solid #f5f5f5}
.hp .item{background:#f0f0f0;width:5rem;margin-right:10px;float:left;padding:5px 0;display:flex;}
.hp .item img{width:45%;height:2.2rem}
.title1{font-size:18px;color:#636161;font-weight:900;padding-top:15px;
overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}
.title2{font-size:14px;color:#3f3f3f;font-weight:900;overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  margin:2px 0;
  line-clamp: 1;
  -webkit-box-orient: vertical;}
.title3{font-size:12px;color:#c6c3c3;}
.title3{font-size:12px;color:#c6c3c3;}
.title4{font-size:20px;color:#1c1a1a;font-weight:900}
.titlebanan{height:1.79rem;width:100%}
.titlebanan1{height:1.2rem;width:100%}
.shop .title1{height:1.2rem;width:100%}
.shopbanner{
  height:3.12rem;width:100%;
}
.shoplist{width:96%;display: flex;flex-wrap:wrap ;padding:0 2%}
.shopitem{width:47%;padding:10px 1.5% ;}
.shopitem img{width:100%;height:3.5rem}
.shoptext{
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size:14px;
  color:#333;
  padding:4px 0
}
.shopprice{
  color:#ff4c44;
  font-size:16px;
}
</style>
