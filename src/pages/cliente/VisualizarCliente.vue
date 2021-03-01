<template>
  <b-container fluid>
    <b-row class="barra-top-cliente " align-v="center">
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
    <b-row class="tabela-clientes">
      <b-col class="col-tabela-clientes">
        <b-table
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
            <vs-button type="flat" color="dark" @click="editarClienteModal(row.item.id)" icon="edit"></vs-button>
          </template>
          <template #cell(deletar)="row">
            <vs-button type="flat" color="dark" @click="deletarClienteModal(row.item)" icon="delete"></vs-button>
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
                  <p><b>Rua:</b> {{ row.item.rua }},{{ row.item.numero }}</p>
                </b-col>
                <b-col cols="auto">
                  <p><b>Bairro: </b>{{ row.item.bairro }}</p>
                </b-col>
                <b-col cols="auto">
                  <p><b>Cidade: </b>{{ row.item.cidade }}</p>
                </b-col>
                <b-col cols="auto">
                  <p><b>Estado: </b>{{ row.item.estado }}</p>
                </b-col>
                <b-col>
                  <p><b>Complemento: </b>{{ row.item.complemento }}</p>
                </b-col>
              </b-row>
              <p><b>Telefones: </b></p>
              <div v-for="(telefone, index) in row.item.numero_telefone" :key="index">
                <b-row>
                  <b-col cols="auto"><p>{{ telefone }}</p></b-col>
                  <b-col><p>{{ row.item.tipo_telefone[index] }}</p></b-col>
                </b-row>
              </div>
            </b-card>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-container fluid class="divider-personalizado">
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
        <b-col class="ml-auto" cols="auto" style="margin-bottom: -5px">
          <vs-button color="#24a35a" type="filled" icon="person_add" @click="mostrarModal">
            Adicionar
          </vs-button>
        </b-col>
      </b-row>
    </b-container>
    <!--  Fim da tabela-->
    <modal name="modal-cliente" width="60%" height="auto" :scrollable="true" :click-to-close="false"
           class="modal-adicionando-cliente">
      <h3>Adicionando cliente</h3>
      <b-tabs content-class="mt-3">
        <b-tab title="Dados gerais" active>
          <b-row class="mb-2">
            <b-col>
              <b-form-radio-group v-slot="{ ariaDescribedby }" v-model="cliente.tipo_cliente">
                <b-form-radio :aria-describedby="ariaDescribedby" value="pessoa física">Pessoa física*</b-form-radio>
                <b-form-radio :aria-describedby="ariaDescribedby" value="pessoa jurícida">Pessoa jurídica*</b-form-radio>
              </b-form-radio-group>
            </b-col>
          </b-row>
          <b-row align-v="center">
            <b-col cols="5">
              <vs-input label-placeholder="Nome*" v-model="cliente.nome" class="input-personalizado"
              />
            </b-col>
            <b-col cols="2">
              <b-form-group id="select-cliente" label="Estado Civil">
                <b-form-select v-model="cliente.estado_civil" :options="estadosCivis" value-field="id"
                               text-field="descricao">
                  <template #first>
                    <b-form-select-option :value="null">Selecione</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col cols="3">
              <vs-input label="Data de Nascimento" v-model="cliente.data_nascimento" type="date"
                        class="input-nascimento"/>
            </b-col>
            <b-col cols="2">
              <b-form-group id="select-cliente" label="Status">
                <b-form-select v-model="cliente.status" :options="tiposStatus" value-field="id" text-field="descricao">
                  <template #first>
                    <b-form-select-option :value="null">Selecione</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="6">
              <vs-input label-placeholder="Email*" v-model="cliente.email" class="input-personalizado"/>
            </b-col>
            <b-col cols="3">
              <vs-input onKeyDown="if(this.value.length==15 && event.keyCode!=8) return false;" type="text"
                        v-mask="['###.###.###-##', '##.###.###/####-##']" label-placeholder="CPF ou CNPJ*"
                        v-model="cliente.cpf_cnpj"
                        class="input-personalizado"/>
            </b-col>
            <b-col cols="3">
              <vs-input onKeyDown="if(this.value.length==10 && event.keyCode!=8) return false;" type="number"
                        label-placeholder="Identidade" v-model="cliente.identidade" class="input-personalizado"/>
            </b-col>
          </b-row>
          <Carregando :visivel="carregandoCep"/>
          <b-row>
            <b-col cols="2">
              <vs-input type="text" onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                        onKeyDown="if(this.value.length==10 && event.keyCode!=8) return false;"
                        label-placeholder="CEP" v-model="cliente.cep" class="input-personalizado"
                        v-mask="'#####-###'"/>
            </b-col>
            <b-col cols="5">
              <vs-input label-placeholder="Rua" v-model="cliente.rua" class="input-personalizado"/>
            </b-col>
            <b-col cols="2">
              <vs-input label-placeholder="Número" v-model="cliente.numero" class="input-personalizado"/>
            </b-col>
            <b-col cols="3">
              <vs-input label-placeholder="Complemento" v-model="cliente.complemento" class="input-personalizado"/>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <vs-input label-placeholder="Bairro" v-model="cliente.bairro" class="input-personalizado"/>
            </b-col>
            <b-col>
              <vs-input label-placeholder="Cidade" v-model="cliente.cidade" class="input-personalizado"/>
            </b-col>
            <b-col cols="2">
              <vs-input label-placeholder="UF" v-model="cliente.estado" class="input-personalizado" maxlength="2"/>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Inf. Adicionais">
          <b-row>
            <b-col>
              <vs-input label-placeholder="Indicação" v-model="cliente.referencia" class="input-personalizado"
                        required/>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group
                  id="textarea"
                  label="Observação"
                  label-for="input-1">
                <b-form-textarea
                    id="textarea"
                    v-model="cliente.observacao"
                    rows="3"
                    max-rows="6"
                ></b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Telefones" @click="inicializarTabTelefone">
          <b-row>
            <b-col cols="3">
              <vs-input label-placeholder="Numero de telefone" v-model="telefone.numero"
                        class="input-personalizado" v-mask="['(##)####-####', '(##)#####-####']"/>
            </b-col>
            <b-col cols="3">
              <b-form-group id="select-cliente" label="Tipo telefone">
                <b-form-select :options="tiposTelefone" value-field="id_tipo" v-model="telefone.id_tipo"
                               text-field="descricao">
                  <template #first>
                    <b-form-select-option :value="null">Selecione</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <vs-input label-placeholder="Observação" class="input-personalizado" v-model="telefone.observacao"/>
            </b-col>
            <b-col cols="auto">
              <vs-button type="filled" icon="add_ic_call" class="botao-salvar botao-adicionar-telefone" color="#5498ff"
                         @click.prevent="adicionarTelefone()"/>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-table
                  :fields="fieldsTelefone"
                  :current-page="currentPage"
                  :per-page="perPage"
                  :filter="filter"
                  :filter-included-fields="filterOn"
                  :sort-by.sync="sortBy"
                  :sort-desc.sync="sortDesc"
                  :sort-direction="sortDirection"
                  head-variant="dark"
                  show-empty
                  :items="telefones"
                  small
                  @filtered="onFiltered"
                  striped
                  hover
                  bordered
                  sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px)"
                  outlined
                  sort-icon-left
                  no-border-collapse>
                <template #table-colgroup>
                  <col>
                  <col>
                  <col>
                  <col style="width: 15px">
                  <col style="width: 15px">
                </template>
                <template #cell(editar)="row">
                  <vs-button type="flat" color="dark" @click="editarTelefone(row)" icon="edit"></vs-button>
                </template>
                <template #cell(deletar)="row">
                  <vs-button type="flat" color="dark" @click="alertaDeletarTelefone(row)" icon="delete"></vs-button>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Contratos" @click.prevent="buscarContratos">
          <b-row>
            <b-col>
              <h6>Contratos de: {{ cliente.nome }} </h6>
            </b-col>
          </b-row>
          <b-row class="tabela-contratos-clientes">
            <b-col class="col-tabela-contratos-clientes">
              <b-table
                  :fields="fieldsContratos"
                  :current-page="currentPage"
                  :per-page="perPage"
                  :filter="filter"
                  :filter-included-fields="filterOn"
                  :sort-by.sync="sortBy"
                  :sort-desc.sync="sortDesc"
                  :sort-direction="sortDirection"
                  head-variant="dark"
                  show-empty
                  sort-icon-left
                  small
                  :items="contratos"
                  @filtered="onFiltered"
                  striped
                  hover
                  bordered
                  selectable
                  select-mode="single"
                  @row-selected="selecionandoContrato"
                  sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px - 300px)"
                  outlined
                  no-border-collapse>
                <template #table-colgroup>
                  <col>
                  <col>
                  <col>
                  <col>
                  <col>
                  <col style="width: 15px">
                </template>
                <template #cell(id)="row">
                  <label>
                    {{ ("0000" + row.item.id).slice(-4) }}
                  </label>
                </template>
                <template #cell(data_inicio)="row">
                  <label>
                    {{ $dayjs(row.item.data_inicio).format('DD/MM/YYYY') }}
                  </label>
                </template>
                <template #cell(data_fim)="row">
                  <label>
                    {{ $dayjs(row.item.data_fim).format('DD/MM/YYYY') }}
                  </label>
                </template>
                <template #cell(editar)="row">
                  <vs-button type="flat" color="dark" @mousedown.stop="mostrarModalContrato(row.item)" icon="edit"></vs-button>
                </template>
              </b-table>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <h6>Boletos do contrato: {{ idContrato }}</h6>
            </b-col>
          </b-row>
          <b-row class="tabela-parcelas-clientes">
            <b-col class="col-tabela-parcelas-clientes">
              <b-table
                  :fields="fieldsBoletos"
                  :current-page="currentPage"
                  :per-page="perPage"
                  :filter="filter"
                  :filter-included-fields="filterOn"
                  :sort-by.sync="sortBy"
                  :sort-desc.sync="sortDesc"
                  :sort-direction="sortDirection"
                  show-empty
                  head-variant="dark"
                  :items="boletos"
                  small
                  @filtered="onFiltered"
                  striped
                  sort-icon-left
                  bordered
                  hover
                  outlined
                  sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px - 300px)"
                  no-border-collapse>
                <template #cell(data_vencimento)="row">
                  <label>
                    {{ $dayjs(row.item.data_vencimento).format('DD/MM/YYYY') }}
                  </label>
                </template>
                <template #cell(data_quitacao)="row">
                  <label v-if="row.item.data_quitacao">
                    {{ $dayjs(row.item.data_quitacao).format('DD/MM/YYYY') }}
                  </label>
                </template>
                <template #cell(valor)="row">
                  <label>
                    R$ {{ row.item.valor }}
                  </label>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
      <b-row align-h="end">
        <b-col cols="2">
          <vs-button v-if="editar == true" color="#24a35a" type="filled" icon="save" class="botao-salvar"
                     @click="editarCliente">Salvar
          </vs-button>
          <vs-button v-else color="#24a35a" type="filled" icon="save" class="botao-salvar" @click="cadastrarCliente">
            Salvar
          </vs-button>
        </b-col>
        <b-col cols="2">
          <vs-button color="#707070" type="filled" icon="clear" class="botao-salvar" @click.native="esconderModal">
            Cancelar
          </vs-button>
        </b-col>
      </b-row>
    </modal>
    <ModalContrato :idContrato="idContratoModal" :visivel="modal_visivel" @esconder-modal="modal_visivel = $event"/>
  </b-container>
</template>

<script>

import api from '../../services/api'
import Carregando from "../../components/shared/Carregando";
import {atribuirCep} from "../../methods/global";
import ModalContrato from "../../components/shared/ModalContrato";

export default {
  name: "VisualizarCliente",
  components: {
    Carregando,
    ModalContrato
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
        {key: 'status', label: 'Status', sortable: true,class: 'text-center'},
        {key: 'editar', label: ''},
        {key: 'deletar', label: ''},
      ],
      fieldsTelefone:[
        {key: 'numero', label: 'Número', sortable: true,thClass: 'text-center', tdClass:"td-centralizado"},
        {key: 'descricao', label: 'Tipo', sortable: true,class: 'text-center', tdClass:"td-centralizado"},
        {key: 'observacao', label: 'Observação', sortable: true, thClass: 'text-center', tdClass:"td-centralizado"},
        {key: 'editar', label: ''},
        {key: 'deletar', label: ''},
      ],
      fieldsContratos: [
        {key: 'id', label: 'Contrato', sortable: true,class: 'text-center',tdClass:"td-centralizado"},
        {key: 'nome', label: 'Imóvel', sortable: true,thClass: 'text-center',tdClass:"td-centralizado"},
        {key: 'data_inicio', label: 'Data de Início', sortable: true,class: 'text-center',tdClass:"td-centralizado"},
        {key: 'data_fim', label: 'Data de Término', sortable: true,class: 'text-center',tdClass:"td-centralizado"},
        {key: 'status', label: 'Status',sortable: true, class: 'text-center',tdClass:"td-centralizado"},
        {key: 'editar', label: ''},
      ],
      fieldsBoletos: [
        {key: 'valor', label: 'Valor',sortable: true, class: 'text-center'},
        {key: 'data_vencimento', label: 'Vencimento',sortable: true, class: 'text-center'},
        {key: 'data_quitacao', label: 'Quitação',sortable: true, class: 'text-center'},
        {key: 'status', label: 'Status',sortable: true, class: 'text-center'},
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
        cep: "",
        bairro: "",
        cidade: "",
        estado: "",
        complemento: "",
        cpf_cnpj: "",
        identidade: "",
        email: "",
        referencia: "",
        data_nascimento: "",
        estado_civil: null,
        numero: "",
        status: null,
        observacao: "",
        tipo_cliente: "",
        id:0,
      },
      telefones: [],
      telefone:{id: null, numero: "", id_tipo: null, observacao: "", tipo:""},
      tiposTelefone: [],
      tiposStatus: [],
      editar: false,
      estadosCivis: [],
      carregandoCep: false,
      contEditarCep: 0,
      contratos: [],
      idContrato: "",
      boletos:[],
      idContratoModal:'',
      telefoneEditar:false,
      indexTelefoneTabela:0,
      modal_visivel:false
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
    async inicializarTabTelefone(){
      this.buscarTelefones()
    },
    async buscarTelefones(){
      await api.get("/telefones", {params:{idCliente:this.cliente.id}}).then(consulta => {
        this.telefones = consulta.data
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
        // this.telefones = []
        // for (let x = 0; x < response.data.numero_telefone.length; x++) {
        //   let numero = response.data.numero_telefone[x]
        //   let tipo = response.data.tipo_telefone[x]
        //   let id_tipo = response.data.id_tipo_telefone[x]
        //   let observacao = response.data.observacao_telefone[x]
        //   let id = response.data.id_telefone[x]
        //   this.telefones.push({id: id, numero: numero, tipo: tipo, id_tipo: id_tipo, observacao: observacao})
        // }
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
        let idUsuario = this.$store.state.usuario.id
        await api.post(`/cliente/editar/${this.cliente.id}`, {
          data: this.cliente,
          telefones: this.telefones,
          idUsuario: idUsuario
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
        }).catch(erro => {

          this.$vs.notify({
            text: `${erro.response.data.erro}`,
            position: 'top-center',
            color: 'danger',
            time: 4000,
            icon: 'check_circle_outline'
          })
        })
      }
    },
    async buscarTipoTelefones() {
      await api.get('/tipos_telefones').then(consulta => {
        console.log(consulta.data)
        for (let x = 0; x < consulta.data.length; x++) {
          let id_tipo = {id: consulta.data[x].id, descricao: consulta.data[x].descricao}
          let descricao = consulta.data[x].descricao
          this.tiposTelefone.push({id_tipo: id_tipo, descricao: descricao})
        }
      })
    },
    async editarTelefone(telefone){
      this.telefoneEditar = true
      this.telefone = telefone.item
      this.telefone.id_tipo = {id: telefone.item.id_tipo, descricao: telefone.item.tipo}
      this.indexTelefoneTabela = telefone.index
    },
    alertaDeletarTelefone(telefone) {
      this.$bvModal.msgBoxConfirm(`Tem certeza que deseja deletar o telefone: ${telefone.item.numero} ?`, {
        title: 'Deletar telefone',
        buttonSize: 'sm',
        okTitle: 'Deletar',
        cancelTitle: 'Cancelar',
        okVariant: 'danger',
        footerClass: 'p-2',
        centered: true
      }).then(value => {
        if (value) {
          this.deletarTelefone(telefone)
        }
      })
    },
    async deletarTelefone(telefone){
      console.log(telefone)
      await api.post('/cliente/deletar/telefone', {idTelefone: telefone.item.id}).then(() => {
        // this.telefones
        this.telefones.splice(telefone.index, 1)
      })
    },


    async buscarTipoStatus() {
      await api.get('/cliente/tipos_status').then(response => {
        this.tiposStatus = response.data
      })
    },

    mostrarModal() {
      this.$modal.show('modal-cliente')
      this.buscarTipoTelefones()
      this.buscarTipoStatus()
    },
    esconderModal() {
      this.$modal.hide('modal-cliente');
      this.limparModal()
      this.contEditarCep = 0
      this.editar = false
    },
    async buscarContratos() {
      await api.get('/cliente/contratos', {params:{idCliente:this.cliente.id}}).then((response) => {
        console.log(response.data)
        this.contratos = response.data
      })
    },
    limparModal() {
      Object.keys(this.cliente).forEach(key => {
        this.cliente[key] = ""
      })
      this.telefones = [{numero: "", tipo: null}]
      this.cliente.status = null
      this.cliente.estado_civil = null
      this.contratos = []
      this.boletos = []
    },
    adicionarTelefone() {
      let id_descricao = this.telefone.id_tipo
      this.telefone.id_tipo = id_descricao.id
      this.telefone.tipo = id_descricao.descricao
      if(this.telefoneEditar){
        this.telefone = {id: null, numero: "", id_tipo: null, observacao: "", tipo:""}
      }else{
        this.telefones.push(this.telefone)
        this.telefone = {id: null, numero: "", id_tipo: null, observacao: "", tipo:""}
      }

    },

    async removerTelefone(index) {
      let telefone = this.telefones[index]
      if (telefone.id) {
        this.$bvModal.msgBoxConfirm(`Tem certeza que deseja remover o telefone: ${telefone.numero} ?`, {
          title: 'Remover telefone',
          buttonSize: 'sm',
          okTitle: 'Remover',
          cancelTitle: 'Cancelar',
          okVariant: 'danger',
          footerClass: 'p-2',
          centered: true
        }).then(value => {
          if (value) {
            api.post('/cliente/deletar/telefone', {idTelefone: telefone.id}).then(() => {
              if (this.telefones.length > 1) {
                this.telefones.splice(index, 1)
              } else {
                this.telefones = [{id: "", numero: "", tipo: null}]
              }
            })
          }
        })
      } else {
        if (this.telefones.length > 1) {
          this.telefones.splice(index, 1)
        } else {
          this.telefones = [{id: "", numero: "", tipo: null}]
        }
      }
    },
    async cadastrarCliente() {
      if (this.validarCamposObrigatorio()) {
        let variaveisString = ['data_nascimento', 'identidade', 'status', 'estado_civil']
        for (let key in variaveisString) {
          if (this.cliente[variaveisString[key]] == "") {
            this.cliente[variaveisString[key]] = null
          }
        }
        let idUsuario = this.$store.state.usuario.id
        await api.post('/cliente/cadastrar', {data: this.cliente, telefones: this.telefones, idUsuario: idUsuario}, ).then(response => {
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
        }).catch(erro => {
          this.$vs.notify({
            text: `${erro.response.data.erro}`,
            position: 'top-center',
            color: 'danger',
            time: 40000,
            icon: 'check_circle_outline'
          })
        })
      }
    },
    validarCamposObrigatorio() {
      if (this.cliente['nome'] == "" || this.cliente['email'] == "" || this.cliente['tipo_cliente'] == "" ) {
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
    },
    async selecionandoContrato(contrato){
      this.idContrato = ("0000" + contrato[0].id).slice(-4)
      await api.get('/cliente/contrato/boletos', {params:{idContrato: contrato[0].id}}).then(response => {
        this.boletos = response.data
      })
    },
    mostrarModalContrato(contrato){
      this.$modal.show('modal-contrato')
      this.modal_visivel = true
      this.idContratoModal = contrato.id
    }
  },
  watch: {
    'cliente.cep': function (cep) {
      if (atribuirCep(cep)) {
        if (cep.length == 9) {
          this.carregandoCep = true
        }
        atribuirCep(cep).then(response => {
          this.carregandoCep = false
          this.atribuirCep(response)
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

.divider-personalizado {
  border-top: 1px solid rgb(200, 200, 200);
  position: absolute;
  bottom: 0;
  margin-left: -100px;
  width: 100%;
  padding: 10px 100px 15px 100px;
  background-color: white;
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

.td-centralizado{
  padding-top: 10px !important;
}

</style>
