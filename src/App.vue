<template>
  <div id="app">
    <Fundo/>
    <Topo v-if="logado"/>
    <Menu v-if="logado && !$isMobile"/>
    <menu-mobile v-if="logado && $isMobile"></menu-mobile>
    <router-view class="pagina"/>
  </div>
</template>

<script>

import Menu from "../src/components/Menu";
import Topo from "@/components/Topo";
import Fundo from "@/components/Fundo";
import MenuMobile from "./components/shared/MenuMobile";

export default {
  name: 'App',
  components: {
    Menu,
    Topo,
    Fundo,
    MenuMobile
  },
  computed:{
    logado: function(){ return this.$store.state.token != null}
  }
}
</script>

<style scoped>

html{
  font-size: 16px;
}

#app{
  width:100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;

}
.pagina{
  padding: 10px 100px;
  z-index:20;
}

.centralizar-container{
  padding-right:15px;
  padding-left:75px;
}

@media screen and (max-width: 992px){
  .centralizar-container{
    padding: 60px 10px 0px 10px;
  }
}
</style>
