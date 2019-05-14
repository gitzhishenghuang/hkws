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
            <input v-model.trim="queryKeyWord" class="dirName" type="text" @keydown.enter="QueryUserImpower" placeholder="名/域账号">
            <el-button style="margin-left: 32px" @click="QueryUserImpower">搜索</el-button>
          </div>
          <div>
            <div style="margin-bottom: 5px;">
              <a @click="addAuth" class="addDir" href="javascript:void (0);">
                <i></i>新增授权
              </a>
            </div>
            <div class="clearFloat">
              <table class="userTable">
                <thead>
                <tr>
                  <td width="7%">序号</td>
                  <td width="20%"><i></i> 姓名</td>
                  <td width="20%"><i></i> 域账号</td>
                  <td width="20%"><i></i> 创建时间</td>
                  <td width="20%"><i></i> 文件夹空间</td>
                  <td width="13%"><i></i> 操作</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in authTableList" :key="item.SN">
                  <td>{{item.SN||'-'}}</td>
                  <td>{{item.Name||'-'}}</td>
                  <td>{{item.Account||'-'}}</td>
                  <td>{{item.CreateTime||'-'}}</td>
                  <td>{{item.FileSpace+'GB'||'-'}}</td>
                  <td>
                    <a href="javascript:void(0)" @click="updateAuth(item.ID,item.FileServerID,item.Name,item.AccreditID)">修改</a>
                    <a href="javascript:void(0)" @click="delAuth(item.ID,index)">| 删除</a>
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
    <!--新增授权-->
    <div v-show="isShowNewAuth" class="newAuthDiv">
      <div class="box">
        <div class="header">
          <i class="el-icon-close fr close" @click="newAuthCancel"></i>
          新增授权
        </div>
        <div class="tabs" style="padding: 0 30px 10px 30px;line-height: 32px;margin-top: 10px;">
          <div style="margin-bottom: 10px;">
            <input class="dirName" @keydown.enter="searchAuthList" type="text" placeholder="名/域账号" v-model.trim="modalKeyWord">
            <el-button @click="searchAuthList">查询</el-button>
          </div>
          <div class="propFindAuthList">
            <table>
              <thead>
                <tr>
                  <td width="15%"></td>
                  <td width="35%">姓名</td>
                  <td width="35%">域账号</td>
                  <td width="15%">状态</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in findAuthList" :key="item.UPN">
                  <td><input type="radio" name="Auth"  @click="selectRadio(item.AccreditID,item.Account,item.Name)"/></td>
                  <td>{{item.Name}}</td>
                  <td>{{item.UPN}}</td>
                  <td>{{item.State}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="footer">
          <el-button style="margin-left: 32px" :disabled="btnAble" @click="addAuthProp">添加</el-button>
          <el-button style="margin-left: 32px" @click="newAuthCancel">取消</el-button>
        </div>
      </div>
    </div>

    <!--添加-->
    <div v-show="isShowAdd" class="addAuthDiv">
      <div class="box">
        <div class="tabs" style="padding: 10px 20px;line-height: 32px;margin-top: 10px">
          <el-row>
            <el-col :span="7" class="text-right" >授权编号</el-col>
            <el-col :span="17">
              <input type="text" v-model="AuthId" readOnly>
            </el-col>
          </el-row>
          <el-row style="margin:5px 0">
            <el-col :span="7" class="text-right" >姓名</el-col>
            <el-col :span="17">
              <input type="text" v-model="AuthName" readOnly>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7" class="text-right">文件服务器</el-col>
            <el-col :span="17">
              <el-select v-model="serverActive" :disabled="serverDisable" style="width: 150px">
                <el-option
                  v-for="item in serverList"
                  :key="item.ID"
                  :label="item.Name"
                  :value="item.ID">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row style="margin:5px 0">
            <el-col :span="7" class="text-right">空间大小</el-col>
            <el-col :span="17">
              <el-select v-model="spaceSize" style="width: 150px">
                <el-option
                  v-for="item in spaceSizeList"
                  :key="item.Space"
                  :label="item.SpaceName"
                  :value="item.Space">
                </el-option>
              </el-select>　
            </el-col>
          </el-row>
        </div>
        <div class="footer">
          <el-button :disabled="isAdd" @click="addAuthSave">确定</el-button>
          <el-button style="margin-left: 32px" @click="addAuthDivCancel">关闭</el-button>
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
    watch:{
      serverActive(){
        this.isAdd=false
      }
    },
    mounted(){
      //获取授权服务器
      this.$http.post('',{
        strCurrentTime:Storage.get('LoginInfo').key,
        LoginUser:Storage.get('LoginInfo').Account,
        opr:'GetFolderServer'
      }).then(res=>{
        var json=res.data;
        //Storage.setKey(json.key)
        if (json.result.toLowerCase() == 'false') {
          if (json.errmsg == '超时'||json.errmsg == '验证失败请求非法') {
                this.$alert('与服务器断开连接',json.errmsg, {
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
          this.serverList=json.data;
          this.serverActive=json.data.length?json.data[0].ID:''
        }
      }).catch(err=>{
        this.$message.error('数据错误');
      });
      //获取文件夹空间
      this.$http.post('',{
        strCurrentTime:Storage.get('LoginInfo').key,
        LoginUser:Storage.get('LoginInfo').Account,
        opr:'GetSpaceList'
      }).then(res=>{
        var json=res.data;
        //Storage.setKey(json.key)
        if (json.result.toLowerCase() == 'false') {
          if (json.errmsg == '超时'||json.errmsg == '验证失败请求非法') {
                this.$alert('与服务器断开连接',json.errmsg, {
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
          this.spaceSizeList=json.data;
          this.spaceSize=json.data.length?json.data[0].Space:''
        }
      }).catch(err=>{
        this.$message.error('数据错误');
      });
      this.QueryUserImpower()
    },
    data(){
      return {
        saveOrUpdate:1,
        listItemID:'',
        queryKeyWord:'',
        btnAble:true,
        loading:false,
        isShowAdd:false,
        isShowNewAuth:false,
        currentPage:1,
        total:0,
        authTableList:[
        ],

        //新增授权
        findAuthList:[
        ],
        AuthId:'',
        AuthAccount:'',
        AuthName:'',
        spaceSize:100,
        serverDisable:false,
        serverActive:'',
        spaceSizeList:[
          {
            value: 100,
            label: '100GB'
          },
          {
            value: 300,
            label: '300GB'
          },
          {
            value: 500,
            label: '500GB'
          },
        ],
        modalKeyWord:'',
        isAdd:true,


        //服务器列表
        serverList:[],

      }
    },
    components:{
      VHeader,
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
        this.QueryUserImpower()
      },
      addAuth(){
        this.isShowNewAuth=true
        this.findAuthList=[]
        this.modalKeyWord=''
      },
      newAuthCancel(){
        this.isShowNewAuth=false
      },

    //  新增授权
      selectRadio(id,account,name){
        this.AuthId=id
        this.AuthAccount=account
        this.btnAble=false
        this.AuthName=name
      },
      addAuthProp(){
        this.isShowAdd=true
        this.serverDisable=false
        this.saveOrUpdate=1
      },
      addAuthDivCancel(){
        this.isShowAdd=false
      },
      //新增授权保存
      addAuthSave(){
        if(this.saveOrUpdate===1){
          this.$http.post('',{
            strCurrentTime:Storage.get('LoginInfo').key,
            Name:this.AuthName,
            Account:this.AuthAccount,
            FileSpace:this.spaceSize,
            AccreditID:this.AuthId,
            FileServerID:this.serverActive,
            LoginUser:Storage.get('LoginInfo').Account,
            opr:'AddUserImpower'
          }).then(res=>{
            var json=res.data;
            
            if (json.result.toLowerCase() == 'false') {
              if (json.errmsg == '超时'||json.errmsg == '验证失败请求非法') {
                this.$alert('与服务器断开连接',json.errmsg, {
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
              Storage.setKey(json.key)
              this.QueryUserImpower()
              this.isShowAdd=false
              this.isShowNewAuth=false
            }
          }).catch(err=>{
            this.$message.error('数据错误');
          })
        }else{
          this.$http.post('',{
            strCurrentTime:Storage.get('LoginInfo').key,
            ID:this.listItemID,
            FileSpace:this.spaceSize,
            FileServerID:this.serverActive,
            LoginUser:Storage.get('LoginInfo').Account,
            opr:'UpdateUserImpower'
          }).then(res=>{
            var json=res.data;
            if (json.result.toLowerCase() == 'false') {
              if (json.errmsg == '超时'||json.errmsg == '验证失败请求非法') {
                this.$alert('与服务器断开连接',json.errmsg, {
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
              Storage.setKey(json.key)
              this.QueryUserImpower()
              this.isShowAdd=false
            }
          }).catch(err=>{
            this.$message.error('数据错误');
          })
        }

      },
      //查询
      searchAuthList(){
        if(this.modalKeyWord==''){
          this.$message.warning('输入框必填')
          return false;
        }
        this.findAuthList=[];
        this.loading=true;
        this.$http.post('',{
          strCurrentTime:Storage.get('LoginInfo').key,
          KeyWord:this.modalKeyWord,
          LoginUser:Storage.get('LoginInfo').Account,
          opr:'SearchUserForAD'
        }).then(res=>{
          this.loading=false;
          var json=res.data;
          if (json.result.toLowerCase() == 'false') {
            if (json.errmsg == '超时'||json.errmsg == '验证失败请求非法') {
                this.$alert('与服务器断开连接',json.errmsg, {
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
            Storage.setKey(json.key)
            this.findAuthList=json.data;
            this.btnAble=true
          }
        }).catch(err=>{
          this.$message.error('数据错误');
        })
      },

      //授权列表查询
      QueryUserImpower(){
        this.loading=true;
        this.$http.post('',{
          strCurrentTime:Storage.get('LoginInfo').key,
          KeyWord:this.queryKeyWord,
          PageIndex:this.currentPage,
          PageSize:10,
          LoginUser:Storage.get('LoginInfo').Account,
          opr:'QueryUserImpower'
        }).then(res=>{
          this.loading=false;
          var json=res.data;
          if (json.result.toLowerCase() == 'false') {
            if (json.errmsg == '超时'||json.errmsg == '验证失败请求非法') {
                this.$alert('与服务器断开连接',json.errmsg, {
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
            Storage.setKey(json.key)
            this.authTableList=json.data;
            this.total=Number(json.recordCount)
          }
        }).catch(err=>{
          this.$message.error('数据错误');
        })
      },

      //修改
      updateAuth(...arg){
        console.log(arg);
        this.listItemID=arg[0]
        this.serverActive=arg[1]
        this.AuthName=arg[2]
        this.AuthId=arg[3]
        this.isShowAdd=true
        this.serverDisable=true
        this.saveOrUpdate=2
        console.log(this.serverActive);
      },

      //删除
      delAuth(id,index){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('',{
            strCurrentTime:Storage.get('LoginInfo').key,
            ID:id,
            LoginUser:Storage.get('LoginInfo').Account,
            opr:'DeleteUserImpower'
          }).then(res=>{
            var json=res.data;
            
            if (json.result.toLowerCase() == 'false') {
              if (json.errmsg == '超时'||json.errmsg == '验证失败请求非法') {
                this.$alert('与服务器断开连接',json.errmsg, {
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
              Storage.setKey(json.key)
              this.authTableList.splice(index,1)
              this.total--
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
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
    border-top:1px solid #F2F2F3;
  }

  .newAuthDiv{
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
        height: 31px;
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

  .propFindAuthList{
    height: 240px;
    overflow-y: auto;
  }
  .propFindAuthList table{
    table-layout: fixed;
    width: 100%;
  }
  .propFindAuthList table td{
    border: 1px solid #f4f4f5;
    text-align: center;
    word-break: break-all;
    line-height: 1.3;
    padding: 7px 5px;
    vertical-align: middle;
  }
  .propFindAuthList table td input{
    width: 20px !important;
  }
  .propFindAuthList table td input:hover{
    cursor: pointer;
  }
  .addAuthDiv{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(105,105,105,.6);
    z-index: 100;
    .box{
      position: absolute;
      top:50%;
      left:50%;
      transform: translate(-50%,-50%);
      background: #fff;
      border-top: 2px solid #840A0B;
      width: 300px;
      .tabs input{
        border: 1px solid #dcdfe6;
        padding: 7px;
        outline: none;
        box-sizing: border-box;
        width: 150px;
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

