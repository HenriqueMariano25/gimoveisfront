<template>
  <b-container>
    <b-card-group deck>
      <b-card header="Contratos para vencer"
              header-tag="header"
              footer-tag="footer"
              class="text-center"
              header-text-variant="danger">
        <template>
          <b-table
              striped
              hover
              :items="contratoVencendo"
              thead-class="d-none"
              :small="true"
              show-empty
              class="tabela-contratos-vencendo"
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
<!--          <b-table-simple hover small striped class="tabela-contratos-vencendo">-->
<!--            <b-tbody>-->
<!--              <b-tr v-for="contrato in contratoVencendo" :key="contrato.id">-->
<!--                <b-td>{{ ("0000" + contrato.id).slice(-4) }}</b-td>-->
<!--                <b-td>{{ dayjs(contrato.data_fim).format('DD/MM/YYYY') }}</b-td>-->
<!--              </b-tr>-->
<!--            </b-tbody>-->
<!--            <template #empty="scope">-->
<!--              <h4>{{ scope.emptyText }}</h4>-->
<!--            </template>-->
<!--          </b-table-simple>-->
        </template>
      </b-card>
<!--            <b-card header="Clientes em atraso"-->
      <!--                    header-tag="header"-->
      <!--                    footer-tag="footer"-->
      <!--                    class="text-center"-->
      <!--                    header-text-variant="danger">-->
      <!--              <template>-->
      <!--                <b-table-simple hover small striped>-->
      <!--                  <b-tbody>-->
      <!--                    <b-tr>-->
      <!--                      <b-td>Henrique</b-td>-->
      <!--                      <b-td>R$ 123</b-td>-->
      <!--                    </b-tr>-->
      <!--                    <b-tr>-->
      <!--                      <b-td>Henrique</b-td>-->
      <!--                      <b-td>R$ 123</b-td>-->
      <!--                    </b-tr>-->
      <!--                  </b-tbody>-->
      <!--                </b-table-simple>-->
      <!--              </template>-->
      <!--            </b-card>-->

<!--            <b-card header="Despesas do dia"-->
<!--                    header-tag="header"-->
<!--                    footer-tag="footer"-->
<!--                    class="text-center"-->
<!--                    header-text-variant="danger">-->
<!--              <template>-->
<!--                <b-table-simple hover small striped>-->
<!--                  <b-tbody>-->
<!--                    <b-tr>-->
<!--                      <b-td>Conta luz</b-td>-->
<!--                      <b-td>R$ 123</b-td>-->
<!--                    </b-tr>-->
<!--                    <b-tr>-->
<!--                      <b-td>Henrique</b-td>-->
<!--                      <b-td>R$ 123</b-td>-->
<!--                    </b-tr>-->
<!--                  </b-tbody>-->
<!--                </b-table-simple>-->
<!--              </template>-->
<!--            </b-card>-->

      <!--      <b-card header="Contratos vencidos"-->
      <!--              header-tag="header"-->
      <!--              footer-tag="footer"-->
      <!--              class="text-center"-->
      <!--              header-text-variant="danger">-->
      <!--        <template>-->
      <!--          <b-table-simple hover small striped>-->
      <!--            <b-tbody>-->
      <!--              <b-tr>-->
      <!--                <b-td>Salão de festa</b-td>-->
      <!--                <b-td>R$ 123</b-td>-->
      <!--              </b-tr>-->
      <!--              <b-tr>-->
      <!--                <b-td>Henrique</b-td>-->
      <!--                <b-td>R$ 123</b-td>-->
      <!--              </b-tr>-->
      <!--            </b-tbody>-->
      <!--          </b-table-simple>-->
      <!--        </template>-->
      <!--      </b-card>-->
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
      camposContratoVencendo: [
        {key: 'id', label: '', class: 'text-center'},
        {key: 'data_fim', label: '', thClass: 'text-center'},
      ],
      contratoVencendo: [],
      dayjs: dayjs,
    }
  },
  methods: {
    async buscarContratosVencendo() {
      api.get('/home/contratos_vencendo').then(resposta => {
        this.contratoVencendo = resposta.data
      })
    }
  },
  created() {
    this.buscarContratosVencendo()
  }
}
</script>

<style scoped>
.tabela-contratos-vencendo{
  margin:0;
}
</style>