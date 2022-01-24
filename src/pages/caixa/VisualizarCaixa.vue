<template>
  <v-row no-gutters>
    <v-col>
      <v-row no-gutters>
        <v-col>
          <barra-topo-busca titulo="Caixa" :busca="busca" @buscar="busca = $event"></barra-topo-busca>
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
                class="elevation-1 caixa-tabela pointer"
                :height="$isMobile ? 'calc(100vh - 300px)' : 'calc(100vh - 310px)'"
                single-expand
                :expanded="expanded"
                mobile-breakpoint="0"
                item-key="id"
            >
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" style="background-color: #d5e6fd">
                  <ul class="pa-3" style="list-style-type: none;">
                    <li v-if="item.complemento_historico">
                      <span><strong>Complemento histórico: </strong>{{ item.complemento_historico }}</span>
                    </li>
                    <li><span><strong>Ímovel: </strong>{{ item.imovel_nome }}</span></li>
                    <li><span><strong>Conta: </strong>{{ item.conta_nome }}</span></li>
                    <li v-if="item.numero_documento">
                      <span><strong>N° do documento: </strong>{{ item.numero_documento }}</span>
                    </li>
                  </ul>
                </td>
              </template>

              <template v-slot:item="{ item }">
                <tr>
                  <td @click.prevent="abrirDetalhes(item, $event)">{{ ("000000" + item.id).slice(-6) }}</td>
                  <td @click.prevent="abrirDetalhes(item, $event)">{{ item.descricao_historico }}</td>
                  <td @click.prevent="abrirDetalhes(item, $event)">R$ {{ item.valor.replace('.', ',') }}</td>
                  <td @click.prevent="abrirDetalhes(item, $event)">
                    {{ item.movimento ? dayjs(item.movimento).format('DD/MM/YYYY') : '' }}
                  </td>
                  <td @click.prevent="abrirDetalhes(item, $event)">{{ item.imovel_nome }}</td>
                  <td @click.prevent="abrirDetalhes(item, $event)">{{ item.conta_nome }}</td>
                  <td @click.prevent="abrirDetalhes(item, $event)"
                      :class="{'debito': item.id_debito_credito === 1, 'credito' : item.id_debito_credito === 2}">
                    {{ item.id_debito_credito === 1 ? 'Débito' : item.id_debito_credito === 2 ? 'Crédito' : '' }}
                  </td>
                  <td class="acoes text-center">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on" color="black" @click="dialogCaixa = true; caixa = item">
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
                            @click.prevent="dialogDeletar = true; caixa = item"
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

    <dialog-caixa
        :mostrar="dialogCaixa"
        @cancelar="dialogCaixa = false; caixa = {}"
        :dadosCaixa="caixa"
        @cadastrado="cadastrado"
        @editado="editado"
    >

    </dialog-caixa>

    <barra-bottom-botoes @clickBtnAdicionar="dialogCaixa = true"
                         @clickBtnImprimirRelatorio="gerarRelatorio"></barra-bottom-botoes>

    <dialog-deletar
        :texto="`Certeza que deseja deletar o caixa ${('000000' + caixa.id).slice(-6)} ?`"
        sub-texto="Após deletar esse caixa não é possivel recuperar!"
        :mostrar="dialogDeletar"
        @cancelar="dialogDeletar = !dialogDeletar"
        @deletar="deletar"
    >
    </dialog-deletar>

    <alerta-acoes
        :palavra-chave="'caixa'"
        @sumir="mostrarAlerta = false"
        v-bind:mostrar="mostrarAlerta"
        :funcao="funcao"
    >
    </alerta-acoes>
  </v-row>
</template>
<script>

import api from '../../services/api'
import dayjs from 'dayjs'
import {jsPDF} from "jspdf";
import 'jspdf-autotable'

import BarraTopoBusca from "../../components/shared/BarraTopoBusca"
import BarraBottomBotoes from "../../components/shared/BarraBottomBotoes"
import DialogCaixa from "./DialogCaixa"
import AlertaAcoes from "../../components/shared/AlertaAcoes";
import DialogDeletar from "../../components/shared/DialogDeletar";

export default {
  name: "VisualizarCaixa.vue",
  components: {
    BarraTopoBusca,
    BarraBottomBotoes,
    DialogCaixa,
    AlertaAcoes,
    DialogDeletar
  },
  data() {
    return {
      items: [],
      headers: [
        {text: 'Lançamento', value: 'id', align: 'center', width: '120px'},
        {text: 'Histórico', value: 'descricao_historico'},
        {text: 'Valor', value: 'valor'},
        {text: 'Movimento', value: 'movimento'},
        {text: 'Imóvel', value: 'imovel_nome'},
        {text: 'Conta', value: 'conta_nome'},
        {text: 'D/C', value: 'id_debito_credito'},
        {text: '', value: 'acoes', align: 'center', sortable: false, width: '90px'},
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 25,
      pageOptions: [25, 50, 100],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      transProps: {
        name: "flip-list",
      },
      dayjs: dayjs,
      caixa: {},
      barraBuscaMobile: false,
      carregandoTableCaixa: false,
      filtrados: [],
      historicos: [],
      dialogCaixa: false,

      funcao: '',
      mostrarAlerta: false,
      dialogDeletar: false,
      expanded: [],
      busca: ''
    }
  },
  created() {
    this.buscarCaixa()
  },
  methods: {
    async buscarCaixa() {
      this.carregandoTableCaixa = true
      await api.get('/caixa').then(consulta => {
        this.items = consulta.data
        this.filtrados = consulta.data
        this.totalRows = this.items.length
        this.carregandoTableCaixa = false
      })
    },

    async buscarHistoricos() {
      await api.get('/ajuste/historico').then(consulta => {
        this.historicos = consulta.data
        console.log(this.historicos)
      })
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

    cadastrado(item) {
      this.items.push(item)
      this.dialogCaixa = false
      this.funcao = 'cadastrado'
      this.mostrarAlerta = true
      this.caixa = {}
    },

    editado(item) {
      let index = this.items.findIndex(obj => {
        return obj.id === item.id
      })
      this.items[index].movimento = item.movimento
      this.items[index].valor = item.valor
      this.items[index].id_conta = item.id_conta
      this.items[index].conta_nome = item.conta_nome
      this.items[index].id_imovel = item.id_imovel
      this.items[index].imovel_nome = item.imovel_nome
      this.items[index].id_debito_credito = item.id_debito_credito
      this.items[index].numero_documento = item.numero_documento
      this.items[index].id_historico = item.id_historico
      this.items[index].descricao_historico = item.descricao_historico
      this.items[index].complemento_historico = item.complemento_historico
      this.dialogCaixa = false
      this.funcao = 'editado'
      this.mostrarAlerta = true
      this.caixa = {}
    },

    async deletar() {
      let caixa = this.caixa
      await api.delete(`/caixa/${caixa.id}`).then(resp => {
        let {id} = resp.data.caixa
        let index = this.items.findIndex(obj => {
          return obj.id === id
        })
        this.items.splice(index, 1)
        this.dialogDeletar = false
        this.funcao = 'deletado'
        this.mostrarAlerta = true
      })
    },

    gerarRelatorio() {
      console.log(this.filtrados)
      let hojeAgr = dayjs().format('DD/MM/YYYY hh:mm:ss')
      let novosDados = JSON.parse(JSON.stringify(this.filtrados))
      for (let i in novosDados) {
        let valorFormatado = `${novosDados[i].valor.replace('.', ',')}`
        let movimentoFormatada = dayjs(novosDados[i].movimento).format('DD/MM/YYYY')
        let codigoFormatado = ("000000" + novosDados[i].id).slice(-6)
        novosDados[i].valor = valorFormatado
        novosDados[i].movimento = movimentoFormatada
        novosDados[i].id = codigoFormatado
      }
      var doc = new jsPDF()
      doc.page = 1
      doc.setProperties({
        title: "Relátorio de Caixa"
      });
      doc.setFontSize(10)
      doc.text(hojeAgr, 200, 10, null, null, "right")
      doc.line(10, 12, 200, 12);
      doc.setFontSize(24)
      doc.text(`Relátorio de Caixa`, 10, 22)
      doc.setFontSize(14)
      doc.text(`Total: ${this.filtrados.length}`, 200, 21, null, null, "right")
      doc.autoTable({
        head: [['Código', 'Histórico', 'Valor', 'Movimento', 'Imóvel', 'Conta', 'D/C']],
        columns: [
          {header: 'Código', dataKey: 'id'},
          {header: 'Histórico', dataKey: 'descricao_historico'},
          {header: 'Valor', dataKey: 'valor'},
          {header: 'Movimento', dataKey: 'movimento'},
          {header: 'Imóvel', dataKey: 'imovel_nome'},
          {header: 'Conta', dataKey: 'conta_nome'},
        ],
        columnStyles: {id: {halign: 'center'}},
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
      window.open(doc.output('bloburl', {filename: 'tabela_imovel.pdf'}));
    },
  }
}
</script>

<style scoped>

.debito {
  color: red;
}

.credito {
  color: #105ab9;
}

.caixa-tabela >>> tbody tr:nth-of-type(even) {
  cursor: pointer;

}

.caixa-tabela >>> tbody tr:nth-of-type(odd) {
  background-color: #dedddd;
  cursor: pointer;
  /*color: white;*/
}

.caixa-tabela >>> tbody tr:hover {
  background-color: #4c9afc !important;
  color: white;
}

.caixa-tabela >>> thead {
  background-color: #01479a;
  /*color:white !important;*/
}

.caixa-tabela >>> thead th {
  color: white !important;
  border: 1px solid rgb(90, 90, 90);
}

.caixa-tabela >>> thead th i {
  color: white !important;
}

.caixa-tabela >>> tbody td {
  border: 1px solid rgb(150, 150, 150);
}

.caixa-tabela >>> .acoes {
  padding: 2px;
}

.caixa-tabela >>> tbody tr:hover .acoes i {
  color: white;
}

.caixa-tabela >>> tbody tr:hover .debito {
  color: white;
}

.caixa-tabela >>> tbody tr:hover .credito {
  color: white;
}

.caixa-tabela >>> .aberto {
  background-color: #63a1f6 !important;
  color: white !important;
}

.caixa-tabela >>> .aberto .credito {
  color: white !important;
}

.caixa-tabela >>> .aberto .debito {
  color: white !important;
}


.caixa-tabela >>> .v-data-footer__select .v-input {
  margin-left: 5px;
}

.caixa-tabela >>> .v-data-footer__select {
  margin: 0;
}

.caixa-tabela >>> .v-data-footer__pagination {
  margin-right: 5px;
}

@media screen and (max-width: 390px) {
  .caixa-tabela >>> .v-data-footer__pagination {
    display: none;
  }
}

</style>