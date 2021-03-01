<template>
  <b-container fluid>
    <b-row class="barra-top-contrato" align-v="center">
      <b-col>
        <h1 class="mb-1">Cadastro de Contrato</h1>
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
    <b-row class="tabela-responsaveis">
      <b-col class="col-tabela-responsaveis">
        <b-table
            id="tabela-contrato"
            primary-key="id"
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
            :busy="carregandoContratos"
            @filtered="onFiltered"
            striped
            hover
            outlined
            sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px)"
            no-border-collapse>
          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong class="ml-2">Carregando...</strong>
            </div>
          </template>
          <template #cell(id)="row">
            <p class="tr-contrato">{{ ("0000" + row.item.id).slice(-4) }}</p>
          </template>
          <template #cell(nome_cliente)="row">
            <p class="tr-contrato">{{ row.item.nome_cliente }}</p>
          </template>
          <template #cell(nome_responsavel)="row">
            <p class="tr-contrato">{{ row.item.nome_responsavel }}</p>
          </template>
          <template #cell(nome_imovel)="row">
            <p class="tr-contrato">{{ row.item.nome_imovel }}</p>
          </template>
          <template #cell(status)="row">
            <p v-if="!row.item.nome_pdf" class="tr-contrato" style="color:red"><b>Falta PDF</b></p>
            <p v-else class="tr-contrato text-capitalize">{{ row.item.status }}</p>
          </template>
          <template #cell(contrato)="row">
            <div class="item-coluna-centralizada">
              <vs-button type="flat" color="dark" :disabled="!row.item.url" target :href="row.item.url"
                         icon="description"></vs-button>
            </div>
          </template>
          <template #cell(editar)="row">
            <div class="item-coluna-centralizada">
              <vs-button type="flat" color="dark" @click="editarContratoModal(row.item.id)" icon="edit"></vs-button>
            </div>
          </template>
          <template #cell(deletar)="row">
            <div class="item-coluna-centralizada">
              <vs-button type="flat" color="dark" @click="deletarContratoModal(row.item)" icon="delete"></vs-button>
            </div>
          </template>
          <template #table-colgroup>
            <col>
            <col>
            <col>
            <col>
            <col>
            <col style="width: 15px">
            <col style="width: 15px">
            <col style="width: 15px">
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
              class="mb-1"
          >
            <b-form-select
                id="per-page-select"
                v-model="perPage"
                :options="pageOptions"
                size="sm"
            ></b-form-select>
          </b-form-group>
        </b-col>
        <b-col class="ml-auto" cols="auto" style="margin-bottom: -5px">
          <vs-button color="#24a35a" type="filled" icon="note_add" @click="mostrarModal">Adicionar
          </vs-button>
        </b-col>
      </b-row>
    </b-container>
    <!--  Fim da tabela-->
    <modal name="modal-contrato" id="modal-contrato" width="60%" height="auto" :scrollable="true" class="modal-adicionando-responsavel">
      <h3>Adicionando contrato</h3>
      <b-tabs content-class="mt-3">
        <b-tab title="Dados gerais" active>
          <b-row>
            <b-col>
              <b-form-group id="select-contrato" label="Responsável">
                <b-form-select v-model="contrato.id_responsavel" :options="responsaveis" value-field="id"
                               text-field="nome">
                  <template #first>
                    <b-form-select-option :value="null">Selecione</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group id="select-contrato" label="Cliente">
                <b-form-select v-model="contrato.id_cliente" :options="clientes" value-field="id"
                               text-field="nome">
                  <template #first>
                    <b-form-select-option :value="null">Selecione</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group id="select-contrato" label="Imóvel">
                <b-form-select v-model="contrato.id_imovel" :options="imoveis" value-field="id"
                               text-field="nome">
                  <template #first>
                    <b-form-select-option :value="null">Selecione</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <vs-input label="Data de Início" v-model="contrato.data_inicio" type="date"
                        class="input-nascimento"/>
            </b-col>
            <b-col>
              <vs-input label="Data de Término" v-model="contrato.data_fim" type="date"
                        class="input-nascimento" :disabled="!ativo_data_termino"/>
            </b-col>
            <b-col>
              <vs-input label-placeholder="Vigência" v-model="contrato.vigencia" class="input-personalizado" readonly
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <vs-input label="Vencimento" v-model="contrato.data_vencimento" type="date"
                        class="input-nascimento"/>
            </b-col>
            <b-col>
              <vs-input ref="valor_boleto" label-placeholder="Valor do Boleto" v-model="contrato.valor_boleto"
                        class="input-personalizado"
                        v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                        allowNegative: false, currency:'BRL'}"
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <vs-input label-placeholder="Carência" v-model="contrato.carencia" class="input-personalizado"/>
            </b-col>
            <b-col>
              <vs-input label-placeholder="Garantia" v-model="contrato.garantia" class="input-personalizado"/>
            </b-col>
            <b-col>
              <b-form-group id="select-contrato" label="Fiador">
                <b-form-select v-model="contrato.fiador" :options="clientes" value-field="id"
                               text-field="descricao">
                  <template #first>
                    <b-form-select-option :value="null">Selecione</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Inf. adicionais">
          <b-row>
            <b-col>
              <b-form-file @change="importarPDF" type="file" ref="file" class="mt-3 arquivo-pdf" accept=".pdf"
                           placeholder="Escolha um arquivo para importar"
                           drop-placeholder="Solte o arquivo aqui!">
              </b-form-file>
            </b-col>
            <b-col>
              <p v-if="contrato.nome_pdf" style="color:green" class="p-contrato"><b>Contrato importado</b></p>
              <p v-else style="color:red" class="p-contrato"><b>Contrato não importado</b></p>
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
                    rows="1s"
                    max-rows="6"
                ></b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Boletos" :disabled="!editar">
          <b-row>
            <b-col>
              <b-table
                  id="tabela-boleto"
                  primary-key="id"
                  :tbody-transition-props="transProps"
                  bordered
                  head-variant="dark"
                  sort-icon-left
                  :items="boletos"
                  :fields="fieldsBoletos"
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
                <template #cell(data_vencimento)="row">
                  <p class="tr-contrato">{{ dayjs(row.item.data_vencimento).format('DD/MM/YYYY') }}</p>
                </template>
                <template #cell(valor)="row">
                  <p class="tr-contrato">R$ {{ row.item.valor }}</p>
                </template>
                <template #cell(status)="row">
                  <p class="tr-contrato">{{ row.item.status }}</p>
                </template>
                <template #cell(id)="row">
                  <p class="tr-contrato">{{ ("000000" + row.item.id).slice(-6) }}</p>
                </template>
                <template #cell(data_quitacao)="row">
                  <p v-if="row.item.data_quitacao != null" class="tr-contrato">
                    {{ dayjs(row.item.data_quitacao).format('DD/MM/YYYY') }}</p>
                  <p v-else class="tr-contrato">{{ row.item.data_quitacao }}</p>
                </template>
                <template #cell(editar)="row">
                  <div class="item-coluna-centralizada">
                    <vs-button type="flat" color="dark" @click="editarBoletoModal(row.item)" icon="edit"></vs-button>
                  </div>
                </template>
                <template #table-colgroup>
                  <col>
                  <col>
                  <col>
                  <col>
                  <col>
                  <col style="width: 15px">
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
      <b-row align-h="end">
        <b-col cols="auto">
          <vs-button v-if="editar == true" color="#24a35a" type="filled" icon="save" class="botao-salvar"
                     @click.native="editarContrato">Salvar
          </vs-button>
          <vs-button v-else color="#24a35a" type="filled" icon="save" class="botao-salvar"
                     @click.native="cadastrarContrato">
            Salvar
          </vs-button>
        </b-col>
        <b-col cols="auto">
          <vs-button color="#707070" type="filled" icon="clear" class="botao-salvar" @click.native="esconderModal">
            Cancelar
          </vs-button>
        </b-col>

      </b-row>
    </modal>
    <modal name="modal-editar-boleto"  width="60%" height="auto" :scrollable="true" :click-to-close="false"
           class="modal-adicionando-responsavel">
      <b-container>
        <b-row>
          <b-col>
            <h4>Editando contrato: </h4>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <vs-input label="Data Vencimento" v-model="boleto.data_vencimento" type="date"
                      class="input-nascimento"/>
          </b-col>
          <b-col>
            <vs-input label="Data Quitação" v-model="boleto.data_quitacao" type="date"
                      class="input-nascimento"/>
          </b-col>
          <b-col>
            <vs-input label-placeholder="Valor" v-model="boleto.valor" class="input-personalizado"/>
          </b-col>
          <b-col>
            <b-form-group id="select-contrato" label="Status">
              <b-form-select v-model="boleto.id_status_boleto" :options="status_boleto" value-field="id"
                             text-field="descricao">
                <template #first>
                  <b-form-select-option :value="null">Selecione</b-form-select-option>
                </template>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row align-h="end">
          <b-col cols="2">
            <vs-button color="#24a35a" type="filled" icon="save" class="botao-salvar"
                       @click="editarBoleto" >
              Salvar
            </vs-button>
          </b-col>
          <b-col cols="2">
            <vs-button color="#707070" type="filled" icon="clear" class="botao-salvar"
                       @click="esconderModalEditarBoleto">
              Cancelar
            </vs-button>
          </b-col>
        </b-row>
      </b-container>
    </modal>
  </b-container>
</template>

<script>

import api from '../../services/api'
import dayjs from 'dayjs'
import {converterDinherioFloat} from "../../methods/global";

export default {
  name: "VisualizarContrato",
  data() {
    return {
      transProps: {
        name: "flip-list",
      },
      items: [],
      fields: [
        {key: 'id', label: 'Código', sortable: true, class: 'text-center'},
        {key: 'nome_cliente', label: 'Cliente', sortable: true, thClass: 'text-center'},
        {key: 'nome_responsavel', label: 'Responsável', sortable: true, thClass: 'text-center'},
        {key: 'nome_imovel', label: 'Imóvel', sortable: true, thClass: 'text-center'},
        {key: 'status', label: 'Status', class: 'text-center'},
        {key: 'contrato', label: ''},
        {key: 'editar', label: ''},
        {key: 'deletar', label: ''},
      ],
      fieldsBoletos: [
        {key: 'id', label: 'Código', sortable: true, class: 'text-center'},
        {key: 'data_vencimento', label: 'Vencimento', sortable: true, class: 'text-center'},
        {key: 'valor', label: 'Valor', sortable: true, class: 'text-center'},
        {key: 'data_quitacao', label: 'Data Quitação', sortable: true, class: 'text-center'},
        {key: 'status', label: 'Status', sortable: true, class: 'text-center'},
        {key: 'editar', label: '', class: 'text-center'},
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
      contrato: {
        id: '',
        id_responsavel: null,
        id_cliente: null,
        id_imovel: null,
        data_inicio: "",
        data_fim: "",
        vigencia: "",
        data_vencimento: "",
        valor_boleto: "",
        carencia: "",
        garantia: "",
        fiador: "",
        locador: "",
        nome_pdf: ""
      },
      boletos: [],
      boleto: {
        valor: "",
        data_vencimento: "",
        data_quitacao: "",
        id: "",
        id_status_boleto: null,
      },
      editar: false,
      responsaveis: [],
      clientes: [],
      imoveis: [],
      btn_desabilitado: false,
      ativo_data_termino: false,
      dayjs: dayjs,
      status_boleto: [],
      files: null,
      btn_importa_desabilitado: true,
      carregandoContratos: false
    }
  },

  methods: {
    async buscarResponsaveis() {
      await api.get('/contrato/responsaveis').then(response => {
        this.responsaveis = response.data
      })
    },
    async buscarClientes() {
      await api.get('/contrato/clientes').then(response => {
        this.clientes = response.data
      })
    },
    async buscarImoveis() {
      await api.get('/contrato/imoveis').then(response => {
        this.imoveis = response.data
      })
    },
    async buscarContratos() {
      this.carregandoContratos = true
      await api.get('/contratos').then(response => {
        this.items = response.data
        console.log(response.data)
        this.carregandoContratos = false
      })
    },
    async buscarBoletos(idContrato) {
      await api.get('/contrato/boletos', {params: {idContrato: idContrato}}).then(response => {
        this.boletos = response.data
      })
    },
    async buscarStatusBoleto() {
      await api.get('/contrato/boleto/status').then(response => {
        this.status_boleto = response.data
      })
    },

    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    async deletarContrato(contrato) {
      await api.delete(`/contrato/deletar/`, {params: contrato}).then(() => {
        this.buscarContratos()
      })
    },
    deletarContratoModal(contrato) {
      this.$bvModal.msgBoxConfirm(`Tem certeza que deseja deletar o contrato: ${contrato.id} ?`, {
        title: 'Deletar contrato',
        buttonSize: 'sm',
        okTitle: 'Deletar',
        cancelTitle: 'Cancelar',
        okVariant: 'danger',
        footerClass: 'p-2',
        centered: true
      }).then(value => {
        if (value) {
          this.deletarContrato(contrato)
        }
      })
    },
    async editarContratoModal(id) {
      await api.get('/contrato', {params: {idContrato: id}}).then(response => {
        this.contrato = response.data[0]
        this.contrato.valor_boleto = `R$ ${response.data[0].valor_boleto.replace('.',',')}`
        this.buscarBoletos(id)
        this.mostrarModal()
        this.editar = true
      })
    },
    async editarContrato() {
      this.contrato.valor_boleto = converterDinherioFloat(this.contrato.valor_boleto)
      if (this.validarCamposObrigatorio()) {
        let idUsuario = this.$store.state.usuario.id
        await api.post(`/contrato/editar`, {
          contrato: this.contrato,
          idUsuario: idUsuario
        }).then(response => {
          let codigo = response.data[0].id
          this.$vs.notify({
            text: `Contrato editado com sucesso: ${codigo} !`,
            position: 'top-center',
            color: 'warning',
            time: 6000,
            icon: 'check_circle_outline'
          })
          this.buscarContratos()
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
    editarBoletoModal(boleto) {
      api.get('/contrato/boleto', {params: {idBoleto: boleto.id}}).then(response => {
        this.boleto = response.data[0]
        this.buscarStatusBoleto()
        this.mostrarModalEditarBoleto()
      })
    },
    editarBoleto() {
      if (this.boleto.data_quitacao == null) {
        this.boleto.data_quitacao = ''
      }
      api.post('/contrato/boleto/editar', {boleto: this.boleto}).then(response => {
        this.buscarBoletos(response.data[0].id_contrato)
        this.esconderModalEditarBoleto()
      })
    },

    async mostrarModal() {
      this.buscarResponsaveis()
      this.buscarClientes()
      this.buscarImoveis()
      this.$modal.show('modal-contrato')
    },

    esconderModal() {
      this.$modal.hide('modal-contrato');
      this.limparModal()
      this.editar = false
    },
    limparModal() {
      Object.keys(this.contrato).forEach(key => {
        this.contrato[key] = ""
      })
      this.contrato.id_cliente = null
      this.contrato.id_imovel = null
      this.contrato.id_responsavel = null
      this.boletos = []
    },
    mostrarModalEditarBoleto() {
      this.$modal.show('modal-editar-boleto')
    },
    esconderModalEditarBoleto() {
      this.$modal.hide('modal-editar-boleto');
    },
    limparModalEditarBoleto() {
      Object.keys(this.boleto).forEach(key => {
        this.contrato[key] = ""
      })
    },
    importarPDF(event) {
      this.btn_importa_desabilitado = false
      this.files = event.target.files
      const formData = new FormData();
      for (const i of Object.keys(this.files)) {
        formData.append('files', this.files[i])
      }
      api.post(`/contrato/${this.contrato.id}/importar/pdf`, formData, {}).then((res) => {
        console.log(res)
        this.contrato.nome_pdf = res.data[0].nome
        this.buscarContratos()
        this.$vs.notify({
          text: `Contrato importado com sucesso!`,
          position: 'top-center',
          color: 'success',
          time: 4000,
          icon: 'check_circle_outline'
        })
      })
    },
    async cadastrarContrato() {
      this.contrato.valor_boleto = converterDinherioFloat(this.contrato.valor_boleto)
      if (this.validarCamposObrigatorio()) {
        if (this.validarDataInicioFim()) {
          let idUsuario = this.$store.state.usuario.id
          await api.post('/contrato/cadastrar', {contrato: this.contrato, idUsuario: idUsuario}).then(() => {
            this.esconderModal()
            this.$vs.notify({
              text: `Contrato cadastrado com sucesso!`,
              position: 'top-center',
              color: 'success',
              time: 6000,
              icon: 'check_circle_outline'
            })
            this.buscarContratos()
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
      }
    },
    validarCamposObrigatorio() {
      if (this.contrato['id_responsavel'] == "" || this.contrato['id_cliente'] == "" || this.contrato['id_imovel'] == "" ||
          this.contrato['data_inicio'] == "" || this.contrato['data_fim'] == "" ||
          this.contrato['valor_boleto'] == "" || this.contrato['data_vencimento'] == "") {
        console.log(this.contrato)
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
    validarDataInicioFim() {
      let inicio = this.contrato.data_inicio
      let fim = this.contrato.data_fim
      if (fim <= inicio) {
        this.$vs.notify({
          text: `Datas de Início ou Fim inválidas`,
          position: 'top-center',
          color: 'danger',
          time: 5000,
          icon: 'check_circle_outline'
        })
        return false
      } else {
        return true
      }
    },
  },
  watch: {
    'contrato.data_inicio': function (inicio) {
      if (inicio.length == 10) {
        this.ativo_data_termino = true
      } else {
        this.ativo_data_termino = false
        this.contrato.data_fim = ""
        this.contrato.vigencia = ""
      }
    },
    'contrato.data_fim': function (fim) {
      if (fim.length == 10) {
        let inicio = this.contrato.data_inicio
        this.contrato.vigencia = dayjs(fim).diff(inicio, 'month')
      } else {
        this.contrato.vigencia = ""
      }
    },
  },
  async mounted() {
    this.buscarContratos()
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
  margin-top: -40px !important;
  bottom: 25px;
  padding: 25px;
}

.tr-contrato {
  margin-top: 6px;
  margin-bottom: 0px;
}

.tr-cliente {
  margin-top: 6px;
  margin-bottom: 0px;
}

.barra-top-contrato {
  padding: 0;
  margin: 0;
  margin-bottom: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 1px 5px rgba(200, 200, 200, 0.5);
}

.tabela-responsaveis {
  background-color: white;
  margin: 0;
  padding: 0;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0px 1px 5px rgba(200, 200, 200, 0.5);
}

.col-tabela-responsaveis {
  padding-top: 15px;
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

.material-icons {
  z-index: 0;
}

#select-contrato__BV_label_ {
  margin: 0;
  padding: 0;
  color: rgb(110, 110, 110);
  font-size: 12px;
}

#select-contrato {
  margin-bottom: 10px;
}

.item-coluna-centralizada {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-importar-pdf {
  margin-top: 5px;
}

.arquivo-pdf {
  margin-top: 10px !important;
}

.custom-file-input:lang(en) ~ .custom-file-label::after {
  content: 'Importar';
}

.p-contrato {
  margin-top: 15px;
}

table#tabela-contrato .flip-list-move {
  transition: transform 0.4s;
}

table#tabela-boleto .flip-list-move {
  transition: transform 0.4s;
}
</style>
