<template>
  <div class="counter-warp">
      <scroll-view
        scroll-y
        style="height:100vh"
        bindscrolltoupper="upper"
        bindscrolltolower="lower"
        bindscroll="scroll"
        scroll-top="100"
        @scrolltolower='scrollfun'
      >
        <div class='category'>
          <div class='categorylist'>
            <navigator style="width:95%;display:flex;text-align:center;font-weight:600"
                  url="/pages/category/main"
                  open-type="switchTab">
              <p style='color:red'>{{fenleitext}}</p>
              <img style='margin-top:-1px;margin-left:0;' src='/static/images/fenleiicon1.png'>
            </navigator>
            
          </div>
          <div  class='categorylist' @click='category(1)'>
            <p :class="{ active: categoryflg1==1||categoryflg1==2}">销量</p>
            <img v-if='categoryflg1==0' src='/static/images/fenleiicon2.png'>
            <img v-if='categoryflg1==1' src='/static/images/fenleiicon3.png'>
            <img v-if='categoryflg1==2' src='/static/images/fenleiicon4.png'>
          </div>
          <div  class='categorylist' @click='category(2)'>
            <p :class="{ active: categoryflg2==1||categoryflg2==2}">价格</p>
            <img v-if='categoryflg2==0' src='/static/images/fenleiicon2.png'>
            <img v-if='categoryflg2==1' src='/static/images/fenleiicon3.png'>
            <img v-if='categoryflg2==2' src='/static/images/fenleiicon4.png'>
          </div>
       <!--   <div  class='categorylist' @click='category(3)'>
            <p :class="{ active: categoryflg3==1||categoryflg3==2}">更多</p>
            <img v-if='categoryflg3==0' src='/static/images/fenleiicon2.png'>
            <img v-if='categoryflg3==1' src='/static/images/fenleiicon3.png'>
            <img v-if='categoryflg3==2' src='/static/images/fenleiicon4.png'>
          </div>-->
        </div>
        <!--商品-->
        <div class='shop'>
            <div class='shopbox'>
              <div class='shoplist'>
                <div class='shopitem' v-for='(list,index) in shopList' :key="index" @click="$go('shopdetails',{id:list.id})">
                  <img :src='list.image_uri'>
                  <p class='shoptext'>{{list.goods_name}}</p>
                  <p class='shopprice'>¥{{list.sale_price}}</p>
                </div>
              </div>
            </div>
        </div>
        <van-loading class='jiazaigengduo'  v-if='!onoffMore'/>
        <p class='jiazaigengduotxt' v-if='onoffMore'>没有数据了</p>
      </scroll-view>
    
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
      pagesize: 10,
      onoff: false, //是否追加数据
      onoffMore: false,
      fenleitext:'选择分类',
    }
  },
  
 
 
  onShow: function () {   
    if(this.$mp.query.name){
      this.fenleitext = this.$mp.query.name
    }else{
      this.fenleitext = '选择分类'
    }
      this.page=1;
      this.shopList=[];
      this.onoff= false; //是否追加数据
      this.onoffMore= false;
      this.shaoplist();
  },
  methods: {
    category(index){
      if(index==1){
        if(this.categoryflg1==0){
          this.categoryflg1=1
          this.categoryflg2=0
          this.categoryflg3=0
        }else if(this.categoryflg1==1){
          this.categoryflg1=2
        }else if(this.categoryflg1==2){
          this.categoryflg1=1
        }
        this.page=1;
        this.shopList=[];
        this.onoff= false; //是否追加数据
        this.onoffMore= false;
        this.shaoplist();
        
      }else if(index==2){
        if(this.categoryflg2==0){
          this.categoryflg2=1
          this.categoryflg1=0
          this.categoryflg3=0
        }else if(this.categoryflg2==1){
          this.categoryflg2=2
        }else if(this.categoryflg2==2){
          this.categoryflg2=1
        }
        this.page=1;
        this.shopList=[];
        this.onoff= false; //是否追加数据
        this.onoffMore= false;
        this.shaoplist();
      }else if(index==3){
        if(this.categoryflg3==0){
          this.categoryflg3=1
          this.categoryflg1=0
          this.categoryflg2=0
        }else if(this.categoryflg3==1){
          this.categoryflg3=2
        }else if(this.categoryflg3==2){
          this.categoryflg3=1
        }
        this.page=1;
        this.shopList=[];
        this.onoff= false; //是否追加数据
        this.onoffMore= false;
        this.shaoplist();
      }
    },
    scrollfun(){
      if (this.onoffMore) {} else {
          this.onoff = true;
          this.page++;
          this.shaoplist(0);

      }
    },
    // 商品列表
    shaoplist(){
      this.$wxAjax('goods', {
        userToken:this.$getStorage('token'),
        category_id:this.$mp.query.id,
        goodsName:this.$mp.query.searchkey,
        page:this.page,
        limit:this.pagesize,
        actual_sale_nums:this.categoryflg1,
        sale_price:this.categoryflg2
      }).then((data) => {
        if (data.status == 0) {
          if (data.data.goods.length <= 0) { //判断显示更多
              this.onoffMore = true;
              return false;
          }
          if (this.onoff) {
              this.shopList.push.apply(this.shopList, data.data.goods);
          } else {
              this.shopList = data.data.goods;
              if(this.shopList.length<this.pagesize){
                this.onoffMore = true;
                return false;
              }
          }
                   
        } else {
          this.$toast(data.message);
        }
      })
    }
  },

  created () {
  }
}
</script>

<style scoped>

.counter-warp{background:#f8f8f8}
.shopbanner{
  height:3.12rem;width:100%;
}
.shoplist{width:96%;display: flex;flex-wrap:wrap ;padding:0 2%}
.shopitem{width:47%;
margin:10px 1.5% ;background:#fff;}
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
.jiazaigengduotxt{
  font-size:14px;
  text-align:center;
  line-height:40px
}
</style>
