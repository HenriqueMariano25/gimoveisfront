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
      <b-col class="botao-add-total-mobile" cols="12">
        <b-row>
          <b-col>
            <vs-button color="#24a35a" type="filled" icon="person_add" @click="mostrarModal" style="width: 100%; z-index: 0;"
                       class="botao-add-mobile">
              Adicionar
            </vs-button>
          </b-col>
          <b-col class="ml-auto total-mobile" cols="auto">
            <h6>Total: {{ this.totalRows }}</h6>
          </b-col>
        </b-row>
      </b-col>
      <b-col class="col-tabela-caixas">
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
            :busy="carregandoTableCaixa"
            show-empty
            small
            @filtered="onFiltered"
            striped
            hover
            outlined
            sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px)"
            no-border-collapse>
          <template #table-colgroup>
            <col style="width: 50px">
            <col style="max-width: 150px;">
            <col>
            <col>
            <col>
            <col>
            <col style="width: 15px">
            <col style="width: 15px">
            <col style="width: 15px">
          </template>
          <template #cell(id)="row">
            <span class="tr-caixa">{{ ("000000" + row.item.id).slice(-6) }}</span>
          </template>
          <template #cell(debito_credito)="row">
            <span v-if="row.item.id_debito_credito == 1" class="debito">Débito</span>
            <span v-else-if="row.item.id_debito_credito == 2" class="credito">Crédito</span>
            <span v-else></span>
          </template>
          <template #cell(historico)="row">
            <span v-if="row.item.historico.length < 40">{{ row.item.historico }}</span>
            <span v-else>{{ row.item.historico.substring(0,40) }}...</span>
          </template>
          <template #cell(movimento)="row">
            <span class="tr-caixa">{{ dayjs(row.item.movimento).format('DD/MM/YYYY') }}</span>
          </template>
          <template #cell(valor)="row">
            <span class="tr-caixa">R$ {{ row.item.valor.replace('.', ',') }}</span>
          </template>
          <template #cell(editar)="row">
            <vs-tooltip text="Editar">
              <vs-button type="flat" color="dark" icon="edit" @click.native="modalEditarModalCaixa(row)"></vs-button>
            </vs-tooltip>
          </template>
          <template #cell(deletar)="row">
            <vs-tooltip text="Deletar">
              <vs-button type="flat" color="dark" icon="delete" @click.native="deletarCaixaModal(row)"></vs-button>
            </vs-tooltip>
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
          <vs-button color="#24a35a" type="filled" icon="person_add" @click="modalCadastrarModalCaixa">
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
    <ModalCaixa @recarregarDados="buscarCaixa" :dados="caixa"></ModalCaixa>
  </b-container>
</template>
<script>

import ModalCaixa from '../../components/Caixa/ModalCaixa'
import api from '../../services/api'
import dayjs from 'dayjs'

export default {
  name: "VisualizarCaixa.vue",
  data() {
    return {
      items: [],
      camposCaixa: [
        {key: 'id', label: 'Código', sortable: true, class: 'text-center', tdClass: 'pt-2'},
        {key: 'historico', label: 'Histórico', sortable: true, thClass: 'text-center', tdClass: 'pt-2'},
        {key: 'valor', label: 'Valor', sortable: true, thClass: 'text-center', tdClass: 'pt-2'},
        {key: 'movimento', label: 'Movimento', sortable: true, thClass: 'text-center', tdClass: 'pt-2'},
        {key: 'imovel_nome', label: 'Imóvel', sortable: true, thClass: 'text-center', tdClass: 'pt-2'},
        {key: 'conta_nome', label: 'Conta', sortable: true, thClass: 'text-center', tdClass: 'pt-2'},
        {key: 'debito_credito', label: 'D/C', sortable: true, class: 'text-center', tdClass: 'pt-2'},
        {key: 'editar', label: '', tdClass: 'p-0'},
        {key: 'deletar', label: '', tdClass: 'p-0'},
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
      caixa: {},
      barraBuscaMobile: false,
      carregandoTableCaixa: false,
    }
  },
  components: {
    ModalCaixa
  },
  created() {
    this.buscarCaixa()
  },
  methods: {
    mostrarModal() {
      this.$modal.show('modal-caixa')
    },
    async buscarCaixa() {
      this.carregandoTableCaixa = true
      await api.get('/caixa').then(consulta => {
        this.items = consulta.data
        this.totalRows = this.items.length
        this.carregandoTableCaixa = false
      })
    },
    modalEditarModalCaixa(caixa) {
      let auxiliar = Object.entries(caixa.item)
      this.caixa = Object.fromEntries(auxiliar)
      this.mostrarModal()
    },
    modalCadastrarModalCaixa() {
      this.caixa = {
        id: '',
        movimento: '',
        valor: '',
        id_debito_credito: '',
        id_imovel: null,
        historico: '',
        complemento_historico: '',
        id_conta: null,
        numero_documento: ''
      }
      this.mostrarModal()
    },

    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    deletarCaixaModal(caixa) {
      this.$bvModal.msgBoxConfirm(
          `Tem certeza que deseja deletar o caixa: ${("000000" + caixa.item.id).slice(-6)} - ${caixa.item.historico} ?`,
          {
            title: 'Deletar caixa',
            buttonSize: 'sm',
            okTitle: 'Deletar',
            cancelTitle: 'Cancelar',
            okVariant: 'danger',
            footerClass: 'p-2',
            centered: true
          }).then(value => {
        if (value) {
          this.deletarCaixa(caixa)
        }
      })
    },
    async deletarCaixa(caixa) {
      console.log(caixa)
      await api.delete(`/caixa/${caixa.item.id}`).then(() => {
        this.buscarCaixa()
      })
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
  padding:0;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0px 1px 5px rgba(200, 200, 200, 0.5);
}

.debito {
  color: green;
}

.credito {
  color: red;
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

.col-tabela-caixas {
  padding-top: 15px;
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

table#tabela-caixa .flip-list-move {
  transition: transform 0.4s;
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

.botao-add-total-mobile {
  padding-top: 15px;
  display: none;
  width: 100%;
}

.total-mobile {
  padding-top: 9px;

}

.total-mobile h6 {
  font-size: 1.4rem;
}

.barra-paginacao-total-paginas-mobile {
  width: 100%;
}

.col-paginacao-mobile {
  max-width: 400px;
  padding-top: 25px;
  margin-bottom: 0;
}

.titulo {
  font-size: 170%;
}

.botao-add-mobile {
  max-width: 300px;
}

@media screen and (max-width: 992px) {
  .tabela-caixa{
    max-height: calc(((((100vh - 82px) - 30px) - 48px) - 52px) - 55px - 20px) !important;
  }
  .barra-busca-mobile {
    display: block;
  }
  .botao-add-total-mobile {
    display: block;
  }

  .col-tabela-caixas {
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