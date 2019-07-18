<template>
  <div class="counter-warp">
  <!--轮播图地址 和搜索-->
    <img v-if='shouquan' class='logo' src='/static/images/logo.jpg'>
    <button v-if='shouquan' class='btn' open-type="getUserInfo" @getuserinfo='getUser'>(授权登录)</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      shouquan:false,
    }
  },
  onLoad: function () {
      
      var that = this;
      // 查看是否授权
      wx.getSetting({
          success: function (res) {
              if (res.authSetting['scope.userInfo']) {
                that.shouquan = false
                  wx.getUserInfo({
                    success: function (res) {
                      that.$setStorage('parent_id',that.$mp.query.id);
                      console.log('999'+that.$mp.query.id)
                      //从数据库获取用户信息
                      wx.getUserInfo({
                        success: (res) => {
                          that.$setStorage('userInfo',res.userInfo);
                          wx.switchTab({
                            url: '/pages/index/main'
                          })
                        }
                      })
                    }
                  });
              }else{
              that.$setStorage('parent_id',that.$mp.query.id);
              console.log('999'+that.$mp.query.id)
              that.shouquan = true
            }
          }
      })
    },
  methods: {
    getUser(e) { 
      wx.getUserInfo({
          success: (res) => {
            console.log('999'+this.$mp.query.id)
              this.$setStorage('parent_id',this.$mp.query.id);
              this.$setStorage('userInfo',res.userInfo);
              wx.switchTab({
                url: '/pages/index/main'
              })

          }
      })
    },
  },

  created () {

  }
}
</script>

<style scoped>
  .logo{
    width:25%;
    margin:20% 37.5% 10%;
    height:1.5rem
  }
  .btn{
    background:#fff;
    width:60%;
    margin:0 20%
  }
</style>
