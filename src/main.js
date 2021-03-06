// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/base.css';
import Vue from 'vue';
import router from './router';
import ElementUI from 'element-ui';
import CryptoJS from 'crypto-js/crypto-js'
//import qs from 'qs';
import App from './App';
import Promise from 'es6-promise'
Promise.polyfill()//兼容ie
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
import JSEncrypt from 'jsencrypt'
Vue.prototype.$enRSA=function(str){
  let encrypt=new JSEncrypt();
  encrypt.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD1qk8m7ftHMQlG0DbiYt6BNJGBvs3roN/LiirsT+oIWnk2oObuMBKRn9CLHttVNnI708vLb/5jkuParxwkhHzLrTEJ1fppwkiSCU24gLTfbP2Ozed8lK8+5JafuUA51uq8V21bK8GGsXwER923961W8C73G48+RZNV9ihuXIBlWwIDAQAB');
  let data=encrypt.encryptLong(str);
  return data
}
Vue.prototype.$deRSA=function(str){
  let encrypt=new JSEncrypt();  
  encrypt.setPrivateKey('MIICXAIBAAKBgQDTNGrHRwi0gsuKa7aQ+STCwUxRUbGi2caEa8DyUOCLJ4WWE8YylRCFZsdQv5nMLlCElaV/2WK70yxiFXbT/acoWwKrXewXyetUUcRNEA2Vsvq/1uzQaJfWOaoTR+VNK+O+txmJZ/7IEE96vp/Qu4moFOoN9wvztiejz7Z+X/4mqwIDAQABAoGACRWxHh9FFZamsK6PbM76sNHluX29GVcqvdlwtDucXP/3NAxnsxdMXaCdJDEJqYm4duuE8enk4FVmDFYGBXpcrUCq4v07z9jX7YuXj1tO5wwdTcnTsqnNpWOgcgzQr1vjFanRrb3qXSAh/f03AmQOOTl2KoHhovByGUnuQl69l/ECQQD2vXBdBZaMGMKNQFpg7XV0ynpfEcZPGD2ajFwNOj/Z8+LtrJV0dhthx34MV68lf8N6McfmypsVsazzFPX/AEFzAkEA2yGSiSMRwVbZAhOeJlasAGd+fIigzXXcnX8YjmvUsSioNtLLH2L70zVtd299HnlLV3u0ZWyW02cvneuy+EnX6QJBAN2JrAipismRNaWTwVJEAvDxF7yiffboYe+Q1Nm/kjMEap1SFwLxRJafgspcNFMsCvx9E+phwatR02KSUGk79ocCQEJKa7wU4eAtV8TrDmLmwW314SvnYU4Go9D5jAI52MQnWowLROuf1DLW7OC+14kKhKJYiABO02nsw1jw3tmB7VECQAwKLRnPme2Ay8lG/AnjZYBXdoP7u2UiYYoR4pfQzdzUEgMCHJiGNUSN0dbGQidgnjxv38wwZQ1TFEVjbw4WmpQ=');
  let data=encrypt.decryptLong(str);
  return data
}
Vue.prototype.randomStr=function () {
  var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz",
    a = t.length,
    n = "";
  for (var i = 0; i < 5; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n
};
Vue.prototype.randomStrAES=function () {
  var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz",
    a = t.length,
    n = "";
  for (var i = 0; i < 16; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n
};
//AES加密
Vue.prototype.Encrypt=function(word, key, iv) {
  var encrypted = CryptoJS.AES.encrypt(word, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  return encrypted.toString();
}
import axios from 'axios';
axios.defaults.baseURL = process.env.API_ROOT;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.interceptors.request.use(function (config) {
  if(config.method==='post'){
    //console.log(JSON.stringify(config.data))
    //console.log(JSON.stringify(config.Editor))
    //console.log(JSON.stringify(config.Reader))
    //console.log(Vue.prototype.$enRSA(JSON.stringify(config.data)))
    //console.log(Vue.prototype.$enRSA(JSON.stringify(config.Editor)))
    //console.log(Vue.prototype.$enRSA(JSON.stringify(config.Reader)))
    //console.log('object='+JSON.stringify(config.data)+'&Editor='+JSON.stringify(config.Editor)+'&Reader='+JSON.stringify(config.Reader))

    var key=Vue.prototype.randomStrAES(),
      iv=Vue.prototype.randomStrAES(),
      Editor='',
      Reader='';
    var aes=encodeURIComponent(Vue.prototype.$enRSA(key+';'+iv));

    if(config.Editor){
      //console.log(window.btoa(encodeURIComponent(JSON.stringify(config.Editor))))
      //config.data='object='+encodeURIComponent(Vue.prototype.$enRSA(JSON.stringify(config.data)))
      //+'&Editor='+encodeURIComponent(Vue.prototype.$enRSA(JSON.stringify(config.Editor)))
      //+'&Reader='+encodeURIComponent(Vue.prototype.$enRSA(JSON.stringify(config.Reader)))

      Editor='&Editor='+Vue.prototype.randomStr()+window.btoa(encodeURIComponent(JSON.stringify(config.Editor)))
      Reader='&Reader='+Vue.prototype.randomStr()+window.btoa(encodeURIComponent(JSON.stringify(config.Reader)))
    }
    //console.log(JSON.stringify(config.data))
    //console.log(encodeURIComponent(Vue.prototype.Encrypt(JSON.stringify(config.data), CryptoJS.enc.Latin1.parse(key), CryptoJS.enc.Latin1.parse(iv))));
    config.data='object='+
      encodeURIComponent(Vue.prototype.Encrypt(JSON.stringify(config.data),CryptoJS.enc.Latin1.parse(key),CryptoJS.enc.Latin1.parse(iv)))
      +'&aes='+aes+Editor+Reader;
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  //console.log(response)
  //console.log(response.data)
  //console.log(Vue.prototype.$deRSA(response.data))
  let data=decodeURIComponent(Vue.prototype.$deRSA(response.data))
  //console.log(data);
  //console.log(typeof data);
  response.data=JSON.parse(data) ;
  //console.log(response)
  //console.log(response.data)
  return response;
}, function (error) {
  // 对响应错误做点什么
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
