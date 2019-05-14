<template>
  <div v-loading="loading">
    <el-container>
      <el-header>
        <VHeader></VHeader>
      </el-header>
      <el-container style="margin-top: 5px;max-height:100%;overflow:auto">
        <el-aside width="230px" style="border-right: 1px solid #ccc">
        </el-aside>
        <el-main>
          <div style="margin-bottom: 10px;">
            关键字　<input v-model.trim="queryKeyWord" class="dirName" type="text" @keydown.enter="QueryLogList" placeholder="关键字">
            操作时间　<el-date-picker
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
            操作结果　<el-select v-model="operationResult" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
            <el-button @click="QueryLogList">搜索</el-button>
          </div>
          <div>
            <!--<div style="margin-bottom: 5px;">
              <a @click="addAuth" class="addDir" href="javascript:void (0);">
                <i></i>新增授权
              </a>
            </div>-->
            <div class="clearFloat">
              <table class="userTable">
                <thead>
                <tr>
                  <td width="4%" style="padding-left:0;text-align:center">序号</td>
                  <td width="11%"><i></i> 操作者</td>
                  <td width="13%"><i></i> IP</td>
                  <td width="15%"><i></i> 操作时间</td>
                  <td width="10%"><i></i> 操作对象</td>
                  <td width="39%"><i></i> 操作描述</td>
                  <td width="8%"><i></i> 操作结果</td>
                  <!--<td width="10%"><i></i> 操作</td>-->
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in logTableList" :key="index">
                  <td>{{item.序号||'-'}}</td>
                  <td>{{item.操作者||'-'}}</td>
                  <td>{{item.IP||'-'}}</td>
                  <td>{{item.操作时间||'-'}}</td>
                  <td>{{item.操作对象||'-'}}</td>
                  <td>{{item.操作描述||'-'}}</td>
                  <td>{{item.操作结果||'-'}}</td>
                  <!--<td>
                    <a href="javascript:void(0)" @click="updateAuth(item.ID,item.FileServerID,item.Name,item.AccreditID)">修改</a>
                    <a href="javascript:void(0)" @click="delAuth(item.ID,index)">| 删除</a>
                  </td>-->
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
    <!--查看详情-->
    <!--<div v-show="isShowDetail" class="newAuthDiv">-->
      <!--<div class="box">-->
        <!--<div class="header">-->
          <!--<i class="el-icon-close fr close" @click="newAuthCancel"></i>-->
          <!--查看日志详情-->
        <!--</div>-->
        <!--<div class="tabs" style="padding: 0 30px 10px 30px;line-height: 32px;margin-top: 10px;">-->
          <!--<div v-text="log" style="height: 400px;overflow-y: auto">-->

          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->

  </div>
</template>

<script type='es6'>
  import VHeader from '@/components/header';
  import Storage from '@/mode/storage'
  export default {
    name: 'commitLog',
    mounted(){
      var date=new Date();
      var yy=date.getFullYear(),
          MM=date.getMonth()+1,
          dd=date.getDate()
      this.dateValue=[yy+'-'+MM+'-'+dd+' 00:00:00',yy+'-'+MM+'-'+dd+' 23:59:59']
      this.QueryLogList()
    },
    data(){
      return {
        pickerOptions:{
          disabledDate(time) {
            return time.getTime()> Date.now()+24*60*60*1000 ;
          }
        },
        clearable:false,
        options:[
          {
            value:'1',
            label:'全部',
          },
          {
            value:'2',
            label:'成功',
          },
          {
            value:'3',
            label:'失败',
          },
        ],
        operationResult:'1',
        queryKeyWord:'',
        dateValue:[],
        loading:false,
        currentPage:1,
        total:0,
        logTableList:[
        ],

        //查看日志详情
        //isShowDetail:false,
        //log:'',
        //logId:'',

      }
    },
    components:{
      VHeader,
    },
    methods:{
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        //console.log(`当前页: ${val}`);
        this.QueryLogList()
      },

      //查询
      QueryLogList(){
        this.loading=true;
        this.$http.post('',{
          strCurrentTime:Storage.get('LoginInfo').key,
          KeyWord:this.queryKeyWord,
          BeginTime:this.dateValue[0],
          EndTime:this.dateValue[1],
          PageIndex: this.currentPage,
          PageSize: 10,
          LoginUser:Storage.get('LoginInfo').Account,
          opr:'QueryOperLog'
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
            this.logTableList=json.data
            this.total=Number(json.recordCount)
          }
        }).catch(err=>{
          this.$message.error('数据错误');
        })
      },

      //查看
      newAuthCancel(){
        this.isShowDetail=false
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
    width:150px;
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
    padding-right: 0;
    line-height: 1.7;
    vertical-align: middle;
    background: #fff;
    word-break: break-all;
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

