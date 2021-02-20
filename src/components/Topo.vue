<template>
  <b-container fluid >
    <b-row align-v="center" class="topo" >
      <b-col class="text-center">
        <h1>Gimoveis</h1>
      </b-col>
      <b-col cols="auto">
        <b-row>
          <b-col cols="auto">
            <b-row class="text-center" align-v="center">
              <b-col>
                <p class="nome-topo"><b>{{ $store.state.usuario.nome.split(" ")[0] }}</b></p>
              </b-col>

            </b-row>
            <b-row class="text-center m-0">
              <b-col>
                <b-button variant="link" class="text-decoration-none btn-logout" v-b-modal.modal-1>Sair</b-button>
              </b-col>
            </b-row>
          </b-col>
          <b-col cols="auto" class="m-0">
            <b-img right src="https://picsum.photos/250/250/?image=54" rounded="circle" alt="Circle image" width="60px"
                   class="img-perfil"/>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-modal id="modal-1" title="Sair" centered >
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
  </b-container>
</template>

<script>
export default {
  name: "Topo",
  methods: {
    sair() {
      this.$store.commit('DESLOGAR_USUARIO')
      this.$router.push({name: 'Login'})
    },
  }
}
</script>

<style scoped>
.topo{
  box-shadow: 0px 1px 5px rgba(200,200,200,0.6);
  background-color: white;
}

.img-perfil {
  margin-top: 10px;
  margin-right: 10px;
}

.btn-logout {
  margin: 0;
  color: black;
}

.nome-topo {
  margin: 0;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
