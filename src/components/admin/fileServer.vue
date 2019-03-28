<template>
  <div v-loading="loading">
    <el-container>
      <el-header>
        <VHeader></VHeader>
      </el-header>
      <el-container style="margin-top: 5px;">
        <el-aside width="230px" style="border-right: 1px solid #ccc">
          <!--<div class="toggleList">-->
            <!--<ul>-->
              <!--<li @click="addClass(index)" :class="{now:now===index}" v-for="(item,index) in liList">{{item}}</li>-->
            <!--</ul>-->
          <!--</div>-->
        </el-aside>
        <el-main>
          <div style="margin-bottom: 10px;">
            文件服务器名称　<input class="dirName" @keydown.enter="searchList" type="text" v-model.trim="KeyWord" placeholder="请输入文件夹名称">
            <el-button style="margin-left: 32px" @click="searchList">搜索</el-button>
          </div>
          <div >
            <div style="margin-bottom: 5px;">
              <a @click="addServer" class="addDir" href="javascript:void (0);">
                <i></i>新建文件服务器
              </a>
            </div>
            <div class="clearFloat">
              <table class="userTable">
                <thead>
                <tr>
                  <td width="43%">文件服务器名称</td>
                  <td width="43%"><i></i> 文件服务器路径</td>
                  <td width="14%"><i></i> 操作</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in serverTableList">
                  <td>{{item.Name||'-'}}</td>
                  <td>{{item.Path||'-'}}</td>
                  <td>
                    <a href="javascript:void(0)" @click="editServer(item.ID,item.Name,item.Path,item.Space)">编辑</a>
                    <a href="javascript:void(0)" @click="delServer(item.ID,index)">| 删除</a>
                  </td>
                </tr>
                </tbody>
              </table>
              <div class="fr">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="currentPage"
                  :page-size="10"
                  layout="total, prev, pager, next"
                  :total="total">
                </el-pagination>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <!--新建文件服务器-->
    <div v-show="isShowNewServer" class="newServerDiv">
      <div class="box">
        <div class="header">
          <i class="el-icon-close fr close" @click="newServerCancel"></i>
          新建文件服务器
        </div>
        <div class="tabs" style="padding: 10px 30px;line-height: 32px;margin-top: 10px;padding-bottom: 50px">
          <el-row>
            <el-col :span="7" class="text-right">文件服务器名称</el-col>
            <el-col :span="17">
              <input type="text" v-model.trim="serverName" :readonly="isReadOnly">
            </el-col>
          </el-row>
          <el-row style="margin:5px 0">
            <el-col :span="7" class="text-right">文件服务器路径</el-col>
            <el-col :span="17">
              <input type="text" v-model.trim="serverPath" :readonly="isReadOnly">
            </el-col>
          </el-row>
          <el-row style="margin:5px 0">
            <el-col :span="7" class="text-right">文件服务器本地路径</el-col>
            <el-col :span="17">
              <input type="text" v-model.trim="serverLocalPath" :readonly="isReadOnly">
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7" class="text-right">文件服务器空间大小</el-col>
            <el-col :span="17">
              <input type="number" width="135px" v-model="serverSpace" @keydown="handleInput">GB
            </el-col>
          </el-row>
        </div>
        <div class="footer">
          <el-button style="margin-left: 32px" @click="saveServer">确定</el-button>
          <el-button style="margin-left: 32px" @click="newServerCancel">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type='es6'>
  import VHeader from '@/components/header';
  import Storage from '@/mode/storage'
  export default {
    name: 'fileServer',
    data(){
      return {
        loading:false,
        isShowNewServer:false,
        isReadOnly:false,
        serverTableList:[],

        //新增文件服务器管理
        serverName:'',
        serverPath:'',
        serverSpace:'',
        serverLocalPath:"",

        //查询
        KeyWord:'',
        total:0,
        currentPage:1,
      }
    },
    components:{
      VHeader,
    },
    mounted(){
      this.searchList();
    },
    methods:{
      addClass(that){
        this.now=that;
        if(that==0){
          this.isPastDue=false
        }else{
          this.isPastDue=true
        }
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.searchList();
      },
      addServer(){
        this.serverName='';
        this.serverPath='';
        this.serverLocalPath="";
        this.serverSpace='';
        this.isShowNewServer=true;
        this.isReadOnly=false;
      },
      newServerCancel(){
        this.isShowNewServer=false
      },


      handleInput(e){
        if(e.key!=='Backspace'){
          let a = e.key.replace(/[^\d]/g, "");
          if (!a) {
            e.preventDefault();
          }
        }
      },
      //新增服务器
      saveServer(){
        if(this.serverPath==''||this.serverName==''||this.serverSpace==''||this.serverLocalPath==''){
          this.$message({
            message:'输入框必填',
            type:'warning'
          });
          return
        }
        this.loading=true;
        this.$http.post('',{
          strCurrentTime:Storage.get('LoginInfo').key,
          Name:this.serverName,
          Path:this.serverPath,
          LocalPath:this.serverLocalPath,
          Space:this.serverSpace,
          LoginUser:Storage.get('LoginInfo').Account,
          opr:'AddFolderServer'
        }).then(res=>{
          this.loading=false;
          var json=res.data;
          Storage.setKey(json.key)
          if (json.result.toLowerCase() == 'false') {
            if (json.errmsg == '超时') {
              this.$alert('key超时','超时', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$router.push('/login')
                }
              });
              return false;
            } else if (json.errmsg) {
              this.$message.warning(json.errmsg)
              return false;
            } else {
              this.$message.warning('数据异常')
              return false;
            }
          } else {
            this.searchList();
            this.isShowNewServer=false
          }

        }).catch(err=>{
          this.$message.error('数据错误');
        })
      },

      //搜索
      searchList(){
        this.loading=true;
        this.$http.post('',{
          strCurrentTime:Storage.get('LoginInfo').key,
          KeyWord:this.KeyWord,
          PageIndex:this.currentPage,
          PageSize:10,
          LoginUser:Storage.get('LoginInfo').Account,
          opr:'QueryFolderServer'
        }).then(res=>{
          this.loading=false;
          var json=res.data;
          Storage.setKey(json.key)
          if (json.result.toLowerCase() == 'false') {
            if (json.errmsg == '超时') {
              this.$alert('key超时','超时', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$router.push('/login')
                }
              });
              return false;
            } else if (json.errmsg) {
              this.$message.warning(json.errmsg)
              return false;
            } else {
              this.$message.warning('数据异常')
              return false;
            }
          } else {
            this.serverTableList=json.data;
            this.total=Number(json.recordCount);
          }
        }).catch(err=>{
          this.$message.error('数据错误');
        })
      },

      //编辑
      editServer(id,...data){
        this.serverName=data[0];
        this.serverPath=data[1];
        this.serverSpace=data[2];
        this.isReadOnly=true;
        this.isShowNewServer=true;
      },

      //删除
      delServer(id,index){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('',{
            strCurrentTime:Storage.get('LoginInfo').key,
            FoldeServerID:id,
            LoginUser:Storage.get('LoginInfo').Account,
            opr:'DeleteFolderServer'
          }).then(res=>{
            var json=res.data;
            Storage.setKey(json.key)
            if (json.result.toLowerCase() == 'false') {
              if (json.errmsg == '超时') {
                this.$alert('key超时','超时', {
                  confirmButtonText: '确定',
                  callback: action => {
                    this.$router.push('/login')
                  }
                });
                return false;
              } else if (json.errmsg) {
                this.$message.warning(json.errmsg)
                return false;
              } else {
                this.$message.warning('数据异常')
                return false;
              }
            } else {
              this.serverTableList.splice(index,1);
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(err=>{
            this.$message.error('数据错误');
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      }
    }
  }

</script>

<style  lang="scss" scoped>
  .el-container{
    height: 100%;
    /*height: calc(100% - 69px);*/
    box-sizing: border-box;

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
    border-top: 1px solid #F2F2F3;
  }

  .newServerDiv{
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
  .el-main{
    padding: 20px 40px;
    background: #F0F1F5;
  }
  .el-header{
    padding: 0;
    height: 64px !important;
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
</style>
