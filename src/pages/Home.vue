<template>
  <b-container fluid style="padding-right:15px;padding-left:75px">
    <b-row>
      <b-col cols="4">
        <b-card header="Contratos para vencer"
                header-tag="header"
                footer-tag="footer"
                class="text-center"
                header-text-variant="danger"
                style="max-width: 100%;"
        >
          <template>
            <b-table
                striped
                hover
                :items="contratosVencendo"
                :small="true"
                show-empty
                class="tabela-contratos-vencendo"
                responsive
                head-variant="dark"
                :fields="camposContratosVencendo"
                sticky-header="294px"
            >
              <template #cell(id)="row">
                <div>
                  <span>{{ ("0000" + row.item.id).slice(-4) }}</span>
                </div>
              </template>
              <template #cell(data_fim)="row">
                <div>
                  <span>{{ dayjs(row.item.data_fim).format('DD/MM/YYYY') }}</span>
                </div>
              </template>
              <template #empty>
                <span>Não há contratos vencendo!</span>
              </template>
              <template #table-colgroup>
                <col cols="auto" style="width: 15px">
                <col style="width: 15px">
              </template>
            </b-table>
          </template>
        </b-card>
      </b-col>
      <b-col class="mb-2">
        <b-card header="Boletos vencidos"
                class="text-center"
                header-text-variant="danger">
          <template>
            <b-table
                striped
                hover
                :items="boletosVencendo"
                :small="true"
                show-empty
                class="tabela-contratos-vencendo"
                :fields="camposBoletosVencendo"
                head-variant="dark"
                @row-dblclicked="mostrarEditarModalBoleto"
                sticky-header="294px"
            >
              <template #cell(id)="row">
                <div>
                  <span>{{ ("000000" + row.item.id).slice(-6) }}</span>
                </div>
              </template>
              <template #cell(data_vencimento)="row">
                <div>
                  <span>{{ dayjs(row.item.data_vencimento).format('DD/MM/YYYY') }}</span>
                </div>
              </template>
              <template #empty>
                <span>Não há boletos vencidos!</span>
              </template>
            </b-table>
          </template>
        </b-card>
      </b-col>
      <b-col cols="4">
        <b-card header="Contratos para reajustar"
                class="text-center"
                header-text-variant="danger">
          <template>
            <b-table
                striped
                hover
                :items="contratosParaReajustar"
                :small="true"
                show-empty
                class="tabela-contratos-vencendo"
                :fields="camposContratoReajustar"
                head-variant="dark"
                sticky-header="294px"
            >
              <template #cell(id)="row">
                <div>
                  <span>{{ ("000000" + row.item.id).slice(-6) }}</span>
                </div>
              </template>
              <template #empty>
                <span>Não há contratos para reajustar!</span>
              </template>
            </b-table>
          </template>
        </b-card>
      </b-col>
    </b-row>
    <ModalEditarBoleto :idBoleto="idBoleto" :visivelBoleto="modalBoletoVisivel"
                       @esconder-modal-boleto="modalBoletoVisivel = $event" @recarregarInformacoes="buscarBoletosVencendo"/>
  </b-container>
</template>

<script>

import api from '../services/api'
import dayjs from 'dayjs'
import ModalEditarBoleto from "@/components/shared/ModalEditarBoleto";

export default {
  name: "Home",
  components:{
    ModalEditarBoleto
  },
  data() {
    return {
      camposContratosVencendo: [
        {key: 'id', label: 'Código', class: 'text-center'},
        {key: 'data_fim', label: 'Data de término', class: 'text-center'},
      ],
      camposBoletosVencendo: [
        {key: 'id', label: 'Código', class: 'text-center'},
        {key: 'imovel_nome', label: 'Imóvel', class: 'text-center'},
        {key: 'cliente_nome', label: 'Cliente', class: 'text-center'},
        {key: 'data_vencimento', label: 'Data de vencimento', class: 'text-center'},
      ],
      camposContratoReajustar: [
        {key: 'id', label: 'Código', class: 'text-center'},
      ],
      contratosVencendo: [],
      boletosVencendo: [],
      contratosParaReajustar:[],
      dayjs: dayjs,
      idBoleto:'',
      modalBoletoVisivel:false,
    }
  },
  methods: {
    async buscarContratosVencendo() {
      api.get('/home/contratos_vencendo').then(resposta => {
        this.contratosVencendo = resposta.data
      })
    },
    async buscarBoletosVencendo() {
      api.get('/home/boletos_vencendo').then(resposta => {
        this.boletosVencendo = resposta.data
      })
    },
    async buscarContratosParaReajustar(){
      await api.get('/contrato/reajuste').then(resposta => {
        this.contratosParaReajustar = resposta.data
      })
    },
    mostrarEditarModalBoleto(linha){
      this.idBoleto = linha.id
      this.$modal.show('modal-editar-boleto')
      this.modalBoletoVisivel = true
    }
  },
  created() {
    this.buscarContratosVencendo()
    this.buscarBoletosVencendo()
    this.buscarContratosParaReajustar()
  }
}
</script>

<style>
.tabela-contratos-vencendo {
  margin: 0;
}
</style>