<template>
  <div id="app">
    <!--    <img alt="Vue logo" src="./assets/logo.png" />-->
    <!--    <HelloWorld msg="Welcome to Your Vue.js App" />-->
    <!--    <BigFileRequest />-->
    <ER />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import BigFileRequest from "./test/BigFileRequest.vue";
import ER from "./ER/ER.vue";

export default {
  name: "App",
  components: {
    HelloWorld,
    BigFileRequest,
    ER,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
