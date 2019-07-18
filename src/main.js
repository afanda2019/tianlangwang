import Vue from 'vue'
import App from './App'
// 
import { go, back, wxAjax, showLoading, toast, closeLoading, setStorage, getStorage, rmStorage} from './utils'
import { SUCCESS_CODE } from './utils/config'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue(App)
// fastclick.attach(document.body)
Vue.prototype.$go = go
Vue.prototype.$back = back
Vue.prototype.$toast = toast
Vue.prototype.$showLoading = showLoading
Vue.prototype.$closeLoading = closeLoading
Vue.prototype.$setStorage = setStorage
Vue.prototype.$getStorage = getStorage
Vue.prototype.$rmStorage = rmStorage
Vue.prototype.$wxAjax = wxAjax
Vue.prototype.SUCCESS_CODE = SUCCESS_CODE
Vue.prototype.$_event = new Vue()

Vue.prototype.$_event = new Vue()
Vue.directive('auto-height', {
    inserted: el => el.style.height = el.offsetWidth + 'px',
    update: el => el.style.height = el.offsetWidth + 'px'
})


// Vue.prototype.$token = () => {
//     return wx.getStorageSync('token');
// }
app.$mount()
