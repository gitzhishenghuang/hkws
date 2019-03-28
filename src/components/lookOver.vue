<template>
  <div class="lookOver">
    <div class="box">
      <div class="header">
        <i class="el-icon-close fr close" @click="lookOverCancel"></i>
        <!--续期申请-->
      </div>
      <div class="tabs" style="padding: 10px 30px;line-height: 32px;margin-top: 10px;padding-bottom: 50px">
        <el-row>
          <el-col :span="7" class="text-right">文件夹名称</el-col>
          <el-col :span="17">
            <input type="text" v-model="dirName" readonly>
          </el-col>
        </el-row>
        <el-row style="margin:5px 0">
          <el-col :span="7" class="text-right">共享路径</el-col>
          <el-col :span="17">
            <input type="text" v-model="dirPath" readonly>
          </el-col>
        </el-row>
        <el-row >
          <el-col :offset="7" :span="17">
            <a href="javascript:void (0)"  v-clipboard:copy="dirPath"  v-clipboard:success="onCopy"
               v-clipboard:error="onError" style="color: #409EFF">复制路径</a>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7" class="text-right">有效期</el-col>
          <el-col :span="17">
            <input type="text" width="150px" v-model="validity" readonly>
          </el-col>
        </el-row>
      </div>

    </div>
  </div>
</template>

<script>
  import Storage from '@/mode/storage'

  export default {
      name: "lookOver",
      props:['FolderID'],
      methods:{
        lookOverCancel(){
          this.$parent.lookOverDiv=false
        },
        onCopy(){
          this.$message.success('复制成功')
        },
        onError(){
          this.$message.error('复制失败')
        }
      },
      data(){
        return {
          dirName:'',
          dirPath:'',
          validity:''
        }
      },
      mounted(){
        this.$http.post('',{
          strCurrentTime:Storage.get('LoginInfo').key,
          FolderID:this.FolderID,
          LoginUser:Storage.get('LoginInfo').Account,
          opr:'FolderToView'
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
            this.dirPath=json.Path
            this.dirName=json.Name
            this.validity=json.Validity
          }

        }).catch(err=>{
          this.$message.error('数据错误');
        })
      }
    }
</script>

<style lang="scss" scoped>
  .lookOver{
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
