<template>
  <v-row class="topo elevation-1 pr-5 pa-2" no-gutters>
    <v-col>
      <v-row align="center" no-gutters>
        <v-col class="text-center">
          <h1 class="ma-0">GImóveis</h1>
        </v-col>
        <v-col cols="auto">
          <v-row no-gutters>
            <v-col cols="auto">
              <span><b>{{ $store.state.usuario.nome.split(" ")[0] }}</b></span>
            </v-col>
          </v-row>
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

  <!--  <b-container fluid >-->
  <!--    <b-row align-v="center" class="topo" >-->
  <!--      <b-col class="text-center">-->
  <!--        <h1>GImóveis</h1>-->
  <!--      </b-col>-->
  <!--      <b-col cols="auto">-->
  <!--        <b-row>-->
  <!--          <b-col cols="auto">-->
  <!--            <b-row class="text-center" align-v="center">-->
  <!--              <b-col>-->
  <!--                <p class="nome-topo"><b>{{ $store.state.usuario.nome.split(" ")[0] }}</b></p>-->
  <!--              </b-col>-->

  <!--            </b-row>-->
  <!--            <b-row class="text-center m-0">-->
  <!--              <b-col>-->
  <!--                <b-button variant="link" class="text-decoration-none btn-logout" v-b-modal.modal-1>Sair</b-button>-->
  <!--              </b-col>-->
  <!--            </b-row>-->
  <!--          </b-col>-->
  <!--&lt;!&ndash;          <b-col cols="auto" class="m-0">&ndash;&gt;-->
  <!--&lt;!&ndash;            <b-img right src="https://picsum.photos/250/250/?image=54" rounded="circle" alt="Circle image" width="60px"&ndash;&gt;-->
  <!--&lt;!&ndash;                   class="img-perfil"/>&ndash;&gt;-->
  <!--&lt;!&ndash;          </b-col>&ndash;&gt;-->
  <!--        </b-row>-->
  <!--      </b-col>-->
  <!--    </b-row>-->
  <!--    <b-modal id="modal-1" title="Sair" centered >-->
  <!--      <h5 class="my-4">Tem certeza que deseja sair ?</h5>-->
  <!--      <template #modal-footer="{ ok, cancel }">-->
  <!--        <b-button @click="cancel()">-->
  <!--          Cancelar-->
  <!--        </b-button>-->
  <!--        <b-button variant="danger" @click="sair()">-->
  <!--          Sair-->
  <!--        </b-button>-->
  <!--      </template>-->
  <!--    </b-modal>-->
  <!--  </b-container>-->
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
