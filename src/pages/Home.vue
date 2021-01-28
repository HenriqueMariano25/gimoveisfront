<template>
  <b-container>
    <b-card-group deck>
      <b-card header="Clientes em atraso"
              header-tag="header"
              footer-tag="footer"
              class="text-center"
              header-text-variant="danger">
        <template>
          <b-table-simple hover small striped>
            <b-tbody>
              <b-tr>
                <b-td>Henrique</b-td>
                <b-td>R$ 123</b-td>
              </b-tr>
              <b-tr>
                <b-td>Henrique</b-td>
                <b-td>R$ 123</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </template>
      </b-card>

      <b-card header="Despesas do dia"
              header-tag="header"
              footer-tag="footer"
              class="text-center"
              header-text-variant="danger">
        <template>
          <b-table-simple hover small striped>
            <b-tbody>
              <b-tr>
                <b-td>Conta luz</b-td>
                <b-td>R$ 123</b-td>
              </b-tr>
              <b-tr>
                <b-td>Henrique</b-td>
                <b-td>R$ 123</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </template>
      </b-card>

      <b-card header="Contratos vencidos"
              header-tag="header"
              footer-tag="footer"
              class="text-center"
              header-text-variant="danger">
        <template>
          <b-table-simple hover small striped>
            <b-tbody>
              <b-tr>
                <b-td>Salão de festa</b-td>
                <b-td>R$ 123</b-td>
              </b-tr>
              <b-tr>
                <b-td>Henrique</b-td>
                <b-td>R$ 123</b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </template>
      </b-card>
    </b-card-group>
  </b-container>
</template>

<script>
export default {
name: "Home",
  data(){
    return{
      totalRows: 1,
      currentPage: 1,
      perPage: 25,
      pageOptions: [25, 50, 100],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      items: [{nome:'Henrique',valor:'R$100.00'}],
    }
  }
}
</script>

<style scoped>

</style>