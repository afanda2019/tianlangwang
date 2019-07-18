<template>
  <div class="counter-warp">
    <div class='address' v-for='(list,key) in address' :key="key">
      <div class='address_header'>
        <p style='padding:0 20px 0 0'>{{list.name}}</p>
        <p>{{list.mobile}}</p>
      </div>
      <p class='address_cont'>{{list.province_h}}-{{list.city_h}}-{{list.district_h}}-{{list.address}}</p>
      <div class='address_fot'>
        <van-radio :name="1" v-model='list.is_default' @click='setDefAddr(list.id,key)'>设为默认</van-radio>
        <div class='address_right'>
          <p class='edit'  @click="$go('editaddress',{id:list.id})" >
            <van-icon style='margin-top:2px;float:left' name="edit" />
            <span>编辑</span>
          </p>
          <p class='delete' @click="delAddress(list.id)">
            <van-icon style='margin-top:2px;float:left' name="delete" />
            <span>删除</span>
          </p>
        </div>
      </div>
      <img class='line' src='/static/images/line.png'>
    </div>
    <button class='btn' @click="$go('addaddress')" >新建地址</button>
    <div style='height:20px'></div>
  </div>
  
</template>

<script>

export default {
  data () {
    return {
      address:[]
    }
  },
  onShow: function () {   
    this.addresslist()
  },
  methods: {
    // 商品列表
    addresslist(){
      this.$wxAjax('addresses', {
        userToken: this.$getStorage('token'),
        column_id:1
      }).then((data) => {
        if (data.status == 0) {
          this.address = data.data
                   
        } else {
          this.$toast(data.message);
        }
      })
    },
    // 商品列表
    delAddress(id){
      this.$wxAjax('delAddress', {
        userToken: this.$getStorage('token'),
        id:id
      }).then((data) => {
        if (data.status == 0) {
          this.address = [];
          this.addresslist()
                   
        } else {
          this.$toast(data.message);
        }
      })
    },
    setDefAddr(id,index){
      this.$wxAjax('setDefAddr', {
        userToken: this.$getStorage('token'),
        id:id
      }).then((data) => {
        if (data.status == 0) {
          for(var i = 0;i<this.address.length;i++){
            this.address[i].is_default=0
          }
            this.address[index].is_default=1       
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
  .address{
    background:#fff;
    font-size:16px;
    margin-top:8px
  }
  .line{
    width:100%;
    height:2px;
    display:block;

  }
  .address_header{
    display:flex;
    padding:10px 15px;
  }
  .address_cont{
    padding:0 15px 10px;
    border-bottom:1px solid #f1f1f1;
    color:#313131;
    font-size:14px
  }
  .address_fot{
    padding:10px 15px;
    display:flex;justify-content: space-between;
    font-size:16px
  }
  .address_right{display:flex;}
  .delete{padding-left:5px}
  .btn{width:80%;line-height:40px;height:40px;background:red;color:#fff;margin:20px 10% 0; border-radius:8px}
</style>
