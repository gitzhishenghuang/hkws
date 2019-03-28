<template>
  <div>
    <el-container>
      <el-header>
        <VHeader></VHeader>
      </el-header>
      <el-container style="margin-top: 5px;">
        <el-aside width="230px" style="border-right: 1px solid #ccc">
          <div class="toggleList">
            <ul>
              <li @click="addClass(index)" :class="{now:now===index}" v-for="(item,index) in liList">{{item}}</li>
            </ul>
          </div>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>


  </div>
</template>

<script type='es6'>
  import VHeader from '@/components/header';
  import Storage from '@/mode/storage'
  export default {
    name: 'report',
    mounted(){
      this.$router.push('/admin/report/RenewalOfApproval')
      //this.$router.push('/admin/report/FolderReport')
      /*if(this.$route.path=='/admin/report/RenewalOfApproval'){
        this.now=1
      }*/
    },
    data(){
      return {
        liList:['续期审批'],
        now:0,
      }
    },
    components:{
      VHeader,
    },
    methods:{
      addClass(that){
        this.$router.push('/admin/report/RenewalOfApproval')
        return
        this.now=that;
        if(that==0){
          this.isPastDue=false
          this.$router.push('/admin/report/FolderReport')
        }else{
          this.isPastDue=true
          this.$router.push('/admin/report/RenewalOfApproval')
        }
      },
    }
  }

</script>

<style  lang="scss" scoped>
  .el-container{
    height: 100%;
    /*height: calc(100% - 69px);*/
    box-sizing: border-box;

  }
  .progress{
    padding: 10px 25px;
  }
  .progress .fr{
    margin-top: 10px;
  }
  .toggleList li{
    height: 40px;
    line-height: 40px;
    background: #fff;
    padding:0 20px ;
  }
  .toggleList li:hover{
    cursor: pointer;
  }
  .toggleList li.now{
    background: #350F05;
    color: #fff;
  }
  .dirName{
    width:352px;
    padding:7px;
    margin-right:20px;
    border: 1px solid #dcdfe6;
    outline:none;
  }
  .addDir{
    color:#840A0B;
  }
  .addDir i{
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url("../../assets/img/plus.png") no-repeat;
    vertical-align: middle;
  }
  .userTable{
    table-layout: fixed;
    width: 100%;
    margin-bottom: 10px;
  }
  .userTable thead td{
    background: #350F05;
    color: #fff;
    position: relative;
  }
  .userTable thead td i{
    position: absolute;
    height: 10px;
    top:15px;
    left: 10px;
    border-left: 1px solid #665C66;
  }
  .userTable td{
    height: 30px;
    line-height: 30px;
    padding: 5px 20px;
    background: #fff;
  }
  .userTable tbody td{
    border-top: #F2F2F3;
  }

  /*续期申请 、查看*/
  .renewalDiv{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(105,105,105,.6);
    .box{
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%,-50%);
      background: #fff;
      border-top: 2px solid #840A0B;
      width: 500px;
      .header{
        height: 30px;
        line-height: 30px;
        padding: 5px 20px;
        border-bottom: 1px solid #f4f4f5;
      }
      .tabs input{
        border: 1px solid #dcdfe6;
        padding: 7px;
        outline: none;
        box-sizing: border-box;
        width: 270px;
      }

      .tabs textarea{
        display: block;
        resize: none;
        border: 1px solid #dcdfe6;
        padding: 7px;
        outline: none;
        box-sizing: border-box;
        width: 270px;
      }
      .footer{
        text-align: center;
        padding: 30px 0;
      }
      .close{
        line-height: 30px;
        font-size: 20px;
        color: #7E7E7E;
      }
      .close:hover{
        cursor: pointer;
      }
      .text-right{
        text-align: right;
        padding-right: 15px;
      }
    }
  }

</style>


<style>
  .el-progress.is-exception .el-progress-bar__inner{
    background: #840A0B;
  }
  .el-main{
    padding: 20px 40px;
    background: #F0F1F5;
  }
  .el-header{
    padding: 0;
    height: 64px !important;
  }
  .el-input__inner{
    border-radius:0;
    height: 32px;
    line-height: 32px;
  }
  .el-input__icon{
    height: 32px;
    line-height: 32px;
  }
  .el-select .el-input.is-focus .el-input__inner{
    border-color:  #dcdfe6;
  }
  .el-select .el-input__inner:focus{
    border-color:  #dcdfe6;
  }
  .el-select-dropdown__empty{
    font-size: 12px;
  }
  .el-input{
    font-size: 13.333px;
  }
  .el-date-editor .el-range-separator{
    line-height: 25px;
  }
  .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
    width: 280px;
    margin-right:20px;
  }
  .el-button{
    background: #840A0B;
    color: #fff;
    font-size: 12px;
    line-height: 5px;
  }
  .el-button:focus, .el-button:hover{
    color: #fff;
    border-color: #dcdfe6;
    background-color: #840A0B;
  }
  .el-pagination{
    padding: 0;
  }
</style>

