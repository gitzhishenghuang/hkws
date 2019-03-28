<template>
    <div class="bg"  v-loading="loading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <div class="login">
        <div class="inp">
          <input type="text" v-model="username" placeholder="请输入用户名" autocomplete="off"/>
          <input type="password" v-model="password" placeholder="请输入密码" @keyup.enter="login"/>
        </div>
        <div class="loginBtn">
          <button @click="login">登 录</button>
        </div>
        <div class="logoImg">
          <img src="../assets/img/logo.png" alt=""/>
        </div>
        <div id="tapBtn" class="tapBtn">
          <button :class="{now:userType==1}" @click="toggleType(1)">用户登录</button>
          <button :class="{now:userType==0}" @click="toggleType(0)">管理员登录</button>
        </div>
      </div>
      <div class="footer">
          杭州海康威视数字技术股份有限公司 版权所有 Powered by Mountor
      </div>

    </div>
</template>

<script type='es6'>
  import Storage from '@/mode/storage'
  export default {
    name: 'login',
    data(){
      return {
        username:'',
        password:'',
        userType:1,
        loading:false
      }
    },
    mounted(){
      //this.$router.push('/user');
      window.addEventListener('popstate', function () {
        window.history.pushState('forward', null, '#');
        window.history.forward(1);
      });
      window.history.pushState('forward', null, '#'); //在IE中必须得有这两行
      window.history.forward(1);
    },
    methods:{
      toggleType(val){
        this.userType=val;
      },
      login(){
        if(this.username==''||this.password==''){
          this.$message({
            message: '用户名和密码必填',
            type: 'warning'
          });
          return
        }
        this.loading=true;
        this.$http.post('',
          {
            Account: this.username,
            Pwd: this.password,
            UserType:this.userType,
            opr:'Login'
        },
          ).then(res=>{
          this.loading=false;
          if(res.data.result.toLowerCase()==='false'){
            this.$message.error(res.data.errmsg);
            return
          }
          Storage.set('LoginInfo',res.data);
          //Storage.set('userType',this.userType);
          if(this.userType==1)
            this.$router.push('/user')
          else
            this.$router.push('/admin/dirAdmin')
        }).catch(err=>{
          this.$message.error('数据错误');
          this.loading=false;
        })
      }
    }
  }

</script>

<style scoped>
  .bg{
    background: url(../assets/img/Login.png) no-repeat;
    background-size: 100% 100%;
  }
  .footer{
    position:absolute;
    bottom: 0;
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: rgba(50,50,50,.6);
    text-align: center;
    font-size: 12px;
    color: #C5C8C9;
    box-sizing: border-box;
  }
  .login{
    position: absolute;
    left: 50%;
    top:50%;
    transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -webkit-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    padding: 20px 50px 30px;
    background: #F0F7FA;
    box-shadow: 0 0 1px 1px #ddd;
    -ms-box-shadow: 0 0 1px 1px #ddd;
    -moz-box-shadow: 0 0 1px 1px #ddd;
    -webkit-box-shadow: 0 0 1px 1px #ddd;
    -o-box-shadow: 0 0 1px 1px #ddd;
    border-radius: 5px;
    box-sizing: border-box;
  }
  .inp input{
    display: block;
    width: 280px;
    height: 30px;
    padding: 10px;
    padding-left: 40px;
    box-sizing: border-box;
    box-shadow: 0 0 1px 1px #ddd;
    -ms-box-shadow: 0 0 1px 1px #ddd;
    -moz-box-shadow: 0 0 1px 1px #ddd;
    -webkit-box-shadow: 0 0 1px 1px #ddd;
    -o-box-shadow: 0 0 1px 1px #ddd;
    border: none;
    border-radius: 2px;
    margin-bottom: 5px;
  }
  .inp input:first-child{
    background: url("../assets/img/login-Sprites-.png") no-repeat 10px 4px;
  }
  .inp input:last-child{
    background: url("../assets/img/login-Sprites-.png") no-repeat 10px -26px;
  }
  .loginBtn{
    margin-top: 25px;
  }
  .loginBtn button{
    display: block;
    width: 280px;
    height: 40px;
    line-height: 40px;
    background: #1C76D0;
    border: none;
    outline: none;
    box-shadow: 1px 1px 1px 1px #ddd;
    -ms-box-shadow:1px 1px 1px 1px #ddd;
    -moz-box-shadow: 1px 1px 1px 1px #ddd;
    -webkit-box-shadow: 1px 1px 1px 1px #ddd;
    -o-box-shadow:1px 1px 1px 1px #ddd;
    border-radius: 2px;
    color: #fff;
    font-size: 14px;
  }
  .loginBtn button:hover,.tapBtn button:hover{
    cursor: pointer;
  }
  .loginBtn button:active{
    background:#196ABB;
  }
  .logoImg{
    position: absolute;
    top:-30px;
    left: 5px;
  }
  .logoImg img{
    width: 150px;
  }
  .tapBtn{
    position: absolute;
    top:-40px;
    right: 8px;
  }
  .tapBtn button{
    border: none;
    outline: none;
    font-size: 14px;
    background: #DADEDF;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    padding: 10px 20px;
    color: #9B9D9D;
  }
  .tapBtn button.now{
    background: #F0F7FA;
    padding: 11px 20px;
    color: #7D7E7E;
    box-shadow: 1px -1px 1px 1px #ddd;
    -ms-box-shadow:1px -1px 1px 1px #ddd;
    -moz-box-shadow: 1px -1px 1px 1px #ddd;
    -webkit-box-shadow: 1px -1px 1px 1px #ddd;
    -o-box-shadow:1px -1px 1px 1px #ddd;
  }
</style>
