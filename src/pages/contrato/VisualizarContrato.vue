<template>
  <v-row no-gutters>
    <barra-topo-busca titulo="Contratos"></barra-topo-busca>
    <v-col>
      <v-row class="mt-0">
        <v-col>
          <v-card>
            <v-data-table
              @update:page="$paraTopo"
              fixed-header
              :headers="headers"
              :items="filtrarContrato"
              :footer-props="{
                itemsPerPageOptions: [50, 100, 220, -1],
              }"
              class="tabela pointer"
              :height="
                $isMobile ? 'calc(100vh - 300px)' : 'calc(100vh - 180px)'
              "
              single-expand
              :expanded="expanded"
              mobile-breakpoint="0"
              item-key="id"
              dense
              calculate-widths
              some-items
            >
              <template v-slot:[`header.nome_imovel`]="{ header }">
                {{ header.text }}
                <FiltroSimples
                    textoFiltro="Buscar por imovel"
                    @enviar-filtro="buscaImovel = $event"
                    @limpar-filtro="buscaImovel = null"
                />
              </template>
              <template v-slot:[`header.id`]="{ header }">
                {{ header.text }}
                <FiltroSimples
                    textoFiltro="Buscar por código"
                    @enviar-filtro="buscaCodigo = $event"
                    @limpar-filtro="buscaCodigo = null"
                />
              </template>
              <template v-slot:[`header.nome_cliente`]="{ header }">
                {{ header.text }}
                <FiltroSimples
                    textoFiltro="Buscar por cliente"
                    @enviar-filtro="buscaCliente = $event"
                    @limpar-filtro="buscaCliente = null"
                />
              </template>
              <template v-slot:[`header.nome_responsavel`]="{ header }">
                {{ header.text }}
                <FiltroSimples
                    textoFiltro="Buscar por responsável"
                    @enviar-filtro="buscaResponsavel = $event"
                    @limpar-filtro="buscaResponsavel = null"
                />
              </template>
              <template v-slot:[`header.status`]="{ header }">
                {{ header.text }}
                <FiltroSimples
                    textoFiltro="Buscar por status"
                    @enviar-filtro="buscaStatus = $event"
                    @limpar-filtro="buscaStatus = null"
                />
              </template>
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" style="background-color: #d5e6fd">
                  <ul class="pa-3" style="list-style-type: none">
                    <li>
                      <span
                        ><strong>Data de ínicio: </strong
                        >{{
                          $dayjs(item.data_inicio).format("DD/MM/YYYY")
                        }}</span
                      >
                    </li>
                    <li>
                      <span
                        ><strong>Data de término: </strong
                        >{{ $dayjs(item.data_fim).format("DD/MM/YYYY") }}</span
                      >
                    </li>
                    <li>
                      <span
                        ><strong>Data de vencimento: </strong
                        >{{ item.data_vencimento }}</span
                      >
                    </li>
                    <li>
                      <span
                        ><strong>Valor: </strong>R$
                        {{ item.valor_boleto.replace(".", ",") }}</span
                      >
                    </li>
                    <li v-if="item.fiadores">
                      <span v-if="item.fiadores[0] !== null"
                        ><strong>Fiadores:</strong></span
                      >
                      <ul style="list-style-type: none">
                        <li v-for="fiador in item.fiadores" :key="fiador">
                          {{ fiador }}
                        </li>
                      </ul>
                    </li>
                    <li v-if="item.carencia">
                      <span
                        ><strong>Carência: </strong>{{ item.carencia }}</span
                      >
                    </li>
                    <li>
                      <span
                        ><strong>Vigência: </strong
                        >{{
                          $dayjs(item.data_fim).diff(item.data_inicio, "month")
                        }}
                        meses</span
                      >
                    </li>
                  </ul>
                </td>
              </template>
              <template v-slot:item="{ item }">
                <tr>
                  <td @click.prevent="abrirDetalhes(item, $event)">
                    {{ ("0000" + item.id).slice(-4) }}
                  </td>
                  <td
                    @click.prevent="abrirDetalhes(item, $event)"
                    style="white-space: nowrap"
                  >
                    {{ item.nome_imovel }}
                  </td>
                  <td
                    @click.prevent="abrirDetalhes(item, $event)"
                    style="white-space: nowrap"
                  >
                    {{ item.nome_cliente }}
                  </td>
                  <td @click.prevent="abrirDetalhes(item, $event)">
                    <span style="white-space: nowrap">{{
                      item.nome_responsavel
                    }}</span>
                  </td>
                  <td @click.prevent="abrirDetalhes(item, $event)">
                    <span
                      :class="{ 'falta-pdf': !item.nome_pdf }"
                      class="text-capitalize"
                      >{{ !item.nome_pdf ? "Falta PDF" : item.status }}</span
                    >
                  </td>
                  <td class="acoes text-center">
                    <v-tooltip top :disabled="!item.url">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          target="_blank"
                          color="black"
                          :disabled="!item.url"
                          :href="item.url"
                        >
                          <v-icon dark> mdi-file-document </v-icon>
                        </v-btn>
                      </template>
                      <span>Mostrar contrato</span>
                    </v-tooltip>
                    <v-tooltip top :disabled="!item.url_aditivo">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          color="black"
                          :href="item.url_aditivo"
                          target="_blank"
                          :disabled="!item.url_aditivo"
                        >
                          <v-icon dark> mdi-file-edit </v-icon>
                        </v-btn>
                      </template>
                      <span>Mostrar aditivo</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          color="black"
                          @click="
                            dialogContrato = true
                            idContrato = item.id
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
                            contrato = item
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
    </v-col>

    <barra-bottom-botoes
      :btn-adicionar="true"
      @clickBtnAdicionar="dialogContrato = true"
      @clickBtnImprimirRelatorio="gerarRelatorio"
      :btn-gerar-relatorio="true"
    ></barra-bottom-botoes>

    <dialog-contrato
      :mostrar="dialogContrato"
      @cancelar="cancelar"
      @cadastrado="cadastrado"
      @editado="editado"
      :idContrato="idContrato"
    ></dialog-contrato>

    <alerta-acoes
      :palavra-chave="palavraChave"
      @sumir="mostrarAlerta = false"
      v-bind:mostrar="mostrarAlerta"
      :funcao="funcao"
    ></alerta-acoes>

    <dialog-deletar
      :texto="`Certeza que deseja deletar o contrato: ${
        contrato ? ('0000' + contrato.id).slice(-4) : ''
      } ?`"
      sub-texto="Após deletar esse contrato não é possivel recuperar!"
      :mostrar="dialogDeletar"
      @cancelar="
        dialogDeletar = !dialogDeletar
        responsavel = {}
      "
      @deletar="deletar"
    >
    </dialog-deletar>
  </v-row>
</template>

<script>
import api from "../../services/api"
import dayjs from "dayjs"

import BarraTopoBusca from "../../components/shared/BarraTopoBusca"
import BarraBottomBotoes from "../../components/shared/BarraBottomBotoes"
import DialogContrato from "./DialogContrato"
import AlertaAcoes from "../../components/shared/AlertaAcoes"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import DialogDeletar from "../../components/shared/DialogDeletar"
import FiltroSimples from "@/components/shared/Filtros/FiltroSimples"

export default {
  name: "VisualizarContrato",
  components: {
    BarraTopoBusca,
    BarraBottomBotoes,
    DialogContrato,
    AlertaAcoes,
    DialogDeletar,
    FiltroSimples
  },
  data() {
    return {
      busca: "",
      items: [],
      headers: [
        { text: "Código", value: "id", width: "130px", fixed: true },
        { text: "Imóvel", value: "nome_imovel", fixed: true },
        { text: "Cliente", value: "nome_cliente" },
        { text: "Responsável", value: "nome_responsavel", width: "160px"},
        { text: "Status", value: "status", width: "128px" },
        {
          text: "",
          value: "acoes",
          align: "center",
          sortable: false,
          width: "170px",
        },
      ],
      expanded: [],
      dialogContrato: false,
      idContrato: null,
      dayjs: dayjs,
      files: null,
      funcao: "",
      palavraChave: "contrato",
      mostrarAlerta: false,
      dialogDeletar: false,
      contrato: {},
      buscaImovel: null,
      buscaCliente: null,
      buscaResponsavel: null,
      buscaCodigo: null,
      buscaStatus: null,
    }
  },

  computed: {
    filtrarContrato() {
      let condicoes = []

      if (this.buscaCodigo) {
        condicoes.push(this.filtrarCodigo)
      }

      if (this.buscaImovel) {
        condicoes.push(this.filtrarImovel)
      }

      if (this.buscaCliente) {
        condicoes.push(this.filtrarCliente)
      }

      if (this.buscaResponsavel) {
        condicoes.push(this.filtrarResponsavel)
      }

      if (this.buscaStatus) {
        condicoes.push(this.filtrarStatus)
      }

      if (condicoes.length > 0) {
        return this.items.filter((contrato) => {
          return condicoes.every((condicao) => {
            return condicao(contrato)
          })
        })
      }

      return this.items
    },
  },

  methods: {
    async buscarContratos() {
      await api.get("/contratos").then((resp) => {
        this.items = resp.data
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

    gerarRelatorio() {
      let novosDados = JSON.parse(JSON.stringify(this.items))
      for (let dado of novosDados) {
        dado.codigo = ("0000" + dado.id).slice(-4)
      }
      let hojeAgr = dayjs().format("DD/MM/YYYY HH:mm:ss")
      var doc = new jsPDF()
      doc.page = 1
      doc.setProperties({
        title: "Relátorio de Contrato",
      })
      doc.setFontSize(10)
      doc.text(hojeAgr, 200, 10, null, null, "right")
      doc.line(10, 12, 200, 12)
      doc.setFontSize(24)
      doc.text(`Relátorio de Contratos`, 10, 22)
      doc.setFontSize(14)
      doc.text(`Total: ${this.items.length}`, 200, 21, null, null, "right")
      doc.autoTable({
        head: [["Código", "Imóvel", "Responsável", "Cliente", "Status"]],
        columns: [
          { header: "Código", dataKey: "codigo" },
          { header: "Imóvel", dataKey: "nome_imovel" },
          { header: "Responsável", dataKey: "nome_responsavel" },
          { header: "Cliente", dataKey: "nome_cliente" },
          { header: "Status", dataKey: "status" },
        ],
        body: novosDados,
        theme: "striped",
        headStyles: {
          fillColor: [50, 50, 50],
        },
        startY: 25,
        pageBreak: "auto",
        margin: { left: 10, right: 10, top: 10 },
      })
      const totalPaginas = doc.internal.getNumberOfPages()
      doc.setFontSize(8)
      for (var i = 1; i <= totalPaginas; i++) {
        doc.setPage(i)
        doc.text(
          `Página ${String(i)} de ${String(totalPaginas)}`,
          205,
          293,
          null,
          null,
          "right"
        )
      }
      window.open(doc.output("bloburl", { filename: "tabela_contrato.pdf" }))
    },

    cancelar(contrato) {
      if (contrato) {
        this.items.push(contrato)
      }
      this.dialogContrato = false
      this.idContrato = null
    },

    cadastrado(dados) {
      let { contrato, notificar } = dados
      if (notificar) {
        this.items.push(contrato)
        this.mostrarAlerta = true
        this.funcao = "cadastrado"
        this.dialogContrato = false
        this.contrato = {}
      }
    },

    editado(contrato) {
      let index = this.items.findIndex((obj) => {
        return obj.id === contrato.id
      })
      if (index >= 0) {
        for (let key of Object.keys(contrato)) {
          this.items[index][key] = contrato[key]
        }
      } else {
        this.items.push(contrato)
      }

      this.dialogContrato = false
      this.funcao = "editado"
      this.mostrarAlerta = true
      this.idContrato = null
    },

    async deletar() {
      let { id } = this.contrato
      await api.delete(`/contrato/deletar/${id}`).then((resp) => {
        let { id } = resp.data.contrato
        let index = this.items.findIndex((obj) => {
          return obj.id === id
        })
        this.dialogDeletar = false
        this.items.splice(index, 1)
        this.funcao = "deletado"
        this.mostrarAlerta = true
        this.contrato = {}
      })
    },

    filtrarCodigo(item) {
      return item.id.toString().toLowerCase().includes(this.buscaCodigo.toLowerCase())
    },

    filtrarImovel(item) {
      return item.nome_imovel.toLowerCase().includes(this.buscaImovel.toLowerCase())
    },

    filtrarCliente(item) {
        return item.nome_cliente
            .toLowerCase()
            .includes(this.buscaCliente.toLowerCase())
    },

    filtrarResponsavel(item) {
        return item.nome_responsavel
            .toLowerCase()
            .includes(this.buscaResponsavel.toLowerCase())
    },

    filtrarStatus(item) {
      if(item.status)
      return item.status
          .toLowerCase()
          .includes(this.buscaStatus.toLowerCase())
    },
  },
  async mounted() {
    this.buscarContratos()
  },
}
</script>

<style scoped src="../../css/dataTableVuetifyCustom.css" />

<style>
.falta-pdf {
  color: red;
  font-weight: bold;
}
</style>
