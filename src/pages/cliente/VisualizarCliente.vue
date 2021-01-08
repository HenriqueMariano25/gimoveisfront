<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <vs-button color="#007bff" type="filled" icon="add" @click="mostrarModal">Adicionar cliente
        </vs-button>
      </b-col>
      <b-col lg="6" class="my-1">
        <b-form-group
            label="Buscar cliente"
            label-for="filter-input"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
                id="filter-input"
                v-model="filter"
                type="search"
                placeholder="Ex: João da Silva"
            ></b-form-input>

            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Limpar</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
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
      <b-col sm="5" md="auto" class="my-1">
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
        @filtered="onFiltered">
      <template #cell(nome)="row" >
        <p class="tr-cliente">{{row.item.nome}}</p>
      </template>
      <template #cell(email)="row" >
        <p class="tr-cliente">{{row.item.email}}</p>
      </template>
      <template #cell(cpf_cnpj)="row" >
        <p class="tr-cliente">{{row.item.cpf_cnpj}}</p>
      </template>
      <template #cell(detalhes)="row">
        <vs-button color="dark" type="flat" @click="row.toggleDetails"
                   :icon="row.detailsShowing ? 'expand_less' : 'expand_more' "></vs-button>
      </template>
      <template #cell(editar)="row">
        <vs-button type="flat" color="dark"  @click="editarClienteModal(row.item.id)" icon="edit"></vs-button>
      </template>
      <template #cell(deletar)="row">
        <vs-button type="flat" color="danger"  @click="activePrompt = true" icon="delete"></vs-button>
        <vs-prompt
            @cancel="val=''"
            @accept="deletarCliente(row.item)"
            accept-text="Deletar"
            cancel-text="Cancelar"
            color="danger"
            title="Deletar cliente"
            :active.sync="activePrompt">
          <div class="con-exemple-prompt">
            <p>Tem certeza que deseja excluir o cliente {{ row.item.nome }} ?</p>
          </div>
        </vs-prompt>
      </template>


      <template #row-details="row">
        <b-card>
          <p>Endereço: {{ row.item.rua }} n° {{ row.item.numero }}, {{ row.item.bairro }}, {{ row.item.cidade }},
            {{ row.item.estado }}</p>
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

    <!--  Fim da tabela-->
    <modal name="hello-world" width="60%" height="auto" :scrollable="true" :click-to-close="false">
      <h1 class="text-center">Cadastrar cliente</h1>
      <b-row>
        <b-col cols="7">
          <vs-input label-placeholder="Nome*" v-model="cliente.nome" class="input-personalizado"
                    val-icon-danger="clear" danger-text="Campo obrigatorio" :danger="cliente.nome.length < 1"/>
        </b-col>
        <b-col cols="2">
          <vs-select placeholder="Selecione" label-placeholder="Selecione" label="Estado civil"
                     v-model="cliente.estado_civil">
            <vs-select-item :key="index" :value="item.id" :text="item.descricao" v-for="(item,index) in estadoCivil"/>
          </vs-select>
        </b-col>
        <b-col class="input-nascimento" cols="3">
          <vs-input label="Data de Nascimento" v-model="cliente.data_nascimento" type="date"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="6">
          <vs-input label-placeholder="Email*" v-model="cliente.email" class="input-personalizado"
                    val-icon-danger="clear" danger-text="Campo obrigatorio" :danger="cliente.email.length < 1"/>
        </b-col>
        <b-col cols="3">
          <vs-input label-placeholder="CPF ou CNPJ*" v-model="cliente.cpf_cnpj" class="input-personalizado"
                    val-icon-danger="clear" danger-text="Campo obrigatorio" :danger="cliente.cpf_cnpj.length < 1"/>
        </b-col>
        <b-col cols="3">
          <vs-input label-placeholder="Identidade" v-model="cliente.identidade" class="input-personalizado"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          <vs-input label-placeholder="CEP*" v-model="cliente.cep" class="input-personalizado"
                    val-icon-danger="clear" danger-text="Campo obrigatorio" :danger="cliente.cep.length < 1"/>
        </b-col>
        <b-col cols="5">
          <vs-input label-placeholder="Rua*" v-model="cliente.rua" class="input-personalizado"
                    val-icon-danger="clear" danger-text="Campo obrigatorio" :danger="cliente.rua.length < 1"/>
        </b-col>
        <b-col cols="2">
          <vs-input label-placeholder="Número*" v-model="cliente.numero" class="input-personalizado"
                    val-icon-danger="clear" danger-text="Campo obrigatorio" :danger="cliente.numero.length < 1"/>
        </b-col>
        <b-col cols="3">
          <vs-input label-placeholder="Complemento" v-model="cliente.complemento" class="input-personalizado"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <vs-input label-placeholder="Bairro*" v-model="cliente.bairro" class="input-personalizado"
                    val-icon-danger="clear" danger-text="Campo obrigatorio" :danger="cliente.bairro.length < 1"/>
        </b-col>
        <b-col>
          <vs-input label-placeholder="Cidade*" v-model="cliente.cidade" class="input-personalizado"
                    val-icon-danger="clear" danger-text="Campo obrigatorio" :danger="cliente.cidade.length < 1"/>
        </b-col>
        <b-col>
          <vs-input label-placeholder="UF*" v-model="cliente.estado" class="input-personalizado"
                    val-icon-danger="clear" danger-text="Campo obrigatorio" :danger="cliente.estado.length < 1"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <vs-input label-placeholder="Referência" v-model="cliente.referencia" class="input-personalizado" required/>
        </b-col>
      </b-row>
      <b-row class="campos-telefone" >
        <b-col cols="6" v-for="(telefone, index) in telefones" :key="index">
          <b-row >
            <b-col cols="5">
              <vs-input label-placeholder="Numero de telefone" v-model="telefone.numero"
                        class="input-personalizado"/>
            </b-col>
            <b-col cols="5">
              <vs-select placeholder="Selecione" label-placeholder="Selecione" label="Tipo de número"
                         v-model="telefone.tipo">
                <vs-select-item :key="index" :value="item.id" :text="item.descricao"
                                v-for="(item,index) in tiposTelefone"/>
              </vs-select>
            </b-col>
            <b-col cols="2" class="text-center botao-deletar-telefone">
              <vs-button type="filled" icon="clear" color="danger" class="botao-salvar botao-adicionar-telefone"
                         @click="removerTelefone(index)"/>
            </b-col>
          </b-row>
        </b-col>

      </b-row>
      <b-row>
        <b-col>
          <vs-button type="filled" icon="add_ic_call" class="botao-salvar botao-adicionar-telefone" color="#696969"
                     @click.prevent="adicionarTelefone()">Mais
            telefone
          </vs-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <vs-button color="danger" type="filled" icon="clear" class="botao-salvar" @click="esconderModal">
            Cancelar
          </vs-button>
        </b-col>
        <b-col>
          <vs-button v-if="editar == true" color="#007bff" type="filled" icon="edit" class="botao-salvar"
                     @click="editarCliente">Editar
          </vs-button>
          <vs-button v-else color="#007bff" type="filled" icon="add" class="botao-salvar" @click="cadastrarCliente">
            Salvar
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
      popupCadastrarCliente: false,
      editarClientePopup: false,
      items: [],
      fields: [
        {key: 'nome', label: 'Nome', sortable: true},
        {key: 'email', label: 'Email', sortable: true, class: 'text-center'},
        {key: 'cpf_cnpj', label: 'CPF ou CNPJ', sortable: true,},
        {key: 'detalhes', label: 'Detalhes'},
        {key: 'editar', label: 'Editar'},
        {key: 'deletar', label: 'Deletar'},
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
      telefones: [{id: "", numero: "", tipo: ""}],
      activePrompt: false,
      tiposTelefone: [],
      editar:false
    }
  },
  computed: {
    sortOptions() {
      return this.fields
          .filter(f => f.sortable)
          .map(f => {
            return {text: f.label, value: f.key}
          })
    },
  },
  async mounted() {
    this.buscarClientes()
    this.buscarEstadosCivis()
  },
  methods: {
    async buscarEstadosCivis() {
      await api.get('/estados_civis').then(response => {
        this.estadoCivil = response.data
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
      await api.delete(`/cliente/deletar/${cliente.id}`).then(response => {
        console.log(response)
        this.buscarClientes()
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
        this.$modal.show('hello-world')
        this.editar = true
      })
    },
    async editarCliente() {
      for (let key in this.cliente) {
        if (this.cliente[key] == "") {
          this.cliente[key] = null
        }
      }
      await api.post(`/cliente/editar/${this.cliente.id}`, {data: this.cliente, telefones: this.telefones}).then(response => {
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
    },

    async buscarTipoTelefones() {
      await api.get('/tipos_telefones').then(response => {
        console.log(response)
        this.tiposTelefone = response.data
      })
    },
    mostrarModal() {
      this.$modal.show('hello-world')
      this.buscarTipoTelefones()
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
      this.telefones = [{numero:"", tipo:""}]
    },
    adicionarTelefone() {
      this.telefones.push({
        numero: '',
        tipo: ''
      })
    },
    removerTelefone(index){
      this.telefones.splice(index,1)
    },
    async cadastrarCliente() {
      if(this.validarCamposObrigatorio()){
        for (let key in this.cliente) {
          if (this.cliente[key] == "") {
            this.cliente[key] = null
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
    validarCamposObrigatorio(){
      if(this.cliente['nome'] == "" || this.cliente['email'] == "" || this.cliente['rua'] == "" ||
          this.cliente['cidade'] == "" || this.cliente['bairro'] == "" || this.cliente['estado'] == "" ||
          this.cliente['cpf_cnpj'] == "" || this.cliente['numero'] == "" || this.cliente['cep'] == ""){
        this.$vs.notify({
          text: `Campos obrigatorios vazio.`,
          position: 'top-center',
          color: 'danger',
          time: 4000,
          icon: 'check_circle_outline'
        })
        return false
      }else{
        return true
      }
    },
    atribuirCep(dados){
      if(dados.bairro != ""){
        this.cliente['bairro'] = dados.bairro
      }
      if(dados.localidade != ""){
        this.cliente.cidade = dados.localidade
      }
      if(dados.uf != ""){
        this.cliente.estado = dados.uf
      }
      if(dados.complemento != ""){
        this.cliente.complemento = dados.complemento
      }
      if(dados.logradouro != ""){
        this.cliente.rua = dados.logradouro
      }
    }


  },
  watch:{
    'cliente.cep': function(cep){
      if(cep.length == 8){
        api.get(`/cliente/consultar_cep/${cep}`).then(response => {
          this.atribuirCep(response.data)
        })
      }
    }
  }

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
  margin-top: -6px;
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
}

.vs-select--label {
  margin: 0;
}

.vm--modal{
  margin-top:10px;
  bottom:10px;
  padding: 10px;
}
.tr-cliente{
  margin-top: 6px;
  margin-bottom: 0px;
  /*margin: 0;*/
}
.botao-deletar-telefone{
  margin-top:12px;
}
</style>