<template>
  <v-row no-gutters>
    <BarraTopoBusca
        titulo="Imóvel"
        :btnAdicionar="true"
        @clickBtnAdicionar="dialogImovel = true"
    />

    <BarraBuscaRelatorio
        :btn-gerar-relatorio="true"
        :input-busca="true"
        @buscar="buscar"
        @limparBusca="buscarImoveis"
        @clickBtnImprimirRelatorio="gerarRelatorio"
    />
    <v-col>
      <v-row class="mt-0">
        <v-col class="pt-2">
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
                $isMobile ? 'calc(100vh - 300px)' : 'calc(100vh - 184px)'
              "
              single-expand
              :expanded="expanded"
              mobile-breakpoint="0"
              item-key="id"
              dense
              :loading="carregando"
            >
              <template v-slot:[`loading`]>
                <v-row
                    style="margin-top: 2px; padding-botton: 100px"
                    justify="center"
                    align="center"
                >
                  <v-col cols="auto" class="pb-5">
                    <v-progress-circular
                        indeterminate
                        color="primary"
                    ></v-progress-circular>
                  </v-col>
                  <v-col cols="auto" class="pb-5">
                    <h2>Recebendo informações... Favor aguarde !</h2>
                  </v-col>
                </v-row>
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
import DialogImovel from "./DialogImovel"
import AlertaAcoes from "../../components/shared/AlertaAcoes"
import DialogDeletar from "../../components/shared/DialogDeletar"
import BarraBuscaRelatorio from "@/components/shared/BarraBuscaRelatorio";

export default {

  name: "VisualizarImovel",
  components: {
    BarraTopoBusca,
    DialogImovel,
    AlertaAcoes,
    DialogDeletar,
    BarraBuscaRelatorio
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
      carregando: false,
    }
  },

  computed: {
    filtrarImovel() {
      return this.items
    },
  },

  methods: {
    async buscar(valor){
      this.carregando = true;

      await api.get("/imoveis/busca", { params: { busca:valor } }).then((consulta) => {
        this.items = consulta.data
        this.filtrados = consulta.data
        this.carregando = false;
        if(consulta.data.length > 0){
          this.totalItens = parseInt(consulta.data[0].total_itens)
        }
      })
    },

    async buscarImoveis() {
      this.carregando = true;

      await api
        .get("/imoveis")
        .then((response) => {
          this.items = response.data
          this.filtrados = response.data
          this.carregando = false;
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
  },
  async mounted() {
    this.buscarImoveis()
  },
}
</script>

<style scoped src="../../css/dataTableVuetifyCustom.css" />

<style scoped></style>
