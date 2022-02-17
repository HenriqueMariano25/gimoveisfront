<template>
  <v-row class="topo elevation-1 pr-5 pa-2" no-gutters>
    <v-col>
      <v-row align="center" no-gutters>
        <v-col class="text-center">
          <h1 class="ma-0">GImóveis</h1>
        </v-col>
        <v-col cols="auto">
          <v-row no-gutters>
            <v-col class="text-center" cols="auto">
              <v-btn text @click="dialogSair = true">Sair</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>

    <v-dialog v-model="dialogSair"  max-width="400px">
      <v-card class="pa-5">
        <v-row>
          <v-col>
            <h5 class="text-center">Tem certeza que deseja sair ?</h5>
          </v-col>
        </v-row>
        <v-row justify="space-between">
          <v-col cols="auto">
            <v-btn text @click="dialogSair = false">
              Cancelar
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn depressed color="red darken-2" dark @click="sair()">
              Sair
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>

  </v-row>
</template>

<script>
export default {
  name: "Topo",
  data() {
    return {
      dialogSair: false
    }
  },
  methods: {
    sair() {
      this.$store.commit('DESLOGAR_USUARIO')
      this.$router.push({name: 'Login'})
    },
  }
}
</script>

<style scoped>
.topo {
  /*box-shadow: 0px 1px 5px rgba(200, 200, 200, 0.6);*/
  background-color: white;
}

.img-perfil {
  margin-top: 10px;
  margin-right: 10px;
}


.nome-topo {
  margin: 0;
  margin-top: 10px;
  margin-bottom: 10px;
}

@media screen and (max-width: 992px) {
  .topo {
    margin-top: 56px;
    display: none;
  }
}
</style>
