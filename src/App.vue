<template>
  <v-app class="app">
    <div>
      <Fundo />
      <!-- <Topo v-if="logado"/> -->
      <Menu v-if="logado && !$isMobile" />
      <menu-mobile v-if="logado && $isMobile" class="menu_mobile"></menu-mobile>
      <v-container fluid class="">
        <router-view class="pagina"></router-view>
      </v-container>
    </div>
  </v-app>
</template>

<script>
import Menu from "../src/components/Menu"
// import Topo from "@/components/Topo"
import Fundo from "@/components/Fundo"
import MenuMobile from "./components/shared/MenuMobile"

export default {
  name: "App",
  components: {
    Menu,
    // Topo,
    Fundo,
    MenuMobile,
  },
  computed: {
    logado: function () {
      return this.$store.state.token != null
    },
  },
}
</script>

<style>
:root {
  --azul-principal: #061733;
  --azul-secundaria: #01479A;
  --azul-terceario: #014461;
  --azul-btn-simples: #014461;
  --preto-principal: #353a40;
  --btn-adicionar: #24a45a;
  --btn-salvar: #24a45a;
  --btn-cancelar: #707070;
  --btn-deletar: #dc3545;
  --btn-adicionar-azul: #5398ff;
}

html {
  font-size: 16px;
}

.app {
  background-color: rgb(220, 220, 220) !important;
}

.pagina {
  padding-left: 55px;
  z-index: 20;
}

.menu_mobile {
  display: block;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 3;
}

@media screen and (max-width: 992px) {
  .pagina {
    padding-left: 0;
    padding-top: 53px;
  }
}
</style>
