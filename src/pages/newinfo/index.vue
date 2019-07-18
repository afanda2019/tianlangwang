<template>
  <div class="counter-warp">
  <!--轮播图地址 和搜索-->
      <img v-if='content.pic' style='width:100%;' class='logo' :src='content.pic'>
      <div class='cont' v-html='content.content'></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      content: '',
    }
  },
  onLoad() {
      this.contents();
  },
  methods: {
    // 	关于平台
    contents(){
      this.$wxAjax('contents', {
        userToken:this.$getStorage('token'),
        id:this.$mp.query.id
      }).then((data) => {
        if (data.status == 0) {
          this.content = data.data
          
        } else {
          this.$toast(data.message);
        }
      })
    },
  }
}
</script>

<style scoped>
  .counter-warp{
    padding:0 15px
  }
  
  .cont{
    width:90%;
    font-size:14px;
    line-height:25px;
    }
</style>
