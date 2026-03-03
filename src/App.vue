<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
/**
 * 根组件
 * 提供应用的基础布局和路由视图
 */
</script>

<style>
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
