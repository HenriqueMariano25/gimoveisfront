<template>
  <v-row no-gutters>
    <v-col>
      <v-row no-gutters>
        <v-col>
          <barra-topo-busca titulo="Ajuste" :temBusca="false"></barra-topo-busca>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col>
          <v-card class="border-radius pa-3">
            <v-row>
              <v-tabs
                  v-model="tab"
                  grow
                  class="tab-personalizada"
              >
                <v-tab>Conta</v-tab>
                <v-tab>Histórico</v-tab>

                <v-tabs-items v-model="tab">

                  <v-tab-item>
                    <v-row class="pa-4 mt-0" no-gutters>
                      <v-col>
                        <v-row >
                          <v-col>
                            <h1>Conta</h1>
                          </v-col>
                          <v-col cols="auto">
                            <v-btn color="var(--btn-salvar)" dark large @click="dialogConta = true;">
                              <v-icon class="mr-2">
                                mdi-plus
                              </v-icon>
                              Adicionar
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-row class="mt-0">
                          <v-col>
                            <v-data-table
                                @update:page="$paraTopo"
                                :headers="camposConta"
                                :items="contas"
                                fixed-header
                                :footer-props="{
                                    itemsPerPageOptions:[10,25,50,-1]
                                 }"
                                class="elevation-1 tabela pointer"
                                mobile-breakpoint="0"
                                item-key="id"
                            >
                              <template v-slot:item="{ item }">
                                <tr>
                                  <td>{{ item.nome }}</td>
                                  <td class="acoes text-center">
                                    <v-tooltip top>
                                      <template v-slot:activator="{ on, attrs }">
                                        <v-btn icon v-bind="attrs" v-on="on" color="black" @click="dialogConta = true; conta = item">
                                          <v-icon dark>
                                            mdi-pencil
                                          </v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Editar</span>
                                    </v-tooltip>
                                  </td>
                                </tr>
                              </template>
                            </v-data-table>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-tab-item>

                  <v-tab-item>
                    <v-row class="pa-4 mt-0" no-gutters>
                      <v-col>
                        <v-row >
                          <v-col>
                            <h1>Histórico</h1>
                          </v-col>
                          <v-col cols="auto">
                            <v-btn color="var(--btn-salvar)" dark large @click="dialogHistorico = true;">
                              <v-icon class="mr-2">
                                mdi-plus
                              </v-icon>
                              Adicionar
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-row class="mt-0">
                          <v-col>
                            <v-data-table
                                @update:page="$paraTopo"
                                :headers="camposHistorico"
                                :items="historicos"
                                fixed-header
                                :footer-props="{
                                    itemsPerPageOptions:[10,25,50,-1]
                                 }"
                                class="elevation-1 tabela pointer"
                                mobile-breakpoint="0"
                                item-key="id"
                            >
                              <template v-slot:item="{ item }">
                                <tr>
                                  <td>{{ item.descricao }}</td>
                                  <td class="acoes text-center">
                                    <v-tooltip top>
                                      <template v-slot:activator="{ on, attrs }">
                                        <v-btn icon v-bind="attrs" v-on="on" color="black" @click="dialogHistorico = true; historico = item">
                                          <v-icon dark>
                                            mdi-pencil
                                          </v-icon>
                                        </v-btn>
                                      </template>
                                      <span>Editar</span>
                                    </v-tooltip>
                                  </td>
                                </tr>
                              </template>
                            </v-data-table>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-tab-item>

                </v-tabs-items>
              </v-tabs>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-col>

    <dialog-conta
      :mostrar="dialogConta"
      :dados="conta"
      @cancelar="dialogConta = false; conta = null"
      @editado="contaEditada"
      @cadastrado="contaCadastrada"
    />

    <dialog-historico
        :mostrar="dialogHistorico"
        :dados="historico"
        @cancelar="dialogHistorico = false; historico = null"
        @editado="historicoEditada"
        @cadastrado="historicoCadastrada"
    />

    <alerta-acoes
        :palavra-chave="palavraChave"
        @sumir="mostrarAlerta = false"
        v-bind:mostrar="mostrarAlerta"
        :funcao="funcao"
    />


  </v-row>
</template>

<script>
import BarraTopoBusca from "../../components/shared/BarraTopoBusca"
import DialogConta from "./DialogConta";
import AlertaAcoes from "../../components/shared/AlertaAcoes";
import DialogHistorico from "./DialogHistorico";


import api from '../../services/api'

export default {
  name: "VisualizarAjuste",
  components: {
    BarraTopoBusca,
    DialogConta,
    AlertaAcoes,
    DialogHistorico
  },
  data() {
    return {
      tab: null,
      dialogConta: false,
      dialogHistorico: false,
      conta: null,
      funcao: '',
      palavraChave: 'conta',
      mostrarAlerta: false,

      contas: [],
      camposConta: [
        {text: 'Nome', value: 'nome'},
        {text: '', value: 'acoes', align: 'center', sortable: false, width: '90px'},
      ],
      historicos: [],
      historico: '',
      camposHistorico: [
        {text: 'Descrição', value: 'descricao'},
        {text: '', value: 'acoes', align: 'center', sortable: false, width: '90px'},
      ],
    }
  },
  created() {
    this.buscarContas()
    this.buscarHistoricos()
  },
  methods: {
    async buscarContas() {
      await api.get('ajuste/conta').then(consulta => {
        this.contas = consulta.data
      })
    },
    async buscarHistoricos() {
      await api.get('ajuste/historico').then(consulta => {
        this.historicos = consulta.data
      })
    },


    contaEditada(conta) {
      let index = this.contas.findIndex(obj => {
        return obj.id === conta.id
      })

      for (let key of Object.keys(conta)) {
        this.contas[index][key] = conta[key]
      }
      this.conta = null
      this.funcao = 'editado'
      this.palavraChave = 'conta'
      this.mostrarAlerta = true
      this.dialogConta = false
    },

    contaCadastrada(conta) {
      this.contas.push(conta)
      this.dialogConta = false
      this.funcao = 'cadastrado'
      this.palavraChave = 'conta'
      this.mostrarAlerta = true
      this.conta = null
    },


    historicoEditada(historico) {
      let index = this.historicos.findIndex(obj => {
        return obj.id === historico.id
      })

      for (let key of Object.keys(historico)) {
        this.historicos[index][key] = historico[key]
      }
      this.historico = null
      this.funcao = 'editado'
      this.palavraChave = 'histórico'
      this.mostrarAlerta = true
      this.dialogHistorico = false
    },

    historicoCadastrada(historico) {
      this.historicos.push(historico)
      this.dialogHistorico = false
      this.funcao = 'cadastrado'
      this.palavraChave = 'histórico'
      this.mostrarAlerta = true
      this.historico = null
    },
  }
}
</script>

<style scoped src="../../css/dataTableVuetifyCustom.css"/>

<style scoped>

</style>