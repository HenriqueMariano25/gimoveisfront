s
<template>
  <v-row>
    <v-col>
      <v-card class="border-radius pa-3">
        <v-tabs v-model="tab" grow class="tab-personalizada">
          <v-tab>Contratos para vencer</v-tab>
          <v-tab>Boletos vencidos</v-tab>
          <v-tab>Contratos para reajustar</v-tab>

          <v-tabs-items v-model="tab" touchless>
            <v-tab-item>
              <v-row class="mt-1" no-gutters>
                <v-col>
                  <v-row
                    no-gutters
                    class="pl-2 pr-2"
                    justify="space-between"
                    align="center"
                  >
                    <v-col cols="auto">
                      <span class="dica-tabela">
                        Clique duas vezes na linha da coluna para editar
                      </span>
                    </v-col>
                    <v-col cols="auto">
                      <v-btn
                        depressed
                        :color="'var(--preto-principal)'"
                        dark
                        @click="gerarRelatorioContratosVencendo()"
                        :fab="$isMobile"
                      >
                        <v-icon :class="{ 'mr-2': !$isMobile }">
                          mdi-printer
                        </v-icon>
                        <span v-if="!$isMobile"> Gerar relátorio </span>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row class="mt-0">
                    <v-col>
                      <v-data-table
                        @update:page="$paraTopo"
                        fixed-header
                        :headers="camposContratosVencendo"
                        :items="contratosVencendo"
                        :footer-props="{
                          itemsPerPageOptions: [10, 25, 50, -1],
                        }"
                        class="elevation-1 tabela pointer"
                        mobile-breakpoint="0"
                        item-key="id"
                        dense
                      >
                        <template v-slot:item="{ item }">
                          <tr>
                            <td
                              @dblclick.prevent="
                                dialogContrato = true
                                idContrato = item.id
                                editandoContratoVencido = true
                              "
                            >
                              {{ ("0000" + item.id).slice(-4) }}
                            </td>
                            <td
                              @dblclick.prevent="
                                dialogContrato = true
                                idContrato = item.id
                                editandoContratoVencido = true
                              "
                            >
                              {{ dayjs(item.data_fim).format("DD/MM/YYYY") }}
                            </td>
                            <td
                              @dblclick.prevent="
                                dialogContrato = true
                                idContrato = item.id
                                editandoContratoVencido = true
                              "
                            >
                              {{ item.nome }}
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
              <v-row class="mt-1" no-gutters>
                <v-col>
                  <v-row
                    no-gutters
                    class="pl-2 pr-2"
                    justify="space-between"
                    align="center"
                  >
                    <v-col cols="auto">
                      <span class="dica-tabela">
                        Clique duas vezes na linha da coluna para editar
                      </span>
                    </v-col>
                    <v-col cols="auto">
                      <v-btn
                        depressed
                        :color="'var(--preto-principal)'"
                        dark
                        @click="gerarRelatorioBoletosVencidos()"
                        :fab="$isMobile"
                      >
                        <v-icon :class="{ 'mr-2': !$isMobile }">
                          mdi-printer
                        </v-icon>
                        <span v-if="!$isMobile"> Gerar relátorio </span>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row class="mt-0">
                    <v-col>
                      <v-data-table
                        @update:page="$paraTopo"
                        fixed-header
                        :headers="camposBoletosVencendo"
                        :items="boletosVencendo"
                        :footer-props="{
                          itemsPerPageOptions: [10, 25, 50, -1],
                        }"
                        class="elevation-1 tabela pointer"
                        mobile-breakpoint="0"
                        item-key="id"
                        dense
                      >
                        <template v-slot:item="{ item }">
                          <tr>
                            <td
                              @dblclick.prevent="
                                dialogBoleto = true
                                dadosBoleto = item
                              "
                            >
                              {{ ("000000" + item.id).slice(-6) }}
                            </td>
                            <td
                              @dblclick.prevent="
                                dialogBoleto = true
                                dadosBoleto = item
                              "
                            >
                              {{ item.imovel_nome }}
                            </td>
                            <td
                              @dblclick.prevent="
                                dialogBoleto = true
                                dadosBoleto = item
                              "
                            >
                              {{ item.cliente_nome }}
                            </td>
                            <td
                              @dblclick.prevent="
                                dialogBoleto = true
                                dadosBoleto = item
                              "
                            >
                              {{
                                dayjs(item.data_vencimento).format("DD/MM/YYYY")
                              }}
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
              <v-row class="mt-1" no-gutters>
                <v-col>
                  <v-row
                    no-gutters
                    class="pl-2 pr-2"
                    justify="space-between"
                    align="center"
                  >
                    <v-col cols="auto">
                      <span class="dica-tabela">
                        Clique duas vezes na linha da coluna para editar
                      </span>
                    </v-col>
                    <v-col cols="auto">
                      <v-btn
                        depressed
                        :color="'var(--preto-principal)'"
                        dark
                        @click="gerarRelatorioContratosReajustar()"
                        :fab="$isMobile"
                      >
                        <v-icon :class="{ 'mr-2': !$isMobile }">
                          mdi-printer
                        </v-icon>
                        <span v-if="!$isMobile"> Gerar relátorio </span>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row class="mt-0">
                    <v-col>
                      <v-data-table
                        @update:page="$paraTopo"
                        fixed-header
                        :headers="camposContratoReajustar"
                        :items="contratosParaReajustar"
                        :footer-props="{
                          itemsPerPageOptions: [10, 25, 50, -1],
                        }"
                        class="elevation-1 tabela pointer"
                        mobile-breakpoint="0"
                        item-key="id"
                        dense
                      >
                        <template v-slot:item="{ item }">
                          <tr>
                            <td
                              @dblclick.prevent="
                                dialogContrato = true
                                idContrato = item.id
                                editandoContratoVencido = false
                              "
                            >
                              {{ ("0000" + item.id).slice(-4) }}
                            </td>
                            <td
                              @dblclick.prevent="
                                dialogContrato = true
                                idContrato = item.id
                                editandoContratoVencido = false
                              "
                            >
                              {{ item.imovel_nome }}
                            </td>
                            <td
                              @dblclick.prevent="
                                dialogContrato = true
                                idContrato = item.id
                                editandoContratoVencido = false
                              "
                            >
                              {{ item.cliente_nome }}
                            </td>
                            <td
                              @dblclick.prevent="
                                dialogContrato = true
                                idContrato = item.id
                                editandoContratoVencido = false
                              "
                            >
                              {{
                                dayjs(item.ultimo_reajuste).format("DD/MM/YYYY")
                              }}
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
      </v-card>
    </v-col>

    <dialog-boleto
      :mostrar="dialogBoleto"
      :dados="dadosBoleto"
      @cancelar="
        dialogBoleto = false
        dadosBoleto = null
      "
      @editado="boletoEditado"
    ></dialog-boleto>

    <alerta-acoes
      :palavra-chave="palavraChave"
      @sumir="mostrarAlerta = false"
      v-bind:mostrar="mostrarAlerta"
      :funcao="funcao"
    ></alerta-acoes>

    <dialog-contrato
      :mostrar="dialogContrato"
      @cancelar="
        dialogContrato = false
        idContrato = ''
      "
      @editado="editadoContrato"
      :idContrato="idContrato"
    ></dialog-contrato>
  </v-row>
</template>

<script>
import api from "../services/api"
import dayjs from "dayjs"
import DialogBoleto from "../components/Dialogs/DialogBoleto"
import AlertaAcoes from "../components/shared/AlertaAcoes"
import DialogContrato from "./contrato/DialogContrato"

import { jsPDF } from "jspdf"
import "jspdf-autotable"

export default {
  name: "Home",
  components: {
    DialogBoleto,
    AlertaAcoes,
    DialogContrato,
  },
  data() {
    return {
      funcao: "",
      palavraChave: "boleto",
      mostrarAlerta: false,
      dialogBoleto: false,
      dadosBoleto: null,
      dialogContrato: false,
      idContrato: "",
      tab: null,
      camposContratosVencendo: [
        { text: "Código", value: "id" },
        { text: "Data de término", value: "data_fim" },
        { text: "Imóvel", value: "nome" },
      ],
      camposBoletosVencendo: [
        { text: "Código", value: "id" },
        { text: "Imóvel", value: "imovel_nome" },
        { text: "Cliente", value: "cliente_nome" },
        { text: "Vencimento", value: "data_vencimento" },
      ],
      camposContratoReajustar: [
        { text: "Código", value: "id" },
        { text: "Cliente", value: "cliente_nome" },
        { text: "Imóvel", value: "imovel_nome" },
        { text: "Último Reajuste", value: "ultimo_reajuste" },
      ],
      contratosVencendo: [],
      boletosVencendo: [],
      contratosParaReajustar: [],
      dayjs: dayjs,
      idBoleto: "",
      editandoContratoVencido: false,
    }
  },
  methods: {
    async buscarContratosVencendo() {
      api.get("/home/contratos_vencendo").then((resp) => {
        this.contratosVencendo = resp.data
      })
    },
    async buscarBoletosVencendo() {
      api.get("/boletos/vencendo").then((resposta) => {
        this.boletosVencendo = resposta.data
      })
    },
    async buscarContratosParaReajustar() {
      await api.get("/contrato/reajuste").then((resposta) => {
        this.contratosParaReajustar = resposta.data
      })
    },
    async boletoEditado(boleto) {
      if (boleto.data_quitacao || boleto.status == "Pago") {
        let index = this.boletosVencendo.findIndex((obj) => {
          return obj.id === boleto.id
        })
        this.boletosVencendo.splice(index, 1)
      }
      this.dialogBoleto = false
      this.funcao = "editado"
      this.palavraChave = "boleto"
      this.mostrarAlerta = true
    },
    async editadoContrato(contrato) {
      if (this.editandoContratoVencido) {
        let index = this.contratosVencendo.findIndex((obj) => {
          return obj.id === contrato.id
        })
        this.contratosVencendo.splice(index, 1)
      } else {
        let index = this.contratosParaReajustar.findIndex((obj) => {
          return obj.id === contrato.id
        })
        this.contratosParaReajustar.splice(index, 1)
      }
      this.dialogContrato = false
      this.funcao = "editado"
      this.palavraChave = "contrato"
      this.mostrarAlerta = true
    },

    gerarRelatorioContratosVencendo() {
      let novosDados = JSON.parse(JSON.stringify(this.contratosVencendo))
      for (let dado of novosDados) {
        dado.codigo = ("0000" + dado.id).slice(-4)
        dado.data = dayjs(dado.data_fim).format("DD/MM/YYYY")
      }
      let hojeAgr = dayjs().format("DD/MM/YYYY HH:mm:ss")
      var doc = new jsPDF()
      doc.page = 1
      doc.setProperties({
        title: "Relátorio de contratos para vencer",
      })
      doc.setFontSize(10)
      doc.text(hojeAgr, 200, 10, null, null, "right")
      doc.line(10, 12, 200, 12)
      doc.setFontSize(24)
      doc.text(`Relátorio de contratos para vencer`, 10, 22)
      doc.setFontSize(14)
      doc.text(
        `Total: ${this.contratosVencendo.length}`,
        200,
        21,
        null,
        null,
        "right"
      )
      doc.autoTable({
        head: [["Código", "Data de término", "Imóvel"]],
        columns: [
          { header: "Código", dataKey: "codigo" },
          { header: "Data de término", dataKey: "data" },
          { header: "Imóvel", dataKey: "nome" },
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
        doc.output("bloburl", { filename: "tabela_contratos_para_vencer.pdf" })
      )
    },

    gerarRelatorioBoletosVencidos() {
      let novosDados = JSON.parse(JSON.stringify(this.boletosVencendo))
      for (let dado of novosDados) {
        dado.codigo = ("000000" + dado.id).slice(-6)
        dado.data = dayjs(dado.data_vencimento).format("DD/MM/YYYY")
      }
      let hojeAgr = dayjs().format("DD/MM/YYYY HH:mm:ss")
      var doc = new jsPDF()
      doc.page = 1
      doc.setProperties({
        title: "Relátorio de boletos vencidos",
      })
      doc.setFontSize(10)
      doc.text(hojeAgr, 200, 10, null, null, "right")
      doc.line(10, 12, 200, 12)
      doc.setFontSize(24)
      doc.text(`Relátorio de boletos vencidos`, 10, 22)
      doc.setFontSize(14)
      doc.text(
        `Total: ${this.boletosVencendo.length}`,
        200,
        21,
        null,
        null,
        "right"
      )
      doc.autoTable({
        head: [["Código", "Imóvel", "Cliente", "Vencimento"]],
        columns: [
          { header: "Código", dataKey: "codigo" },
          { header: "Imóvel", dataKey: "imovel_nome" },
          { header: "Cliente", dataKey: "cliente_nome" },
          { header: "Vencimento", dataKey: "data" },
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
        doc.output("bloburl", { filename: "tabela_boletos_vencidos.pdf" })
      )
    },

    gerarRelatorioContratosReajustar() {
      let novosDados = JSON.parse(JSON.stringify(this.contratosParaReajustar))
      for (let dado of novosDados) {
        dado.codigo = ("0000" + dado.id).slice(-4)
        dado.data = dayjs(dado.ultimo_reajuste).format("DD/MM/YYYY")
      }
      let hojeAgr = dayjs().format("DD/MM/YYYY HH:mm:ss")
      var doc = new jsPDF()
      doc.page = 1
      doc.setProperties({
        title: "Relátorio de contrato para reajustar",
      })
      doc.setFontSize(10)
      doc.text(hojeAgr, 200, 10, null, null, "right")
      doc.line(10, 12, 200, 12)
      doc.setFontSize(24)
      doc.text(`Relátorio de contratos para reajustar`, 10, 22)
      doc.setFontSize(14)
      doc.text(
        `Total: ${this.contratosParaReajustar.length}`,
        200,
        21,
        null,
        null,
        "right"
      )
      doc.autoTable({
        head: [["Código", "Imóvel", "Cliente", "Último reajuste"]],
        columns: [
          { header: "Código", dataKey: "codigo" },
          { header: "Cliente", dataKey: "cliente_nome" },
          { header: "Imóvel", dataKey: "imovel_nome" },
          { header: "Último reajuste", dataKey: "data" },
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
        doc.output("bloburl", {
          filename: "tabela_contratos_para_reajustar.pdf",
        })
      )
    },
  },
  created() {
    this.buscarContratosVencendo()
    this.buscarBoletosVencendo()
    this.buscarContratosParaReajustar()
  },
}
</script>

<style scoped src="../css/dataTableVuetifyCustom.css" />
<style scoped src="../css/tabVuetifyCustom.css" />

<style>
.dica-tabela {
  color: #888888;
}
</style>
