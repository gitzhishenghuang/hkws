<template>
    <div>
      <el-checkbox @change="show" :falseLabel="''" :trueLabel="checked">备选项</el-checkbox>
    </div>
</template>

<script>
    export default {
        name: "test",
      data(){
          return {
            checked:'sdf'
          }
      },
      methods:{
        show(val){
          console.log(val);
        }
      }
    }
</script>

<style scoped>

</style>
