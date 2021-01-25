<template>
  <b-container fluid>
    <b-row class="barraTopCliente " align-v="center">
      <b-col>
        <h1 class="mb-1">Cadastro de Imóveis</h1>
      </b-col>
      <b-col class="my-1" cols="3">
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
    <!-- Main table element
    stacked="md"
    -->
    <b-row class="tabela-clientes">
      <b-col class="col-tabela-clientes">
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
            show-empty
            small
            fixed
            @filtered="onFiltered"
            striped
            hover
            outlined
            :sticky-header="alturaTela"
            no-border-collapse
            @row-clicked="item=>$set(item, '_showDetails', !item._showDetails)">
          <template #cell(nome)="row">
            <p class="tr-cliente">{{ row.item.nome }}</p>
          </template>
          <template #cell(email)="row">
            <p class="tr-cliente">{{ row.item.email }}</p>
          </template>
          <template #cell(cpf_cnpj)="row">
            <p class="tr-cliente">{{ row.item.cpf_cnpj }}</p>
          </template>
          <template #cell(status)="row">
            <p class="tr-cliente">{{ row.item.status }}</p>
          </template>
          <template #cell(editar)="row">
            <vs-button type="flat" color="dark" @click="editarImovelModal(row.item)" icon="edit"></vs-button>
          </template>
          <template #cell(deletar)="row">
            <vs-button type="flat" color="dark" @click="deletarImovelModal(row.item)" icon="delete"></vs-button>
          </template>


          <template #row-details="row">
            <b-card>
              <p>Rua: {{ row.item.rua }},{{ row.item.numero }} | Bairro: {{ row.item.bairro }} | Cidade:
                {{ row.item.cidade }} |
                Estado: {{ row.item.estado }}</p>
              <p>Complemento: {{ row.item.complemento }}</p>
              <p>Identidade: {{ row.item.identidade }}</p>
              <p>Data de Nascimento: {{ row.item.data_nascimento }}</p>
              <p>Estado Civil: {{ row.item.estado_civil }}</p>
              <p>Referência: {{ row.item.referencia }}</p>

              <p>Telefones:</p>
              <ul v-for="(telefone, index) in row.item.numero_telefone" :key="index">

                <li>{{ telefone }}</li>
              </ul>
            </b-card>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row class="divider-personalizado">
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
        >
          <b-form-select
              id="per-page-select"
              v-model="perPage"
              :options="pageOptions"
              size="sm"
          ></b-form-select>
        </b-form-group>
      </b-col>
      <b-col class="ml-auto" cols="auto">
        <vs-button color="#24a35a" type="filled" icon="person_add" @click="mostrarModal">Adicionar
        </vs-button>
      </b-col>
    </b-row>
    <!--  Fim da tabela-->
    <modal name="hello-world" width="60%" height="auto" :scrollable="true" :click-to-close="false"
           class="modal-adicionando-cliente">
      <h3>Adicionando imóvel</h3>
      <b-tabs content-class="mt-3">

        <b-tab title="Dados gerais" active>
          <b-row align-v="center">
            <b-col cols="5">
              <vs-input label-placeholder="Nome*" v-model="imovel.nome" class="input-personalizado"/>
            </b-col>
            <b-col cols="5">
              <vs-input label-placeholder="Proprietário*" v-model="imovel.proprietario" class="input-personalizado"/>
<!--              <b-form-group id="select-tipo-imovel" label="Proprietário*" class="select-personalizado">-->
<!--                <b-form-select v-model="imovel.proprietario" :options="estadosCivis" value-field="id"-->
<!--                               text-field="descricao">-->
<!--                  <template #first>-->
<!--                    <b-form-select-option :value="null">Selecione</b-form-select-option>-->
<!--                  </template>-->
<!--                </b-form-select>-->
<!--              </b-form-group>-->
            </b-col>
            <b-col>
              <b-form-group id="select-cliente" label="Status" class="select-personalizado">
                <b-form-select v-model="imovel.status" :options="tiposStatus" value-field="id"
                               text-field="descricao">
                  <template #first>
                    <b-form-select-option :value="null">Selecione</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <vs-input type="number" label-placeholder="Inscrição Municipal" v-model="imovel.inscricao_municipal"
                        class="input-personalizado"/>
            </b-col>
            <b-col>
              <vs-input type="number" label-placeholder="Funesbom" v-model="imovel.funesbom"
                        class="input-personalizado"/>
            </b-col>
            <b-col cols="3">
              <b-form-group id="select-tipo-imovel" label="Tipo do Imóvel*" class="select-personalizado">
                <b-form-select v-model="imovel.tipo_imovel" :options="tiposImoveis" value-field="id"
                               text-field="descricao">
                  <template #first>
                    <b-form-select-option :value="null">Selecione</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="2">
              <vs-input type="number" label-placeholder="CEP*" v-model="imovel.cep" class="input-personalizado"/>
            </b-col>
            <b-col cols="5">
              <vs-input label-placeholder="Rua*" v-model="imovel.rua" class="input-personalizado"/>
            </b-col>
            <b-col cols="2">
              <vs-input label-placeholder="Número*" v-model="imovel.numero" class="input-personalizado"/>
            </b-col>
            <b-col cols="3">
              <vs-input label-placeholder="Complemento" v-model="imovel.complemento" class="input-personalizado"/>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <vs-input label-placeholder="Bairro*" v-model="imovel.bairro" class="input-personalizado"/>
            </b-col>
            <b-col>
              <vs-input label-placeholder="Cidade*" v-model="imovel.cidade" class="input-personalizado"/>
            </b-col>
            <b-col cols="2">
              <vs-input label-placeholder="UF*" v-model="imovel.estado" class="input-personalizado" maxlength="2"/>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Inf. adicionais">
          <b-row>
            <b-col>
              <vs-input label="Data de Aquisição" v-model="imovel.data_aquisicao" type="date"
                        class="input-nascimento"/>
            </b-col>
            <b-col>
              <vs-input label="Data de Venda" v-model="imovel.data_venda" type="date"
                        class="input-nascimento"/>
            </b-col>
            <b-col>
              <vs-input label-placeholder="Área total m²" type="number" v-model="imovel.area"
                        class="input-personalizado"/>
            </b-col>
            <b-col>
              <vs-input label-placeholder="Área construida m²" type="number" v-model="imovel.area_construida"
                        class="input-personalizado"/>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <vs-input label-placeholder="Valor da aquisição" type="number" v-model="imovel.valor_aquisicao"
                        class="input-personalizado"/>
            </b-col>
            <b-col>
              <vs-input label-placeholder="Valor atual" type="number" v-model="imovel.valor_atual"
                        class="input-personalizado"/>
            </b-col>
            <b-col>
              <vs-input label-placeholder="Valor atual dólar" type="number" v-model="imovel.valor_dolar" readonly=""
                        class="input-personalizado"/>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <vs-input type="number" label-placeholder="N° cliente luz" v-model="imovel.numero_cliente_luz"
                        class="input-personalizado"/>
            </b-col>
            <b-col>
              <vs-input type="number" label-placeholder="N° cliente água" v-model="imovel.numero_cliente_agua"
                        class="input-personalizado"/>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Despesas">
          <b-row class="text-center">
            <b-col cols="auto">
              <vs-button color="#5498ff" type="filled" icon="add" class="botao-salvar">
                Adicionar despesa
              </vs-button>
            </b-col>
          </b-row>
          <b-row >
            <b-col class="col-tabela-clientes">
              <b-table
                  :items="itemsContratoClientes"
                  :fields="cabecalhosDespesas"
                  :current-page="currentPage"
                  :per-page="perPage"
                  :filter="filter"
                  :filter-included-fields="filterOn"
                  :sort-by.sync="sortBy"
                  :sort-desc.sync="sortDesc"
                  :sort-direction="sortDirection"
                  show-empty
                  small
                  fixed
                  @filtered="onFiltered"
                  striped
                  hover
                  outlined
                  no-border-collapse
                  @row-clicked="item=>$set(item, '_showDetails', !item._showDetails)">
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Contratos">
          <b-row class="text-center mb-2">
            <b-col cols="auto">
              <vs-button color="#5498ff" type="filled" icon="add" class="botao-salvar">
                Adicionar contrato
              </vs-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <p class="p-contratos">Contratos de: </p>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="tabelas-contrato">
              <b-table
                  :items="itemsContratoClientes"
                  :fields="cabecalhosContratosClientes"
                  :current-page="currentPage"
                  :per-page="perPage"
                  :filter="filter"
                  :filter-included-fields="filterOn"
                  :sort-by.sync="sortBy"
                  :sort-desc.sync="sortDesc"
                  :sort-direction="sortDirection"
                  show-empty
                  small
                  fixed
                  @filtered="onFiltered"
                  striped
                  hover
                  outlined
                  no-border-collapse
                  @row-clicked="item=>$set(item, '_showDetails', !item._showDetails)">
              </b-table>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <p class="p-contratos">Parcelas do contrato:</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="tabelas-contrato">
              <b-table
                  :items="itemsContratoClientes"
                  :fields="cabecalhosContratosParcelas"
                  :current-page="currentPage"
                  :per-page="perPage"
                  :filter="filter"
                  :filter-included-fields="filterOn"
                  :sort-by.sync="sortBy"
                  :sort-desc.sync="sortDesc"
                  :sort-direction="sortDirection"
                  show-empty
                  small
                  fixed
                  @filtered="onFiltered"
                  striped
                  hover
                  outlined
                  no-border-collapse
                  @row-clicked="item=>$set(item, '_showDetails', !item._showDetails)">
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
      <div class="text-center">
        <b-row align-h="end">
          <b-col cols="2">
            <vs-button v-if="editar == true" color="#24a35a" type="filled" icon="save" class="botao-salvar"
                       @click="editarImovel">Salvar
            </vs-button>
            <vs-button v-else color="#24a35a" type="filled" icon="save" class="botao-salvar" @click="cadastrarImovel">
              Salvar
            </vs-button>
          </b-col>
          <b-col cols="2">
            <vs-button color="#707070" type="filled" icon="clear" class="botao-salvar" @click="esconderModal">
              Cancelar
            </vs-button>
          </b-col>
        </b-row>
      </div>
    </modal>
  </b-container>
</template>

<script>

import api from '../../services/api'

export default {
  name: "VisualizarImovel",
  data() {
    return {
      alturaTela: `${(window.innerWidth / 3).toString()}px`,
      larguraTela: window.innerHeight,
      items: [],
      itemsContratoClientes: [],
      fields: [
        {key: 'nome', label: 'Nome', sortable: true},
        {key: 'rua', label: 'Rua', sortable: true, class: 'text-center'},
        {key: 'status', label: 'Status'},
        {key: 'editar', label: 'Editar'},
        {key: 'deletar', label: 'Deletar'},
      ],
      cabecalhosDespesas: [
        {key: 'categoria', label: 'Categoria', sortable: true},
        {key: 'descricao', label: 'Descricao', sortable: true, class: 'text-center'},
        {key: 'data', label: 'Data', sortable: true,},
        {key: 'vencimento', label: 'Vencimento'},
        {key: 'tipo', label: 'Tipo'},
        {key: 'editar', label: 'Editar'},
        {key: 'deletar', label: 'Deletar'},
      ],
      cabecalhosContratosClientes: [
        {key: 'contrato', label: 'Contrato', sortable: true},
        {key: 'cliente', label: 'Cliente', sortable: true, class: 'text-center'},
        {key: 'data_inicio', label: 'Data de início', sortable: true,},
        {key: 'vencimento', label: 'Vencimento'},
        {key: 'status', label: 'Status'},
        {key: 'editar', label: 'Editar'},
        {key: 'deletar', label: 'Deletar'},
      ],
      cabecalhosContratosParcelas: [
        {key: 'valor', label: 'Valor', sortable: true},
        {key: 'vencimento', label: 'Vencimento'},
        {key: 'status', label: 'Status'},
        {key: 'editar', label: 'Editar'},
        {key: 'deletar', label: 'Deletar'},
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
      imovel: {
        id:"",
        nome: "",
        proprietario: "",
        status: null,
        inscricao_municipal: "",
        funesbom: "",
        tipo_imovel: null,
        rua: "",
        cep: "",
        bairro: "",
        cidade: "",
        estado: "",
        numero:"",
        complemento: "",
        identidade: "",
        data_aquisicao: "",
        data_venda: "",
        area: "",
        area_construida: "",
        valor_aquisicao: "",
        valor_atual: "",
        valor_dolar: "",
        numero_cliente_luz: "",
        numero_cliente_agua: "",
      },
      tiposStatus: [],
      tiposImoveis: [],
      editar: false
    }
  },

  methods: {
    async buscarTiposStatus() {
      await api.get('/imovel/status').then(response => {
        this.tiposStatus = response.data
      })
    },
    async buscarTiposImoveis(){
      await api.get('/imovel/tipos_imoveis').then(response => {
        this.tiposImoveis = response.data
      })
    },
    async buscarImoveis() {
      await api.get('/imoveis').then(response => {
        this.items = response.data
        this.totalRows = this.items.length
      }).catch(erro => {
        console.log(erro)
      })
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    async deletarImovel(imovel) {
      await api.delete(`/imovel/deletar/${imovel.id}`).then(() => {
        this.buscarImoveis()
      })
    },
    deletarImovelModal(imovel) {
      this.$bvModal.msgBoxConfirm(`Tem certeza que deseja deletar o imóvel: ${imovel.nome} ?`, {
        title: 'Deletar imóvel',
        buttonSize: 'sm',
        okTitle: 'Deletar',
        cancelTitle: 'Cancelar',
        okVariant: 'danger',
        footerClass: 'p-2',
        centered: true
      }).then(value => {
        if (value) {
          this.deletarImovel(imovel)
        }
      })
    },


    async editarImovelModal(imovel) {
      await api.get(`/imovel/`,{params:{id:imovel.id}}).then(response => {
        console.log(response.data)
        this.imovel = response.data[0]
        this.editar = true
        this.mostrarModal()

      })
    },
    async editarImovel() {
      if (this.validarCamposObrigatorio()) {
        // let variaveisString = ['data_nascimento', 'identidade', 'status', 'estado_civil']
        // for (let key in variaveisString) {
        //   if (this.cliente[variaveisString[key]] == "") {
        //     this.cliente[variaveisString[key]] = null
        //   }
        // }
        await api.post(`/imovel/editar/${this.imovel.id}`, {
          data: this.imovel,
        }).then(response => {
          let nomeImovel = response.data[0].nome
          this.$vs.notify({
            text: `Imóvel editado com sucesso: ${nomeImovel} !`,
            position: 'top-center',
            color: 'warning',
            time: 6000,
            icon: 'check_circle_outline'
          })
          this.buscarImoveis()
          this.limparModal()
          this.esconderModal()
        })
      }
    },

    async buscarTipoTelefones() {
      await api.get('/tipos_telefones').then(response => {
        this.tiposTelefone = response.data
      })
    },

    mostrarModal() {
      this.$modal.show('hello-world')
      this.buscarTipoTelefones()
      this.buscarTipoStatus()
    },
    esconderModal() {
      this.$modal.hide('hello-world');
      this.limparModal()
      this.editar = false
    },
    limparModal() {
      Object.keys(this.imovel).forEach(key => {
        this.imovel[key] = ""
      })
      this.imovel.status = null
      this.imovel.tipo_imovel = null
    },
    async cadastrarImovel() {
      if (this.validarCamposObrigatorio()) {
        // let variaveisString = ['data_nascimento', 'identidade', 'status', 'estado_civil']
        // for (let key in variaveisString) {
        //   if (this.cliente[variaveisString[key]] == "") {
        //     this.cliente[variaveisString[key]] = null
        //   }
        // }
        await api.post('/imovel/cadastrar', {data: this.imovel}).then(response => {
          let nomeImovel = response.data[0].nome
          console.log(nomeImovel)
          this.esconderModal()
          this.$vs.notify({
            text: `Imóvel cadastrado com sucesso: ${nomeImovel} !`,
            position: 'top-center',
            color: 'success',
            time: 6000,
            icon: 'check_circle_outline'
          })
          this.buscarImoveis()
          this.limparModal()
        })
      }
    },
    validarCamposObrigatorio() {
      if (this.imovel['nome'] == "" || this.imovel['email'] == "" || this.imovel['rua'] == "" ||
          this.imovel['cidade'] == "" || this.imovel['bairro'] == "" || this.imovel['estado'] == "" ||
          this.imovel['cpf_cnpj'] == "" || this.imovel['numero'] == "" || this.imovel['cep'] == "") {
        // this.$vs.notify({
        //   text: `Campos obrigatorios vazio.`,
        //   position: 'top-center',
        //   color: 'danger',
        //   time: 4000,
        //   icon: 'check_circle_outline'
        // })
        return true
      } else {
        return true
      }
    },
    atribuirCep(dados) {
      if (dados.bairro != "") {
        this.imovel['bairro'] = dados.bairro
      }
      if (dados.localidade != "") {
        this.imovel.cidade = dados.localidade
      }
      if (dados.uf != "") {
        this.imovel.estado = dados.uf
      }
      if (dados.complemento != "") {
        this.imovel.complemento = dados.complemento
      }
      if (dados.logradouro != "") {
        this.imovel.rua = dados.logradouro
      }
    }
  },
  watch: {
    'imovel.cep': function (cep) {
      if (cep.length == 8) {
        api.get(`/cliente/consultar_cep/${cep}`).then(response => {
          this.atribuirCep(response.data)
        })
      }
    },
    'imovel.valor_atual': function(valor){
      let dolar = this.$store.state.dolar
      this.imovel.valor_dolar = parseFloat(valor * dolar).toFixed(2)
    }
  },
  async mounted() {
    this.buscarImoveis()
    this.buscarTiposStatus()
    this.buscarTiposImoveis()
  },
}
</script>
<style>
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

.barraTopCliente {
  border: 1px solid rgb(220, 220, 220);
  padding: 0;
  margin: 0;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 5px 5px 20px rgb(200, 200, 200);
}

.tabela-clientes {
  background-color: white;
  margin: 0;
  padding: 0;
  margin-bottom: 10px;
}

.col-tabela-clientes {
  padding-top: 15px;
}

.divider-personalizado {
  border-top: 1px solid rgb(200, 200, 200);
  padding-top: 10px;
}

.botao-adicionar-telefone {
  margin-bottom: 8px;
}

.material-icons {
  z-index: 0;
}

.select-personalizado {
  margin-bottom: 10px;
}

.bv-no-focus-ring {
  margin: 0;
  padding: 0;
  color: rgb(110, 110, 110);
  font-size: 12px;
}
.tabelas-contrato{
  padding-top: 0;
}
.p-contratos{
  margin:0;
}

</style>