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
        <!--商品-->
         <div class="classes-list-item"  v-for='(item,index) in shopList' :key="index" @click="$go('shopdetails',{id:item.goods.id})">
          <van-row>
            <van-col span="6">
              <div class="classes-preview">
                <img class="preview" :src="item.goods.image_uri" alt="">

              </div>
            </van-col>
            <van-col span="18">
              <div class="classes-info">
                <h3 class="classes-title">{{item.goods.goods_name}}</h3>
                
                <div class="classes-price">
                  <small>￥{{item.goods.sale_price}}</small>
                </div>
                <div class='xiaoliang'>
                  <p>
                    <van-icon style='float:left;margin:2px 0 0;font-size:14px ' name="orders-o" />销量{{item.goods.total_sale_nums}}
                  </p>
                  <p class='del' @click.stop='delcollection(item.id)'>取消收藏</p>  
                </div>
                
              </div>
            </van-col>
          </van-row>
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
      page:1,
      shopList:[],
      pagesize: 10,
      onoff: false, //是否追加数据
      onoffMore: false,
    }
  },
  
 
  
  onShow: function () {   
      this.page=1;
      this.shopList=[];
      this.onoff= false; //是否追加数据
      this.onoffMore= false;
      this.shaoplist();
  },
  methods: {
    scrollfun(){
      if (this.onoffMore) {} else {
          this.onoff = true;
          this.page++;
          this.shaoplist(0);

      }
    },
    // 商品列表
    shaoplist(){
      this.$wxAjax('collectList', {
        userToken: this.$getStorage('token'),
        page:this.page,
        limit:this.pagesize
      }).then((data) => {
        if (data.status == 0) {
          if (data.data.length <= 0) { //判断显示更多
              this.onoffMore = true;
              return false;
          }
          if (this.onoff) {
              this.shopList.push.apply(this.shopList, this.shopList);
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
    // 取消收藏
    delcollection(id){
      this.$wxAjax('deleteCollect', {
        userToken: this.$getStorage('token'),
        id:id,
      }).then((data) => {
        if (data.status == 0) {
          this.page=1;
          this.shopList=[];
          this.onoff= false; //是否追加数据
          this.onoffMore= false;
          this.shaoplist();
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
.classes-list-item {
    background : #fff;
    padding    :10px 10px;    
    border-bottom:1px solid #f1f1f1
  }

.classes-list-item .classes-preview .preview {
    width         : 80px;
    height        : 80px;
  }

.classes-list-item .classes-title {
    padding   : 0;
    margin    : 0;
    font-size : 14px;
    width     : 95%;
     text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

.classes-list-item .classes-info {
    padding-left : 5px;
  }

.classes-list-item .classes-desc {
    font-size     : 13px;
    color         : #666;
    background    : #F5F5F5;
    border-radius : 3px;
    padding       : 4px;
    line-height   : 20px;
    margin        : 5px 0;
    width         : 98%;
  }

.classes-list-item .classes-desc .arrow-icon {
    position : relative;
    top      : 2px;
  }

.classes-list-item .classes-info .classes-price {
    color : red;
  }

 .classes-list-item .classes-info .icon-cart {
    float : right;
    color : #F59C3F;
  }

.classes-list-item .classes-preview {
    position : relative;
     width         : 80px;
  }

.classes-list-item .classes-preview .hot {
    position : absolute;
    left     : 0;
    width    : 60%;
    top      : 0;
  }
.jiazaigengduo{
margin:0 45%;
width:10%;

}
.jiazaigengduotxt{
  font-size:14px;
  text-align:center;
  line-height:40px
}
 .xiaoliang{
   font-size:12px;
   color:#474747;
   line-height:20px;
   display:flex;
   justify-content: space-between
   }
 .del{
   color:#989898;
   padding:0 10px;
   border:1px solid #f1f1f1;
   border-radius:10px
   }
</style>
