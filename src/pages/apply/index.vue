<template>
  <div class="counter-warp">
    <div style='height:0.4rem;background:#f0eff5'></div>
    <van-field
      v-model="nickname"
      label="姓名"
      placeholder="填写您的姓名"
      border='false'
      @change="e=>nickname = e.mp.detail"
    />
    <van-field
      v-model="idcard"
      label="身份证号"
      placeholder="202020"
      border='false'
      @change="e=>idcard = e.mp.detail"
    />
    <van-field
      :value="mobile"
      center
      clearable
      label="手机号"
      placeholder="请输入手机号"
      border="false"
      @change="e=>mobile = e.mp.detail"
      use-button-slot
    >
    <!--  <van-button slot="button" size="small">发送验证码</van-button>-->
    </van-field>
   <!-- <van-field
      v-model="code"
      label="填写验证码"
      placeholder="202020"
      border='false'
      @change="e=>code = e.mp.detail"
    />-->
    <div class='imglist'>
      <p @click='bindChooiceProduct(index)'><img src='/static/images/cirman.png'></p>
      <ul class='img'>
        <li v-for='(imglist,i) in imgurllist' :key='i'><img :src='imglist.url'></li>
      </ul>
    </div>
    <button class='btn' @click='apply'>申请</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      imgurllist:[],
      imgxinxi:[],
      imgids:'',
      nickname:'',
      idcard:'',
      mobile:'',
      code:''
    }
  },
  onShow: function () {   
     
  },
  methods: {
    shaoplist(){
      this.$wxAjax('orderList', {
        userToken: this.$getStorage('token'),
      }).then((data) => {
        if (data.status == 0) {
                   
        } else {
          this.$toast(data.message);
        }
      })
    },
    apply(){
      this.imgids = '';
      for(var i = 0;i<this.imgurllist.length;i++){
        this.imgids +=this.imgurllist[i].id+','
      }
      console.log(this.imgids)
      if(!this.nickname){
        this.$toast('填写您的用户名');
        return;
      }else if(!this.mobile){
        this.$toast('填写您的手机号');
        return;
      }
      if(!this.idcard){
        this.$toast('填写您的身份证号码');
        return;
      }
      if(!this.imgids){
        this.$toast('上传资质图片');
        return;
      }
      this.$wxAjax('apply', {
        userToken: this.$getStorage('token'),
        nickname:this.nickname,	
        mobile:this.mobile,		
        idcard:this.idcard,		
        pic:this.imgids,	
      }).then((data) => {
        let _this = this
        if (data.status == 0) {
          wx.showModal({
            title: '温馨提示',
            content: '申请成功等待审核',
            showCancel:false,
            success (res) {
              _this.$back();
            }
          })
        } else {
          _this.$toast(data.message);
        }
      })
    },
    bindChooiceProduct: function (index) {   
      var that = this;        
      wx.chooseImage({  
        count: 1,  //最多可以选择的图片总数  
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
        success: function (res) {  
          var tempFilePaths = res.tempFilePaths;
          wx.showLoading({
            title: '加载中',
          })
          wx.uploadFile({
            url: 'https://jiazhuang.ccpingtai.cn/api/v1/upload', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[0],
            header: {
            'content-type': 'multipart/form-data'
              },
            name:'imgFile',
            formData:{
              'module': 'api',
              'type': 'image',
              'path':'Evaluates',
            },
            success: function(res){
              that.imgxinxi = JSON.parse(res.data)
              that.imgurllist.push({'url':that.imgxinxi.data.attach_uri,'id':that.imgxinxi.data.id});                
              setTimeout(function () {
                wx.hideLoading()
              }, 500)
            }
          })
        }  
      });  
    },
  },

}
</script>

<style scoped>
.counter-warp{
  background:#f0eff5;
  height:100vh;
}
.top{padding:10px 20px;color:#2c3e50;font-size:16px;background:#fff}
.price{font-size:32px;font-weight:600}
.allprice{
  line-height:30px;
  display:flex;
  justify-content: space-between;
}
.btn{width:90%;line-height:40px;height:40px;background:red;color:#fff;margin:20px 5% 0; border-radius:8px;font-size:14px;border:none}

.imglist{
   padding-bottom:10px 
}
.img{
  display:flex;
   flex-wrap:wrap 
}
.imglist img{
width:80px;
height:80px;
margin:0.2rem 0.1rem 0;
display:block

}
</style>
