<template>
    <div>
      <div style="margin-bottom: 10px;">
        文件夹名称　<input class="dirName" type="text" placeholder="请输入文件夹名称">
        使用情况　<el-select v-model="sizeValue" placeholder="请选择"  style="margin-right: 20px;width: 170px">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
        所属人　<el-select v-model="host" placeholder="请选择" style="width: 173px">
        <el-option
          v-for="item in hostOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      </div>
      <div style="margin-bottom: 15px;">
        文件服务器　<el-select v-model="fileServer" placeholder="请选择" style="margin-right: 20px">
        <el-option
          v-for="item in fileServerOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
        创建时间　<el-date-picker
        v-model="dateValue"
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
        有效期　<el-select v-model="deadlineValue" placeholder="请选择">
        <el-option
          v-for="item in options2"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
        <el-button style="margin-left: 32px">搜索</el-button>
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
              <td width="12%"><i></i> 使用情况</td>
              <td width="12%"><i></i> 所属人</td>
              <td width="12%"><i></i> 文件服务器</td>
              <td width="12%"><i></i> 创建时间</td>
              <td width="8%"><i></i> 有效期</td>
              <td width="8%"><i></i> 权限详情</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in adminTableList" :key="item">
              <td>{{item.dirName||'-'}}</td>
              <td>{{item.host||'-'}}</td>
              <td>{{item.fileServer||'-'}}</td>
              <td>{{item.capacity||'-'}}</td>
              <td>{{item.crateTime||'-'}}</td>
              <td>{{item.validity||'-'}}</td>
              <td>
                <a href="javascript:void(0)" @click="showLookOverDiv">查看</a>
              </td>
            </tr>
            </tbody>
          </table>
          <div class="fr">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage1"
              :page-size="10"
              layout="total, prev, pager, next"
              :total="50">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import LookOver from '@/components/lookOver';
    export default {
      name: "FolderReport",
      data(){
        return {
          options: [{
            value: '选项1',
            label: '黄金糕'
          }, {
            value: '选项2',
            label: '双皮奶'
          }, {
            value: '选项3',
            label: '蚵仔煎'
          }, {
            value: '选项4',
            label: '龙须面'
          }, {
            value: '选项5',
            label: '北京烤鸭'
          }],
          sizeValue: '',
          dateValue:'',
          deadlineValue:'',
          options2: [{
            value: '选项1',
            label: '30天'
          }],
          adminTableList:[
            {
              dirName:'',
              capacity:'50G/100G',
              host:'',
              fileServer:'',
              crateTime:'2019-12-12',
              validity:'30天'
            },
            {
              dirName:'',
              capacity:'50G/100G',
              host:'',
              fileServer:'',
              crateTime:'2019-12-12',
              validity:'30天'
            },
            {
              dirName:'',
              capacity:'50G/100G',
              host:'',
              fileServer:'',
              crateTime:'',
              validity:'30天'
            }
          ],
          currentPage1:3,
          showNewDir:false,

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
            {
              value: '选项1',
              label: '黄金糕'
            },
            {
              value: '选项2',
              label: '黄金糕'
            }
          ],
          //文件服务器
          fileServer:'',
          fileServerOptions:[
            {
              value: '选项1',
              label: '服务器1'
            },
            {
              value: '选项2',
              label: '服务器2'
            }
          ],

        }
      },
      methods:{
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          console.log(`当前页: ${val}`);
        },
        addDir(){
          this.showNewDir=true;
        },

        //续期
        showRenewalDiv(){
          this.renewalDiv=true;
        },
        renewalCancel(){
          this.renewalDiv=false;
        },

        //查看
        showLookOverDiv(){
          this.lookOverDiv=true;
        },

      },
      components:{
        LookOver
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
