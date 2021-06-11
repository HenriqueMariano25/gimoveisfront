<template>
  <b-container fluid class="centralizar-container">
    <div class="barra-busca-mobile">
      <b-row class="no-gutters">
        <b-col>
          <b-form-group class="barra-busca-mobile__form-group">
            <b-input-group>
              <transition name="slide-down__input-busca">
                <b-form-input
                    v-if="barraBuscaMobile"
                    id="filter-input"
                    v-model="filter"
                    type="search"
                    placeholder="Ex: João da Silva"
                    class="barra-busca-mobile__input">
                </b-form-input>
              </transition>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col cols="auto">
          <template>
            <b-input-group-text @click="barraBuscaMobile = !barraBuscaMobile" class="barra-busca-mobile__botao">
              <b-icon icon="search"></b-icon>
            </b-input-group-text>
          </template>
        </b-col>
      </b-row>
    </div>
    <b-row class="barra-top-cliente " align-v="center">
      <b-col>
        <h1 class="mb-1 titulo">Cadastro de Clientes</h1>
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
    <b-row class="tabela-clientes">
      <b-col class="botao-add-total-mobile" cols="12">
        <b-row>
          <b-col>
            <vs-button color="#24a35a" type="filled" icon="person_add" @click="adicionarClienteModal" style="width: 100%"
                       class="botao-add-mobile">
              Adicionar
            </vs-button>
          </b-col>
          <b-col class="ml-auto total-mobile" cols="auto">
            <h6>Total: {{ this.totalRows }}</h6>
          </b-col>
        </b-row>
      </b-col>
      <b-col class="col-tabela-clientes">
        <b-table
            class="tabela-cliente"
            id="tabela-cliente"
            primary-key="nome"
            :tbody-transition-props="transProps"
            bordered
            head-variant="dark"
            sort-icon-left
            :items="items"
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
            :filter="filter"
            :filter-included-fields="colunasPrFiltro"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            :busy="carregandoTableCliente"
            show-empty
            small
            @filtered="onFiltered"
            striped
            hover
            outlined
            sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px)"
            no-border-collapse
            @row-clicked="item=>$set(item, '_showDetails', !item._showDetails)">
          <template #cell(nome)="row">
            <label class="tr-cliente">{{ row.item.nome }}</label>
          </template>
          <template #cell(email)="row">
            <label class="tr-cliente">{{ row.item.email }}</label>
          </template>
          <template #cell(cpf_cnpj)="row">
            <label class="tr-cliente">{{ row.item.cpf_cnpj }}</label>
          </template>
          <template #cell(status)="row">
            <label class="tr-cliente">{{ row.item.status }}</label>
          </template>
          <template #cell(editar)="row">
            <vs-tooltip text="Editar">
              <vs-button type="flat" color="dark" @click.native="editarClienteModal(row.item.id)" icon="edit"></vs-button>
            </vs-tooltip>
          </template>
          <template #cell(deletar)="row">
            <vs-tooltip text="Deletar">
              <vs-button type="flat" color="dark" @click="deletarClienteModal(row.item)" icon="delete"></vs-button>
            </vs-tooltip>
          </template>
          <template #table-colgroup>
            <col>
            <col>
            <col>
            <col>
            <col style="width: 15px">
            <col style="width: 15px">
          </template>
          <template #row-details="row">
            <b-card>
              <b-row>
                <b-col cols="auto">
                  <span><b>Rua:</b> {{ row.item.rua }},{{ row.item.numero }}</span>
                </b-col>
                <b-col cols="auto">
                  <span><b>Bairro: </b>{{ row.item.bairro }}</span>
                </b-col>
                <b-col cols="auto">
                  <span><b>Cidade: </b>{{ row.item.cidade }}</span>
                </b-col>
                <b-col cols="auto">
                  <span><b>Estado: </b>{{ row.item.estado }}</span>
                </b-col>
                <b-col cols="auto">
                  <span><b>CEP: </b>{{ row.item.cep }}</span>
                </b-col>
                <b-col>
                  <span><b>Complemento: </b>{{ row.item.complemento }}</span>
                </b-col>
              </b-row>
              <span><b>Telefones: </b></span>
              <div v-for="(telefone, index) in row.item.numero_telefone" :key="index">
                <b-row>
                  <b-col cols="auto"><span>{{ telefone }}</span></b-col>
                  <b-col><span>{{ row.item.tipo_telefone[index] }}</span></b-col>
                </b-row>
              </div>
            </b-card>
          </template>
          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle mr-3"></b-spinner>
              <strong>Carregando...</strong>
            </div>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-container fluid class="divider-personalizado esconder-quando-mobile" style="margin-left: -75px">
      <b-row align-v="end">
        <b-col class="" cols="auto">
          <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              align="left"
              class="my-0"
              first-text="Primeira"
              last-text="Última"
          ></b-pagination>
        </b-col>
        <b-col sm="5" md="auto" class="">
          <b-form-group
              label="Por pagina"
              label-for="per-page-select"
              label-cols-sm="auto"
              label-cols-md="auto"
              label-cols-lg="auto"
              label-align-sm="right"
              label-size="sm"
              align="left"
              class="mb-1">
            <b-form-select
                id="per-page-select"
                v-model="perPage"
                :options="pageOptions"
                size="sm"
            ></b-form-select>
          </b-form-group>
        </b-col>
        <b-col class="esconder-quando-mobile">
          <h6>Total: {{ this.totalRows }}</h6>
        </b-col>
        <b-col class="ml-auto esconder-quando-mobile" cols="auto" style="margin-bottom: -5px">
          <vs-button color="#24a35a" type="filled" icon="person_add" @click="adicionarClienteModal">
            Adicionar
          </vs-button>
        </b-col>
      </b-row>
    </b-container>
    <b-container fluid class="container-paginacao-total-mobile">
      <b-row class="barra-paginacao-total-paginas-mobile no-gutters" style="width: 100%">
        <b-col class="mr-2 col-paginacao-mobile">
          <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"

              class="my-0 w-100"
              aria-controls="my-table"
              align="fill">
          </b-pagination>
        </b-col>
        <b-col class="ml-auto" cols="auto" style="max-width: 100px">
          <b-form-group
              label="Por pagina"
              label-for="per-page-select"
              label-cols-sm="auto"
              label-cols-md="auto"
              label-cols-lg="auto"
              label-align-sm="right"
              label-size="sm"
              align="left"
              class="mb-0 mr-0">
            <b-form-select
                id="per-page-select"
                v-model="perPage"
                :options="pageOptions"
                size="sm"
            ></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
    </b-container>
    <ModalCliente :idCliente="idCliente" @recarregarDados="buscarClientes"/>
  </b-container>
</template>

<script>

import api from '../../services/api'
import ModalCliente from "@/components/Modal/ModalCliente";

export default {
  name: "VisualizarCliente",
  components: {
    ModalCliente
  },
  data() {
    return {
      transProps: {
        name: "flip-list",
      },
      items: [],
      fields: [
        {key: 'nome', label: 'Nome', sortable: true, thClass: 'text-center'},
        {key: 'email', label: 'Email', sortable: true, thClass: 'text-center'},
        {key: 'cpf_cnpj', label: 'CPF ou CNPJ', sortable: true, thClass: 'text-center'},
        {key: 'status', label: 'Status', sortable: true, class: 'text-center'},
        {key: 'editar', label: ''},
        {key: 'deletar', label: ''},
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 25,
      pageOptions: [25, 50, 100],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      colunasPrFiltro: ['nome', 'email','cpf_cnpj', 'status'],
      modal_visivel: false,
      carregandoTableCliente: false,
      barraBuscaMobile: false,
      idCliente: null
    }
  },

  methods: {
    async buscarClientes() {
      this.carregandoTableCliente = true
      await api.get('/clientes').then(response => {
        this.items = response.data
        this.totalRows = this.items.length
        this.carregandoTableCliente = false
      }).catch(erro => {
        console.log(erro)
      })
    },

    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    async adicionarClienteModal(){
      this.idCliente = null
      this.mostrarModalCliente()
    },
    async editarClienteModal(id) {
      this.idCliente = id
      this.mostrarModalCliente()
    },
    mostrarModalCliente() {
      this.$modal.show('modal-cliente')
    },
    deletarClienteModal(cliente) {
      this.$bvModal.msgBoxConfirm(`Tem certeza que deseja deletar o cliente: ${cliente.nome} ?`, {
        title: 'Deletar cliente',
        buttonSize: 'sm',
        okTitle: 'Deletar',
        cancelTitle: 'Cancelar',
        okVariant: 'danger',
        footerClass: 'p-2',
        centered: true
      }).then(value => {
        if (value) {
          this.deletarCliente(cliente)
        }
      })
    },
    async deletarCliente(cliente) {
      await api.delete(`/cliente/deletar/${cliente.id}`).then(() => {
        this.buscarClientes()
      })
    },


  },
  async mounted() {
    this.buscarClientes()
  },
}
</script>
<style>

.titulo {
  font-size: 170%;
}

.input-personalizado {
  width: 100%;
  margin-bottom: 10px;
}

.botao-salvar {
  width: 100%;
  margin-top: 5px;
}

.botao-fiador {
  width: 100%;
  margin-bottom: 10px;
}

.vs-input--label {
  color: rgb(160, 160, 160);
  font-size: 11px;
  margin-bottom: 2px;
}

.input-nascimento {
  margin-top: -6px !important;
  margin-bottom: 10px !important;
}

.vs-con-input-label {
  width: 100%;
}

.vs-notifications {
  max-width: 100% !important;
}

.con-select {
  width: 100%;
  margin-top: -6px;
  margin-bottom: 10px;
}

.vs-select--label {
  margin: 0;
}

.vm--modal {
  margin-top: -20px !important;
  bottom: 25px;
  padding: 25px;
}

.tr-cliente {
  margin-top: 6px;
  margin-bottom: 0px;
}

.botao-deletar-telefone {
  margin-top: 12px;
}

.barra-top-cliente {
  padding: 0;
  background-color: white;
  margin: 0;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0px 1px 5px rgba(200, 200, 200, 0.5);
}

.tabela-clientes {
  background-color: white;
  margin: 0;
  padding: 0;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0px 1px 5px rgba(200, 200, 200, 0.5);
}

.container-paginacao-total-mobile {
  position: fixed;
  bottom: 0;
  margin-left: -10px;
  margin-right: 0;
  border-top: 1px solid rgb(200, 200, 200);
  background-color: white;
  padding: 0px 0px 10px 5px;
  display: none;
}

.barra-paginacao-total-paginas-mobile {
  width: 100%;
}

.col-paginacao-mobile {
  max-width: 400px;
  padding-top: 25px;
  margin-bottom: 0;
}

.divider-personalizado {
  border-top: 1px solid rgb(200, 200, 200);
  position: absolute;
  bottom: 0;
  margin-left: -100px;
  width: 100%;
  padding: 10px 100px 15px 100px;
  background-color: white;
}

.botao-add-total-mobile {
  padding-top: 15px;
  display: none;
  width: 100%;
}

.botao-add-mobile {
  max-width: 300px;
}

.total-mobile {
  padding-top: 9px;

}

.total-mobile h6 {
  font-size: 1.4rem;
}

.col-tabela-clientes {
  padding-top: 15px;
}

.botao-adicionar-telefone {
  margin-top: 16px;
}

.material-icons {
  z-index: 0;
}

#select-cliente__BV_label_ {
  margin: 0;
  padding: 0;
  color: rgb(110, 110, 110);
  font-size: 12px;
}

#select-cliente {
  margin-bottom: 10px;
}

table#tabela-cliente .flip-list-move {
  transition: transform 0.4s;
}

.td-centralizado {
  padding-top: 10px !important;
}

.modal-adicionando-cliente {
  margin-left: 25px;
}


.barra-busca-mobile {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  z-index: 2;
  display: none;
}

.barra-busca-mobile__form-group {
  margin-bottom: 0;
}

.barra-busca-mobile__input {
  width: 100%;
  height: 42px;
  margin-bottom: 0 !important;
}

.barra-busca-mobile__botao {
  font-size: 20px;
  padding-bottom: 7px;
  padding-top: 8px;
}


.slide-down__input-busca-enter-active {
  transition: all .2s ease;
}

.slide-down__input-busca-leave-active {
  transition: all .2s ease;
}

.slide-down__input-busca-enter, .slide-down__input-busca-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

@media screen and (max-width: 992px) {
  .tabela-cliente{
    max-height: calc(((((100vh - 82px) - 30px) - 48px) - 52px) - 55px - 20px) !important;
  }
  .barra-busca-mobile {
    display: block;
  }
  .botao-add-total-mobile {
    display: block;
  }

  .col-tabela-clientes {
    padding-top: 10px;
  }

  .esconder-quando-mobile {
    display: none;
  }
  .container-paginacao-total-mobile {
    display:block;
  }
}

</style>
