<template>
  <div class="counter-warp">
    <van-tabs :active="active"  @change="onChange">
      <van-tab title="我的分销">
        <scroll-view
          scroll-y
          style="height:100vh"
          bindscrolltoupper="upper"
          bindscrolltolower="lower"
          bindscroll="scroll"
          scroll-top="100"
          @scrolltolower='scrollfun'
        >
          <div class='list' @click="$go('personnellist',{id:1})">
            <div class='item'>
              <van-icon style='color:#cbcbcb;float:left;margin-top:3px;margin-right:4px;' name="arrow" />
              <span>成功分销</span>
            </div>
            <span class='remshu'>{{num}}人</span>
          </div>
        </scroll-view>
      </van-tab>
      <van-tab title="我的佣金">
        <scroll-view
          scroll-y
          style="height:100vh"
          bindscrolltoupper="upper"
          bindscrolltolower="lower"
          bindscroll="scroll"
          scroll-top="100"
          @scrolltolower='scrollfun'
        >
          <div class='header'>
            <img class='bg' src='/static/images/wd_00.png'>
            <div class='header_right'>
              <p >当前佣金</p>
              <p style='font-size:24px'>{{userinfo.balance}}</p>
            </div>
            <span class='header_left' @click="$go('tixian',{id:1})">申请提现</span>
            <div style='height:20px'></div>
          </div>
          <p class='yjtitle'>佣金明细</p>
          <div>
             <van-cell :title="list.remark" v-for='(list,index) in shopList' :key="index" :value="list.balance" :label="list.change_time" />
          </div>
        </scroll-view>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userinfo:[],
      num:0,
      yongjin:0,
      page:1,
      pagesize: 10,
      shopList:[]
    }
  },
  onShow: function () {   
    this.page=1;
    this.shopList=[];
    this.num = this.$mp.query.num;
    this.yongjin = this.$mp.query.yongjin;
    this.mingxi();
    this.getUserInfo();
  },
  methods: { 
    scrollfun(){
      if (this.onoffMore) {} else {
          this.onoff = true;
          this.page++;
          this.mingxi();
          this.getUserInfo()

      }
    },  
   getUserInfo() {
      this.$wxAjax('users', {
        // userToken: encodeURIComponent(this.$getStorage('token'))
        userToken: this.$getStorage('token')
      }).then((data) => {
        if (data.status == 0) {
          console.log(data)
          this.userinfo = data.data.userInfo;
        } else {
          this.$toast(data.message);
        }
      })
    },
   mingxi(){
      this.$wxAjax('mingxis', {
        userToken: this.$getStorage('token'),
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
  },
}
</script>

<style scoped>
.header{
  height:140px;
  position:relative;
  width:100%;
  padding-top:10px;
  background:#fff
  }
.bg{
  width:90%;
  height:80%;
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
.counter-warp{
  min-height:100vh;
  background:#f8f8f8
}
.remshu{
  padding:3px 15px;
  background:#fa4319;
  color:#fff;
  border-radius:15px;
  font-size:14px;
}
.list{
  display:flex;
  justify-content:space-between;
  padding:10px 15px;
  font-size:14px;
  background:#fff
}
</style>
