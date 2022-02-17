<template>
  <div class="menu">
    <v-navigation-drawer
        permanent
        expand-on-hover
        class="navigation"
        dark
    >
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              {{ $store.state.usuario.nome }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ $store.state.usuario.usuario.split(" ")[0] }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list nav dense>
        <router-link to="/">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>
        </router-link>

        <router-link to="/visualizar/caixa">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-cash-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Caixa</v-list-item-title>
          </v-list-item>
        </router-link>

        <router-link to="/visualizar/cliente">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-account-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Clientes</v-list-item-title>
          </v-list-item>
        </router-link>

        <router-link to="/visualizar/imovel">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-home-group</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Imóveis</v-list-item-title>
          </v-list-item>
        </router-link>

        <router-link to="/visualizar/responsavel">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-account-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Responsáveis</v-list-item-title>
          </v-list-item>
        </router-link>

        <router-link to="/visualizar/contrato">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-briefcase-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Contratos</v-list-item-title>
          </v-list-item>
        </router-link>

        <router-link to="/visualizar/usuario">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-card-account-details-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Usuários</v-list-item-title>
          </v-list-item>
        </router-link>
      </v-list>

      <v-divider></v-divider>

      <v-list nav dense>
        <router-link to="/ajuste">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Ajuste</v-list-item-title>
          </v-list-item>
        </router-link>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "Menu",
};
</script>

<style>
.menu {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 3;
}

.navigation .v-list:not(:first-of-type) .v-list-item:hover {
  background-color: #5fa2db !important;
}

</style>
