<template>
  <b-container fluid>
    <!--    <h1 style="position:absolute; top:0;">{{ alturaTela }}</h1>-->
    <!--    <h1 style="position:absolute; top:0;">{{ larguraTela }}</h1>-->
    <b-row class="barraTopCliente " align-v="center">
      <b-col>
        <h1 class="mb-1">Cadastro de Clientes</h1>
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
            <vs-button type="flat" color="dark" @click="editarClienteModal(row.item.id)" icon="edit"></vs-button>
          </template>
          <template #cell(deletar)="row">
            <vs-button type="flat" color="dark" @click="deletarClienteModal(row.item)" icon="delete"></vs-button>
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
      <h3>Adicionando cliente</h3>
      <b-row align-v="center">
        <b-col cols="5">
          <vs-input label-placeholder="Nome*" v-model="cliente.nome" class="input-personalizado"
          />
        </b-col>
        <b-col cols="2">
          <b-form-group id="select-cliente" label="Estado Civil">
            <b-form-select v-model="cliente.estado_civil" :options="estadosCivis" value-field="id" text-field="descricao">
              <template #first>
                <b-form-select-option  :value="null">Escolha uma opção</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
<!--          <vs-select placeholder="Selecione" label-placeholder="Selecione" label="Estado civil"-->
<!--                     v-model="cliente.estado_civil">-->
<!--            <vs-select-item :key="index" :value="item.id" :text="item.descricao" v-for="(item,index) in estadoCivil"/>-->
<!--          </vs-select>-->
        </b-col>
        <b-col cols="3">
          <vs-input label="Data de Nascimento" v-model="cliente.data_nascimento" type="date" class="input-nascimento"/>
        </b-col>
        <b-col cols="2">
          <b-form-group id="select-cliente" label="Status">
            <b-form-select v-model="cliente.status" :options="tiposStatus" value-field="id" text-field="descricao">
              <template #first>
                <b-form-select-option  :value="null">Escolha uma opção</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
<!--          <vs-select placeholder="Selecione" label-placeholder="Selecione" label="Status"-->
<!--                     v-model="cliente.status">-->
<!--            <vs-select-item :key="index" :value="item.id" :text="item.descricao" v-for="(item,index) in tiposStatus"/>-->
<!--          </vs-select>-->
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="6">
          <vs-input label-placeholder="Email*" v-model="cliente.email" class="input-personalizado"/>
        </b-col>
        <b-col cols="3">
          <vs-input onKeyDown="if(this.value.length==15 && event.keyCode!=8) return false;" type="number" label-placeholder="CPF ou CNPJ*" v-model="cliente.cpf_cnpj" class="input-personalizado"/>
        </b-col>
        <b-col cols="3">
          <vs-input onKeyDown="if(this.value.length==10 && event.keyCode!=8) return false;" type="number" label-placeholder="Identidade" v-model="cliente.identidade" class="input-personalizado"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          <vs-input type="number" label-placeholder="CEP*" v-model="cliente.cep" class="input-personalizado"/>
        </b-col>
        <b-col cols="5">
          <vs-input label-placeholder="Rua*" v-model="cliente.rua" class="input-personalizado"/>
        </b-col>
        <b-col cols="2">
          <vs-input label-placeholder="Número*" v-model="cliente.numero" class="input-personalizado"/>
        </b-col>
        <b-col cols="3">
          <vs-input label-placeholder="Complemento" v-model="cliente.complemento" class="input-personalizado"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <vs-input label-placeholder="Bairro*" v-model="cliente.bairro" class="input-personalizado"/>
        </b-col>
        <b-col>
          <vs-input label-placeholder="Cidade*" v-model="cliente.cidade" class="input-personalizado"/>
        </b-col>
        <b-col cols="2">
          <vs-input label-placeholder="UF*" v-model="cliente.estado" class="input-personalizado" maxlength="2"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <vs-input label-placeholder="Referência" v-model="cliente.referencia" class="input-personalizado" required/>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group
              id="textarea"
              label="Observação"
              label-for="input-1"
          >
            <b-form-textarea
                id="textarea"
                v-model="cliente.observacao"
                rows="3"
                max-rows="6"
            ></b-form-textarea>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row class="divider-personalizado">
        <b-col cols="auto">
          <vs-button type="filled" icon="add_ic_call" class="botao-salvar botao-adicionar-telefone" color="#5498ff"
                     @click.prevent="adicionarTelefone()">Adicionar telefone
          </vs-button>
        </b-col>
      </b-row>
      <b-row class="campos-telefone">
        <b-col cols="6" v-for="(telefone, index) in telefones" :key="index">
          <b-row>
            <b-col cols="5">
              <vs-input label-placeholder="Numero de telefone" v-model="telefone.numero"
                        class="input-personalizado"/>
            </b-col>
            <b-col cols="5">
              <b-form-group id="select-cliente" label="Status">
                <b-form-select v-model="telefone.tipo" :options="tiposTelefone" value-field="id" text-field="descricao">
                  <template #first>
                    <b-form-select-option  :value="null">Escolha uma opção</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
<!--              <vs-select placeholder="Selecione" label-placeholder="Selecione" label="Tipo de número"-->
<!--                         v-model="telefone.tipo">-->
<!--                <vs-select-item :key="index" :value="item.id" :text="item.descricao"-->
<!--                                v-for="(item,index) in tiposTelefone"/>-->
<!--              </vs-select>-->
            </b-col>
            <b-col cols="2" class="text-center botao-deletar-telefone">
              <vs-button type="flat" icon="delete" color="dark" class="botao-salvar"
                         @click="removerTelefone(index)"/>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row align-h="end">
        <b-col cols="2">
          <vs-button v-if="editar == true" color="#24a35a" type="filled" icon="edit" class="botao-salvar"
                     @click="editarCliente">Editar
          </vs-button>
          <vs-button v-else color="#24a35a" type="filled" icon="save" class="botao-salvar" @click="cadastrarCliente">
            Salvar
          </vs-button>
        </b-col>
        <b-col cols="2">
          <vs-button color="#707070" type="filled" icon="clear" class="botao-salvar" @click="esconderModal">
            Cancelar
          </vs-button>
        </b-col>

      </b-row>
    </modal>
  </b-container>
</template>

<script>

import api from '../../services/api'

export default {
  data() {
    return {
      alturaTela: `${(window.innerWidth / 3).toString()}px`,
      larguraTela: window.innerHeight,
      items: [],
      fields: [
        {key: 'nome', label: 'Nome', sortable: true},
        {key: 'email', label: 'Email', sortable: true, class: 'text-center'},
        {key: 'cpf_cnpj', label: 'CPF ou CNPJ', sortable: true,},
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
        estado_civil: null,
        numero: "",
        status: null,
        observacao: ""
      },
      telefones: [{id: "", numero: "", tipo: ""}],
      tiposTelefone: [],
      tiposStatus: [],
      editar: false,
      estadosCivis: []
    }
  },

  methods: {
    async buscarEstadosCivis() {
      await api.get('/estados_civis').then(response => {
        this.estadosCivis = response.data
      })
    },
    async buscarClientes() {
      await api.get('/clientes').then(response => {
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
    async deletarCliente(cliente) {
      await api.delete(`/cliente/deletar/${cliente.id}`).then(() => {
        this.buscarClientes()
      })
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


    async editarClienteModal(id) {
      await api.get('/cliente', {params: {idCliente: id}}).then(response => {
        this.cliente = response.data
        this.telefones = []
        for (let x = 0; x < response.data.numero_telefone.length; x++) {
          let numero = response.data.numero_telefone[x]
          let tipo = response.data.tipo_telefone[x]
          let id = response.data.id_telefone[x]
          this.telefones.push({id: id, numero: numero, tipo: tipo})
        }
        this.mostrarModal()
        this.editar = true
      })
    },
    async editarCliente() {
      if (this.validarCamposObrigatorio()) {
        let variaveisString = ['data_nascimento', 'identidade', 'status', 'estado_civil']
        for (let key in variaveisString) {
          if (this.cliente[variaveisString[key]] == "") {
            this.cliente[variaveisString[key]] = null
          }
        }
        await api.post(`/cliente/editar/${this.cliente.id}`, {
          data: this.cliente,
          telefones: this.telefones
        }).then(response => {
          let nomeCliente = response.data[0].nome
          this.$vs.notify({
            text: `Cliente editado com sucesso: ${nomeCliente} !`,
            position: 'top-center',
            color: 'warning',
            time: 6000,
            icon: 'check_circle_outline'
          })
          this.buscarClientes()
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
    async buscarTipoStatus() {
      await api.get('/cliente/tipos_status').then(response => {
        this.tiposStatus = response.data
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
      Object.keys(this.cliente).forEach(key => {
        this.cliente[key] = ""
      })
      this.telefones = [{numero: "", tipo: ""}]
      this.cliente.status = null
      this.cliente.estado_civil = null
    },
    adicionarTelefone() {
      this.telefones.push({
        numero: '',
        tipo: ''
      })
    },
    removerTelefone(index) {
      this.telefones.splice(index, 1)
    },
    async cadastrarCliente() {
      if (this.validarCamposObrigatorio()) {
        let variaveisString = ['data_nascimento', 'identidade', 'status', 'estado_civil']
        for( let key in variaveisString){
          if(this.cliente[variaveisString[key]] == ""){
            this.cliente[variaveisString[key]] = null
          }
        }
        await api.post('/cliente/cadastrar', {data: this.cliente, telefones: this.telefones}).then(response => {
          let nomeCliente = response.data[0].nome
          this.esconderModal()
          this.$vs.notify({
            text: `Cliente cadastrado com sucesso: ${nomeCliente} !`,
            position: 'top-center',
            color: 'success',
            time: 6000,
            icon: 'check_circle_outline'
          })
          this.buscarClientes()
          this.limparModal()
        })
      }
    },
    validarCamposObrigatorio() {
      if (this.cliente['nome'] == "" || this.cliente['email'] == "" || this.cliente['rua'] == "" ||
          this.cliente['cidade'] == "" || this.cliente['bairro'] == "" || this.cliente['estado'] == "" ||
          this.cliente['cpf_cnpj'] == "" || this.cliente['numero'] == "" || this.cliente['cep'] == "") {
        this.$vs.notify({
          text: `Campos obrigatorios vazio.`,
          position: 'top-center',
          color: 'danger',
          time: 4000,
          icon: 'check_circle_outline'
        })
        return false
      } else {
        return true
      }
    },
    atribuirCep(dados) {
      if (dados.bairro != "") {
        this.cliente['bairro'] = dados.bairro
      }
      if (dados.localidade != "") {
        this.cliente.cidade = dados.localidade
      }
      if (dados.uf != "") {
        this.cliente.estado = dados.uf
      }
      if (dados.complemento != "") {
        this.cliente.complemento = dados.complemento
      }
      if (dados.logradouro != "") {
        this.cliente.rua = dados.logradouro
      }
    }
  },
  watch: {
    'cliente.cep': function (cep) {
      if (cep.length == 8) {
        api.get(`/cliente/consultar_cep/${cep}`).then(response => {
          this.atribuirCep(response.data)
        })
      }
    }
  },
  async mounted() {
    this.buscarClientes()
    this.buscarEstadosCivis()
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
#select-cliente__BV_label_{
  margin:0;
  padding:0;
  color:rgb(110,110,110);
  font-size: 12px;
}
#select-cliente{
  margin-bottom: 10px;
}

</style>