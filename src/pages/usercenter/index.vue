<template>
  <div class="counter-warp">
    <div class='header'>
      <img class='bg' src='/static/images/wd_00.png'>
      <div class='header_left'>
        <img :src='header.headimgurl'>
        <div class='username'>
          <p>{{header.nickname}}</p>
          <p style='font-size:14px' v-if='header.user_rank==0'>普通会员</p>
          <p style='font-size:14px' v-if='header.user_rank==1'>分销商</p>
        </div>
        
      </div>
      <p class='header_right' @click="$go('information')" >我的资料</p>
      <div class='dingdanlist'>
        <div class='dingdanitem'  @click="$go('myorder',{active:'1'})">
          <img src='/static/images/wd_01.png'>
          <p>待付款</p>
        </div>
        <div  class='dingdanitem' @click="$go('myorder',{active:'2'})">
          <img src='/static/images/wd_02.png'>
          <p>待发货</p>
        </div>
        <div class='dingdanitem' @click="$go('myorder',{active:'3'})">
          <img src='/static/images/wd_03.png'>
          <p>待收货</p>
        </div>
        <div class='dingdanitem' @click="$go('myorder',{active:'4'})">
          <img src='/static/images/wd_04.png'>
          <p>已完成</p>
        </div>
        <div class='dingdanitem'  @click="$go('myorder',{active:'0'})">
          <img src='/static/images/wd_5.png'>
          <p>全部订单</p>
        </div>  
      </div>
    </div>
    <div style='height:2.8rem'></div>
    <div class='fenxiao' v-if='userinfo.user_rank==1'>
      <div class='fenxiao_item'  @click="$go('distribution',{active:'0',num:userinfo.distribution_num,yongjin:userinfo.balance})" >
         <img src='/static/images/wd_6.png'>
          <div style='padding:8px;'>
            <p >我的分销</p>
            <p style='color:#26a1fa '>{{userinfo.distribution_num}}人</p>
          </div>
          
      </div>
      <div class='fenxiao_item' style='border-left:1px solid #dadada'  @click="$go('distribution',{active:'1',yongjin:userinfo.balance,num:userinfo.distribution_num})" >
          <img src='/static/images/wd_7.png'>
          <div style='padding:8px '>
            <p>我的佣金</p>
            <p style='color:#ff5e49'>{{userinfo.balance}}元</p>
          </div>
      </div>
      
    </div>
    <div class='huiyuan' @click="$go('integral')" >
      <img src='/static/images/wd_king.png'>
      <p>
        {{userinfo.points}}积分
        <van-icon style='float:right;margin-top:3px' name="arrow" />
      </p>
    </div>
    <div class='listfunction' style='flex-wrap:wrap;padding-bottom:15px'>
      <div class='dingdanitems' @click="$go('coupon1')">
          <img src='/static/images/wd_16.png'>
          <p>领券中心 </p>
      </div>
      <div class='dingdanitems'  @click="$go('coupon')" >
          <img src='/static/images/wd_8.png'>
          <p>优惠券</p>
      </div>
      <div class='dingdanitems' @click="$go('collection')">
          <img src='/static/images/wd_9.png'>
          <p>我的收藏</p>
      </div>
      <div class='dingdanitems' @click="$go('evaluate')" >
          <img src='/static/images/wd_10.png'>
          <p>我的评价</p>
      </div>
      <div class='dingdanitems'  @click="$go('address')" >
          <img src='/static/images/wd_11.png'>
          <p>我的地址</p>
      </div>
      <div class='dingdanitems' @click="$go('share')">
          <img src='/static/images/wd_12.png'>
          <p>平台分享</p>
      </div>
      <div class='dingdanitems' @click="calling">
          <img src='/static/images/wd_13.png'>
          <p>客户服务</p>
      </div>
      <div class='dingdanitems'  @click="$go('platform')" >
          <img src='/static/images/wd_14.png'>
          <p>关于平台</p>
      </div>
      <div class='dingdanitems' @click="$go('information')">
          <img src='/static/images/wd_15.png'>
          <p>账户设置 </p>
      </div>
      
    </div>
    <button v-if='userinfo.user_rank==0' class='btn' @click="$go('apply')" >申请成为分销商</button>
    <!--<button class='btn' @click="closelogin()" >退出登录</button>-->
    <div style='height:10px'></div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      userinfo:[],
      header:[],
      tel:''
    }
  },
  onShow() {
      this.userinfo = [];
      this.getUserInfo();
  },

  methods: {
    getUserInfo() {
      this.$wxAjax('users', {
        // userToken: encodeURIComponent(this.$getStorage('token'))
        userToken: this.$getStorage('token')
      }).then((data) => {
        if (data.status == 0) {
          console.log(data)
          this.header = data.data.userInfo;
          this.userinfo = data.data.userInfo;
          this.tel = data.data.site_phone
        } else {
          this.$toast(data.message);
        }
      })
    },
    closelogin(){
      this.$rmStorage('token');
      this.$rmStorage('parent_id');
    },
    calling: function () {
      wx.makePhoneCall({
      phoneNumber:this.tel,
      success: function () {
      console.log("拨打电话成功！")
      },
      fail: function () {
      console.log("拨打电话失败！")
      }
      })
    }
  },

  created () {
  }
}
</script>

<style scoped>

.counter-warp{background:#f5f5f5;min-height:100vh;}
.header{height:150px;position:relative}
.bg{width:100%;height:100%;position:absolute;left:0;right:0}
.header_left{position:absolute;left:20px;top:20px;font-size:16px;color:#fff;display:flex}
.header_left img{width:1.2rem;height:1.2rem;border-radius:50%;border:2px solid #fff;

} 
.username{
  margin:12px 10px
}
.header_right{position:absolute;right:10px;top:35px;font-size:14px;padding:5px 10px;background:rgba(0,0,0,0.5);color:#fff;border-radius:12px}
.dingdanlist{width:90%;margin:0 4% 0;display:flex;background:#fff;border-radius:10px;position:absolute;bottom:-40px;padding:20px 1%;}
.fenxiao,.listfunction{
  width:90%;margin:0 4% 0;background:#fff;border-radius:10px;padding:18px 1%;display:flex;
}
.dingdanitem{width:20%;font-size:12px;text-align:center;line-height:18px;font-weight:600}
.dingdanitems{width:25%;font-size:14px;text-align:center;line-height:16px;font-weight:600;color:#333333;margin-bottom:10px}
.dingdanitem img{width:38%;height:0.55rem;margin:0 30%}
.dingdanitems img{width:42%;height:0.7rem;margin:0 30%}
.fenxiao_item{width:40%;padding:0 0 0 8%;font-size:14px;font-weight:600;display:flex;}
.fenxiao_item img{
  width:35%;
  height:0.95rem;
  margin-right:5px
}

.huiyuan{background: linear-gradient(to right,#d8b25d,#f3d893);width:80%;margin:12px 8% 0;padding:10px 2%;border-radius:10px 10px 0 0;display:flex;color:#9d7440;font-size:20px;lint-height:20px;justify-content:space-between}
.huiyuan img{height:0.5rem;width:40%;margin-top:3px}
.btn{width:90%;line-height:40px;height:40px;background:#d8b25d;color:#fff;margin:20px 5% 0; border-radius:8px;font-size:14px;border:none}
</style>
