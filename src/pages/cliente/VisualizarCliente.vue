<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <vs-button color="#007bff" type="filled" icon="add" @click="popupCadastrarCliente=true">Adicionar cliente</vs-button>
      </b-col>
      <b-col class="my-1">
        <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="right"
            class="my-0"
            first-text="Primeira"
            last-text="Última"
        ></b-pagination>
      </b-col>
      <b-col sm="5" md="auto" class="my-1" >
        <b-form-group
            label="Por pagina"
            label-for="per-page-select"
            label-cols-sm="auto"
            label-cols-md="auto"
            label-cols-lg="auto"
            label-align-sm="right"
            label-size="sm"
            align="right"
        >
          <b-form-select
              id="per-page-select"
              v-model="perPage"
              :options="pageOptions"
              size="sm"
          ></b-form-select>
        </b-form-group>
      </b-col>
    </b-row>

    <!-- Main table element -->
    <b-table
        :items="items"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        :filter-included-fields="filterOn"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :sort-direction="sortDirection"
        stacked="md"
        show-empty
        small
        @filtered="onFiltered"
    >
      <template #cell(name)="row">
        {{ row.value.first }} {{ row.value.last }}
      </template>

      <template #cell(editar)="row">
        <vs-button radius color="dark" size="small" type="border" @click="editarCliente(row.item.id)" icon="edit"></vs-button>
      </template>
      <template #cell(detalhes)="row">
        <vs-button color="dark" size="small" type="border" @click="row.toggleDetails" :icon="row.detailsShowing ? 'expand_less' : 'expand_more' "></vs-button>
      </template>


      <template #row-details="row">
        <b-card>
          <p>Endereço: {{ row.item.rua }} n° {{row.item.numero}}, {{ row.item.bairro }}, {{ row.item.cidade }}, {{ row.item.estado }}</p>
          <p>Complemento: {{ row.item.complemento }}</p>
          <p>Identidade: {{ row.item.identidade }}</p>
          <p>Data de Nascimento: {{ row.item.data_nascimento }}</p>
          <p>Estado Civil: {{row.item.estado_civil}}</p>
          <p>Referência: {{row.item.referencia}}</p>

          <p>Telefones:</p>
          <ul v-for="(telefone, index) in row.item.numero_telefone" :key="index">

            <li>{{telefone}}</li>
          </ul>
        </b-card>
      </template>
    </b-table>

<!--  Fim da tabela-->
    <PopupAddCliente :visivel="popupCadastrarCliente" :cliente="cliente" :telefones="telefones" :editar="editarClientePopup" @fecharpopup="popupCadastrarCliente = $event" @atualizar="buscarClientes()"/>
  </b-container>
</template>

<script>

import api from '../../services/api'
import PopupAddCliente from '../../components/cliente/PopupAddCliente'

export default {
  components:{
    PopupAddCliente
  },
  data() {
    return {
      popupCadastrarCliente:false,
      editarClientePopup: false,
      items: [],
      fields: [
        {key: 'nome', label: 'Nome', sortable: true},
        {key: 'email', label: 'Email', sortable: true, class: 'text-center'},
        {key: 'cpf_cnpj', label: 'CPF ou CNPJ', sortable: true,},
        {key: 'detalhes', label: 'Detalhes'},
        {key: 'editar', label: 'Editar'},
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: ''
      },
      cliente: {
        nome: "",
        rua: "",
        bairro: "",
        cidade: "",
        estado: "",
        complemento: "",
        cpf_cnpj: "",
        identidade: "",
        email: "",
        referencia: "",
        cep: "",
        data_nascimento: "",
        estado_civil: "",
        numero: "",
      },
      telefones: [{id:"",numero:"", tipo:""}],

    }
  },
  computed: {
    sortOptions() {
      return this.fields
          .filter(f => f.sortable)
          .map(f => {
            return {text: f.label, value: f.key}
          })
    }
  },
  async mounted() {
    this.buscarClientes()
    this.buscarEstadosCivis()

  },
  methods: {
    async buscarEstadosCivis(){
      await api.get('/estados_civis').then(response => {
        this.estadoCivil = response.data
      })
    },
    async buscarClientes(){
      await api.get('/clientes').then(response => {
        this.items = response.data
        this.totalRows = this.items.length
      }).catch(erro => {console.log(erro)})
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    async editarCliente(id){
      await api.get('/cliente', {params:{idCliente:id}}).then(response => {
        this.cliente = response.data
        this.telefones = []
        for(let x = 0; x < response.data.numero_telefone.length; x++){
          let numero = response.data.numero_telefone[x]
          let tipo = response.data.tipo_telefone[x]
          let id = response.data.id_telefone[x]
          this.telefones.push({id:id,numero:numero, tipo:tipo})
        }
        this.popupCadastrarCliente = true
        this.editarClientePopup = true
      })
    }
  }
}
</script>
<style>
.input-personalizado{
  width:100%;
  margin-bottom: 10px;
}
.botao-salvar{
  width:100%;
  margin-top:5px;
}
.botao-fiador{
  width:100%;
  margin-bottom: 10px;
}
.vs-input--label{
  color:rgb(160,160,160);
  font-size:11px;
  margin-bottom:2px;
}
.input-nascimento{
  margin-top:-6px;
}
.vs-con-input-label{
  width:100%;
}
.vs-notifications{
  max-width:100% !important;
}
.con-select{
  width:100%;
  margin-top:-6px;
}
.vs-select--label{
  margin:0;
}
</style>