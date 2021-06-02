<template>
  <modal
      name="modal-conta"
      width="90%"
      height="auto"
      :scrollable="true"
      :click-to-close="false"
      class="modal-conta"
      @opened="inicializar"
  >
    <h3>Cadastro de Conta</h3>
    <Carregando :visivel="carregandoVisivel" :style="{ 'height':'65px', 'line-height': '10px' }"></Carregando>
    <b-row>
      <b-col>
        <vs-input label-placeholder="Nome da empresa*" v-model="conta.nome"/>
      </b-col>
    </b-row>
    <b-row align-h="end" class="mt-2">
      <b-col cols="auto" >
        <vs-button color="#24a35a" type="filled" icon="save" class="botao-salvar" @click.native="editar" v-if="conta.id > 0">
          Salvar
        </vs-button>
        <vs-button color="#24a35a" type="filled" icon="save" class="botao-salvar" @click.native="cadastrar" v-else>
          Salvar
        </vs-button>
      </b-col>
      <b-col cols="auto">
        <vs-button color="#707070" type="filled" icon="clear" class="botao-salvar" @click.native="esconderModal">
          Cancelar
        </vs-button>
      </b-col>
    </b-row>
  </modal>
</template>

<script>

import api from '../../services/api'
import Carregando from "@/components/shared/Carregando";

export default {
  name: "ModalConta",
  props:['dados'],
  components: {
    Carregando
  },
  data(){
    return{
      conta:{
        nome:'',
        id: ''
      },
      carregandoVisivel: true
    }
  },
  methods:{
    async inicializar(){

      if(this.dados) this.conta = this.dados
      this.carregandoVisivel = false
    },
    async cadastrar(){
      let idUsuario = this.$store.state.usuario.id
      await api.post('/ajuste/conta', {conta: this.conta, idUsuario: idUsuario}).then(() => {
        this.$vs.notify({
          text: `Conta cadastrada com sucesso !`,
          position: 'top-center',
          color: 'success',
          time: 6000,
          icon: 'check_circle_outline'
        })
        this.esconderModal()
        this.recarregarDados()
      })
    },
    async editar(){
      let idUsuario = this.$store.state.usuario.id
      await api.put('/ajuste/conta', {conta: this.conta, idUsuario: idUsuario}).then(() => {
        this.esconderModal()
        this.recarregarDados()
        this.$vs.notify({
          text: `Conta editada com sucesso !`,
          position: 'top-center',
          color: 'warning',
          time: 6000,
          icon: 'check_circle_outline'
        })
      })
    },
    esconderModal() {
      this.$modal.hide('modal-conta')
      this.conta = { nome:'', id: '' }
      this.carregandoVisivel = true
    },
    recarregarDados() {
      this.$emit('recarregarDados')
    }
  },
}
</script>

<style scoped>

.modal-conta {
  margin-left: 25px;
}

</style>