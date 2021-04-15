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
          <b-form-group id="select-boleto" label="Status">
            <b-form-select v-model="boleto.id_status_boleto" :options="status_boleto" value-field="id"
                           text-field="descricao">
              <template #first>
                <b-form-select-option :value="null" disabled>Selecione</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4">
          <vs-input label-placeholder="Valor" ref="inputValor" v-model="boleto.valor" class="input-personalizado"
                    v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                        allowNegative: false, currency:'BRL'}"
          />
        </b-col>
        <b-col cols="4" v-if="boleto.juros_multa">
          <vs-input label-placeholder="Valor c/ juros" ref="inputValorJuros" v-model="boleto.valor_juros" class="input-personalizado"
                    v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                        allowNegative: false, currency:'BRL'}" readonly
          />
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
                     @click.native="esconderModal">
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
  props: ['idBoleto', 'visivelBoleto'],
  data() {
    return {
      boleto: {
        valor: "",
        data_vencimento: "",
        data_quitacao: "",
        id: "",
        id_status_boleto: null,
        juros_multa: false,
      },
      status_boleto: [],
    }
  },
  methods: {
    async buscarStatusBoleto() {
      await api.get('/contrato/boleto/status').then(response => {
        this.status_boleto = response.data
      })
    },
    async buscarBoleto() {
      await api.get('/contrato/boleto', {params: {idBoleto: this.idBoleto}}).then(response => {
        new Promise((resolve) => {resolve(this.boleto = response.data[0])}).then(() => {
          if(this.boleto.juros_multa){setValue(this.$refs.inputValorJuros, response.data[0].valor_juros)}
        })
        setValue(this.$refs.inputValor, response.data[0].valor)
      })
    },
    async inicializar() {
      this.buscarStatusBoleto()
      this.buscarBoleto()
    },
    editarBoleto() {
      if (this.boleto.data_quitacao == null) {
        this.boleto.data_quitacao = ''
      }
      this.boleto.valor = converterDinherioFloat(this.boleto.valor)
      if(this.boleto.valor_juros) this.boleto.valor_juros = converterDinherioFloat(this.boleto.valor_juros)
      api.post('/contrato/boleto/editar', {boleto: this.boleto}).then(() => {
        this.esconderModal()
      })
    },
    esconderModal() {
      this.$modal.hide('modal-editar-boleto')
      this.$emit('esconder-modal-boleto', false)
      this.$emit('buscarBoletos')
      this.$emit('recarregarInformacoes')
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

<style>

.modal-editando-boleto {
  margin-left: 25px;
}

.input-personalizado {
  width: 100%;
  margin-bottom: 10px;
}

.botao-salvar {
  width: 100%;
  margin-top: 5px;
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

#select-boleto {
  margin-bottom: 10px;
}

#select-boleto__BV_label_ {
  margin: 0;
  padding: 0;
  color: rgb(110, 110, 110);
  font-size: 12px;
}

.vs-con-input-label {
  width: 100%;
}

.vm--modal {
  margin-top: -20px !important;
  bottom: 25px;
  padding: 25px;
}

</style>
