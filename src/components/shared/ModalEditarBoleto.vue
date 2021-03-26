<template>
  <modal name="modal-editar-boleto"
         width="90%"
         height="auto"
         :scrollable="true"
         :click-to-close="false"
         class="modal-editando-boleto"
  >
    <b-container>
      <b-row>
        <b-col>
          <h4>Editando boleto: {{ ("000000" + idBoleto).slice(-6) }}</h4>
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
          <vs-input label-placeholder="Valor" ref="inputValor" v-model="boleto.valor" class="input-personalizado" v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                        allowNegative: false, currency:'BRL'}"/>
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
                     @click="esconderModal">
            Cancelar
          </vs-button>
        </b-col>
      </b-row>
    </b-container>
  </modal>
</template>

<script>
import api from "../../services/api";
import {setValue} from "vue-currency-input";
import {converterDinherioFloat} from "../../methods/global";

export default {
  name: "ModalEditarBoleto",
  props:['idBoleto', 'visivelBoleto'],
  data() {
    return {
      boleto: {
        valor: "",
        valor_formatado: "",
        data_vencimento: "",
        data_quitacao: "",
        id: "",
        id_status_boleto: null,
        status_boleto: [],
      },
    }
  },
  methods:{
    async buscarStatusBoleto() {
      await api.get('/contrato/boleto/status').then(response => {
        this.status_boleto = response.data
      })
    },
    async buscarBoleto() {
      api.get('/contrato/boleto', {params: {idBoleto: this.idBoleto}}).then(response => {
        this.boleto = response.data[0]
        setValue(this.$refs.inputValor, response.data[0].valor)
      })
    },
    async inicializar(){
      this.buscarStatusBoleto()
      this.buscarBoleto()
    },
    editarBoleto() {
      if (this.boleto.data_quitacao == null) {
        this.boleto.data_quitacao = ''
      }
      this.boleto.valor = converterDinherioFloat(this.boleto.valor)
      api.post('/contrato/boleto/editar', {boleto: this.boleto}).then(() => {
        this.esconderModal()
      })
    },
    esconderModal(){
      this.$modal.hide('modal-editar-boleto')
      this.$emit('esconder-modal-boleto', false)
      this.$emit('buscarBoletos')
      this.boleto = {}
    },
  },
  watch: {
    'visivelBoleto': function (valor) {
      if (valor) this.inicializar()
    },
  }
}
</script>

<style scoped>

.modal-editando-boleto{
  margin-left:25px;
}

</style>
