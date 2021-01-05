<template>
  <div id="app">
    <Menu/>
      <router-view class="pagina"/>
  </div>
</template>

<script>

import Menu from "../src/components/Menu";

export default {
  name: 'App',
  components: {
    Menu
  }
}
</script>

<style scoped>
#app{
  width:100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.pagina{
  margin-top:10px;
  padding: 10px 100px;
}
</style>
