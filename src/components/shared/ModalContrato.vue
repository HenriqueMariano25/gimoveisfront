<template>
  <div>
    <modal name="modal-contrato" width="60%" height="auto" :scrollable="true" :click-to-close="false"
           class="modal-adicionando-cliente">
      <h3>Editando contrato</h3>
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
              <!--                      class="input-nascimento"/>-->
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
        <b-tab title="Boletos">
          <b-row>
            <b-col>
              <b-table
                  id="tabela-boleto"
                  primary-key="id"
                  bordered
                  head-variant="dark"
                  sort-icon-left
                  :items="boletos"
                  :fields="fieldsBoletos"
                  show-empty
                  small
                  striped
                  hover
                  outlined
                  sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px)"
                  no-border-collapse
                  @row-clicked="item=>$set(item, '_showDetails', !item._showDetails)">
                <template #cell(data_vencimento)="row">
                  <label class="tr-contrato">{{ dayjs(row.item.data_vencimento).format('DD/MM/YYYY') }}</label>
                </template>
                <template #cell(valor)="row">
                  <label class="tr-contrato">R$ {{ row.item.valor.replace('.',',') }}</label>
                </template>
                <template #cell(status)="row">
                  <label class="tr-contrato">{{ row.item.status }}</label>
                </template>
                <template #cell(id)="row">
                  <label class="tr-contrato">{{ ("000000" + row.item.id).slice(-6) }}</label>
                </template>
                <template #cell(data_quitacao)="row">
                  <label v-if="row.item.data_quitacao != '' && row.item.data_quitacao != null" class="tr-contrato">
                    {{ dayjs(row.item.data_quitacao).format('DD/MM/YYYY') }}</label>
                  <label v-else class="tr-contrato"></label>
                </template>
                <template #cell(editar)="row">
                  <div class="item-coluna-centralizada">
                    <vs-button type="flat" color="dark" @mousedown.stop="mostrarModalEditarBoleto(row.item)" icon="edit"></vs-button>
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
          <vs-button color="#24a35a" type="filled" icon="save" class="botao-salvar" @click.native="editarContrato">
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
    <ModalEditarBoleto :idBoleto="idBoletoModal" :visivelBoleto="modal_visivel_boleto"
                       @esconder-modal-boleto="modal_visivel_boleto = $event" @buscarBoletos="buscarBoletos"/>
  </div>
</template>

<script>
import api from "../../services/api"
import dayjs from 'dayjs'
import {setValue} from "vue-currency-input";
import {converterDinherioFloat} from "../../methods/global";
import ModalEditarBoleto from "./ModalEditarBoleto";

export default {
  name: "ModalContrato",
  props:['idContrato','visivel'],
  components:{
    ModalEditarBoleto
  },
  data() {
    return{
      responsaveis: [],
      clientes: [],
      imoveis: [],
      contrato:{
        data_inicio:""
      },
      dayjs: dayjs,
      ativo_data_termino:false,
      boletos:[],
      fieldsBoletos: [
        {key: 'id', label: 'Código', sortable: true, class: 'text-center'},
        {key: 'data_vencimento', label: 'Vencimento', sortable: true, class: 'text-center'},
        {key: 'valor', label: 'Valor', sortable: true, class: 'text-center'},
        {key: 'data_quitacao', label: 'Data Quitação', sortable: true, class: 'text-center'},
        {key: 'status', label: 'Status', sortable: true, class: 'text-center'},
        {key: 'editar', label: '', class: 'text-center'},
      ],
      idBoletoModal:"",
      modal_visivel_boleto:false
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
    async buscarContrato() {
      await api.get('/contrato', {params: {idContrato: this.idContrato}}).then(consulta => {
        this.contrato = consulta.data[0]
        setValue(this.$refs.valor_boleto, consulta.data[0].valor_boleto)
      })
    },
    async buscarBoletos() {
      await api.get('/contrato/boletos', {params: {idContrato: this.idContrato}}).then(response => {
        this.boletos = response.data
      })
    },
    async inicializar(){
      this.buscarClientes()
      this.buscarResponsaveis()
      this.buscarImoveis()
      this.buscarContrato()
      this.buscarBoletos()
    },
    esconderModal(){
      this.$modal.hide('modal-contrato')
      this.$emit('esconder-modal', false)
      this.contrato = {}
    },
    mostrarModalEditarBoleto(boleto) {
      this.$modal.show('modal-editar-boleto')
      this.modal_visivel_boleto = true
      this.idBoletoModal = boleto.id
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
    validarCamposObrigatorio() {
      if (this.contrato['id_responsavel'] == "" || this.contrato['id_cliente'] == "" || this.contrato['id_imovel'] == "" ||
          this.contrato['data_inicio'] == "" || this.contrato['data_fim'] == "" ||
          this.contrato['valor_boleto'] == "" || this.contrato['data_vencimento'] == "") {
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
    importarPDF(event) {
      this.btn_importa_desabilitado = false
      this.files = event.target.files
      const formData = new FormData();
      for (const i of Object.keys(this.files)) {
        formData.append('files', this.files[i])
      }
      api.post(`/contrato/${this.contrato.id}/importar/pdf`, formData, {}).then((res) => {
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
  },
  watch:{
    'visivel': function (valor){
      if(valor)this.inicializar()
    },
    'contrato.data_inicio': function (inicio) {
      if(this.visivel) {
        if (inicio.length == 10) {
          this.ativo_data_termino = true
        } else {
          this.ativo_data_termino = false
          this.contrato.data_fim = ""
          this.contrato.vigencia = ""
        }
      }
    },
    'contrato.data_fim': function (fim) {
      if(this.visivel) {
        if (fim.length == 10) {
          let inicio = this.contrato.data_inicio
          this.contrato.vigencia = dayjs(fim).diff(inicio, 'month')
        } else {
          this.contrato.vigencia = ""
        }
      }
    },
  },
}
</script>

<style>
.input-personalizado {
  width: 100%;
  margin-bottom: 10px;
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
.arquivo-pdf {
  margin-top: 10px !important;
}
.p-contrato {
  margin-top: 15px;
}
.tr-contrato {
  margin-top: 6px;
  margin-bottom: 0px;
}
</style>
