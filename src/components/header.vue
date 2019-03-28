<template>
    <div class="header">
      <div class="fl">
        <img src="../assets/img/logo.png" alt=""/>
      </div>
      <ul class="fl" v-if="userType==1">
        <li>
          <router-link to="/user">文件夹管理</router-link>
          <i class="el-icon-caret-top" v-if="'/user'==active"></i>
        </li>
      </ul>
      <ul class="fl" v-if="userType==0">
        <li>
          <router-link to="/admin/dirAdmin">文件夹管理</router-link>
          <i class="el-icon-caret-top" v-if="'/admin/dirAdmin'==active"></i>
        </li>
        <li>
          <router-link to="/admin/fileServer">文件服务器管理</router-link>
          <i class="el-icon-caret-top" v-if="'/admin/fileServer'==active"></i>
        </li>
        <li>
          <router-link to="/admin/report">报表</router-link>
          <i class="el-icon-caret-top" v-if="'/admin/report/RenewalOfApproval'==active||'/admin/report/FolderReport'==active||'/admin/report'==active"></i>
        </li>
        <li>
          <router-link to="/admin/authorization">授权设置</router-link>
          <i class="el-icon-caret-top" v-if="'/admin/authorization'==active"></i>
        </li>
        <li>
          <router-link to="/admin/commitLog">操作日志</router-link>
          <i class="el-icon-caret-top" v-if="'/admin/commitLog'==active"></i>
        </li>
      </ul>
      <div class="user fr">
          <div class="username fn-right">
            用户名：<a href="javascript:void(0);" >{{user}}</a>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <div class="quit">
            <a href="javascript:void(0)" @click="dropOut">退出</a>
          </div>
      </div>
    </div>
</template>

<script type='es6'>
  import Storage from '@/mode/storage'
export default {
  data(){
    return {
      active:'',
      user:'',
      userType:''
    }
  },
  beforeCreate(){
  },
  mounted(){
    var data=Storage.get('LoginInfo');
    if(data==null){
      this.$router.push('/login');
    }
    this.userType=data.UserType;
    if(data.UserType==1){
      if(this.$route.path.indexOf('admin')!=-1){
        Storage.remove();
        this.$router.push('/login');
      }
    }
    if(data.UserType==0){

      if(this.$route.path.indexOf('user')!=-1){
        Storage.remove();
        this.$router.push('/login');
      }
    }
    this.user=data.username;
    this.active=this.$route.path;
  },
  methods:{
    dropOut(){
      Storage.remove('LoginInfo');
      this.$router.push('/login');
    }
  }
}
</script>

<style lang="scss" scoped>
  .header{
    height: 64px;
    line-height: 64px;
    background: #350F05;
    padding: 0 20px ;
    ul{
      margin-left:240px;
      li{
        position: relative;
        float: left;
        margin-left:40px;
        a{
          color: #fff;
        }
      }
    }
  }
  .username{
    color: #FFF;
    a{
      color: #fff;
    }
  }
  .user{
    position: relative;
  }
  .quit{
    position: absolute;
    width: 100%;
    z-index: 100;
    display: none;
    height: 40px;
    line-height: 40px;
    background: #350F05;
    text-align:center;
    a{
      color: #fff;
    }
  }
  .user:hover .quit{
    display: block;
  }
</style>
<style>
  .el-icon-caret-top{
    position: absolute;
    left: 50%;
    bottom: -10px;
    color: #fff;
    font-size: 30px;
    transform: translateX(-50%);
  }
  .el-icon-caret-bottom{
    color: #fff;
    font-size: 12px;
  }
</style>
