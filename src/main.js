// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/base.css';
import Vue from 'vue';
import router from './router';
import ElementUI from 'element-ui';
import qs from 'qs';
import App from './App';
import Promise from 'es6-promise'
Promise.polyfill()//兼容ie
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import axios from 'axios';
axios.defaults.baseURL = process.env.API_ROOT;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.interceptors.request.use(function (config) {
  if(config.method==='post'){
    config.data=qs.stringify(config.data)
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
Vue.prototype.$http=axios;


Vue.use(ElementUI);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
