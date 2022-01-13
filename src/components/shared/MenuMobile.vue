<template>
  <div>
    <header class="menu-top">
      <b-row align-h="between" class="menu-top__fechado" @click="fecharAbrirMenu">
        <b-col cols="auto" class="menu-top__titulo">
          <span>GImóveis</span>
        </b-col>
        <b-col cols="auto" class="menu-top__botao">
          <span class="material-icons-round icon__menu-hamburguer">menu</span>
        </b-col>
      </b-row>

      <transition name="slide-down__menu_top">
        <nav class="menu-top__aberto" v-if="menu">
          <ul>

            <li @click="fecharAbrirMenu">
              <router-link to="/">
                <b-row class="">
                  <b-col cols="auto" class="menu-top__aberto-icone">
                    <i class="fa fa-home fa-2x menu-top__aberto-icone-interno"></i>
                  </b-col>
                  <b-col class="menu-top__aberto-texto">
                    <span class="">Home</span>
                  </b-col>
                </b-row>
              </router-link>
            </li>

            <li @click="fecharAbrirMenu">
              <router-link to="/visualizar/caixa">
                <b-row class="">
                  <b-col cols="auto" class="menu-top__aberto-icone">
                    <b-icon icon="cash-stack"
                            class="icone-bootstrap-menu menu-top__aberto-icone-interno"></b-icon>
                  </b-col>
                  <b-col class="menu-top__aberto-texto">
                    <span class="">Caixa</span>
                  </b-col>
                </b-row>
              </router-link>
            </li>

            <li @click="fecharAbrirMenu">
              <router-link to="/visualizar/cliente">
                <b-row class="">
                  <b-col cols="auto" class="menu-top__aberto-icone">
                    <b-icon icon="person-plus-fill"
                            class="icone-bootstrap-menu menu-top__aberto-icone-interno"></b-icon>
                  </b-col>
                  <b-col class="menu-top__aberto-texto">
                    <span class="">Clientes</span>
                  </b-col>
                </b-row>
              </router-link>
            </li>

            <li @click="fecharAbrirMenu">
              <router-link to="/visualizar/imovel">
                <b-row class="">
                  <b-col cols="auto" class="menu-top__aberto-icone">
                    <b-icon icon="house-fill" class="icone-bootstrap-menu menu-top__aberto-icone-interno"></b-icon>
                  </b-col>
                  <b-col class="menu-top__aberto-texto">
                    <span class="">Imóveis</span>
                  </b-col>
                </b-row>
              </router-link>
            </li>

            <li @click="fecharAbrirMenu">
              <router-link to="/visualizar/responsavel">
                <b-row class="">
                  <b-col cols="auto" class="menu-top__aberto-icone">
                    <b-icon icon="people-fill" class="icone-bootstrap-menu menu-top__aberto-icone-interno"></b-icon>
                  </b-col>
                  <b-col class="menu-top__aberto-texto">
                    <span class="">Responsáveis</span>
                  </b-col>
                </b-row>
              </router-link>
            </li>

            <li @click="fecharAbrirMenu">
              <router-link to="/visualizar/contrato">
                <b-row class="">
                  <b-col cols="auto" class="menu-top__aberto-icone">
                    <b-icon icon="briefcase-fill" class="icone-bootstrap-menu menu-top__aberto-icone-interno"></b-icon>
                  </b-col>
                  <b-col class="menu-top__aberto-texto">
                    <span class="">Contratos</span>
                  </b-col>
                </b-row>
              </router-link>
            </li>

            <li @click="fecharAbrirMenu">
              <router-link to="/visualizar/usuario">
                <b-row class="">
                  <b-col cols="auto" class="menu-top__aberto-icone">
                    <b-icon icon="person-badge" class="icone-bootstrap-menu menu-top__aberto-icone-interno"></b-icon>
                  </b-col>
                  <b-col class="menu-top__aberto-texto">
                    <span class="">Usuários</span>
                  </b-col>
                </b-row>
              </router-link>
            </li>

            <li @click="submenu = !submenu">
              <b-row class="">
                <b-col cols="auto" class="menu-top__aberto-icone">
                  <b-icon icon="person-circle" class="icone-bootstrap-menu menu-top__aberto-icone-interno"></b-icon>
                </b-col>
                <b-col class="menu-top__aberto-texto">
                  <span class="">{{ $store.state.usuario.nome.split(" ")[0] }}</span>
                </b-col>
              </b-row>
            </li>
            <transition name="slide-down__submenu">
              <ul v-if="submenu">
                <li v-b-modal.modalSair>
                  <b-row class="menu-top__submenu">
                    <b-col cols="auto" class="menu-top__aberto-icone">
                      <b-icon icon="door-open-fill"
                              class="icone-bootstrap-menu menu-top__aberto-icone-interno"></b-icon>
                    </b-col>
                    <b-col class="menu-top__aberto-texto">
                      <span class="">Sair</span>
                    </b-col>
                  </b-row>
                </li>
              </ul>
            </transition>
            <li @click="fecharAbrirMenu">
              <router-link to="/ajuste">
                <b-row class="">
                  <b-col cols="auto" class="menu-top__aberto-icone">
                    <b-icon icon="gear-fill" class="icone-bootstrap-menu menu-top__aberto-icone-interno"></b-icon>
                  </b-col>
                  <b-col class="menu-top__aberto-texto">
                    <span class="">Ajuste</span>
                  </b-col>
                </b-row>
              </router-link>
            </li>
          </ul>
        </nav>
      </transition>
    </header>

    <b-modal id="modalSair" title="Sair" centered>
      <h5 class="my-4">Tem certeza que deseja sair ?</h5>
      <template #modal-footer="{ ok, cancel }">
        <b-button @click="cancel()">
          Cancelar
        </b-button>
        <b-button variant="danger" @click="sair()">
          Sair
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "MenuMobile",
  data(){
    return{
      menu: false,
    }
  },
  methods: {
    fecharAbrirMenu() {
      this.menu = !this.menu
      this.submenu = false
    },
    sair() {
      this.$store.commit('DESLOGAR_USUARIO')
      this.$router.push({name: 'Login'})
    },
  }
}
</script>

<style scoped>
.menu-top {
  display: block;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 3;
}

.icon__menu-hamburguer {
  font-size: 50px !important;
}

.menu-top__fechado {
  background-color: #212121;
  color: white;
  z-index: 3;
  position: relative;
  padding-top: 0px;
}

.menu-top__titulo {
  font-size: 2rem;
  margin-left: 10px;
}

.menu-top__botao {
  margin-top: 0px;
  margin-bottom: -5px;
  margin-right: 10px;
}

.menu-top__aberto {
  color: white;
  z-index: 2;
  position: relative;
}

.menu-top__aberto ul li {
  background-color: #2a2a2a;
  color: white;
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid #dddddd;
}

.menu-top__aberto-icone {
  color: white;
  padding-right: 5px !important;
  margin-left: 15px !important;
}

.menu-top__aberto-icone-interno {
  width: 30px;
  font-size: 35px;
}

.menu-top__aberto-texto {
  padding-left: 5px !important;
  margin-top: -2px;
  color: white;
  font-size: 1.5rem;
}

.menu-top__submenu {
  padding-left: 15px;
}

</style>