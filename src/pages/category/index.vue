<template>
  <div>
    <div class="page-warp">
      <div class="badge-wrap">
        <div class="badge-left">
          <van-badge-group :active-key="activeKey" @change="onChange">
            <van-badge v-for='(categoryitem,index) in categorylist'  :key="index" :title="categoryitem.name" />
          </van-badge-group>
        </div>
        <div class="badge-content">
          <div class="classes-list">
            <img class='title' :src='adimgurl'>
            <div class="classes-list-item" v-for='(item,index) in category2list'  :key="index">
              <p style='font-size:14px;line-height:30px;background:#f1f1f1;padding-left:10px;margin-bottom:5px'>{{item.name}}</p>
              <van-row>
                <van-col span="8" v-for='(list,index1) in item.data' @click="$go('shoplist',{id:list.id,name:list.name})" :key="index1" >
                  <div class="classes-preview">
                    <img class="preview" :src="list.ad_uri" alt="">
                    <h3 style='text-align:center' class="classes-title">{{list.name}}</h3>
                  </div>
                </van-col>
              </van-row>
            </div>
            <div class='showmore' v-if='showmore'>
              暂无数据
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import card from '@/components/card'

export default {
  components: {
    card
  },

  data () {
    return {
      logs: [],
      categorylist:[],
      category2list:[],
      shopList:[],
      adimgurl:'',
      activeKey :0
    }
  },
  mounted() {
      this.logs=[];
      this.categorylist=[];
      this.category2list=[];
      this.shopList=[];
      this.adimgurl=[];
      this.activeKey  = 0;
      this.getCategory();
  },
  methods: {
    //获取分类列表
     getCategory() {
      this.$wxAjax('category', {
        userToken: this.$getStorage('token')
      }).then((data) => {
        if (data.status == 0) {
          this.categorylist = data.data.data;
          this.adimgurl = this.categorylist[0].image_uri
          this.category2list = this.categorylist[0].data
          console.log(this.adimgurl)
          
        } else {
          this.$toast(data.message);
        }
      })
    },
    // 分类选择
    onChange(index){
      console.log(index);
      this.adimgurl = this.categorylist[index.mp.detail].image_uri;
      this.category2list = this.categorylist[index.mp.detail].data
    },
    // 商品列表
  },
  created () {
    let logs
    if (mpvuePlatform === 'my') {
      logs = mpvue.getStorageSync({key: 'logs'}).data || []
    } else {
      logs = mpvue.getStorageSync('logs') || []
    }
  }
}
</script>

<style>
.page-warp{
  height: 100%;
  background : #fff;

}
  .badge-wrap {
    display : flex;
    overflow: hidden
  }

  .badge-wrap .badge-left {
    flex : 1 0 25%;
    height: 100vh;
    background: #fff;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .badge-wrap .badge-content {
    flex       : 1 0 75%;
    height:100vh;
    -webkit-overflow-scrolling: touch;
    overflow-y: scroll;
  }

  .badge-wrap .badge-left .van-badge {
    color      : #333;
    text-align : center;
  }

  .badge-wrap .badge-left .van-badge--select {
    border-color : #F59C3F;
  }

  .badge-wrap .badge-content .classes-list-item {
    background : #fff;
    margin     :0 10px 0 0;
    padding    :10px 10px;   
  }

  .badge-wrap .badge-content .classes-list-item .classes-preview .preview {
    width         : 80px;
    height        : 80px;
  }

  .badge-wrap .badge-content .classes-list-item .classes-title {
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

  .badge-wrap .badge-content .classes-list-item .classes-info {
    padding-left : 5px;
  }

  .badge-wrap .badge-content .classes-list-item .classes-desc {
    font-size     : 13px;
    color         : #666;
    background    : #F5F5F5;
    border-radius : 3px;
    padding       : 4px;
    line-height   : 20px;
    margin        : 5px 0;
    width         : 98%;
  }

  .badge-wrap .badge-content .classes-list-item .classes-desc .arrow-icon {
    position : relative;
    top      : 2px;
  }

  .badge-wrap .badge-content .classes-list-item .classes-info .classes-price {
    color : red;
  }

  .badge-wrap .badge-content .classes-list-item .classes-info .icon-cart {
    float : right;
    color : #F59C3F;
  }

  .badge-wrap .badge-content .classes-list-item .classes-preview {
    position : relative;
     width         : 80px;
  }

  .badge-wrap .badge-content .classes-list-item .classes-preview .hot {
    position : absolute;
    left     : 0;
    width    : 60%;
    top      : 0;
  }
  .showmore{
    line-height:50px;
    text-align:center;
    color:#7d7d7d
  }
  ::-webkit-scrollbar {display:none}
  .title{width:100%;height:2.5rem}
  .xiaoliang{font-size:12px;color:#474747;line-height:20px}
</style>
