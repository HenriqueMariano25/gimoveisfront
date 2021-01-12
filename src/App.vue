<template>
  <div id="app">
    <Fundo/>
    <Topo/>
    <Menu/>
      <router-view class="pagina"/>
  </div>
</template>

<script>

import Menu from "../src/components/Menu";
import Topo from "@/components/Topo";
import Fundo from "@/components/Fundo";

export default {
  name: 'App',
  components: {
    Menu,
    Topo,
    Fundo
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
  margin-top:30px;
  padding: 10px 100px;
  z-index:20;
}
</style>
