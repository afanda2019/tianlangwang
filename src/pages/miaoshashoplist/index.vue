<template>
  <div class="counter-warp">
        <!--商品-->
        <div class='shop'>
            <div class='shopbox'>
              <div class='shoplist'>
                <div class='shopitem' v-for='(list,index) in shopList' :key="index" @click="$go('shopdetails1',{id:item.goods_id,msid:item.id})">
                  <p style='height:0.3rem'></p>
                  <p class='time' v-html="times2[index]"></p>
                  <p style='height:0.3rem'></p>
                  <img :src='list.image_uri'>
                  <p class='shoptext'>{{list.goods_name}}</p>
                  <p><span class='qingfou'>抢购价</span><span style='font-size:14px'>￥{{list.promotion_price}}</span></p>                  
                </div>
              </div>
            </div>
        </div>
        <p class='jiazaigengduotxt' >没有数据了</p>
  </div>
</template>

<script>

export default {
  data () {
    return {
      categoryflg1:2,//	1销量正序，2倒序
      categoryflg2:2,//	1价格正序，2倒序
      categoryflg3:1,
      page:1,
      shopList:[],
      times2: [],
      pagesize: 10,
      onoff: false, //是否追加数据
      onoffMore: false,
      fenleitext:'选择分类',
      times1:[]
    }
  },
  
 
 
  onShow: function () {   
      this.shaoplist();
  },
  methods: {
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
              var hjdhj = '<span style="background:rgba(0,0,0,0.5);border-radius:4px;color:#fff;padding:1px 4px;font-size:12px">' + h + '</span><span>:</span><span style="background:rgba(0,0,0,0.5);border-radius:4px;color:#fff;padding:1px 4px;font-size:12px">' + m + '</span><span>:</span><span style="background:rgba(0,0,0,0.5);border-radius:4px;color:#fff;padding:1px 4px;font-size:12px">' + s + '</span>后结束';
              _this.times2.splice(a, 1, hjdhj);
            } 
        }
      },1000)
    },
    // 商品列表
    shaoplist(){
      this.$wxAjax('spike', {
        userToken:this.$getStorage('token')
      }).then((data) => {
       
        if (data.status == 0) {
         
          if (data.data.length <= 0) { //判断显示更多
              this.onoffMore = true;
              return false;
          }
          this.shopList = data.data;
          this.$nextTick(function () {

            console.log(this.shopList);
            for(var i = 0;i < this.shopList.length; i++){
                this.times1.push(this.shopList[i].pend)
              }
            console.log(this.times1);
          });
              
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

.counter-warp{background:#f8f8f8;height:100vh}
.shopbanner{
  height:3.12rem;width:100%;
}
.qingfou{
  background:#e82c00;
  color:#fff;
  font-size:10px;
  padding:1px 4px
}
.shoplist{width:96%;display: flex;flex-wrap:wrap ;padding:0 2%}
.shopitem{width:47%;
margin:10px 1.5% ;background:#fff;padding-bottom:10px}
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
  padding:4px 10px
}
.shopprice{
  color:#ff4c44;
  font-size:16px;
   padding:0 10px 10px
}

.category{
  display:flex;
  background:#fff;
  padding:10px 0;
}
.categorylist{width:25%;font-size:12px;color:#666666;display:flex;text-align:center;padding:3%}
.categorylist p{width:100%;text-align:center;font-weight:600}
.categorylist img{width:0.2rem;height:0.28rem;margin-top:3px;margin-left:-10px;}
.active{font-weight:900}
.jiazaigengduo{
margin:0 45%;
width:10%;

}
.time{
  font-size:12px;
  text-align:center;
}
.jiazaigengduotxt{
  font-size:14px;
  text-align:center;
  line-height:40px
}
</style>
