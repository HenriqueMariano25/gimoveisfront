<template>
  <modal
      name="modal-historico"
      width="90%"
      height="auto"
      :scrollable="true"
      :click-to-close="false"
      class="modal-historico"
      @opened="inicializar"
  >
    <h3>Cadastro de Historico</h3>
    <Carregando :visivel="carregandoVisivel" :style="{ 'height':'65px', 'line-height': '10px' }"></Carregando>
    <b-row>
      <b-col>
        <vs-input label-placeholder="Descrição do Histórico*" v-model="historico.descricao"/>
      </b-col>
    </b-row>
    <b-row align-h="end" class="mt-2">
      <b-col cols="auto" >
        <vs-button color="#dc3546" type="filled" icon="delete" class="botao-salvar" @click.native="deletar" v-if="historico.id > 0">
          Deletar
        </vs-button>
      </b-col>
      <b-col cols="auto" >
        <vs-button color="#24a35a" type="filled" icon="save" class="botao-salvar" @click.native="editar" v-if="historico.id > 0">
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
  name: "ModalHistorico",
  props:['dados'],
  components: {
    Carregando
  },
  data(){
    return{
      historico:{
        descricao:'',
        id: ''
      },
      carregandoVisivel: true
    }
  },
  methods:{
    async inicializar(){

      if(this.dados) this.historico = this.dados
      this.carregandoVisivel = false
    },
    async cadastrar(){
      await api.post('/ajuste/historico', {historico: this.historico}).then(() => {

        this.$vs.notify({
          text: `Historico cadastrado com sucesso !`,
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
      await api.put('/ajuste/historico', {historico: this.historico}).then(() => {
        this.esconderModal()
        this.recarregarDados()
        this.$vs.notify({
          text: `Historico editado com sucesso!`,
          position: 'top-center',
          color: 'success',
          time: 6000,
          icon: 'check_circle_outline'
        })
      })
    },

    async deletar(){
      let id = this.historico.id

      await api.delete(`/ajuste/historico/${id}`).then(() => {
        this.esconderModal()
        this.recarregarDados()
        this.$vs.notify({
          text: `Historico deletado com sucesso!`,
          position: 'top-center',
          color: 'danger',
          time: 6000,
          icon: 'delete'
        })
      }).catch(erro => {
        let mensagem = erro.response.data.message

        this.$vs.notify({
          text: `${mensagem}`,
          position: 'top-center',
          color: 'warning',
          time: 6000,
          icon: 'report_problem'
        })
      })
    },
    esconderModal() {
      this.$modal.hide('modal-historico')
      this.historico = { descricao:'', id: '' }
      this.carregandoVisivel = true
    },
    recarregarDados() {
      this.$emit('recarregarDados')
    }
  },
}
</script>

<style scoped>

.modal-historico {
  margin-left: 25px;
}

</style>