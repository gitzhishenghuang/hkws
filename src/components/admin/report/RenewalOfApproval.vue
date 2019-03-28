<template>
  <div v-loading="loading">
    <div style="margin-bottom: 10px;">
      文件夹名称　<input v-model.trim="dirName" class="dirName" type="text" placeholder="请输入文件夹名称">
      文件大小　<el-select v-model="sizeValue" placeholder="请选择"  style="margin-right: 20px;width: 170px">
      <el-option
        v-for="item in options"
        :key="item.Space"
        :label="item.SpaceName"
        :value="item.Space">
      </el-option>
    </el-select>
      所属人　<input v-model.trim="people" class="dirName" type="text" style="width: 180px" placeholder="关键字">
    </div>
    <div style="margin-bottom: 15px;">
      文件服务器　<el-select v-model="fileServer" placeholder="请选择" style="margin-right: 20px">
      <el-option
        v-for="item in fileServerOptions"
        :key="item.ID"
        :label="item.Name"
        :value="item.ID">
      </el-option>
    </el-select>
      创建时间　<el-date-picker
      v-model="dateValue"
      type="daterange"
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :default-time="['00:00:00', '23:59:59']"
      value-format="yyyy-MM-dd HH:mm:ss"
      :picker-options="pickerOptions"
      :clearable="clearable">
    </el-date-picker>
      有效期　<el-select v-model="deadlineValue" placeholder="请选择">
      <el-option
        v-for="item in options2"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
      <el-button style="margin-left: 32px" @click="GetFolderList">搜索</el-button>
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
            <td width="12%">文件夹名称</td>
            <td width="12%"><i></i> 所属人</td>
            <td width="12%"><i></i> 文件服务器</td>
            <td width="14%"><i></i> 创建时间</td>
            <td width="14%"><i></i> 续期时间</td>
            <td width="6%"><i></i> 审批结果</td>
            <td width="14%"><i></i> 审批时间</td>
            <td width="8%"><i></i> 有效期</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in adminTableList">
            <td>{{item.FolderName||'-'}}</td>
            <td>{{item.UserName||'-'}}</td>
            <td>{{item.FileServerName||'-'}}</td>
            <td>{{item.CreateTime||'-'}}</td>
            <td>{{item.AuditTime||'-'}}</td>
            <td>{{item.AuditResult||'-'}}</td>
            <td>{{item.OperTime||'-'}}</td>
            <td>{{item.Validity?item.Validity+'天':'-'}}</td>
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
  </div>
</template>

<script>
  import Storage from '@/mode/storage';
  export default {

    name: "RenewalOfApproval",
    mounted(){
      var date=new Date();
      var yy=date.getFullYear(),
        MM=date.getMonth()+1,
        dd=date.getDate()
      this.dateValue=[yy+'-'+MM+'-'+dd+' 00:00:00',yy+'-'+MM+'-'+dd+' 23:59:59'];
      this.loading='true'
      this.$http.all([this.$http.post('',{
        strCurrentTime:Storage.get('LoginInfo').key,
        LoginUser:Storage.get('LoginInfo').Account,
        opr:'FileServerList'
      }),this.$http.post('',{
        strCurrentTime:Storage.get('LoginInfo').key,
        LoginUser:Storage.get('LoginInfo').Account,
        opr:'GetSpaceList'
      })]).then(this.$http.spread((FileServerList,GetSpaceList)=>{
        this.loading=false
        var json1=FileServerList.data;
        Storage.setKey(json1.key)
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

        var json2=GetSpaceList.data;
        Storage.setKey(json2.key)
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
    },
    data(){
      return {
        dirName:'',
        loading:false,
        clearable:false,
        pickerOptions:{
          disabledDate(time) {
            return time.getTime()> Date.now()+24*60*60*1000 ;
          }
        },
        options: [

        ],
        people:'',
        sizeValue: '',
        dateValue:'',
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

        //文件服务器
        fileServer:'',
        fileServerOptions:[

        ],

      }
    },
    methods:{
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.GetFolderList()
      },
      //获取续期报表
      GetFolderList(){
        this.loading=true
        this.$http.post('',{
          strCurrentTime:Storage.get('LoginInfo').key,
          KeyWord:this.dirName,
          Account:this.people,
          Space:this.sizeValue,
          BeginTime:this.dateValue[0],
          EndTime:this.dateValue[1],
          Validity:this.deadlineValue,
          FileServerID:this.fileServer,
          PageIndex:this.currentPage,
          PageSize:10,
          LoginUser:Storage.get('LoginInfo').Account,
          opr:'QueryRenewalLog'
        }).then(res=>{
          this.loading=false;
          var json=res.data;
          console.log(res);
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
            this.currentPage=Number(json.pageIndex)
            this.total=Number(json.recordCount)
            this.adminTableList=json.data

          }

        }).catch(err=>{
          this.$message.error('数据错误1');
        })

      },
    },

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
    background: url("../../../assets/img/plus.png") no-repeat;
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
    padding-right: 0;
    background: #fff;
  }
  .userTable tbody td{
    border-top: #F2F2F3;
    line-height: 1.7;
    vertical-align: middle;
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
