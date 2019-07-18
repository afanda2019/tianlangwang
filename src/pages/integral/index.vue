<template>
  <div class="counter-warp">
    <!--<div class='header'>
      <img class='bg' src='/static/images/wd_00.png'>
      <div class='header_left'>
        <img :src='userinfo.headimgurl'>
        <div class='username'>
          <p>{{userinfo.nickname}}</p>
        </div>        
      </div>
      <div class='header_right'>
        <p >当前积分</p>
        <p style='font-size:24px'>{{userinfo.points}}</p>
      </div>
      
    </div>
    -->
    <div class='header'>
      <img class='bg' src='/static/images/wd_00.png'>
      <div class='header_right'>
        <p >当前积分</p>
        <p style='font-size:24px'>{{explain.points}}</p>
      </div>
      <span class='header_left' v-if='info.user_rank==1' @click="$go('wallet',{id:1})">积分转佣金</span>
      <div style='height:20px'></div>
    </div>
    <div class='jifenfenlei'>
      <div class='jifenitem' @click='jifenxuanze(1)'>
        <img src='/static/images/jifen1.jpg'>
        <p>使用积分</p>
      </div>
      <div class='jifenitem' @click='jifenxuanze(2)'>
        <img src='/static/images/jifen2.jpg'>
        <p>获取积分</p>
      </div>
      <div class='jifenitem' @click='jifenxuanze(3)'>
        <img src='/static/images/jifen3.jpg'>
        <p>积分规则</p>
      </div>
    </div>
    <p class='jifentitle'>{{jifentitle}}</p>
    <div class='xiangqing' v-if='type==1'>
      {{explain.pointsApply}}
    </div>
    <div class='xiangqing' v-if='type==3'>
      {{explain.pointsRule}}
    </div>
    <div v-if='type==2'>
      <scroll-view
        scroll-y
        style="height:60vh"
        bindscrolltoupper="upper"
        bindscrolltolower="lower"
        bindscroll="scroll"
        scroll-top="60"
        @scrolltolower='scrollfun'
      >
        <van-cell v-for='(item,index) in shopList' :key='index' :title="item.remark" :value="item.points" :label="item.change_time" border="false" />
      </scroll-view>
      
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      jifentitle:'使用积分',
      explain:[],
      type:1,
      explainList:[],
      page:1,
      pagesize: 8,
      shopList:[],
      info:[],
      onoff: false, //是否追加数据
      onoffMore: false

    }
  }, 
  onShow() {
      this.page = 1;
      this.explain = [];
      this.explainList = [];
      this.shopList = [];
      this.info = [];
      this.onoff= false; //是否追加数据
      this.onoffMore= false;
      this.useExplain();
      this.userinfo()
  },
  methods: {
    scrollfun(){
      if (this.onoffMore) {} else {
          this.onoff = true;
          this.page++;
          this.useExplain();

      }
    },  
    jifenxuanze(index){
      this.type = index
      if(index==1){
        this.jifentitle = '使用积分'
      }else if(index==2){
        this.jifentitle = '获取积分'
      }else{
        this.jifentitle = '积分规则'
      }
    },
    //	使用说明
    useExplain() {
      this.$wxAjax('pointsRecord', {
        userToken: this.$getStorage('token'),
        page:this.page,
        limit:this.pagesize
      }).then((data) => {
        console.log(data)
        if (data.status == 0) {
          this.explain = data.data
          if (this.explain.list.length <= 0) { //判断显示更多
            this.onoffMore = true;
            return false;
          }
          if (this.onoff) {
              this.shopList.push.apply(this.shopList, this.explain.list);
          } else {
              this.shopList = this.explain.list;
              if(this.shopList.length<this.pagesize){
                this.onoffMore = true;
                this.onoff = true
                return false;
              }else{
                this.onoff = true;
              }
          }
          
        } else {
          this.$toast(data.message);
        }
      })
    },
    //	使用说明
    userinfo() {
      this.$wxAjax('users', {
        userToken: this.$getStorage('token')
      }).then((data) => {
        console.log(data)
        if (data.status == 0) {
          this.info = data.data.userInfo
          
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
.counter-warp{
  background:#f5f5f5;
  min-height:100vh;
  }
.header{
  height:100px;
  position:relative;
  width:100%;
  padding-top:10px;
  background:#fff
  }
.bg{
  width:90%;
  height:100%;
  position:absolute;
  left:0;
  right:0;
  margin:0 5%;
  border-radius:10px;
  }
.header_left{
  position:absolute;
  right:30px;
  top:55px;
  font-size:14px;
  color:#ff4842;
  padding:4px 10px;
  background:#fff;
  border-radius:8px
  }
.header_left img{
  width:1rem;
  height:1rem;
  } 
.yjtitle{
  color:#e31100;
  font-size:14px;
  font-weight:600;
  padding-left:15px;
  line-height:40px
  }
.header_right{
  position:absolute;
  left:30px;
  top:35px;
  font-size:14px;
  padding:5px 10px;
  color:#fff;
  }
.jifenfenlei{
  display:flex;
  justify-content:space-between;
  width:96%;
  padding:0 2% 10px;
  background:#fff
  }
.jifenitem{
  width:33.33%
  }
.jifenitem img{
  width:40%;
  margin:0.6rem 30% 0;
  height:0.8rem
  }
.jifenitem p{
  text-align:center;
  font-size:14px
  }
.jifentitle{
  padding:10px 20px;
  font-size:14px;
  color:#e31100;
  font-weight:600
  }
.xiangqing{
  background:#fff;
  padding:15px;
  font-size:14px 
  }
</style>
