<template>
  <b-container fluid class="centralizar-container">
    <b-row class="barra-top-ajuste" align-v="center">
      <b-col>
        <h1>Ajustes</h1>
      </b-col>
    </b-row>
    <b-row class="tabelas">
      <b-col cols="12" class="bloco" id="bloco-conta" md="6" >
        <b-row class="bloco__titulo_e_btn no-gutters">
          <b-col class="titulo">
            <h3>Conta</h3>
          </b-col>
          <b-col cols="auto">
            <vs-button color="#24a35a" type="filled" icon="add" @click="modalCadastrarConta">
              Adicionar
            </vs-button>
          </b-col>
        </b-row>
        <b-row class="no-gutters">
          <b-col class="bloco__tabela">
            <b-table
                class="tabela"
                id="tabela"
                primary-key="id"
                bordered
                head-variant="dark"
                sort-icon-left
                :items="contas"
                :fields="camposConta"
                show-empty
                small
                striped
                hover
                outlined
                sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px)"
                tbody-tr-class="linhas-tabela"
                no-border-collapse>
              <template #table-colgroup>
                <col>
                <col style="width: 15px">
              </template>
              <template #cell(nome)="row">
                  <label class="linhas-tabela">{{ row.item.nome }}</label>
              </template>
              <template #cell(editar)="row">
                <vs-tooltip text="Editar">
                  <vs-button type="flat" color="dark" icon="edit" @click.native="modalEditarModalConta(row)"></vs-button>
                </vs-tooltip>
              </template>
<!--              <template #cell(deletar)>-->
<!--                <vs-tooltip text="Deletar">-->
<!--                  <vs-button type="flat" color="dark" icon="delete"></vs-button>-->
<!--                </vs-tooltip>-->
<!--              </template>-->
            </b-table>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="12" class="bloco" md="6">
        <b-row class="bloco__titulo_e_btn no-gutters">
          <b-col class="titulo">
            <h3>Histórico</h3>
          </b-col>
          <b-col cols="auto">
            <vs-button color="#24a35a" type="filled" icon="add" @click="modalCadastrarHistorico">
              Adicionar
            </vs-button>
          </b-col>
        </b-row>
        <b-row class="no-gutters">
          <b-col class="bloco__tabela">
            <b-table
                class="tabela"
                id="tabela"
                primary-key="id"
                bordered
                head-variant="dark"
                sort-icon-left
                :items="historicos"
                :fields="camposHistorico"
                show-empty
                small
                striped
                hover
                outlined
                sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px)"
                tbody-tr-class="linhas-tabela"
                no-border-collapse>
              <template #table-colgroup>
                <col>
                <col style="width: 15px">
              </template>
              <template #cell(descricao)="row">
                <label class="linhas-tabela">{{ row.item.descricao }}</label>
              </template>
              <template #cell(editar)="row">
                <vs-tooltip text="Editar">
                  <vs-button type="flat" color="dark" icon="edit" @click.native="modalEditarModalHistorico(row)"></vs-button>
                </vs-tooltip>
              </template>
              <!--              <template #cell(deletar)>-->
              <!--                <vs-tooltip text="Deletar">-->
              <!--                  <vs-button type="flat" color="dark" icon="delete"></vs-button>-->
              <!--                </vs-tooltip>-->
              <!--              </template>-->
            </b-table>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <ModalConta @recarregarDados="buscarContas" :dados="conta"></ModalConta>
    <ModalHistorico @recarregarDados="buscarHistoricos" :dados="historico"></ModalHistorico>
  </b-container>
</template>

<script>

import ModalConta from "@/components/Ajuste/ModalConta"
import ModalHistorico from "@/components/Ajuste/ModalHistorico"
import api from '../../services/api'

export default {
  name: "VisualizarAjuste",
  components: {
    ModalConta,
    ModalHistorico
  },
  data(){
    return{
      contas:[],
      conta: '',
      camposConta: [
        {key: 'nome', label: 'Nome', sortable: true, thClass: 'text-center'},
        {key: 'editar', label: ''},
        // {key: 'deletar', label: ''},
      ],
      historicos:[],
      historico: '',
      camposHistorico: [
        {key: 'descricao', label: 'Descrição', sortable: true, thClass: 'text-center'},
        {key: 'editar', label: ''},
      ]
    }
  },
  created() {
    this.buscarContas()
    this.buscarHistoricos()
  },
  methods:{
    async buscarContas(){
      await api.get('ajuste/conta').then(consulta => {
        this.contas = consulta.data
      })
    },
    mostrarModalConta(){
      this.$modal.show('modal-conta')
    },
    modalCadastrarConta(){
      this.mostrarModalConta()
      this.conta = {}
    },
    modalEditarModalConta(conta){
      this.conta = {nome: conta.item.nome, id:conta.item.id}
      this.mostrarModalConta()
    },


    async buscarHistoricos(){
      await api.get('ajuste/historico').then(consulta => {
        this.historicos = consulta.data
        console.log(this.historicos)
      })
    },
    mostrarModalHistorico(){
      this.$modal.show('modal-historico')
    },
    modalCadastrarHistorico(){
      this.mostrarModalHistorico()
      this.historico = {}
    },
    modalEditarModalHistorico(historico){
      this.historico = {descricao: historico.item.descricao, id:historico.item.id}
      this.mostrarModalHistorico()
    },
  }
}
</script>

<style scoped>

.barra-top-ajuste {
  padding: 0;
  background-color: white;
  margin: 0;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0px 1px 5px rgba(200, 200, 200, 0.5);
}

.tabelas {
  background-color: white;
  margin: 0;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0px 1px 5px rgba(200, 200, 200, 0.5)
}

.bloco {
  padding: 10px;
  border-radius: 5px;
  background-color: rgb(220, 220, 220);
  box-shadow: 0px 1px 5px rgba(200, 200, 200, 0.5);
}

.bloco__titulo_e_btn {
}

.titulo {
  margin: 0;
  padding-top: 3px;
  padding-left: 10px;
}

.bloco__tabela{
  margin-top: 10px;
  margin-bottom: 0;
  background-color: white;
  padding: 0;
}

.tabela{
  margin: 0;
  padding: 0;
}

.linhas-tabela{
  padding-top: 7px;
  padding-left: 3px;
  margin:0;
}

@media screen and (max-width: 992px) {

}

</style>