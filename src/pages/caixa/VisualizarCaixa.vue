<template>
  <v-row no-gutters>
    <barra-topo-busca titulo="Caixa"></barra-topo-busca>
    <v-col>
      <v-row class="mt-0">
        <v-col>
          <v-card class="">
            <v-data-table
              @update:page="$paraTopo"
              fixed-header
              :headers="headers"
              :items="filtrarCaixa"

              class="tabela pointer"
              :height="
                $isMobile ? 'calc(100vh - 300px)' : 'calc(100vh - 187px)'
              "
              single-expand
              :expanded="expanded"
              mobile-breakpoint="0"
              item-key="id"
              dense
              calculate-widths
              :page.sync="pagina"
              hide-default-footer
              @page-count="contadorPagina = $event"
              :server-items-length="totalItens"
              :items-per-page="itensPorPagina"
            >
              <template v-slot:[`header.id`]="{ header }">
                {{ header.text }}
                <FiltroSimples
                  textoFiltro="Buscar por lançamento"
                  @enviar-filtro="buscaLancamento = $event"
                  @limpar-filtro="buscaLancamento = null"
                />
              </template>
              <template v-slot:[`header.descricao_historico`]="{ header }">
                {{ header.text }}
                <FiltroSimples
                  textoFiltro="Buscar por histórico"
                  @enviar-filtro="buscaHistorico = $event"
                  @limpar-filtro="buscaHistorico = null"
                />
              </template>
              <template v-slot:[`header.valor`]="{ header }">
                {{ header.text }}
                <FiltroSimples
                  textoFiltro="Buscar por valor"
                  @enviar-filtro="buscaValor = $event"
                  @limpar-filtro="buscaValor = null"
                />
              </template>
              <template v-slot:[`header.movimento`]="{ header }">
                {{ header.text }}
                <FiltroData
                  textoFiltro="Buscar por movimento"
                  @enviar-filtro="buscaMovimento = $event"
                  @limpar-filtro="buscaMovimento = null"
                />
              </template>

              <template v-slot:[`header.imovel_nome`]="{ header }">
                {{ header.text }}
                <FiltroSimples
                  textoFiltro="Buscar por imóvel"
                  @enviar-filtro="buscaImovel = $event"
                  @limpar-filtro="buscaImovel = null"
                />
              </template>
              <template v-slot:[`header.conta_nome`]="{ header }">
                {{ header.text }}
                <FiltroSimples
                  textoFiltro="Buscar por conta"
                  @enviar-filtro="buscaConta = $event"
                  @limpar-filtro="buscaConta = null"
                />
              </template>
              <template v-slot:[`header.id_debito_credito`]="{ header }">
                {{ header.text }}
                <FiltroSimples
                  textoFiltro="Buscar por Debito/Crédito"
                  @enviar-filtro="buscaDebitoCredito = $event"
                  @limpar-filtro="buscaDebitoCredito = null"
                />
              </template>
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" style="background-color: #d5e6fd">
                  <ul class="pa-3" style="list-style-type: none">
                    <li v-if="item.complemento_historico">
                      <span
                        ><strong>Complemento histórico: </strong
                        >{{ item.complemento_historico }}</span
                      >
                    </li>
                    <li>
                      <span
                        ><strong>Ímovel: </strong>{{ item.imovel_nome }}</span
                      >
                    </li>
                    <li>
                      <span><strong>Conta: </strong>{{ item.conta_nome }}</span>
                    </li>
                    <li v-if="item.numero_documento">
                      <span
                        ><strong>N° do documento: </strong
                        >{{ item.numero_documento }}</span
                      >
                    </li>
                  </ul>
                </td>
              </template>
              <template v-slot:[`item.id`]="{ item }">
                <span style="white-space: nowrap">{{
                  ("000000" + item.id).slice(-6)
                }}</span>
              </template>

              <template v-slot:item="{ item }">
                <tr>
                  <td @click.prevent="abrirDetalhes(item, $event)">
                    <span style="white-space: nowrap">
                      {{ ("000000" + item.id).slice(-6) }}
                    </span>
                  </td>
                  <td @click.prevent="abrirDetalhes(item, $event)">
                    <span style="white-space: nowrap">
                      {{ item.descricao_historico }}
                    </span>
                  </td>
                  <td @click.prevent="abrirDetalhes(item, $event)">
                    <span style="white-space: nowrap">
                      R$ {{ item.valor.replace(".", ",") }}
                    </span>
                  </td>
                  <td @click.prevent="abrirDetalhes(item, $event)">
                    <span style="white-space: nowrap">
                      {{
                        item.movimento
                          ? dayjs(item.movimento).format("DD/MM/YYYY")
                          : ""
                      }}
                    </span>
                  </td>
                  <td @click.prevent="abrirDetalhes(item, $event)">
                    <span style="white-space: nowrap">
                      {{ item.imovel_nome }}
                    </span>
                  </td>
                  <td @click.prevent="abrirDetalhes(item, $event)">
                    <span style="white-space: nowrap">
                      {{ item.conta_nome }}
                    </span>
                  </td>
                  <td
                    @click.prevent="abrirDetalhes(item, $event)"
                    :class="{
                      debito: item.id_debito_credito === 1,
                      credito: item.id_debito_credito === 2,
                    }"
                  >
                    <span style="white-space: nowrap">
                      {{
                        item.id_debito_credito === 1
                          ? "Débito"
                          : item.id_debito_credito === 2
                          ? "Crédito"
                          : ""
                      }}
                    </span>
                  </td>
                  <td class="acoes text-center">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          color="black"
                          @click="
                            dialogCaixa = true
                            caixa = item
                          "
                        >
                          <v-icon dark> mdi-pencil </v-icon>
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
                          @click.prevent="
                            dialogDeletar = true
                            caixa = item
                          "
                        >
                          <v-icon dark> mdi-delete </v-icon>
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
      <v-row justify="space-between" align="center" class="paginacao pa-3 mt-0 elevation-1" no-gutters>
        <v-col class="pt-0" cols="8">
          <v-pagination
              v-model="pagina"
              :length="contadorPagina"
              :total-visible="10"
          ></v-pagination>
        </v-col>
        <v-col class="pt-0" cols="auto">
          <span>Total de laudos: {{ totalItens }}</span>
        </v-col>
        <v-col class="pt-0" cols="2">
          <v-text-field
              :value="itensPorPagina"
              label="Itens por pagina"
              type="number"
              outlined
              min="-1"
              dense
              max="200"
              @input="itensPorPagina = parseInt($event, 10)"
              hide-details
              background-color="white"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-col>

    <dialog-caixa
      :mostrar="dialogCaixa"
      @cancelar="
        dialogCaixa = false
        caixa = {}
      "
      :dadosCaixa="caixa"
      @cadastrado="cadastrado"
      @editado="editado"
    >
    </dialog-caixa>

    <barra-bottom-botoes
      @clickBtnAdicionar="dialogCaixa = true"
      @clickBtnImprimirRelatorio="gerarRelatorio"
      :btn-adicionar="true"
      :btn-gerar-relatorio="true"
    ></barra-bottom-botoes>

    <dialog-deletar
      :texto="`Certeza que deseja deletar o caixa ${('000000' + caixa.id).slice(
        -6
      )} ?`"
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
import api from "../../services/api"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

import BarraTopoBusca from "../../components/shared/BarraTopoBusca"
import BarraBottomBotoes from "../../components/shared/BarraBottomBotoes"
import AlertaAcoes from "../../components/shared/AlertaAcoes"
import DialogDeletar from "../../components/shared/DialogDeletar"
import DialogCaixa from "./DialogCaixa"

import FiltroData from "@/components/shared/Filtros/FiltroData"
import FiltroSimples from "@/components/shared/Filtros/FiltroSimples"

import dayjs from "dayjs"
var isBetween = require("dayjs/plugin/isBetween")
dayjs.extend(isBetween)

export default {
  name: "VisualizarCaixa.vue",
  components: {
    BarraTopoBusca,
    BarraBottomBotoes,
    AlertaAcoes,
    DialogDeletar,
    DialogCaixa,
    FiltroSimples,
    FiltroData
  },
  data() {
    return {
      items: [],
      headers: [
        { text: "Lançamento", value: "id", align: "center", width: "165px" },
        { text: "Histórico", value: "descricao_historico", width: "143px" },
        { text: "Valor", value: "valor", width: "130px" },
        { text: "Movimento", value: "movimento", width: "155px" },
        { text: "Imóvel", value: "imovel_nome", width: "130px" },
        { text: "Conta", value: "conta_nome", width: "130px" },
        { text: "D/C", value: "id_debito_credito", width: "115px" },
        {
          text: "",
          value: "acoes",
          align: "center",
          sortable: false,
          width: "90px",
        },
      ],
      dayjs: dayjs,
      caixa: {},
      barraBuscaMobile: false,
      carregandoTableCaixa: false,
      filtrados: [],
      historicos: [],
      dialogCaixa: false,
      funcao: "",
      mostrarAlerta: false,
      dialogDeletar: false,
      expanded: [],
      buscaLancamento: null,
      buscaHistorico: null,
      buscaValor: null,
      buscaMovimento: null,
      buscaImovel: null,
      buscaConta: null,
      buscaDebitoCredito: null,
      pagina: 1,
      contadorPagina: 1,
      itensPorPagina: 20,
      totalItens: 0,
    }
  },
  mounted() {
    this.buscarCaixa()
  },
  computed: {
    filtrarCaixa() {
      let condicoes = []

      if (this.buscaLancamento) {
        condicoes.push(this.filtrarLancamento)
      }

      if (this.buscaHistorico) {
        condicoes.push(this.filtrarHistorico)
      }

      if (this.buscaValor) {
        condicoes.push(this.filtrarValor)
      }

      if (this.buscaMovimento) {
        condicoes.push(this.filtrarMovimento)
      }

      if (this.buscaImovel) {
        condicoes.push(this.filtrarImovel)
      }

      if (this.buscaConta) {
        condicoes.push(this.filtrarConta)
      }

      if (this.buscaDebitoCredito) {
        condicoes.push(this.filtrarDebitoCredito)
      }

      if (condicoes.length > 0) {
        return this.items.filter((caixa) => {
          return condicoes.every((condicao) => {
            return condicao(caixa)
          })
        })
      }

      return this.items
    },
  },
  methods: {
    filtrarLancamento(item) {
      return item.id.toLowerCase().includes(this.buscaLancamento.toLowerCase())
    },

    filtrarHistorico(item) {
      return item.descricao_historico
        .toLowerCase()
        .includes(this.buscaHistorico.toLowerCase())
    },

    filtrarValor(item) {
      return item.valor.toLowerCase().includes(this.buscaValor.toLowerCase())
    },

    filtrarMovimento(item) {
      let { inicio, fim } = this.buscaMovimento

      return dayjs(item.movimento).isBetween(inicio, fim, "day", "[]")
    },

    filtrarImovel(item) {
      return item.imovel_nome
        .toLowerCase()
        .includes(this.buscaImovel.toLowerCase())
    },

    filtrarConta(item) {
      return item.conta_nome
        .toLowerCase()
        .includes(this.buscaConta.toLowerCase())
    },

    async buscarCaixa() {
      this.carregandoTableCaixa = true

      let page = this.pagina - 1
      let size = this.itensPorPagina

      await api.get("/caixa", { params: { page, size } }).then((consulta) => {
        this.items = consulta.data
        this.filtrados = consulta.data
        this.carregandoTableCaixa = false
        if(consulta.data.length > 0){
          this.totalItens = parseInt(consulta.data[0].total_itens)
        }
      })
    },

    async buscarHistoricos() {
      await api.get("/ajuste/historico").then((consulta) => {
        this.historicos = consulta.data
      })
    },

    abrirDetalhes(item, evento) {
      let removerClass = document.querySelector(".aberto")
      if (removerClass) removerClass.classList.remove("aberto")

      let tr = evento.target.parentElement

      if (this.expanded[0] === item) {
        this.expanded = []
      } else {
        this.expanded = []
        tr.classList.add("aberto")
        this.expanded.push(item)
      }
    },

    cadastrado(item) {
      this.items.push(item)
      this.dialogCaixa = false
      this.funcao = "cadastrado"
      this.mostrarAlerta = true
      this.caixa = {}
    },

    editado(item) {
      let index = this.items.findIndex((obj) => {
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
      this.funcao = "editado"
      this.mostrarAlerta = true
      this.caixa = {}
    },

    async deletar() {
      let caixa = this.caixa
      await api.delete(`/caixa/${caixa.id}`).then((resp) => {
        let { id } = resp.data.caixa
        let index = this.items.findIndex((obj) => {
          return obj.id === id
        })
        this.items.splice(index, 1)
        this.dialogDeletar = false
        this.funcao = "deletado"
        this.mostrarAlerta = true
      })
    },

    gerarRelatorio() {
      let hojeAgr = dayjs().format("DD/MM/YYYY HH:mm:ss")
      let novosDados = JSON.parse(JSON.stringify(this.filtrarCaixa))
      let valorTotal = 0
      for (let i in novosDados) {
        // let valorFormatado = `${novosDados[i].valor.replace(".", ",")}`
        let movimentoFormatada = dayjs(novosDados[i].movimento).format(
          "DD/MM/YYYY"
        )
        let valorFormatado
        console.log(parseFloat(novosDados[i].valor))
        console.log(novosDados[i])
        if(novosDados[i].id_debito_credito === 1){
          valorTotal -= parseFloat(novosDados[i].valor)
          valorFormatado = `-${novosDados[i].valor.replace(".", ",")}`
        }else if(novosDados[i].id_debito_credito === 2){
          valorTotal += parseFloat(novosDados[i].valor)
          valorFormatado = `${novosDados[i].valor.replace(".", ",")}`
        }
        let codigoFormatado = ("000000" + novosDados[i].id).slice(-6)
        novosDados[i].valor = valorFormatado
        novosDados[i].movimento = movimentoFormatada
        novosDados[i].id = codigoFormatado
      }
      var doc = new jsPDF()
      doc.page = 1
      doc.setProperties({
        title: "Relátorio de Caixa",
      })
      doc.setFontSize(10)
      doc.text(hojeAgr, 200, 10, null, null, "right")
      doc.line(10, 12, 200, 12)
      doc.setFontSize(24)
      doc.text(`Relátorio de Caixa`, 10, 22)
      doc.setFontSize(14)
      doc.text(`Total: ${this.filtrarCaixa.length}`, 200, 21, null, null, "right")


      doc.setTextColor(0,0,0);
      doc.autoTable({
        head: [
          [
            "Código",
            "Histórico",
            "Valor",
            "Movimento",
            "Imóvel",
            "Conta",
            "D/C",
          ],
        ],
        columns: [
          { header: "Código", dataKey: "id" },
          { header: "Histórico", dataKey: "descricao_historico" },
          { header: "Valor", dataKey: "valor" },
          { header: "Movimento", dataKey: "movimento" },
          { header: "Imóvel", dataKey: "imovel_nome" },
          { header: "Conta", dataKey: "conta_nome" },
        ],
        columnStyles: { id: { halign: "center" } },
        body: novosDados,
        theme: "striped",
        headStyles: {
          fillColor: [50, 50, 50],
        },
        startY: 25,
        pageBreak: "auto",
        margin: { left: 10, right: 10, top: 10, bottom: 13 },
      })


      const totalPaginas = doc.internal.getNumberOfPages()

      doc.setFontSize(8)
      for (var i = 1; i <= totalPaginas; i++) {
        doc.line(10, 284, 200, 284)
        doc.setPage(i)
        doc.text(
          `Página ${String(i)} de ${String(totalPaginas)}`,
          205,
          293,
          null,
          null,
          "right"
        )

        doc.setFontSize(16)
        if(valorTotal < 0){
          doc.setTextColor(255,0,0);
        }else if(valorTotal > 0){
          doc.setTextColor(1,71,154);
        }
        doc.text(`R$: ${valorTotal.toFixed(2).replace(".", ",")}`, 10, 290)
        doc.setFontSize(8)
        doc.setTextColor(0,0,0);
      }
      window.open(doc.output("bloburl", { filename: "tabela_imovel.pdf" }))
    },
  },
  watch: {
    pagina: function () {
      this.buscarCaixa();
    },
  }
}
</script>

<style scoped src="../../css/dataTableVuetifyCustom.css" />

<style scoped>
.debito {
  color: red;
}

.credito {
  color: #105ab9;
}

.paginacao{
  background-color:white;
}
</style>
