<template>
  <div class="counter-warp">
    <van-cell-group>
      <van-field
        :value="username"
        @change="e=>username = e.mp.detail"
        label="联系人"
        placeholder="请输入用户名"
      />
      <van-field
        :value="usertel"
         @change="e=>usertel = e.mp.detail"
        type='number'
        label="联系方式"
        placeholder="请输入手机号"
      />
      <van-field
        :value="chengshi"
        label="收货地址"
        placeholder="请点击选择送货区域"
        icon="location"
        @click="onClickIcon"
        disabled
      />
      <van-field
        :value="chengshiinfo"
        
        @change="e=>chengshiinfo = e.mp.detail"
        label="  "
        placeholder="详细楼号 / 门牌号 / 楼层"
      />
    </van-cell-group>
    <div class='btn' @click="onseave()" >保存</div>
    <van-popup
      :show="popupflg"
      position="bottom"
      overlay="false"
     
    >
      <van-area :area-list="areaList"  @cancel='closemask' @confirm='addinfo'  />
    </van-popup>
    
  </div>
  
</template>

<script>
import areaList from '@/utils/area'
export default {
  data () {
    return {
      areaList,
      username:'',
      usertel:'',
      chengshi:'',
      provinceId:'',
      cityId:'',
      districtId:'',
      chengshiinfo:'',
      popupflg:false
    }
  },
  onShow: function () {   
  
      this.address();
  },
  methods: {
    onClickIcon () {
      this.popupflg = true
    },
    closemask(){
      this.popupflg = false
    },
    addinfo(val){
      this.chengshi = val.mp.detail.values[0].name+'/'+val.mp.detail.values[1].name+'/'+val.mp.detail.values[2].name;
      this.provinceId =  val.mp.detail.values[0].code
      this.cityId =  val.mp.detail.values[1].code
      this.districtId =  val.mp.detail.values[2].code
      this.closemask()
    },
    address(){
      this.$wxAjax('addresses', {
        userToken: this.$getStorage('token'),
        id:this.$mp.query.id,

      }).then((data) => {
        if (data.status == 0) {
          this.username=data.data.name;
          this.usertel=data.data.mobile;
          this.chengshi=data.data.province_h+'/'+data.data.city_h+'/'+data.data.district_h;
          this.chengshiinfo = data.data.address;
          this.provinceId = data.data.province;
          this.cityId = data.data.city;
          this.districtId = data.data.district;
        } else {
          this.$toast(data.message);
        }
      })
    },
    onseave(){
      this.$wxAjax('editAddress', {
        userToken: this.$getStorage('token'),
        name:this.username,
        mobile:this.usertel,
        province:this.provinceId,
        city:this.cityId,
        district:this.districtId,
        address:this.chengshiinfo,
        is_default:1,
        id:this.$mp.query.id

      }).then((data) => {
        if (data.status == 0) {
          this.$back()
                   
        } else {
          this.$toast(data.message);
        }
      })
    }
  },

}
</script>

<style scoped>
  .counter-warp{
    background:#f8f8f8;
    min-height:100vh
  }
  .checkedaddress{
    display:flex;
    justify-content:flex-start;
    padding:10px 14px;
    font-size:14px;
    background:#fff;
  }
   .btn{width:80%;line-height:40px;height:40px;background:red;color:#fff;margin:20px 10% 0; border-radius:8px; font-size:14px;text-align:center}
</style>
