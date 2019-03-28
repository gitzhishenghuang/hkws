<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script type="es6">
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: '微软雅黑', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
#app>div{
  height: 100%;
}
</style>
