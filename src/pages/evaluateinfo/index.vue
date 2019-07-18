<template>
  <div class="counter-warp">
    <div v-for='(list,index) in goods_list' :key='index'>
      <div class='top'>
        <img :src='list.image_uri'>
        <div class='right'>
          <p>{{list.goods_name}}</p>
          <van-rate :value="list.index" @click="onChange(index,list.index)"  @change="e=>list.index = e.mp.detail" />
        </div>
      </div>
      <div class='cont'>
        <van-cell-group>
          <van-field
            :value="list.message"
            @change="e=>list.message = e.mp.detail"
            type="text"
            placeholder="商品满足你的期待吗？说说它的美中不足的地方吧"
            border="false"
          />
        </van-cell-group>
        <div class='imglist'>
          <p @click='bindChooiceProduct(index)'><img src='/static/images/cirman.png'></p>
          <ul class='img'>
            <li v-for='(imglist,i) in list.img' :key='i'><img :src='imglist.url'></li>
          </ul>
        </div>
      </div>
    </div>
    <!--<div class='list'>
      <van-checkbox
      :value="checkedflg"
      checked-color="#f53d11"
      @change="onChangechecked"
      >
      匿名
      </van-checkbox>
      <p style='color:#929292'>你写的评价将以匿名的形式展现</p>
    </div>-->
    <div class='btn' @click="tijiaopinglun()" >提交评论</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value:[],
      message:'',
      checkedflg:false,
      shaopInfo:[],
      imgurllist:[],
      imgxinxi:[],
      imgids:'',
      evaluateinfo:[],
      goods_list:[],
      pingluncontent:[]
    }
  },
  methods: {
    // 商品列表
    onChange(event,index) {
      this.goods_list[event].index = index
    },
    onChangechecked(){
      this.checkedflg=!this.checkedflg
    },
    // 商品详情
    shaop(){
      this.goods_list = []
      this.$wxAjax('payOrder', {
        userToken: this.$getStorage('token'),
        id:this.$mp.query.id
      }).then((data) => {
        if (data.status == 0) {
          this.shaopInfo = data.data;
          this.goods_list = data.data.goods_list;
          for(var i = 0;i<this.goods_list.length;i++){
            this.goods_list[i].index = 5
            this.goods_list[i].message = '';
            this.goods_list[i].img=[];
            this.goods_list[i].id = '';
          }
        } else {
          this.$toast(data.message);
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
          var tempFilePaths = res.tempFilePaths
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
                that.goods_list[index].img.push({'url':that.imgxinxi.data.attach_uri});
                if(that.imgxinxi.data.id){
                  that.goods_list[index].id +=that.imgxinxi.data.id+','
                }else{
                  that.goods_list[index].id =''
                }
                
                setTimeout(function () {
                  wx.hideLoading()
                }, 500)
              }
            })
        }  
      });  
    },
    tijiaopinglun(){
      console.log(this.goods_list)
      for(var n = 0;n<this.goods_list.length;n++){
        this.pingluncontent[n] = {"index":this.goods_list[n].index,"content":this.goods_list[n].message||'',pics:this.goods_list[n].id||'',goods_id:this.goods_list[n].goods_id}
      }
      this.$wxAjax('evaluates', {
        userToken: this.$getStorage('token'),
        evaluates:this.pingluncontent,
        order_id:this.$mp.query.id,
        level:''
      }).then((data) => {
        if (data.status == 0) {
          let _this = this
          wx.showModal({
            title: '温馨提示',
            content: '评价成功，可在我的评价中查看',
            showCancel:false,
            success(res) {
              if (res.confirm) {
                _this.value=5;
                _this.message='';
                _this.checkedflg=false;
                _this.shaopInfo=[];
                _this.imgurllist=[];
                _this.imgxinxi=[];
                _this.imgids=[];
                _this.$back();
              }
            }
          })
        } else {
          this.$toast(data.message);
        }
      })
    },
  },
  mounted: function () {   
    this.shaop();
         
  },
}
</script>

<style scoped>
.counter-warp{
  min-height:100vh;
  background:#f8f8f8
}
.top{display:flex;padding:10px 15px}
.top img{
  width:90px;
  height:90px
}
.cont{background:#fff}
.top .right{
  width:5rem;
  margin-left:0.2rem;
  
  font-size:16px;
}
.right p{
  margin-bottom:0.2rem
}
.imglist{
   padding-bottom:10px 
}
.imglist img{
width:80px;
height:80px;
margin:0.2rem 0.1rem 0;
display:block

}
.img{
  display:flex;
   flex-wrap:wrap 
}
.list{background:#fff;padding:10px 15px;border-top:1px solid #f1f1f1;font-size:14px; display:flex; justify-content:space-between}
.btn{width:80%;line-height:40px;height:40px;background:red;color:#fff;margin:20px 10% 0; border-radius:8px; font-size:14px;text-align:center}
</style>
