<template>
  <div v-loading="loading">
    <el-container>
      <el-header>
        <VHeader></VHeader>
      </el-header>
      <el-container style="margin-top: 5px;">
        <el-aside width="230px" style="border-right: 1px solid #ccc">
          <div class="toggleList">
            <ul>
              <li @click="addClass(index)" :key="item" :class="{now:now===index}" v-for="(item,index) in liList">{{item}}</li>
            </ul>
          </div>
        </el-aside>
        <el-main>
          <div v-show="isPastDue" style="font-size: 14px;color: #F81819;padding-bottom: 20px;">
            <i class="el-icon-warning"></i> 过期6个月的文件夹无法再续期
          </div>
          <div style="margin-bottom: 10px;">
            文件夹名称　<input class="dirName" type="text" placeholder="请输入文件夹名称">
            <!--文件夹大小　<el-select v-model="sizeValue" placeholder="请选择"  style="margin-right: 20px">
            <el-option
              v-for="item in options"
              :key="item.Space"
              :label="item.SpaceName"
              :value="item.Space">
            </el-option>
          </el-select>-->
            所属人　<input v-model.trim="people" class="dirName" type="text" style="width: 180px" placeholder="关键字">
          </div>
          <div style="margin-bottom: 15px;">
            文件服务器　<el-select v-model="fileServer" placeholder="请选择" style="margin-right: 20px">
            <el-option
              v-for="item in fileServerOptions"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID"
              >
            </el-option>
          </el-select>
           <!-- 创建时间　<el-date-picker
            v-model="dateValue"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            :clearable="clearable">
          </el-date-picker>-->
            <!--有效期　<el-select v-model="deadlineValue" placeholder="请选择">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>-->
            <el-button @click="GetFolderList('reset')" style="margin-left: 32px">搜索</el-button>
          </div>
          <div>
            <!--<div style="margin-bottom: 5px;">
              <a @click="addDir" class="addDir" href="javascript:void (0);">
                <i></i>新建文件夹
              </a>
            </div>-->
            <div class="clearFloat">
              <table class="userTable">
                <thead>
                <tr>
                  <td width="13%">文件夹名称</td>
                  <td width="13%"><i></i> 共享路径</td>
                  <td width="10%"><i></i> 文件夹大小</td>
                  <td width="10%"><i></i> 所属人</td>
                  <td width="15%"><i></i> 文件服务器</td>
                  <td width="15%"><i></i> 创建时间</td>
                  <td width="15%"><i></i> 修改时间</td>
                  <td width="8%"><i></i> 有效期</td>
                  <td width="15%"><i></i> 操作</td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in adminTableList" :key="item.CreateTime">
                  <td>{{item.Name||'-'}}</td>
                  <td>{{item.Path||'-'}}</td>
                  <td>{{item.Space?item.Space+'GB':''||'-'}}</td>
                  <td>{{item.UserName||'-'}}</td>
                  <td>{{item.FileServerName||'-'}}</td>
                  <td>{{item.CreateTime.replace('+',' ')||'-'}}</td>
                  <td>{{item.ModifyTime.replace('+',' ')||'-'}}</td>
                  <td>{{item.Validity||'-'}}</td>
                  <td>
                    <!--<a href="javascript:void(0)" @click="showLookOverDiv(item.ID)">查看</a>-->
                    <a href="javascript:void(0)" :class="{'gray':item.state==0}" @click="editFolder(item.ID,item.state)">编辑</a>
                    <a href="javascript:void(0)" :class="{'gray':item.state==0}" @click="DeleteFolder(item.ID,index,item.state)">| 删除</a>
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

    <!--编辑-->
    <div v-if="showEditDir">
      <editDir @editSaveFn="editSave" :optionsSize="options" :type="'admin'"  :FolderID="dirID"></editDir>
    </div>

    <!--续期申请-->
    <div class="renewalDiv" v-if="renewalDiv">
      <div class="box">
        <div class="header">
          <i class="el-icon-close fr close" @click="renewalCancel"></i>
          续期申请
        </div>
        <div class="tabs" style="padding: 10px 30px;line-height: 32px;margin-top: 10px">
          <el-row>
            <el-col :span="7" class="text-right">文件夹名称</el-col>
            <el-col :span="17">
              <input type="text">
            </el-col>
          </el-row>
          <el-row style="margin:5px 0">
            <el-col :span="7" class="text-right">文件服务器</el-col>
            <el-col :span="17">
              <input type="text">
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="7" class="text-right">到期时间</el-col>
            <el-col :span="17">
              <input type="text">
            </el-col>
          </el-row>
          <el-row style="margin:5px 0">
            <el-col :span="7" class="text-right">续期</el-col>
            <el-col :span="17">
              <el-select v-model="renewalDay" style="width: 270px">
                <el-option
                  v-for="item in renewalDayList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>　
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="7" class="text-right">说明</el-col>
            <el-col :span="17">
              <textarea cols="30" rows="8" ></textarea>
            </el-col>
          </el-row>
        </div>
        <div class="footer">
          <el-button style="margin-left: 32px">确定</el-button>
          <el-button style="margin-left: 32px" @click="renewalCancel">取消</el-button>
        </div>

      </div>
    </div>

    <!--查看-->
    <div v-if="lookOverDiv">
      <LookOver :FolderID="dirID"></LookOver>
    </div>
  </div>
</template>

<script type='es6'>
  import VHeader from '@/components/header';
  import NewDir from '@/components/newDir';
  import editDir from '@/components/editDir';
  import LookOver from '@/components/lookOver';
  import Storage from '@/mode/storage'
  export default {
    name: 'dirAdmin',
    mounted(){
      /*var date=new Date();
      var yy=date.getFullYear(),
        MM=date.getMonth()+1,
        dd=date.getDate()
      this.dateValue=[yy+'-'+MM+'-'+dd+' 00:00:00',yy+'-'+MM+'-'+dd+' 23:59:59'];*/
      this.$http.all([this.$http.post('',{
        strCurrentTime:Storage.get('LoginInfo').key,
        LoginUser:Storage.get('LoginInfo').Account,
        opr:'FileServerList'
      }),this.$http.post('',{
        strCurrentTime:Storage.get('LoginInfo').key,
        LoginUser:Storage.get('LoginInfo').Account,
        opr:'GetSpaceList'
      })]).then(this.$http.spread((FileServerList,GetSpaceList)=>{
        var json1=FileServerList.data;
        //Storage.setKey(json1.key)
        if (json1.result.toLowerCase() == 'false') {
          if (json1.errmsg == '超时') {
            this.$alert('key超时','超时', {
              confirmButtonText: '确定',
              callback: action => {
                this.$router.push('/login')
              }
            });
            return false;
          } else if (json1.errmsg) {
            this.$message.warning(json1.errmsg)
            return false;
          } else {
            this.$message.warning('数据异常')
            return false;
          }
        } else {
          this.fileServerOptions=json1.data
          this.fileServer=json1.data.length?json1.data[0].ID:''
        }
        return
        var json2=GetSpaceList.data;
        //Storage.setKey(json2.key)
        if (json2.result.toLowerCase() == 'false') {
          if (json2.errmsg == '超时') {
            this.$alert('key超时','超时', {
              confirmButtonText: '确定',
              callback: action => {
                this.$router.push('/login')
              }
            });
            return false;
          } else if (json2.errmsg) {
            this.$message.warning(json2.errmsg)
            return false;
          } else {
            this.$message.warning('数据异常')
            return false;
          }
        } else {
          this.options=json2.data;
          this.sizeValue=json2.data.length?json2.data[0].Space:''
        }
      })).then(()=>{
        this.GetFolderList()
      }).catch(err=>{
        this.$message.error('数据错误');
      });
      /*//获取文件服务器
      this.$http.post('',{
        strCurrentTime:Storage.get('LoginInfo').key,
        LoginUser:Storage.get('LoginInfo').Account,
        opr:'FileServerList'
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
          this.fileServerOptions=json.data
          this.fileServer=json.data.length?json.data[0].ID:''
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
        Storage.setKey(json.key)
        if (json.result.toLowerCase() == 'false') {
          if (json.errmsg == '超时') {
            this.$message.warning('超时')
            return false;
          } else if (json.errmsg) {
            this.$message.warning(json.errmsg)
            return false;
          } else {
            this.$message.warning('数据异常')
            return false;
          }
        } else {
          this.options=json.data;
          this.sizeValue=json.data.length?json.data[0].Space:''
        }
      }).catch(err=>{
        this.$message.error('数据错误');
      });*/

    },
    data(){
      return {
        isAllList:true,
        loading:false,
        dirID:'',
        dirName:'',
        people:'',
        clearable:false,
        pickerOptions:{
          disabledDate(time) {
            return time.getTime()> Date.now()+24*60*60*1000 ;
          }
        },
        dateValue:'',
        liList:['使用中的文件夹','已过期的文件夹'],
        now:0,
        sizeValue:100,
        options: [

        ],
        deadlineValue:1,
        options2: [
          {
            value: 1,
            label: '90天-180天'
          },
          {
            value: 2,
            label: '180天-365天'
          },
          {
            value: 3,
            label: '365天以上'
          },
        ],
        adminTableList:[

        ],
        currentPage:1,
        total:0,
        showEditDir:false,

        //  续期
        renewalDay:'',
        renewalDiv:false,
        renewalDayList:[
          {
            value: '111',
            label: '30天'
          }
        ],

        //查看
        lookOverDiv:false,


        //所属人
        host:'',
        hostOptions:[

        ],
        //文件服务器
        fileServer:'',
        fileServerOptions:[

        ],
        isPastDue:false

      }
    },
    components:{
      VHeader,
      NewDir,
      LookOver,
      editDir
    },
    methods:{
      addClass(that){
        this.now=that;
        this.currentPage=1;
        this.isAllList=true;
        this.GetFolderList();
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
        //this.isAllList?this.GetFolderList():this.QueryAllFolderList();
        this.GetFolderList()
      },
      // addDir(){
      //   this.showNewDir=true;
      // },

      //续期
      showRenewalDiv(){
        this.renewalDiv=true;
      },
      renewalCancel(){
        this.renewalDiv=false;
      },

      //查看
      showLookOverDiv(id){
        this.dirID=id;
        this.lookOverDiv=true;
      },

      //获取文件夹列表
      GetFolderList(reset){
        if(reset){
          this.currentPage=1
          this.isAllList=false
        }
        this.loading=true
        this.$http.post('',{
          strCurrentTime:Storage.get('LoginInfo').key,
          KeyWord:this.dirName,
          Account:this.people,
          //Space:this.sizeValue,
          //BeginTime:this.dateValue[0],
          //EndTime:this.dateValue[1],
          //LocalPath:this.serverLocalPath,
          //Validity:this.deadlineValue,
          FileServerID:this.fileServer,
          Type:this.now==0?0:1,
          PageIndex:this.currentPage,
          PageSize:10,
          LoginUser:Storage.get('LoginInfo').Account,
          opr:'GetFolderList'
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
              Storage.setKey(json.key)
              this.$message.warning('数据异常')
              return false;
            }
          } else {
            this.currentPage=Number(json.pageIndex)
            this.total=Number(json.recordCount)
            this.adminTableList=json.data
            Storage.setKey(json.key)
          }

        }).catch(err=>{
          this.$message.error('数据错误');
        })

      },

      //获取文件夹全部列表
    QueryAllFolderList(){
      this.loading=true
      this.$http.post('',{
        strCurrentTime:Storage.get('LoginInfo').key,
        Account:'',
        Type:this.now==0?0:1,
        PageIndex:this.currentPage,
        PageSize:10,
        LoginUser:Storage.get('LoginInfo').Account,
        opr:'QueryAllFolderList'
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
          this.currentPage=Number(json.pageIndex)
          this.total=Number(json.recordCount)
          this.adminTableList=json.data
        }

      }).catch(err=>{
        this.$message.error('数据错误');
      })
    },
      //编辑
      editFolder(id,state){
        if(state==0){
          this.$message.warning('此文件处于操作中，请10分钟后重试');
          return
        }
        this.showEditDir=true;
        this.dirID=id
      },
      editSave(val){
        if(val=='success'){
          this.showEditDir=false;
        }
      },
      //删除
      DeleteFolder(id,index,state){
        if(state==0){
          this.$message.warning('此文件处于操作中，请10分钟后重试');
          return
        }
        this.$confirm('确定删除吗?','删除后数据无法恢复', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(()=>{
          this.$http.post('',{
            strCurrentTime:Storage.get('LoginInfo').key,
            FolderID:id,
            LoginUser:Storage.get('LoginInfo').Account,
            opr:'DeleteFolder'
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
              this.adminTableList.splice(index,1)
              this.total--
              if(this.adminTableList==0){
                this.currentPage=parseInt(this.total/10);
                if(this.currentPage==0){
                  return
                }
                this.GetFolderList();
              }
            }
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(err=>{
            this.$message.error('数据错误');
          })
        }).catch(()=>{
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })
      },
    }
  }

</script>

<style  lang="scss" scoped>
  .gray{
    color: #ccc;
  }
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
    /*height: 30px;*/
    /*line-height: 30px;*/
    padding: 10px 20px;
    line-height: 1.4;
    padding-right: 0;
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
