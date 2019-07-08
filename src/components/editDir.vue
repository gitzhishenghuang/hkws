<template>
  <div class="bgModel" v-loading="loading">
    <div class="box" >
      <div class="header">
        <i class="el-icon-close fr close" @click="cancel"></i>
        文件夹属性
      </div>
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础设置" name="first">
            <div  class="tabs" style="padding: 10px 30px;line-height: 32px;margin-top: 10px">
              <el-row>
                <el-col :span="7" class="text-right">文件夹名称</el-col>
                <el-col :span="17">
                  <input type="text" v-model="dirInfo.FolderName" readonly>
                </el-col>
              </el-row>
              <!--<el-row>
                <el-col :offset="7" :span="17">
                  <a href="javascript:void (0)" @click="inspectName" style="color: #409EFF">检查文件名称是否可用 <i v-if="showError" style="color:#F56C6C" class="el-icon-error"></i> <i style="color:#67C23A" v-if="showSuccess" class="el-icon-success"></i></a>
                </el-col>
              </el-row>-->
              <el-row v-if="people" style="margin:5px 0">
                <el-col :span="7" class="text-right">所属人</el-col>
                <el-col :span="17">
                  <input type="text" v-model="dirInfo.UserName" readonly>
                </el-col>
              </el-row>
              <el-row style="margin:5px 0">
                <el-col :span="7" class="text-right">授权</el-col>
                <el-col :span="17">
                  <el-col :span="17">
                    <input type="text" v-model="dirInfo.AccreditName" readonly>
                  </el-col>
                </el-col>
              </el-row>
              <el-row style="margin:5px 0">
                <el-col :span="7" class="text-right">选择文件服务器</el-col>
                <el-col :span="17">
                  <input type="text" v-model="dirInfo.FileServerName" readonly>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7" class="text-right">设置文件大小</el-col>
                <el-col :span="17">
                  <el-select v-model="sizeValue" placeholder="请选择"  style="width: 270px">
                    <el-option
                      v-for="item in optionsSize"
                      :key="item.Space"
                      :label="item.SpaceName"
                      :value="item.Space">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
              <el-row style="margin:5px 0">
                <el-col :span="7" class="text-right">有效期</el-col>
                <el-col :span="17">
                  <input type="text" style="width: 120px;" v-model="dirInfo.Validity" readonly>
                  <span class="warning">到期时间为<span v-text="dirInfo.DueToTime"></span></span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7" class="text-right">说明</el-col>
                <el-col :span="17">
                  <textarea cols="30" rows="8" v-model="dirInfo.Desc" placeholder="请输入内容"></textarea>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="权限设置" name="second">
            <div class="clearFloat setting">
              <div class="fl">
                <div class="clearFloat">
                  <span class="fl">编辑组</span>
                  <a class="fr add" @click="PropDiv($event,1)" href="javascript:void (0)"><i class="el-icon-plus"></i> 添加</a>
                </div>
                <div class="editListBox">
                  <ul>
                    <li class="clearFloat" v-for="(item,index) in editList" :key="index">
                      <span class="fl">{{item.Name}}</span>
                      <i v-if="index==0?false:true" class="fr el-icon-close" @click="removeEditUser(index)"></i>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="fr">
                <div class="clearFloat">
                  <span class="fl">只读组</span>
                  <a class="fr add" @click="PropDiv($event,0)" href="javascript:void (0)"><i class="el-icon-plus"></i> 添加</a>
                </div>
                <div class="editListBox">
                  <ul>
                    <li class="clearFloat" v-for="(item,index) in readOnlyList" :key="index">
                      <span class="fl">{{item.Name}}</span>
                      <i class="fr el-icon-close" @click="removeReadUser(index)"></i>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="footer">
        <el-button style="margin-left: 32px" @click="saveDir">确定</el-button>
        <el-button style="margin-left: 32px" @click="cancel">取消</el-button>
      </div>

    </div>
    <div ref="prop" v-show="showProp" class="prop_ou">
      <div class="header_input" @keydown.enter="getUserListByKeyWord">
        <el-input
          placeholder="请输入内容"
          v-model="searchInp"
          clearable>
          <el-button slot="append" @click="getUserListByKeyWord" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <el-checkbox-group v-model="cacheArr">
        <ul id="ou_list" >
          <li v-for="city in checkedArr" :key="city.Name">
            <el-checkbox  :label="city" >{{city.Name}}</el-checkbox>
          </li>
        </ul>
      </el-checkbox-group>

      <div class="prop_button">
        <el-button style="margin-left: 32px" @click="pushSettingList">确定</el-button>
        <el-button style="margin-left: 32px" @click="cancelProp">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Storage from '@/mode/storage'
  export default {
    name: "editDir",
    props:["FolderID",'optionsSize','type'],
    data() {
      return {
        loading:false,
        activeName: 'first',
        showProp:false,
        checkedArr:[

        ],
        sizeValue:'',
        //  设置
        editType:'',
        editList:[
        ],
        readOnlyList:[
        ],
        searchInp:'',
        cacheArr:[],

        dirInfo:'',
        people:false

      };
    },
    methods: {
      handleClick(tab, event) {
        //console.log(tab, event);
      },
      cancel(){
        this.$parent.showEditDir=false
      },
      removeEditUser(index){
        //console.log(index);
        this.editList.splice(index,1)
      },
      removeReadUser(index){
        this.readOnlyList.splice(index,1)
      },
      PropDiv(event,type){
        this.cacheArr=[];
        var dom=this.$refs.prop;
        dom.style.top=event.clientY+'px';
        dom.style.left=event.clientX+'px';

        if(type==1){
          this.editType=1;
        }else{
          this.editType=0;
        }
        this.showProp=true;
        this.searchInp='';
        this.checkedArr=[];
        //
        //this.initCheckedArr(type,this.checkedArr)
      },
      cancelProp(){
        this.showProp=false;
      },
      pushSettingList(){
        var arr;
        if(this.editType==1){
          arr=this.merge(this.editList.concat(this.cacheArr),this.readOnlyList);
          this.editList=arr[0]
          this.readOnlyList=arr[1]
        }
        if(this.editType==0){
          arr=this.merge(this.readOnlyList.concat(this.cacheArr),this.editList);
          this.editList=arr[1]
          this.readOnlyList=arr[0]
        }
        this.showProp=false;
      },
      merge(arr,mutex){
        var stringArr=[],
          strMutex=[],
          strMutexResult=[],
          result=[];
        for(let i=0;i<arr.length;i++){
          stringArr.push(JSON.stringify(arr[i]))
        }
        for(let i=0;i<mutex.length;i++){
          strMutex.push(JSON.stringify(mutex[i]))
        }
        stringArr=[...new Set(stringArr)];
        for(let i=0;i<stringArr.length;i++){
          for(let j=0;j<strMutex.length;j++){
            if(stringArr[i]==strMutex[j]){
              strMutex.splice(j,1)
            }
          }
          result.push(JSON.parse(stringArr[i]))
        }
        for(let i=0;i<strMutex.length;i++){
          strMutexResult.push(JSON.parse(strMutex[i]))
        }
        return [result,strMutexResult];
      },

      //新增里下拉框的联动
      linkage(obj){
        this.fileServerName=obj.Name
        this.sizeValue=obj.FileSpace
      },

      //检查名称
      inspectName(){
        if(this.dirName==''){
          this.$message.warning('请输入文件夹名称');
          return
        }
        this.$http.post('',{
          strCurrentTime:Storage.get('LoginInfo').key,
          FolderName:this.dirName,
          LoginUser:Storage.get('LoginInfo').Account,
          opr:'CheckFolderName'
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
              Storage.setKey(json.key)
              this.$message.warning('数据异常')
              return false;
            }
          } else {
            if(json.result.toLowerCase()=='true'){
              this.showSuccess=true
              this.showError=false
            }else{
              this.showSuccess=false
              this.showError=true
            }
          }

        }).catch(err=>{
          this.$message.error('数据错误');
        })
      },

      //编辑组只读组搜索
      getUserListByKeyWord(){
        if(this.searchInp==''){
          return
        }
        this.loading=true
        this.$http.post('',{
          strCurrentTime:Storage.get('LoginInfo').key,
          KeyWord:this.searchInp,
          Account:Storage.get('LoginInfo').Account,
          LoginUser:Storage.get('LoginInfo').Account,
          opr:'SearchUserForPermissions'
        }).then(res=>{
          var json=res.data;
          this.loading=false
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
          } else if (json.errmsg) {
              this.$message.warning(json.errmsg)
              return false;
            } else {
              this.$message.warning('数据异常')
              return false;
            }
          } else {
            Storage.setKey(json.key)
            this.checkedArr=json.data
          }

        }).catch(err=>{
          this.$message.error('数据错误');
        })
      },

      //编辑 文件夹保存
      saveDir(){
        this.loading=true

        this.$http.post('',{
          strCurrentTime:Storage.get('LoginInfo').key,
          FolderID:this.FolderID,
          Space:this.dirInfo.Space,
          Desc:this.dirInfo.Desc,
          //Permissions:JSON.stringify({Editor:this.editList,Reader:this.readOnlyList}),
          Account:this.people?this.dirInfo.UserAccount:Storage.get('LoginInfo').Account,
          LoginUser:Storage.get('LoginInfo').Account,
          opr:'ModifyFolder'
        },
        {Editor:this.editList,
          Reader:this.readOnlyList}).then(res=>{
          var json=res.data;
          this.loading=false
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
          } else if (json.errmsg) {
              this.$message.warning(json.errmsg)
              return false;
            } else {
              this.$message.warning('数据异常')
              return false;
            }
          } else {
            Storage.setKey(json.key)
            this.$emit('editSaveFn','success')
          }

        }).catch(err=>{
          console.log(err);
          this.$message.error('数据错误');
        })
      }
    },

    mounted(){
      if(this.type=='admin'){
        this.people=true
      }
      this.$http.post('',{
        strCurrentTime:Storage.get('LoginInfo').key,
        FolderID:this.FolderID,
        LoginUser:Storage.get('LoginInfo').Account,
        opr:'GetFolderInfo'
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
          this.dirInfo=json
          this.editList=json.Permissions.Editor
          this.readOnlyList=json.Permissions.Reader
          this.sizeValue=Number(json.Space)
        }

      }).catch(err=>{
        this.$message.error('数据错误');
      });
    }
  }
</script>

<style scoped>
  .bgModel{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(105,105,105,.6);
  }
  .box{
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    background: #fff;
    border-top: 2px solid #840A0B;
    width: 500px;
  }
  .prop{
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(125,125,125,.6);
    z-index: 100;
  }

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
  .tabs .warning{
    margin-left: 20px;
    color: #FF1715;
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
  .setting{
    padding: 10px 30px;
    line-height: 32px;
    margin-top: 10px;
    height: 353px;
  }
  .setting>div{
    width: 210px;
  }
  .setting .add{
    color: #840A0B;
  }
  .editListBox{
    border: 1px solid #f4f4f5;
    overflow-y: scroll;
  }
  .editListBox ul{
    height: 320px;
    box-sizing: border-box;
    padding: 5px 0;
  }
  .editListBox ul li{
    height: 26px;
    line-height: 26px;
    padding:0 10px;
  }
  .editListBox ul li i{
    line-height: 26px;
    font-size: 16px;
  }
  .editListBox ul li i:hover{
    cursor: pointer;
  }


  .prop_ou {
    position: absolute;
    min-width: 240px;
    background: #fff;
    border: 1px solid #ccc;
    box-shadow: 0 0 1px 0 #ccc;
    padding: 10px;
    /*transform: translate(-50%,-50%);*/
  }
  .prop_ou ul {
    height: 140px;
    overflow: auto;
    padding-top: 0;
    margin: 10px 0;
  }
  .prop_ou ul li {
    padding: 3px 0;
  }
</style>

<style>
  .el-tabs__nav-wrap::after{
    height: 1px;
  }
  .el-tabs__nav-wrap{
    box-shadow: 0 10px 10px -7px #ccc;
  }
  .el-tabs__nav-scroll{
    padding: 0 30px;
  }
  .el-tabs__header{
    margin: 0 0 15px;
  }
  .el-input.is-active .el-input__inner, .el-input__inner:focus{
    border-color: #dcdfe6;
  }
  .el-input__inner{
    border-radius: 5px;
  }
</style>
