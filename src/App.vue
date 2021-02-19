<template>
  <div id="app">
    <Fundo/>
    <Topo v-if="logado"/>
    <Menu v-if="logado"/>
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
  },
  computed:{
    logado: function(){ return this.$store.state.token != null}
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
