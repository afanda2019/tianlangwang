<template>
  <div class="counter-warp">
  <!--轮播图地址 和搜索-->
      <div class='top'>
        <img class='bg' src='/static/images/fenxiangbg.png'>
        <img class='ewm' :src='img'>
      </div>
      <div style='display:flex'>
        <div class='footer' style='width:50%'>
            <img @click='onShareAppMessage' src='/static/images/fenxiangicon1.png'>
            <button type="primary" open-type="share" plain="true" data-name="shareBtn">转发</button>
        </div>
       <!-- <div class='footer' style='width:50%'>
            <img @click='onShareAppMessage' src='/static/images/timg.png'>
            <button plain="true" @click='seave()'>保存图片到相册</button>
        </div>-->
      </div>
      
  </div>
</template>

<script>
export default {
  data () {
    return {
      userId:'',
      img:''
      
    }
  },
  onLoad() {
    
      this.userinfo()
  },
  methods: {
    // 	关于平台
      userinfo(){
        this.$wxAjax('users', {
            userToken: this.$getStorage('token')

          }).then((data) => {
            console.log(data)
            if (data.status == 0) {
              this.img = data.data.userInfo.qrcode
              if(data.data.userInfo.user_rank==0){
                this.userId = 0
              }else{
                this.userId = data.data.userInfo.id
              }
                 
            } else {
              this.$toast(data.message);
            }
          })
      },
      seave(){
        const _this = this;
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            // 如果用户之前已经同意授权，则不会出现弹窗，直接返回成功
            wx.downloadFile({
              url:  _this.img,
              success:function (res) {
                console.log(res);
                wx.saveImageToPhotosAlbum({
                  filePath:res.tempFilePath,
                  success(res) {
                    _this.$toast('保存成功')
                  },
                  fail() {
                    wx.showModal({
                      title: '温馨提示',
                      content: '检测到您没打开相册权限，是否去设置打开？',
                      confirmText: "确定",
                      cancelText: "取消",
                      success: function (res) {
                        if (res.confirm) {
                          wx.openSetting()
                        }
                      }
                    })
                  }
                })
              }
            })
          },
          
        })
      },
  },
  
  onShareAppMessage: function (res) {
      return {
        title: '分享有礼',
        path: 'pages/denglu/main?id='+this.userId,
        imageUrl:'../../static/images/fenxiangtup.jpg',
        success: function (shareTickets) {
          console.info(shareTickets + '成功');
          // 转发成功
        },
        fail: function (res) {
          console.log(res + '失败');
        },
        complete:function(res){
          // 不管成功失败都会执行
        }
      }
    },
}
</script>

<style scoped>
.logo{
  width:20%;
  margin:0 40%;
  height:1.5rem
}
.bg{
  width:75%;
  margin:15px 13% 0;
  height:800rpx;
}
.top{
  position: relative;
  }
.ewm{
  position: absolute;
  left:0;
  top:0;
  right:0;
  bottom:30%;
  margin:auto;
  width:200px;
  height:200px
}

.footer{
}
.footer img{
  width:50px;
  padding:20rpx 17%;
  height:50px;
  margin:20rpx 20%;


}
.footer button{
  width:100%;
  margin:0;
  background:none;
  border:none;
  padding-top:120rpx;
  margin-top:-154rpx;
  font-weight:600;
}

</style>
