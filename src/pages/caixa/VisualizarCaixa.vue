<template>
  <b-container fluid class="centralizar-container">
    <b-row class="barra-top-caixa " align-v="center">
      <b-col>
        <h1 class="mb-1 titulo">Caixa</h1>
      </b-col>
      <b-col class="my-1 barra-busca esconder-quando-mobile" cols="3">
        <b-form-group class="mb-0">
          <b-input-group>
            <template #prepend>
              <b-input-group-text>
                <b-icon icon="search"></b-icon>
              </b-input-group-text>
            </template>
            <b-form-input
                id="filter-input"
                v-model="filter"
                type="search"
                placeholder="Ex: João da Silva"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row class="tabela-caixas">
      <b-col>
        <b-table
            class="tabela-caixa"
            id="tabela-caixa"
            primary-key="id"
            :tbody-transition-props="transProps"
            bordered
            head-variant="dark"
            sort-icon-left
            :items="items"
            :fields="camposCaixa"
            :current-page="currentPage"
            :per-page="perPage"
            :filter="filter"
            :filter-included-fields="filterOn"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            show-empty
            small
            @filtered="onFiltered"
            striped
            hover
            outlined
            sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px)"
            no-border-collapse>
          <template #table-colgroup>
            <col>
            <col>
            <col>
            <col style="width: 150px">
          </template>
          <template #cell(id)="row">
            <span class="tr-caixa">{{ ("000000" + row.item.id).slice(-6) }}</span>
          </template>
          <template #cell(debito_credito)="row">
            <span v-if="row.item.debito_credito == 'débito'" class="debito">{{ row.item.debito_credito }}</span>
            <span v-else class="credito">{{ row.item.debito_credito }}</span>
          </template>
          <template #cell(movimento)="row">
            <span class="tr-caixa">{{ dayjs(row.item.movimento).format('DD/MM/YYYY') }}</span>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-container fluid class="divider-personalizado esconder-quando-mobile" style="margin-left: -75px">
      <b-row align-v="end">
<!--        <b-col class="" cols="auto">-->
<!--          <b-pagination-->
<!--              v-model="currentPage"-->
<!--              :total-rows="totalRows"-->
<!--              :per-page="perPage"-->
<!--              align="left"-->
<!--              class="my-0"-->
<!--              first-text="Primeira"-->
<!--              last-text="Última"-->
<!--          ></b-pagination>-->
<!--        </b-col>-->
<!--        <b-col sm="5" md="auto" class="">-->
<!--          <b-form-group-->
<!--              label="Por pagina"-->
<!--              label-for="per-page-select"-->
<!--              label-cols-sm="auto"-->
<!--              label-cols-md="auto"-->
<!--              label-cols-lg="auto"-->
<!--              label-align-sm="right"-->
<!--              label-size="sm"-->
<!--              align="left"-->
<!--              class="mb-1">-->
<!--            <b-form-select-->
<!--                id="per-page-select"-->
<!--                v-model="perPage"-->
<!--                :options="pageOptions"-->
<!--                size="sm"-->
<!--            ></b-form-select>-->
<!--          </b-form-group>-->
<!--        </b-col>-->
<!--        <b-col class="esconder-quando-mobile">-->
<!--          <h6>Total: {{ this.totalRows }}</h6>-->
<!--        </b-col>-->
        <b-col class="ml-auto esconder-quando-mobile" cols="auto" style="margin-bottom: -5px">
          <vs-button color="#24a35a" type="filled" icon="person_add" @click="mostrarModal">
            Adicionar
          </vs-button>
        </b-col>
      </b-row>
    </b-container>
    <ModalCaixa @recarregarDados="buscarCaixa"></ModalCaixa>
  </b-container>
</template>
<script>

import ModalCaixa from '../../components/Caixa/ModalCaixa'
import api from '../../services/api'
import dayjs from 'dayjs'

export default {
  name: "VisualizarCaixa.vue",
  data(){
    return{
      items: [],
      camposCaixa: [
        {key: 'id', label: 'Código', sortable: true, class: 'text-center' },
        {key: 'movimento', label: 'Movimento', sortable: true, class: 'text-center'},
        {key: 'imovel_nome', label: 'Imóvel', sortable: true, thClass: 'text-center'},
        {key: 'debito_credito', label: 'Débito ou Crédito', sortable: true, class: 'text-center'},
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 25,
      pageOptions: [25, 50, 100],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      transProps: {
        name: "flip-list",
      },
      dayjs: dayjs,
    }
  },
  components:{
    ModalCaixa
  },
  created() {
    this.buscarCaixa()
  },
  methods:{
    mostrarModal() {
      this.$modal.show('modal-caixa')
    },
    async buscarCaixa(){
      await api.get('/caixa').then(consulta => {
        console.log(consulta)
        this.items = consulta.data
      })
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
  }
}
</script>

<style scoped>

.barra-top-caixa {
  padding: 0;
  background-color: white;
  margin: 0;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0px 1px 5px rgba(200, 200, 200, 0.5);
}

.tabela-caixas {
  background-color: white;
  margin: 0;
  padding-top: 15px;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0px 1px 5px rgba(200, 200, 200, 0.5);
}

.debito{
  color: green;
}

.credito{
  color: red;
}

</style>