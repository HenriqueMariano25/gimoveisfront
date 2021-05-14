<template lang="html">
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
          </ul>
        </nav>
      </transition>
    </header>
    <b-modal id="modalSair" title="Sair" centered >
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

    <nav class="main-menu">
      <ul>
        <li>
          <router-link to="/">
            <i class="fa fa-home fa-2x"></i>
            <span class="nav-text">Home</span>
          </router-link>
        </li>
        <li class="has-subnav">
          <router-link to="/visualizar/cliente">
            <b-icon icon="person-plus-fill" class="icone-bootstrap-menu"></b-icon>
            <span class="nav-text">
                  Clientes
                </span>
          </router-link>
        </li>
        <li class="has-subnav">
          <router-link to="/visualizar/imovel">
            <b-icon icon="house-fill" class="icone-bootstrap-menu"></b-icon>
            <span class="nav-text">Imóveis</span>
          </router-link>
        </li>
        <li class="has-subnav">
          <router-link to="/visualizar/responsavel">
            <b-icon icon="people-fill" class="icone-bootstrap-menu"></b-icon>
            <span class="nav-text">
                  Responsáveis
                </span>
          </router-link>
        </li>
        <li class="has-subnav">
          <router-link to="/visualizar/contrato">
            <b-icon icon="briefcase-fill" class="icone-bootstrap-menu"></b-icon>
            <span class="nav-text">
                  Contratos
                </span>
          </router-link>
        </li>
        <li class="has-subnav">
          <router-link to="/visualizar/usuario">
            <b-icon icon="person-badge" class="icone-bootstrap-menu"></b-icon>
            <span class="nav-text">
                  Usuários
                </span>
          </router-link>
        </li>
        <!--            <li class="has-subnav">-->
        <!--              <a href="#">-->
        <!--                <i class="fa fa-folder-open fa-2x"></i>-->
        <!--                <span class="nav-text">-->
        <!--                  Pages-->
        <!--                </span>-->
        <!--              </a>-->
        <!--            </li>-->
        <!--            <li class="has-subnav">-->
        <!--              <a href="#">-->
        <!--                <i class="fa fa-folder-open fa-2x"></i>-->
        <!--                <span class="nav-text">-->
        <!--                  Pages-->
        <!--                </span>-->
        <!--              </a>-->
        <!--            </li>-->
        <!--          </ul>-->
        <!--        </li>-->
        <!--        <li class="has-subnav">-->
        <!--          <a href="#">-->
        <!--            <i class="fa fa-list fa-2x"></i>-->
        <!--            <span class="nav-text">-->
        <!--              Forms-->
        <!--            </span>-->
        <!--          </a>-->
        <!--        </li>-->
        <!--        <li class="has-subnav">-->
        <!--          <a href="#">-->
        <!--            <i class="fa fa-folder-open fa-2x"></i>-->
        <!--            <span class="nav-text">-->
        <!--              Pages-->
        <!--            </span>-->
        <!--          </a>-->
        <!--        </li>-->
        <!--        <li>-->
        <!--          <a href="#">-->
        <!--            <i class="fa fa-bar-chart-o fa-2x"></i>-->
        <!--            <span class="nav-text">-->
        <!--              Graphs and Statistics-->
        <!--            </span>-->
        <!--          </a>-->
        <!--        </li>-->
        <!--        <li>-->
        <!--          <a href="#">-->
        <!--            <i class="fa fa-font fa-2x"></i>-->
        <!--            <span class="nav-text">-->
        <!--              Quotes-->
        <!--            </span>-->
        <!--          </a>-->
        <!--        </li>-->
        <!--        <li>-->
        <!--          <a href="#">-->
        <!--            <i class="fa fa-table fa-2x"></i>-->
        <!--            <span class="nav-text">-->
        <!--              Tables-->
        <!--            </span>-->
        <!--          </a>-->
        <!--          <ul class="">-->
        <!--            <li class="has-subnav">-->
        <!--              <a href="#">-->
        <!--                <i class="fa fa-folder-open fa-2x"></i>-->
        <!--                <span class="nav-text">-->
        <!--                  Pages-->
        <!--                </span>-->
        <!--              </a>-->
        <!--            </li>-->
        <!--            <li class="has-subnav">-->
        <!--              <a href="#">-->
        <!--                <i class="fa fa-folder-open fa-2x"></i>-->
        <!--                <span class="nav-text">-->
        <!--                  Pages-->
        <!--                </span>-->
        <!--              </a>-->
        <!--            </li>-->
        <!--            <li class="has-subnav">-->
        <!--              <a href="#">-->
        <!--                <i class="fa fa-folder-open fa-2x"></i>-->
        <!--                <span class="nav-text">-->
        <!--                  Pages-->
        <!--                </span>-->
        <!--              </a>-->
        <!--            </li>-->
        <!--          </ul>-->
        <!--        </li>-->
        <!--        <li>-->
        <!--          <a href="#">-->
        <!--            <i class="fa fa-map-marker fa-2x"></i>-->
        <!--            <span class="nav-text">-->
        <!--              Maps-->
        <!--            </span>-->
        <!--          </a>-->
        <!--        </li>-->
        <!--        <li>-->
        <!--          <a href="#">-->
        <!--            <i class="fa fa-info fa-2x"></i>-->
        <!--            <span class="nav-text">-->
        <!--              Documentation-->
        <!--            </span>-->
        <!--          </a>-->
        <!--        </li>-->
      </ul>

      <!--      <ul class="logout">-->
      <!--        <li>-->
      <!--          <a href="#">-->
      <!--            <i class="fa fa-power-off fa-2x"></i>-->
      <!--            <span class="nav-text">-->
      <!--              Logout-->
      <!--            </span>-->
      <!--          </a>-->
      <!--        </li>-->
      <!--      </ul>-->
    </nav>
  </div>
</template>

<script>
export default {
  data: () => ({
    active: true,
    reduce: true,
    menu: false,
    submenu: false,
  }),
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
};
</script>

<style>
@import url(//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css);

@import url(https://fonts.googleapis.com/css?family=Titillium+Web:300);


.fa-2x {
  font-size: 2em;
}

.fa {
  position: relative;
  display: table-cell;
  width: 60px;
  height: 36px;
  text-align: center;
  vertical-align: middle;
  font-size: 20px;
}

.main-menu:hover,
nav.main-menu.expanded {
  width: 250px;
  overflow: visible;
}

.main-menu {
  background: #212121;
  border-right: 1px solid #e5e5e5;
  position: fixed;
  top: 0;
  bottom: 0;
  height: 100%;
  left: 0;
  width: 60px;
  overflow: hidden;
  -webkit-transition: width 0.05s linear;
  transition: width 0.05s linear;
  -webkit-transform: translateZ(0) scale(1, 1);
  z-index: 1000;
}

.main-menu > ul {
  margin: 7px 0;
}

.main-menu li {
  position: relative;
  display: block;
  width: 250px;
}

.main-menu li > a {
  position: relative;
  display: table;
  border-collapse: collapse;
  border-spacing: 0;
  color: #999;
  font-family: arial;
  font-size: 14px;
  text-decoration: none;
  -webkit-transform: translateZ(0) scale(1, 1);
  -webkit-transition: all 0.1s linear;
  transition: all 0.1s linear;
}

.main-menu .nav-icon {
  position: relative;
  display: table-cell;
  width: 60px;
  height: 36px;
  text-align: center;
  vertical-align: middle;
  font-size: 18px;
}

.main-menu .nav-text {
  position: relative;
  display: table-cell;
  vertical-align: middle;
  width: 190px;
  font-family: "Titillium Web", sans-serif;
}

.main-menu > ul.logout {
  position: absolute;
  left: 0;
  bottom: 0;
}

.no-touch .scrollable.hover {
  overflow-y: hidden;
}

.no-touch .scrollable.hover:hover {
  overflow-y: auto;
  overflow: visible;
}

a:hover,
a:focus {
  text-decoration: none;
}

nav {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}

nav ul,
nav li {
  outline: 0;
  margin: 0;
  padding: 0;
}

.main-menu li:hover > a,
nav.main-menu li.active > a,
.dropdown-menu > li > a:hover,
.dropdown-menu > li > a:focus,
.dropdown-menu > .active > a,
.dropdown-menu > .active > a:hover,
.dropdown-menu > .active > a:focus,
.no-touch .dashboard-page nav.dashboard-menu ul li:hover a,
.dashboard-page nav.dashboard-menu ul li.active a {
  color: #fff;
  background-color: #5fa2db;
}

.area {
  float: left;
  background: red;
  width: 100%;
  height: 100%;
}

@font-face {
  font-family: "Titillium Web";
  font-style: normal;
  font-weight: 300;
  src: local("Titillium WebLight"), local("TitilliumWeb-Light"),
  url(http://themes.googleusercontent.com/static/fonts/titilliumweb/v2/anMUvcNT0H1YN4FII8wpr24bNCNEoFTpS2BTjF6FB5E.woff) format("woff");
}

.main-menu ul li ul {
  overflow: hidden;
  background: #000;
  color: #fff;
  height: 0;
  padding: 0 18px;
  -webkit-transition: all .5s ease;
  -moz-transition: all .5s ease;
  transition: all .5s ease;
}

.main-menu ul li:hover ul, .main-menu ul li.over ul {
  height: auto;
  padding: 24px 18px;
}

.a-sem-href {
  color: #999 !important;
  text-decoration: none;
}

.a-sem-href:hover {
  color: #fff !important;
}

.icone-bootstrap-menu {
  font-size: 8px;
  width: 60px;
  height: 30px;
  position: relative;
  display: table-cell;
  text-align: center;
  vertical-align: middle;
  padding-top: 5px;
}

.menu-top {
  display: none;
}

.icon__menu-hamburguer {
  font-size: 50px !important;
}

.menu-top__fechado {
  background-color: #212121;
  color: #dddddd;
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
  color: #dddddd;
  z-index: 2;
  position: relative;
}

.menu-top__aberto ul li {
  background-color: #2a2a2a;
  color: #dddddd;
  padding-top: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid #dddddd;
}

.menu-top__aberto-icone {
  color: #dddddd;
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
  color: #dddddd;
  font-size: 1.5rem;
}

.menu-top__submenu {
  padding-left: 15px;
}

.slide-down__menu_top-enter-active {
  transition: all .2s ease;
}

.slide-down__menu_top-leave-active {
  transition: all .2s ease;
}

.slide-down__menu_top-enter, .slide-down__menu_top-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

.slide-down__submenu-enter-active {
  transition: all .1s ease;
}

.slide-down__submenu-leave-active {
  transition: all .1s ease;
}

.slide-down__submenu-enter, .slide-down__submenu-leave-to {
  transform: translateY(-5px);
  opacity: 0;
}


@media screen and (max-width: 992px) {
  .main-menu {
    display: none;
  }

  .menu-top {
    display: block;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 3;
  }

}
</style>
