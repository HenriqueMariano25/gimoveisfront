<template>
  <div>
    <modal
        name="modal-cliente"
        width="90%"
        height="auto"
        :scrollable="true"
        :click-to-close="false"
        class="modal-adicionando-cliente"
        @opened="inicializar"
    >
      <h3>Adicionando cliente</h3>
      <Carregando :visivel="carregandoVisivel" :style="{ 'height':'346px', 'line-height': '350px' }"></Carregando>
      <b-tabs content-class="mt-3">
        <b-tab title="Dados gerais" active>
          <b-row class="mb-2">
            <b-col>
              <b-form-radio-group v-slot="{ ariaDescribedby }" v-model="cliente.tipo_cliente">
                <b-form-radio :aria-describedby="ariaDescribedby" value="pessoa física">Pessoa física*</b-form-radio>
                <b-form-radio :aria-describedby="ariaDescribedby" value="pessoa jurícida">Pessoa jurídica*
                </b-form-radio>
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
                <b-form-select v-model="cliente.estado_civil" :options="tiposEstadosCivis" value-field="id"
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
              <vs-input onKeyDown="if(this.value.length==18 && event.keyCode!=8) return false;" type="text"
                        v-mask="['###.###.###-##', '##.###.###/####-##']" label-placeholder="CPF ou CNPJ*"
                        v-model="cliente.cpf_cnpj"
                        class="input-personalizado"/>
            </b-col>
            <b-col cols="3">
              <vs-input type="text"
                        label-placeholder="Identidade" v-model="cliente.identidade" class="input-personalizado"/>
            </b-col>
          </b-row>
          <Carregando :visivel="carregandoCep"/>
          <b-row>
            <b-col cols="2">
              <vs-input
                  type="text"
                  label-placeholder="CEP"
                  v-model="cliente.cep"
                  class="input-personalizado"
                  v-mask="'#####-###'"
                  @focusout="buscarEndereco"
                  @focusin="cepAtual"
              />
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
        <b-tab title="Telefones" :disabled="!editar">
          <b-row>
            <b-col cols="3">
              <vs-input label-placeholder="Numero de telefone" v-model="telefone.numero"
                        class="input-personalizado" v-mask="['(##)####-####', '(##)#####-####']"/>
            </b-col>
            <b-col cols="3">
              <b-form-group id="select-cliente" label="Tipo telefone">
                <b-form-select :options="tiposTelefone" value-field="id" v-model="telefone.id_tipo_telefone"
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
            <b-col cols="auto" v-if="telefoneEditar">
              <vs-button type="filled" icon="add_ic_call" class="botao-salvar botao-adicionar-telefone" color="#5498ff"
                         @click.prevent="salvarEdicaoTelefone()"/>
            </b-col>
            <b-col cols="auto" v-else>
              <vs-button type="filled" icon="add_ic_call" class="botao-salvar botao-adicionar-telefone" color="#5498ff"
                         @click.prevent="adicionarTelefone()"/>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-table
                  :fields="fieldsTelefone"
                  head-variant="dark"
                  show-empty
                  :items="telefones"
                  small
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
                  <vs-tooltip text="Editar">
                    <vs-button type="flat" color="dark" @click="editarTelefone(row)" icon="edit"></vs-button>
                  </vs-tooltip>
                </template>
                <template #cell(deletar)="row">
                  <vs-tooltip text="Deletar">
                    <vs-button type="flat" color="dark" @click="alertaDeletarTelefone(row)" icon="delete"></vs-button>
                  </vs-tooltip>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Contratos" @click.prevent="buscarContratos" :disabled="!editar">
          <b-row>
            <b-col>
              <h6>Contratos de: {{ cliente.nome }} </h6>
            </b-col>
          </b-row>
          <b-row class="tabela-contratos-clientes">
            <b-col class="col-tabela-contratos-clientes">
              <b-table
                  :fields="fieldsContratos"

                  head-variant="dark"
                  show-empty
                  sort-icon-left
                  small
                  :items="contratos"
                  striped
                  hover
                  bordered
                  selectable
                  select-mode="single"
                  @row-selected="selecionandoContrato"
                  sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px - 400px)"
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
                <template #cell(status)="row">
                  <label v-if="!row.item.nome_pdf" style="color:red">
                    <b>
                      Falta PDF
                    </b>
                  </label>
                  <label v-else>
                    {{ row.item.status }}
                  </label>
                </template>
                <template #cell(editar)="row">
                  <vs-tooltip text="Editar">
                    <vs-button type="flat" color="dark" @mousedown.stop="mostrarModalContrato(row.item)"
                               icon="edit"></vs-button>
                  </vs-tooltip>
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
                  show-empty
                  head-variant="dark"
                  :items="boletos"
                  small
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
                <template #cell(id)="row">
                  <label>
                    {{ ("000000" + row.item.id).slice(-6) }}
                  </label>
                </template>
                <template #cell(data_quitacao)="row">
                  <label v-if="row.item.data_quitacao">
                    {{ $dayjs(row.item.data_quitacao).format('DD/MM/YYYY') }}
                  </label>
                </template>
                <template #cell(valor)="row">
                  <label>R$ {{ row.item.valor.replace('.', ',') }}</label>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
      <b-row align-h="end">
        <b-col cols="auto">
          <vs-button v-if="editar" color="#24a35a" type="filled" icon="save" class="botao-salvar"
                     @click="editarCliente">
            Salvar
          </vs-button>
          <vs-button v-else color="#24a35a" type="filled" icon="save" class="botao-salvar"
                     @click="cadastrarCliente(false)">
            Salvar
          </vs-button>
        </b-col>
        <b-col cols="auto" v-if="!editar">
          <vs-button color="#24a35a" type="filled" icon="save" class="botao-salvar" @click="cadastrarCliente(true)">
            Salvar e Sair
          </vs-button>
        </b-col>
        <b-col cols="auto">
          <vs-button color="#707070" type="filled" icon="clear" class="botao-salvar" @click.native="esconderModal">
            Cancelar
          </vs-button>
        </b-col>
      </b-row>
    </modal>
    <ModalContrato :idContrato="idContratoModal" :visivel="modal_visivel" @esconder-modal="modal_visivel = $event"/>
  </div>
</template>

<script>

import Carregando from "@/components/shared/Carregando";
import api from "@/services/api";
import {atribuirCep} from "@/methods/global";
import ModalContrato from "../../components/shared/ModalContrato";

export default {
  name: "ModalCliente",
  components: {
    Carregando,
    ModalContrato
  },
  props: {
    idCliente: {
      type: Number,
      default: null,
    }
  },
  data() {
    return {
      fieldsTelefone: [
        {key: 'numero', label: 'Número', sortable: true, thClass: 'text-center', tdClass: "td-centralizado"},
        {key: 'descricao', label: 'Tipo', sortable: true, class: 'text-center', tdClass: "td-centralizado"},
        {key: 'observacao', label: 'Observação', sortable: true, thClass: 'text-center', tdClass: "td-centralizado"},
        {key: 'editar', label: ''},
        {key: 'deletar', label: ''},
      ],
      fieldsContratos: [
        {key: 'id', label: 'Contrato', sortable: true, class: 'text-center', tdClass: "td-centralizado"},
        {key: 'nome', label: 'Imóvel', sortable: true, thClass: 'text-center', tdClass: "td-centralizado"},
        {key: 'data_inicio', label: 'Data de Início', sortable: true, class: 'text-center', tdClass: "td-centralizado"},
        {key: 'data_fim', label: 'Data de Término', sortable: true, class: 'text-center', tdClass: "td-centralizado"},
        {key: 'status', label: 'Status', sortable: true, class: 'text-center', tdClass: "td-centralizado"},
        {key: 'editar', label: ''},
      ],
      fieldsBoletos: [
        {key: 'id', label: 'Código', sortable: true, class: 'text-center'},
        {key: 'data_vencimento', label: 'Vencimento', sortable: true, class: 'text-center'},
        {key: 'valor', label: 'Valor', sortable: true, class: 'text-center'},
        {key: 'data_quitacao', label: 'Quitação', sortable: true, class: 'text-center'},
        {key: 'status', label: 'Status', sortable: true, class: 'text-center'},
      ],
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
        numero: "",
        estado_civil: null,
        status: null,
        observacao: "",
        tipo_cliente: "",
        id: "",
      },
      telefone: {
        id: "",
        numero: "",
        id_tipo_telefone: null,
        observacao: "",
      },
      editar: false,
      tiposTelefone: [],
      tiposStatus: [],
      tiposEstadosCivis: [],
      telefones: [],
      cep_atual: '',
      carregandoCep: false,
      telefoneEditar: false,
      idContrato: "",
      contratos: [],
      boletos: [],
      idContratoModal: '',
      modal_visivel: false,
      carregandoVisivel: true
    }
  },
  methods: {
    esconderModal() {
      this.cliente = {
        estado_civil: null,
        status: null,
      }
      this.$modal.hide('modal-cliente')
      this.carregandoVisivel = true
      this.contratos = []
      this.telefones = []
      // this.idCliente = null
    },
    async inicializar() {
      this.carregandoVisivel = true
      this.editar = false
      if (this.idCliente) {
        this.editar = true
        this.buscarCliente()
        this.buscarTelefones()
        this.buscarContratos()
      }
      this.buscarTipoTelefones()
      this.buscarTipoStatus()
      await this.buscarEstadosCivis().then(() => this.carregandoVisivel = false)
    },

    //Buscas(GET)
    async buscarCliente() {
      await api.get('/cliente', {params: {idCliente: this.idCliente}}).then(response => {
        this.cliente = response.data
      })
    },
    async buscarTipoTelefones() {
      await api.get('/tipos_telefones').then(consulta => {
        this.tiposTelefone = consulta.data
      })
    },
    async buscarTipoStatus() {
      await api.get('/cliente/tipos_status').then(response => {
        this.tiposStatus = response.data
      })
    },
    async buscarEstadosCivis() {
      await api.get('/estados_civis').then(response => {
        this.tiposEstadosCivis = response.data
      })
    },
    async buscarTelefones() {
      await api.get("/telefones", {params: {idCliente: this.idCliente}}).then(consulta => {
        this.telefones = consulta.data
      })
    },
    async selecionandoContrato(contrato) {
      this.idContrato = ("0000" + contrato[0].id).slice(-4)
      await api.get('/cliente/contrato/boletos', {params: {idContrato: contrato[0].id}}).then(response => {
        this.boletos = response.data
      })
    },
    async buscarContratos() {
      await api.get('/cliente/contratos', {params: {idCliente: this.idCliente}}).then((response) => {
        this.contratos = response.data
      })
    },


    //Cadastros e Edição(POST, PUT)
    async cadastrarCliente(sair) {
      if (this.validarCamposObrigatorio()) {
        let variaveisString = ['status', 'estado_civil']
        for (let key in variaveisString) {
          if (this.cliente[variaveisString[key]] == "") {
            this.cliente[variaveisString[key]] = null
          }
        }
        let variaveisString2 = ['data_nascimento', 'identidade',]
        for (let key in variaveisString2) {
          if (this.cliente[variaveisString2[key]] == null) {
            this.cliente[variaveisString2[key]] = ""
          }
        }
        let idUsuario = this.$store.state.usuario.id
        await api.post('/cliente/cadastrar', {
          data: this.cliente,
          telefones: this.telefones,
          idUsuario: idUsuario
        },).then(response => {
          let nomeCliente = response.data[0].nome
          this.cliente.id = response.data[0].id
          this.$vs.notify({
            text: `Cliente cadastrado com sucesso: ${nomeCliente} !`,
            position: 'top-center',
            color: 'success',
            time: 6000,
            icon: 'check_circle_outline'
          })
          if (sair) {
            this.esconderModal()
          } else {
            this.editar = true
          }
          this.$emit('recarregarDados')
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
    async editarCliente() {
      if (this.validarCamposObrigatorio()) {
        let variaveisString = ['status', 'estado_civil']
        for (let key in variaveisString) {
          if (this.cliente[variaveisString[key]] == "") {
            this.cliente[variaveisString[key]] = null
          }
        }
        let variaveisString2 = ['data_nascimento', 'identidade',]
        for (let key in variaveisString2) {
          if (this.cliente[variaveisString2[key]] == null) {
            this.cliente[variaveisString2[key]] = ""
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
          this.esconderModal()
          this.$emit('recarregarDados')
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

    //TELEFONE(CRUD)
    async adicionarTelefone() {
      let idCliente = this.cliente.id
      let idUsuario = this.$store.state.usuario.id
      await api.post('/cliente/telefone/cadastrar', {
        telefone: this.telefone,
        idCliente: idCliente,
        idUsuario: idUsuario
      }).then(() => {
        this.buscarTelefones()
        this.telefone = {
          id: "",
          numero: "",
          id_tipo_telefone: null,
          observacao: "",
        }
      })
    },
    async editarTelefone(telefone) {
      this.telefoneEditar = true
      this.telefone.numero = telefone.item.numero
      this.telefone.id = telefone.item.id
      this.telefone.id_tipo_telefone = telefone.item.id_tipo_telefone
      this.telefone.observacao = telefone.item.observacao
    },
    async salvarEdicaoTelefone() {
      let idUsuario = this.$store.state.usuario.id
      await api.post('/cliente/telefone/editar', {telefone: this.telefone, idUsuario: idUsuario}).then(() => {
        this.buscarTelefones()
        this.telefone = {
          id: "",
          numero: "",
          id_tipo_telefone: null,
          observacao: "",
        }
        this.telefoneEditar = false
      })
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
    async deletarTelefone(telefone) {
      await api.delete('/cliente/telefone/deletar', {params: {idTelefone: telefone.item.id}}).then(() => {
        this.buscarTelefones()
      })
    },



    mostrarModalContrato(contrato) {
      this.$modal.show('modal-contrato')
      this.modal_visivel = true
      this.idContratoModal = contrato.id
    },
    validarCamposObrigatorio() {
      if (this.cliente['nome'] == "" || this.cliente['email'] == "" || this.cliente['tipo_cliente'] == "") {
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

    //ENDERECO
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
    cepAtual() {
      this.cep_atual = this.cliente.cep
    },
    buscarEndereco() {
      if (this.cep_atual != this.cliente.cep) {
        if (atribuirCep(this.cliente.cep)) {
          if (this.cliente.cep.length == 9) {
            this.carregandoCep = true
          }
          atribuirCep(this.cliente.cep).then(response => {
            this.carregandoCep = false
            this.atribuirCep(response)
          })
        }
      }
    },
  }
}
</script>

<style scoped>

</style>