<template>
  <v-dialog v-model="mostrar" persistent max-width="1200px">
    <v-card class="pa-3">
      <CabecalhoDialog
          texto-cadastrando="Imprimir relatório do caixa"
          @fechar="cancelar()"
      />
      <v-row>
        <v-col>
          <v-row>
            <v-col class="pb-1">
              <span style="color:rgb(90,90,90)">Preencha o intervalo de dias referentes aos lançamentos no caixa.</span>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col>
              <v-text-field
                  label="Data inicial"
                  outlined
                  dense
                  hide-details
                  v-model="relatorio.data_inicio"
                  type="date"
              >
              </v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                  label="Data final"
                  outlined
                  dense
                  hide-details
                  v-model="relatorio.data_fim"
                  type="date"
              >
              </v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-btn
                  depressed
                  :color="'var(--preto-principal)'"
                  dark
                  @click="gerarRelatorio()"
              >
                <v-icon>
                  mdi-printer
                </v-icon>
                Imprimir
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>


      <RodapeDialog @cancelar="cancelar()" :btn-salvar="false"/>
    </v-card>

  </v-dialog>
</template>

<script>

import CabecalhoDialog from "@/components/shared/Dialog/CabecalhoDialog"
import RodapeDialog from "@/components/shared/Dialog/RodapeDialog"

import api from "@/services/api"
import {jsPDF} from "jspdf";
import "jspdf-autotable"

import dayjs from "dayjs"
var isBetween = require("dayjs/plugin/isBetween")
dayjs.extend(isBetween)


export default {
  name: "DialogRelatorioCaixa",
  props: ['mostrar'],
  components: {
    CabecalhoDialog,
    RodapeDialog
  },
  data() {
    return {
      relatorio: {
        data_inicio: null,
        data_fim: null
      }
    }
  },
  methods: {
    cancelar() {
      this.$emit('cancelar')
    },

    async gerarRelatorio(){
      let lancamentos = await api.get("/caixa/relatorio", {params:  this.relatorio }).then((resp) => resp.data)

      let hojeAgr = dayjs().format("DD/MM/YYYY HH:mm:ss")
      let novosDados = JSON.parse(JSON.stringify(lancamentos))
      let valorTotal = 0
      let debito = 0
      let credito = 0
      for (let i in novosDados) {
        // let valorFormatado = `${novosDados[i].valor.replace(".", ",")}`
        let movimentoFormatada = dayjs(novosDados[i].movimento).format(
            "DD/MM/YYYY"
        )
        let valorFormatado
        if(novosDados[i].id_debito_credito === 1){
          debito += parseFloat(novosDados[i].valor)
          valorTotal -= parseFloat(novosDados[i].valor)
          valorFormatado = `-${novosDados[i].valor.replace(".", ",")}`
        }else if(novosDados[i].id_debito_credito === 2){
          credito += parseFloat(novosDados[i].valor)
          valorTotal += parseFloat(novosDados[i].valor)
          valorFormatado = `${novosDados[i].valor.replace(".", ",")}`
        }
        let codigoFormatado = ("000000" + novosDados[i].id).slice(-6)
        novosDados[i].valor = valorFormatado
        novosDados[i].movimento = movimentoFormatada
        novosDados[i].id = codigoFormatado
      }
      novosDados.push({ valor: valorTotal.toFixed(2).replace('.', ',')})
      var doc = new jsPDF()
      doc.page = 1
      doc.setProperties({
        title: "Relátorio de Caixa",
      })
      doc.setFontSize(10)
      doc.text(hojeAgr, 200, 10, null, null, "right")
      doc.line(10, 12, 200, 12)
      doc.setFontSize(22)
      doc.text(`Relátorio de Caixa`, 10, 22)
      doc.setFontSize(14)
      doc.text(`Total: ${lancamentos.length}`, 200, 21, null, null, "right")

      doc.setFontSize(16)
      doc.setTextColor(16, 90, 185);
      doc.text(`Crédito: ${credito.toFixed(2).replace('.',',')} `, 10, 30)

      doc.setTextColor(255, 0, 0);
      doc.text(`Débito: ${debito.toFixed(2).replace('.',',')} `, 90, 30)


      if(valorTotal >= 0)
        doc.setTextColor(16, 90, 185);
      else
        doc.setTextColor(255, 0, 0);
      doc.text(`Saldo: ${valorTotal.toFixed(2).replace('.',',')} `, 200, 30, null, null, "right")

      doc.autoTable({
        head: [
          [
            "Código",
            "Movimento",
            "Conta",
            "Histórico",
            "Imóvel",
            "Valor",
            "D/C",
          ],
        ],
        columns: [
          { header: "Código", dataKey: "id" },
          { header: "Movimento", dataKey: "movimento" },
          { header: "Conta", dataKey: "conta_nome" },
          { header: "Histórico", dataKey: "descricao_historico" },
          { header: "Imóvel", dataKey: "imovel_nome" },
          { header: "Valor", dataKey: "valor" },
        ],
        columnStyles: { id: { halign: "center" }, valor: { halign: "right"} },
        body: novosDados,
        theme: "striped",
        headStyles: {
          fillColor: [50, 50, 50],
        },
        styles: {
          fontSize:8,
        },
        startY: 34,
        pageBreak: "auto",
        margin: { left: 10, right: 10, top: 10, bottom: 13 },
        didParseCell: function (data) {

          var rows = data.table.body;
          if (data.row.index === rows.length - 1) {
            console.log(data)
            console.log(data.cell.text[0])
            console.log(parseFloat(data.cell.text[0].replace(",", ".")))
            data.cell.styles.fillColor = [210, 210, 210];
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.fontSize = 10;
            if(parseFloat(data.cell.text[0].replace(",", ".")) > 0)
              data.cell.styles.textColor = [16, 90, 185];
            else
              data.cell.styles.textColor = [255, 0, 0];
          }
        }
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

        // doc.setFontSize(16)
        // if(valorTotal < 0){
        //   doc.setTextColor(255,0,0);
        // }else if(valorTotal > 0){
        //   doc.setTextColor(1,71,154);
        // }
        // doc.text(`R$: ${valorTotal.toFixed(2).replace(".", ",")}`, 10, 290)
        // doc.setFontSize(8)
        // doc.setTextColor(0,0,0);
      }
      window.open(doc.output("bloburl", { filename: "tabela_imovel.pdf" }))
    }
  }
}
</script>

<style scoped>

</style>