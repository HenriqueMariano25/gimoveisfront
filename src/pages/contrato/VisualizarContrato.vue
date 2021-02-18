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
            primary-key="nome_cliente"
            :tbody-transition-props="transProps"
            tbody-tr-class="testesao"
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
            sticky-header
            no-border-collapse
            @row-clicked="item=>$set(item, '_showDetails', !item._showDetails)">
          <template #cell(id)="row">
            <p class="tr-contrato">{{("0000" + row.item.id).slice(-4) }}</p>
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
            <p class="tr-contrato">{{ row.item.status }}</p>
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
          <template #row-details="row">
            <b-card>
              <vs-button target :href="row.item.url" color="#5498ff" type="filled" icon="description">
                Contrato
              </vs-button>
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
    <modal name="modal-contrato" width="60%" height="auto" :scrollable="true"

           class="modal-adicionando-responsavel">
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
              <vs-input label-placeholder="Valor do Boleto" v-model="contrato.valor_boleto" class="input-personalizado"
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
        <b-tab title="Boletos">
          <b-row>
            <b-col>
              <b-table
                  id="tabela-boleto"
                  primary-key="data_vencimento"
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
                  sticky-header
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
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
      <b-row>
        <b-col cols="6" class="mr-auto">
          <b-form @submit.prevent="importarContrato" enctype="multipart/form-data" v-if="editar == true">
            <b-row>
              <b-col >
<!--                <b-form-file type="file" @change="onSelect" ref="file" class="mt-3 arquivo-pdf" plain accept=".pdf"></b-form-file>-->
                <b-form-file @change="importarPDF" type="file" ref="file" class="mt-3 arquivo-pdf" accept=".pdf"
                    placeholder="Escolha um arquivo para importar"
                    drop-placeholder="Solte o arquivo aqui!">
                </b-form-file>
              </b-col>
            </b-row>
          </b-form>
        </b-col>
        <b-col cols="auto">
          <vs-button v-if="editar == true" color="#24a35a" type="filled" icon="save" class="botao-salvar"
                     @click="editarContrato">Salvar
          </vs-button>
          <vs-button v-else color="#24a35a" type="filled" icon="save" class="botao-salvar"
                     @click="cadastrarContrato">
            Salvar
          </vs-button>
        </b-col>
        <b-col cols="auto">
          <vs-button color="#707070" type="filled" icon="clear" class="botao-salvar" @click="esconderModal">
            Cancelar
          </vs-button>
        </b-col>

      </b-row>
    </modal>
    <modal name="modal-editar-boleto" width="60%" height="auto" :scrollable="true" :click-to-close="false"
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
                       @click="editarBoleto">
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
        {key: 'editar', label: '', thClass: 'text-center'},
        {key: 'deletar', label: '', thClass: 'text-center'},
      ],
      fieldsBoletos: [
        {key: 'id', label: 'Código', sortable: true, class: 'text-center'},
        {key: 'data_vencimento', label: 'Vencimento', class: 'text-center'},
        {key: 'valor', label: 'Valor', class: 'text-center'},
        {key: 'data_quitacao', label: 'Data Quitação', class: 'text-center'},
        {key: 'status', label: 'Status', class: 'text-center'},
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
        carenica: "",
        garantia: "",
        fiador: "",
        locador: ""
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
      btn_importa_desabilitado:true
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
      await api.get('/contratos').then(response => {
        this.items = response.data
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
        console.log(response)
        this.contrato = response.data[0]
        this.buscarBoletos(id)
        this.mostrarModal()
        this.editar = true
      })
    },
    async editarContrato() {
      if (this.validarCamposObrigatorio()) {
        await api.post(`/contrato/editar`, {
          contrato: this.contrato,
        }).then(response => {
          console.log(response)
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

    mostrarModal() {
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
      this.limparModal()
      this.editar = false
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
        this.$vs.notify({
          text: `PDF importado com sucesso!`,
          position: 'top-center',
          color: 'success',
          time: 4000,
          icon: 'check_circle_outline'
        })
      })
    },

    // async importarContrato() {
    //   const formData = new FormData();
    //   for (const i of Object.keys(this.files)) {
    //     formData.append('files', this.files[i])
    //   }
    //   api.post(`/contrato/${this.contrato.id}/importar/pdf`, formData, {}).then((res) => {
    //     console.log(res)
    //     this.$vs.notify({
    //       text: `PDF importado com sucesso!`,
    //       position: 'top-center',
    //       color: 'success',
    //       time: 4000,
    //       icon: 'check_circle_outline'
    //     })
    //   })
    // },

    async cadastrarContrato() {
      if (this.validarCamposObrigatorio()) {
        if (this.validarDataInicioFim()) {
          await api.post('/contrato/cadastrar', {contrato: this.contrato}).then(() => {
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
    'contrato.data_inicio': {
      handler: function (inicio) {
        if (inicio.length == 10) {
          this.ativo_data_termino = true
        } else {
          this.ativo_data_termino = false
          this.contrato.data_fim = ""
          this.contrato.vigencia = ""
        }
      }
    },
    'contrato.data_fim': {
      handler: function (fim) {
        if (fim.length == 10) {
          let inicio = this.contrato.data_inicio
          this.contrato.vigencia = dayjs(fim).diff(inicio, 'month')
        } else {
          this.contrato.vigencia = ""
        }
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
  border: 1px solid rgb(220, 220, 220);
  padding: 0;
  margin: 0;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 5px 5px 20px rgb(200, 200, 200);
}

.tabela-responsaveis {
  background-color: white;
  margin: 0;
  padding: 0;
  margin-bottom: 10px;
}

.col-tabela-responsaveis {
  padding-top: 15px;
}

.divider-personalizado {
  border-top: 1px solid rgb(200, 200, 200);
  padding-top: 10px;
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

.btn-importar-pdf{
  margin-top:5px;
}

.arquivo-pdf{
  margin-top: 10px !important;
}
.custom-file-input:lang(en) ~ .custom-file-label::after {
  content: 'Importar';
}
table#tabela-contrato .flip-list-move {
  transition: transform 0.4s;
}
table#tabela-boleto .flip-list-move {
  transition: transform 0.4s;
}
</style>
