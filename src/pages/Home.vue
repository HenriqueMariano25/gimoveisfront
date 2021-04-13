<template>
  <b-container fluid>
    <b-card-group columns>
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
              bordered
              responsive
              head-variant="dark"
              :fields="camposContratosVencendo"
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
          </b-table>
        </template>
      </b-card>
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
              bordered
              head-variant="dark"
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
            <template #cell(id_contrato)="row">
              <div>
                <span>{{ ("0000" + row.item.id_contrato).slice(-4) }}</span>
              </div>
            </template>
            <template #empty>
              <span>Não há boletos vencidos!</span>
            </template>
          </b-table>
        </template>
      </b-card>
    </b-card-group>
  </b-container>
</template>

<script>

import api from '../services/api'
import dayjs from 'dayjs'

export default {
  name: "Home",
  data() {
    return {
      // totalRows: 1,
      // currentPage: 1,
      // perPage: 25,
      // pageOptions: [25, 50, 100],
      // sortBy: '',
      // sortDesc: false,
      // sortDirection: 'asc',
      // filter: null,
      // filterOn: [],
      // items: [{nome:'Henrique',valor:'R$100.00'}],
      camposContratosVencendo: [
        {key: 'id', label: 'Código', class: 'text-center'},
        {key: 'data_fim', label: 'Data de término', class: 'text-center'},
      ],
      camposBoletosVencendo: [
        {key: 'id', label: 'Código', class: 'text-center'},
        {key: 'data_vencimento', label: 'Data de vencimento', class: 'text-center'},
        {key: 'id_contrato', label: 'Contrato', class: 'text-center'},
      ],
      contratosVencendo: [],
      boletosVencendo: [],
      dayjs: dayjs,
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
    }
  },
  created() {
    this.buscarContratosVencendo()
    this.buscarBoletosVencendo()
  }
}
</script>

<style scoped>
.tabela-contratos-vencendo {
  margin: 0;
}
</style>