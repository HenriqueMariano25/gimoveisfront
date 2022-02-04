<template>
  <v-row no-gutters>
    <v-col>
      <v-row no-gutters>
        <v-col>
          <barra-topo-busca titulo="Responsável" :busca="busca" @buscar="busca = $event"></barra-topo-busca>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col>
          <v-card class="border-radius pa-3">
            <v-data-table
                :search="busca"
                @update:page="$paraTopo"
                fixed-header
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
              <template v-slot:item="{ item }">
                <tr>
                  <td >{{ item.nome }}</td>
                  <td >{{ item.cpf_cnpj }}</td>
                  <td ><span v-if="item.rua">{{ item.rua }}, N°{{ item.numero}}, {{item.complemento}}</span></td>
                  <td class="acoes text-center">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on" color="black" @click="dialogResponsavel = true; idResponsavel = item.id">
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
                            @click.prevent="dialogDeletar = true; responsavel = item"
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

    <barra-bottom-botoes
        :btn-adicionar="true"
        @clickBtnAdicionar="dialogResponsavel = true"
        @clickBtnImprimirRelatorio="gerarRelatorio"
        :btn-gerar-relatorio="true"
    ></barra-bottom-botoes>

    <dialog-responsavel
        :mostrar="dialogResponsavel"
        @cancelar="cancelar"
        @cadastrado="cadastrado"
        @editado="editado"
        :idResponsavel="idResponsavel"
    ></dialog-responsavel>

    <alerta-acoes
        palavra-chave='responsável'
        @sumir="mostrarAlerta = false"
        v-bind:mostrar="mostrarAlerta"
        :funcao="funcao"
        :texto="textoAlerta"
    ></alerta-acoes>

    <dialog-deletar
        :texto="`Certeza que deseja deletar o responsável: ${ responsavel ? responsavel.nome : ''} ?`"
        sub-texto="Após deletar esse responsável não é possivel recuperar!"
        :mostrar="dialogDeletar"
        @cancelar="dialogDeletar = !dialogDeletar; responsavel = {}"
        @deletar="deletar"
    >
    </dialog-deletar>

  </v-row>
</template>

<script>
import BarraTopoBusca from "../../components/shared/BarraTopoBusca"
import BarraBottomBotoes from "../../components/shared/BarraBottomBotoes"

import DialogResponsavel from "./DialogResponsavel";
import AlertaAcoes from "../../components/shared/AlertaAcoes"
import DialogDeletar from "../../components/shared/DialogDeletar";

import dayjs from 'dayjs'
import 'jspdf-autotable'
import {jsPDF} from "jspdf"
import api from '../../services/api'

export default {
  name: "VisualizarResponsavel",
  components: {
    BarraTopoBusca,
    BarraBottomBotoes,
    DialogResponsavel,
    AlertaAcoes,
    DialogDeletar
  },
  data() {
    return {
      items: [],
      headers: [
        {text: 'Nome', value: 'nome'},
        {text: 'CPF / CNPJ', value: 'cpf_cnpj'},
        {text: 'Endereço', value: 'endereco'},
        {text: '', value: 'acoes', align: 'center', sortable: false, width: '90px'},
      ],
      busca: '',
      expanded: [],
      dialogImovel: false,
      idResponsavel: null,
      funcao: '',
      mostrarAlerta: false,
      dialogDeletar: false,
      responsavel: {},
      dialogResponsavel: false,
      textoAlerta: ''
    }
  },

  methods: {
    gerarRelatorio() {
      let novosDados = JSON.parse(JSON.stringify(this.items))
      for (let dado of novosDados) {
        if(dado.rua){
          let rua_formatada = `${dado.rua}, N° ${dado.numero}, ${dado.complemento}`
          dado.rua = rua_formatada
        }
      }
      let hojeAgr = dayjs().format('DD/MM/YYYY hh:mm:ss')
      var doc = new jsPDF()
      doc.page = 1
      doc.setProperties({
        title: "Relátorio de Responsáveis"
      });
      doc.setFontSize(10)
      doc.text(hojeAgr, 200, 10, null, null, "right")
      doc.line(10, 12, 200, 12);
      doc.setFontSize(24)
      doc.text(`Relátorio de Responsáveis`, 10, 22)
      doc.setFontSize(14)
      doc.text(`Total: ${this.items.length}`, 200, 21, null, null, "right")
      doc.autoTable({
        head: [['Nome', 'CPF/CNPJ', 'Endereço']],
        columns: [
          {header: 'Nome', dataKey: 'nome'},
          {header: 'CPF/CNPJ', dataKey: 'cpf_cnpj'},
          {header: 'Endereço', dataKey: 'rua'},
        ],
        body: novosDados,
        theme: 'striped',
        headStyles: {
          fillColor: [50, 50, 50]
        },
        startY: 25,
        pageBreak: 'auto',
        margin: {left: 10, right: 10, top: 10},
      })
      const totalPaginas = doc.internal.getNumberOfPages()
      doc.setFontSize(8)
      for (var i = 1; i <= totalPaginas; i++) {
        doc.setPage(i)
        doc.text(`Página ${String(i)} de ${String(totalPaginas)}`, 205, 293, null, null, "right")
      }
      window.open(doc.output('bloburl', {filename: 'tabela_responsaveis.pdf'}));
    },

    cancelar(responsavel){
      if(responsavel){
        this.items.push(responsavel)
      }

      this.dialogResponsavel = false
      this.idResponsavel = null
    },

    cadastrado(dados) {
      let { responsavel, notificar } = dados

      if(notificar){
        this.items.push(responsavel)
        this.mostrarAlerta = true
        this.funcao = 'cadastrado'
        this.dialogResponsavel = false
        this.responsavel = {}
      }
    },

    editado(responsavel){
      let index = this.items.findIndex(obj => {
        return obj.id === responsavel.id
      })
      for(let key of Object.keys(responsavel)){
        this.items[index][key] = responsavel[key]
      }
      this.dialogResponsavel = false
      this.funcao = 'editado'
      this.mostrarAlerta = true
      this.idResponsavel = null
    },

    async deletar() {
      let responsavel = this.responsavel
      await api.delete(`/responsavel/deletar/${responsavel.id}`).then(() => {
        let index = this.items.findIndex(obj => {
          return obj.id === responsavel.id
        })
        this.dialogDeletar = false
        this.items.splice(index, 1)
        this.funcao = 'deletado'
        this.mostrarAlerta = true
        this.responsavel = {}
      }).catch(erro => {
        let mensagem = erro.response.data.erro
        this.funcao = 'erro'
        this.textoAlerta = mensagem
        this.mostrarAlerta = true
      })
    },
    async buscarResponsaveis() {
      await api.get('/responsaveis').then(response => {
        this.items = response.data
      }).catch(erro => {
        console.log(erro)
      })
    },
  },
  async mounted() {
    this.buscarResponsaveis()
  },
}
</script>
<style scoped src="../../css/dataTableVuetifyCustom.css"/>

<style>

</style>
