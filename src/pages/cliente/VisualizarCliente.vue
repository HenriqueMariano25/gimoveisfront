<template>
  <v-row no-gutters>
    <v-col>
      <v-row no-gutters>
        <v-col>
          <barra-topo-busca titulo="Cliente" :busca="busca" @buscar="busca = $event"></barra-topo-busca>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col>
          <v-card class="border-radius pa-3">
            <v-data-table
                :search="busca"
                :headers="headers"
                :items="items"
                :footer-props="{
                   itemsPerPageOptions:[10,25,50,-1]
                }"
                class="elevation-1 tabela pointer"
                :height="$isMobile ? 'calc(100vh - 300px)' : 'calc(100vh - 310px)'"
                single-expand
                :expanded="expanded"
                mobile-breakpoint="0"
                item-key="id"
            >

              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" style="background-color: #d5e6fd">
                  <ul class="pa-3" style="list-style-type: none;">
                    <li><span><strong>Email: </strong>{{ item.email }}</span></li>
                    <li v-if="item.numero_telefone[0] !== null">
                      <span><strong>Telefones</strong></span>
                      <ul style="list-style-type: none;">
                        <div v-for="(telefone, index) in item.numero_telefone" :key="index">
                          <li>{{ telefone }} - {{ item.tipo_telefone[index] }}</li>
                        </div>
                      </ul>
                    </li>
                    <li v-if="item.rua && item.cep">
                      <v-row>
                        <v-col cols="auto">
                          <span><strong>Rua: </strong>{{ item.rua }}</span>
                        </v-col>
                        <v-col cols="auto">
                          <span><strong>Número: </strong>{{ item.numero }}</span>
                        </v-col>
                        <v-col cols="auto">
                          <span><strong>Bairro: </strong>{{ item.bairro }}</span>
                        </v-col>
                        <v-col cols="auto">
                          <span><strong>Cidade: </strong>{{ item.cidade }}</span>
                        </v-col>
                        <v-col cols="auto">
                          <span><strong>Estado: </strong>{{ item.estado }}</span>
                        </v-col>
                        <v-col cols="auto">
                          <span><strong>CEP: </strong>{{ item.cep }}</span>
                        </v-col>
                        <v-col cols="auto" v-if="item.complemento">
                          <span><strong>Complemento: </strong>{{ item.complemento }}</span>
                        </v-col>
                      </v-row>
                    </li>
                  </ul>
                </td>
              </template>
              <template v-slot:item="{ item }">
                <tr>
                  <td @click.prevent="abrirDetalhes(item, $event)">{{ item.nome }}</td>
                  <td @click.prevent="abrirDetalhes(item, $event)">{{ item.numero_telefone[0] }}</td>
                  <td @click.prevent="abrirDetalhes(item, $event)">{{ item.cpf_cnpj }}</td>
                  <td @click.prevent="abrirDetalhes(item, $event)">{{ item.status }}</td>
                  <td class="acoes text-center">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on" color="black"
                               @click="dialogCliente = true; idCliente = item.id">
                          <v-icon dark>
                            mdi-pencil
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Editar</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            icon
                            v-bind="attrs"
                            v-on="on"
                            color="black"
                            @click.prevent="dialogDeletar = true; cliente = item"
                        >
                          <v-icon dark>
                            mdi-delete
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Deletar</span>
                    </v-tooltip>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-col>

    <barra-bottom-botoes :btn-adicionar="true" @clickBtnAdicionar="dialogCliente = true"></barra-bottom-botoes>

    <dialog-cliente
        :mostrar="dialogCliente"
        @cancelar="cancelar"
        @cadastrado="cadastrado"
        @editado="editado"
        :idCliente="idCliente"

    ></dialog-cliente>

    <alerta-acoes
        :palavra-chave="'cliente'"
        @sumir="mostrarAlerta = false"
        v-bind:mostrar="mostrarAlerta"
        :funcao="funcao"
    ></alerta-acoes>

    <dialog-deletar
        :texto="`Certeza que deseja deletar o cliente: ${ cliente ? cliente.nome : ''} ?`"
        sub-texto="Após deletar esse cliente não é possivel recuperar!"
        :mostrar="dialogDeletar"
        @cancelar="dialogDeletar = !dialogDeletar; cliente = {}"
        @deletar="deletar"
    >
    </dialog-deletar>

  </v-row>
</template>

<script>

import api from '../../services/api'
import BarraTopoBusca from "../../components/shared/BarraTopoBusca"
import BarraBottomBotoes from "../../components/shared/BarraBottomBotoes"
import DialogCliente from "./DialogCliente";
import AlertaAcoes from "../../components/shared/AlertaAcoes"
import DialogDeletar from "../../components/shared/DialogDeletar"

export default {
  name: "VisualizarCliente",
  components: {
    BarraTopoBusca,
    BarraBottomBotoes,
    AlertaAcoes,
    DialogDeletar,
    DialogCliente

  },
  data() {
    return {
      items: [],
      headers: [
        {text: 'Nome', value: 'nome'},
        {text: 'Telefone', value: 'telefone'},
        {text: 'CPF / CNPJ', value: 'cpf_cnpj'},
        {text: 'Status', value: 'status'},
        {text: '', value: 'acoes', align: 'center', sortable: false, width: '90px'},
      ],
      idCliente: null,
      dialogCliente: false,
      busca: '',
      expanded: [],
      funcao: '',
      mostrarAlerta: false,
      dialogDeletar: false,
      cliente: {}
    }
  },

  methods: {
    async buscarClientes() {
      this.carregandoTableCliente = true
      await api.get('/clientes').then(resp => {
        this.items = resp.data
      }).catch(erro => {
        console.log(erro)
      })
    },

    cancelar(cliente){
      console.log(cliente)

      if(cliente){
        this.items.push(cliente)
      }

      this.dialogCliente = false
      this.idCliente = null
    },

    cadastrado(dados) {

      let { cliente, notificar } = dados
      this.items.push(cliente)

      if(notificar){
        this.mostrarAlerta = true
        this.funcao = 'cadastrado'
        this.dialogCliente = false
        this.cliente = {}
      }
    },

    editado(cliente){
      let index = this.items.findIndex(obj => {
        return obj.id === cliente.id
      })
      for(let key of Object.keys(cliente)){
        this.items[index][key] = cliente[key]
      }

      this.dialogCliente = false
      this.funcao = 'editado'
      this.mostrarAlerta = true
      this.idCliente = null
    },

    abrirDetalhes(item, evento) {
      let removerClass = document.querySelector('.aberto')
      if (removerClass)
        removerClass.classList.remove('aberto')

      let tr = evento.target.parentElement

      if (this.expanded[0] === item) {
        this.expanded = []
      } else {
        this.expanded = []
        tr.classList.add('aberto')
        this.expanded.push(item)
      }
    },

    async deletar() {
      let cliente = this.cliente
      await api.delete(`/cliente/deletar/${cliente.id}`).then(() => {
        let index = this.items.findIndex(obj => {
          return obj.id === cliente.id
        })
        this.dialogDeletar = false
        this.items.splice(index, 1)
        this.funcao = 'deletado'
        this.mostrarAlerta = true
        this.cliente = {}
      })
    },


  },
  mounted() {
    this.buscarClientes()
  },
}
</script>

<style scoped src="../../css/dataTableVuetifyCustom.css"/>

<style>

</style>
