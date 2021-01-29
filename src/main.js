import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'

// 设置请求地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 设置header
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('treeTable', ZkTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
