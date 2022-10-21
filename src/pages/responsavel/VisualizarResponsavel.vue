<template>
  <v-row no-gutters>
    <BarraTopoBusca
        titulo="Responsável"
        :btnAdicionar="true"
        @clickBtnAdicionar="dialogResponsavel = true" />

    <BarraBuscaRelatorio
        :btn-gerar-relatorio="true"
        :input-busca="true"
        @buscar="buscar"
        @limparBusca="buscarResponsaveis"
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
              :items="filtrarResponsavel"
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
              <template v-slot:item="{ item }">
                <tr>
                  <td>{{ item.nome }}</td>
                  <td>{{ item.cpf_cnpj }}</td>
                  <td>
                    <span v-if="item.rua"
                      >{{ item.rua }}, N°{{ item.numero }},
                      {{ item.complemento }}</span
                    >
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
                            dialogResponsavel = true
                            idResponsavel = item.id
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
                            responsavel = item
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

    <dialog-responsavel
      :mostrar="dialogResponsavel"
      @cancelar="cancelar"
      @cadastrado="cadastrado"
      @editado="editado"
      :idResponsavel="idResponsavel"
    ></dialog-responsavel>

    <alerta-acoes
      palavra-chave="responsável"
      @sumir="mostrarAlerta = false"
      v-bind:mostrar="mostrarAlerta"
      :funcao="funcao"
      :texto="textoAlerta"
    ></alerta-acoes>

    <dialog-deletar
      :texto="`Certeza que deseja deletar o responsável: ${
        responsavel ? responsavel.nome : ''
      } ?`"
      sub-texto="Após deletar esse responsável não é possivel recuperar!"
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
import BarraTopoBusca from "../../components/shared/BarraTopoBusca"
import DialogResponsavel from "./DialogResponsavel"
import AlertaAcoes from "../../components/shared/AlertaAcoes"
import DialogDeletar from "../../components/shared/DialogDeletar"
import BarraBuscaRelatorio from "@/components/shared/BarraBuscaRelatorio";

import dayjs from "dayjs"
import "jspdf-autotable"
import { jsPDF } from "jspdf"
import api from "../../services/api"

export default {
  name: "VisualizarResponsavel",
  components: {
    BarraTopoBusca,
    BarraBuscaRelatorio,
    DialogResponsavel,
    AlertaAcoes,
    DialogDeletar,
  },
  data() {
    return {
      items: [],
      headers: [
        { text: "Nome", value: "nome" },
        { text: "CPF / CNPJ", value: "cpf_cnpj" },
        { text: "Endereço", value: "endereco" },
        {
          text: "",
          value: "acoes",
          align: "center",
          sortable: false,
          width: "90px",
        },
      ],
      expanded: [],
      dialogImovel: false,
      idResponsavel: null,
      funcao: "",
      mostrarAlerta: false,
      dialogDeletar: false,
      responsavel: {},
      dialogResponsavel: false,
      textoAlerta: "",
      buscaNome: null,
      buscaEndereco: null,
      buscaCpfCnpj: null,
      carregando: false,
    }
  },

  computed: {
    filtrarResponsavel() {
      return this.items
    },
  },

  methods: {
    async buscar(valor){
      this.carregando = true;

      await api.get("/responsaveis/busca", { params: { busca:valor } }).then((consulta) => {
        this.items = consulta.data
        this.filtrados = consulta.data
        this.carregando = false;
        if(consulta.data.length > 0){
          this.totalItens = parseInt(consulta.data[0].total_itens)
        }
      })
    },

    gerarRelatorio() {
      let novosDados = JSON.parse(JSON.stringify(this.items))
      for (let dado of novosDados) {
        if (dado.rua) {
          let rua_formatada = `${dado.rua}, N° ${dado.numero}, ${dado.complemento}`
          dado.rua = rua_formatada
        }
      }
      let hojeAgr = dayjs().format("DD/MM/YYYY HH:mm:ss")
      var doc = new jsPDF()
      doc.page = 1
      doc.setProperties({
        title: "Relátorio de Responsáveis",
      })
      doc.setFontSize(10)
      doc.text(hojeAgr, 200, 10, null, null, "right")
      doc.line(10, 12, 200, 12)
      doc.setFontSize(24)
      doc.text(`Relátorio de Responsáveis`, 10, 22)
      doc.setFontSize(14)
      doc.text(`Total: ${this.items.length}`, 200, 21, null, null, "right")
      doc.autoTable({
        head: [["Nome", "CPF/CNPJ", "Endereço"]],
        columns: [
          { header: "Nome", dataKey: "nome" },
          { header: "CPF/CNPJ", dataKey: "cpf_cnpj" },
          { header: "Endereço", dataKey: "rua" },
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
      window.open(
        doc.output("bloburl", { filename: "tabela_responsaveis.pdf" })
      )
    },

    cancelar(responsavel) {
      if (responsavel) {
        this.items.push(responsavel)
      }

      this.dialogResponsavel = false
      this.idResponsavel = null
    },

    cadastrado(dados) {
      let { responsavel, notificar } = dados

      if (notificar) {
        this.items.push(responsavel)
        this.mostrarAlerta = true
        this.funcao = "cadastrado"
        this.dialogResponsavel = false
        this.responsavel = {}
      }
    },

    editado(responsavel) {
      let index = this.items.findIndex((obj) => {
        return obj.id === responsavel.id
      })
      for (let key of Object.keys(responsavel)) {
        this.items[index][key] = responsavel[key]
      }
      this.dialogResponsavel = false
      this.funcao = "editado"
      this.mostrarAlerta = true
      this.idResponsavel = null
    },

    async deletar() {
      let responsavel = this.responsavel
      await api
        .delete(`/responsavel/deletar/${responsavel.id}`)
        .then(() => {
          let index = this.items.findIndex((obj) => {
            return obj.id === responsavel.id
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
    async buscarResponsaveis() {
      this.carregando = true;

      await api
        .get("/responsaveis")
        .then((response) => {
          this.items = response.data
          this.carregando = false;
        })
        .catch((erro) => {
          console.log(erro)
        })
    },
  },
  async mounted() {
    this.buscarResponsaveis()
  },
}
</script>
<style scoped src="../../css/dataTableVuetifyCustom.css" />

<style></style>
