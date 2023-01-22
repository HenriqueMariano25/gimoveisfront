<template>
  <v-row no-gutters>
    <BarraTopoBusca
        titulo="Caixa"
        :btnAdicionar="true"
        @clickBtnAdicionar="dialogCaixa = true"
    />

    <BarraBuscaRelatorio
        :btn-gerar-relatorio="true"
        :input-busca="true"
        @buscar="buscar"
        @limparBusca="buscarCaixa"
        @clickBtnImprimirRelatorio="dialogRelatorioCaixa = true"
    />

    <v-col >
      <v-row class="mt-0">
        <v-col class="pt-2">
          <v-card class="">
            <v-data-table
              @update:page="$paraTopo"
              fixed-header
              :headers="headers"
              :items="filtrarCaixa"
              class="tabela pointer"
              :height="
                $isMobile ? 'calc(100vh - 300px)' : 'calc(100vh - 192px)'
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
              :search="busca"
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
                      {{
                        item.movimento
                            ? dayjs(item.movimento).format("DD/MM/YYYY")
                            : ""
                      }}
                    </span>
                  </td>
                  <td @click.prevent="abrirDetalhes(item, $event)">
                    <span style="white-space: nowrap">
                      {{ item.conta_nome }}
                    </span>
                  </td>
                  <td @click.prevent="abrirDetalhes(item, $event)">
                    <span style="white-space: nowrap">
                      {{ item.descricao_historico }}
                    </span>
                  </td>
                  <td @click.prevent="abrirDetalhes(item, $event)">
                    <span style="white-space: nowrap">
                      {{ item.imovel_nome }}
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
                  <td @click.prevent="abrirDetalhes(item, $event)">
                    <span style="white-space: nowrap">
                      R$ {{ item.valor.replace(".", ",") }}
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

    <DialogRelatorioCaixa :mostrar="dialogRelatorioCaixa" @cancelar="dialogRelatorioCaixa = false"/>


  </v-row>
</template>
<script>
import api from "../../services/api"

import BarraTopoBusca from "../../components/shared/BarraTopoBusca"
import AlertaAcoes from "../../components/shared/AlertaAcoes"
import DialogDeletar from "../../components/shared/DialogDeletar"
import DialogCaixa from "./DialogCaixa"
import DialogRelatorioCaixa from "@/pages/caixa/DialogRelatorioCaixa";

import BarraBuscaRelatorio from "@/components/shared/BarraBuscaRelatorio";

import dayjs from "dayjs"
var isBetween = require("dayjs/plugin/isBetween")
dayjs.extend(isBetween)

export default {
  name: "VisualizarCaixa.vue",
  components: {
    BarraTopoBusca,
    AlertaAcoes,
    DialogDeletar,
    DialogCaixa,
    DialogRelatorioCaixa,
    BarraBuscaRelatorio
  },
  data() {
    return {
      items: [],
      headers: [
        { text: "Lançamento", value: "id", align: "center", width: "165px" },
        { text: "Movimento", value: "movimento", width: "155px" },
        { text: "Conta", value: "conta_nome", width: "130px" },
        { text: "Histórico", value: "descricao_historico", width: "143px" },
        { text: "Imóvel", value: "imovel_nome", width: "130px" },
        { text: "D/C", value: "id_debito_credito", width: "115px" },
        { text: "Valor", value: "valor", width: "130px" },
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
      dialogRelatorioCaixa: false,
      busca: '',
      carregando: false,
    }
  },
  mounted() {
    this.buscarCaixa()
  },
  computed: {
    filtrarCaixa() {
      return this.items
    },
  },
  methods: {
    async buscar(valor){
      this.carregando = true;

      await api.get("/caixa/busca", { params: { busca:valor } }).then((consulta) => {
        this.items = consulta.data
        this.filtrados = consulta.data
        this.carregando = false;
        if(consulta.data.length > 0){
          this.totalItens = parseInt(consulta.data[0].total_itens)
        }
      })
    },
    async buscarCaixa() {
      this.carregando = true;

      let page = this.pagina - 1
      let size = this.itensPorPagina

      await api.get("/caixa", { params: { page, size } }).then((consulta) => {
        this.items = consulta.data
        this.filtrados = consulta.data
        this.carregando = false;
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
