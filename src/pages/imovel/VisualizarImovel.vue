<template>
  <v-row no-gutters>
    <barra-topo-busca titulo="Imóvel"></barra-topo-busca>
    <v-col>
      <v-row class="mt-0">
        <v-col>
          <v-card>
            <v-data-table
              @update:page="$paraTopo"
              fixed-header
              :headers="headers"
              :items="filtrarImovel"
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
            >
              <template v-slot:[`header.nome`]="{ header }">
                {{ header.text }}
                <FiltroSimples
                    textoFiltro="Buscar por nome"
                    @enviar-filtro="buscaNome = $event"
                    @limpar-filtro="buscaNome = null"
                />
              </template>
              <template v-slot:[`header.rua`]="{ header }">
                {{ header.text }}
                <FiltroSimples
                    textoFiltro="Buscar por endereço"
                    @enviar-filtro="buscaEndereco = $event"
                    @limpar-filtro="buscaEndereco = null"
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
                    <li v-if="item.rua && item.cep">
                      <v-row>
                        <v-col cols="auto">
                          <span><strong>Rua: </strong>{{ item.rua }}</span>
                        </v-col>
                        <v-col cols="auto">
                          <span
                            ><strong>Número: </strong>{{ item.numero }}</span
                          >
                        </v-col>
                        <v-col cols="auto">
                          <span
                            ><strong>Bairro: </strong>{{ item.bairro }}</span
                          >
                        </v-col>
                        <v-col cols="auto">
                          <span
                            ><strong>Cidade: </strong>{{ item.cidade }}</span
                          >
                        </v-col>
                        <v-col cols="auto">
                          <span
                            ><strong>Estado: </strong>{{ item.estado }}</span
                          >
                        </v-col>
                        <v-col cols="auto">
                          <span><strong>CEP: </strong>{{ item.cep }}</span>
                        </v-col>
                        <v-col cols="auto" v-if="item.complemento">
                          <span
                            ><strong>Complemento: </strong
                            >{{ item.complemento }}</span
                          >
                        </v-col>
                      </v-row>
                    </li>
                    <li>
                      <span
                        ><strong>Proprietário: </strong
                        >{{ item.proprietario }}</span
                      >
                    </li>
                    <li>
                      <span
                        ><strong>Tipo de imóvel: </strong
                        >{{ item.tipo_imovel }}</span
                      >
                    </li>
                    <li>
                      <span
                        ><strong>Inscrição Municipal: </strong
                        >{{ item.inscricao_municipal }}</span
                      >
                    </li>
                    <li>
                      <span
                        ><strong>Funesbom: </strong>{{ item.funesbom }}</span
                      >
                    </li>
                  </ul>
                </td>
              </template>
              <template v-slot:item="{ item }">
                <tr>
                  <td @click.prevent="abrirDetalhes(item, $event)">
                    {{ item.nome }}
                  </td>
                  <td @click.prevent="abrirDetalhes(item, $event)">
                    <span v-if="item.rua && item.cep"
                      >{{ item.rua }}, N°{{ item.numero }},
                      {{ item.complemento }}</span
                    >
                  </td>
                  <td @click.prevent="abrirDetalhes(item, $event)">
                    {{ item.status }}
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
                            dialogImovel = true
                            idImovel = item.id
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
                            imovel = item
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
      @clickBtnAdicionar="dialogImovel = true"
      @clickBtnImprimirRelatorio="gerarRelatorio"
      :btn-gerar-relatorio="true"
    ></barra-bottom-botoes>

    <dialog-imovel
      :mostrar="dialogImovel"
      @cancelar="cancelar"
      @cadastrado="cadastrado"
      @editado="editado"
      :idImovel="idImovel"
    ></dialog-imovel>

    <dialog-deletar
      :texto="`Certeza que deseja deletar o imóvel: ${
        imovel ? imovel.nome : ''
      } ?`"
      sub-texto="Após deletar esse imóvel não é possivel recuperar!"
      :mostrar="dialogDeletar"
      @cancelar="
        dialogDeletar = !dialogDeletar
        responsavel = {}
      "
      @deletar="deletar"
    >
    </dialog-deletar>

    <alerta-acoes
      palavra-chave="imóvel"
      @sumir="mostrarAlerta = false"
      v-bind:mostrar="mostrarAlerta"
      :funcao="funcao"
      :texto="textoAlerta"
    ></alerta-acoes>
  </v-row>
</template>

<script>
import api from "../../services/api"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import dayjs from "dayjs"

import BarraTopoBusca from "../../components/shared/BarraTopoBusca"
import BarraBottomBotoes from "../../components/shared/BarraBottomBotoes"
import DialogImovel from "./DialogImovel"
import AlertaAcoes from "../../components/shared/AlertaAcoes"
import DialogDeletar from "../../components/shared/DialogDeletar"
import FiltroSimples from "@/components/shared/Filtros/FiltroSimples"

export default {

  name: "VisualizarImovel",
  components: {
    BarraTopoBusca,
    BarraBottomBotoes,
    DialogImovel,
    AlertaAcoes,
    DialogDeletar,
    FiltroSimples
  },
  data() {
    return {
      items: [],
      headers: [
        { text: "Nome", value: "nome" },
        { text: "Endereço", value: "rua" },
        { text: "Status", value: "status" },
        {
          text: "",
          value: "acoes",
          align: "center",
          sortable: false,
          width: "90px",
        },
      ],
      filtrados: [],
      dayjs: dayjs,
      busca: "",
      expanded: [],
      dialogImovel: false,
      idImovel: null,
      funcao: "",
      mostrarAlerta: false,
      dialogDeletar: false,
      imovel: {},
      textoAlerta: "",
      buscaNome: null,
      buscaEndereco: null,
      buscaStatus: null,
    }
  },

  computed: {
    filtrarImovel() {
      let condicoes = []

      if (this.buscaNome) {
        condicoes.push(this.filtrarNome)
      }

      if (this.buscaEndereco) {
        condicoes.push(this.filtrarEndereco)
      }

      if (this.buscaStatus) {
        condicoes.push(this.filtrarStatus)
      }

      if (condicoes.length > 0) {
        return this.items.filter((cliente) => {
          return condicoes.every((condicao) => {
            return condicao(cliente)
          })
        })
      }

      return this.items
    },
  },

  methods: {
    async buscarImoveis() {
      await api
        .get("/imoveis")
        .then((response) => {
          this.items = response.data
          this.filtrados = response.data
        })
        .catch((erro) => {
          console.log(erro)
        })
    },

    gerarRelatorio() {
      let novosDados = JSON.parse(JSON.stringify(this.filtrados))
      for (let i in novosDados) {
        let rua_formatada = `${novosDados[i].rua}, N° ${novosDados[i].numero}, ${novosDados[i].complemento}`
        novosDados[i].rua = rua_formatada
      }
      let hojeAgr = dayjs().format("DD/MM/YYYY HH:mm:ss")
      var doc = new jsPDF()
      doc.page = 1
      doc.setProperties({
        title: "Relátorio de Imóveis",
      })
      doc.setFontSize(10)
      doc.text(hojeAgr, 200, 10, null, null, "right")
      doc.line(10, 12, 200, 12)
      doc.setFontSize(24)
      doc.text(`Relátorio de Imóveis`, 10, 22)
      doc.setFontSize(14)
      doc.text(`Total: ${this.filtrados.length}`, 200, 21, null, null, "right")
      doc.autoTable({
        head: [["Nome", "Endereço", "Status"]],
        columns: [
          { header: "Nome", dataKey: "nome" },
          { header: "Endereço", dataKey: "rua" },
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
      window.open(doc.output("bloburl", { filename: "tabela_imoveis.pdf" }))
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

    cancelar(imovel) {
      if (imovel) {
        this.items.push(imovel)
      }

      this.dialogImovel = false
      this.idImovel = null
    },

    cadastrado(dados) {
      let { imovel, notificar } = dados
      this.items.push(imovel)

      if (notificar) {
        this.mostrarAlerta = true
        this.funcao = "cadastrado"
        this.dialogImovel = false
        this.imovel = {}
      }
    },

    editado(imovel) {
      let index = this.items.findIndex((obj) => {
        return obj.id === imovel.id
      })
      for (let key of Object.keys(imovel)) {
        this.items[index][key] = imovel[key]
      }
      this.dialogImovel = false
      this.funcao = "editado"
      this.mostrarAlerta = true
      this.idImovel = null
    },

    async deletar() {
      let imovel = this.imovel
      await api
        .delete(`/imovel/deletar/${imovel.id}`)
        .then(() => {
          let index = this.items.findIndex((obj) => {
            return obj.id === imovel.id
          })
          this.dialogDeletar = false
          this.items.splice(index, 1)
          this.funcao = "deletado"
          this.mostrarAlerta = true
          this.responsavel = {}
        })
        .catch((erro) => {
          let mensagem = erro.response.data.erro
          this.funcao = "erro"
          this.textoAlerta = mensagem
          this.mostrarAlerta = true
        })
    },

    filtrarNome(item) {
      return item.nome.toLowerCase().includes(this.buscaNome.toLowerCase())
    },

    filtrarEndereco(item) {

      if(item.rua)
        return item.rua
            .toLowerCase()
            .includes(this.buscaEndereco.toLowerCase())
    },

    filtrarStatus(item) {
      if(item.status)
        return item.status
            .toLowerCase()
            .includes(this.buscaStatus.toLowerCase())
    },
  },
  async mounted() {
    this.buscarImoveis()
  },
}
</script>

<style scoped src="../../css/dataTableVuetifyCustom.css" />

<style scoped></style>
