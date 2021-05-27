<template>
  <modal
      name="modal-caixa"
      width="90%"
      height="auto"
      :scrollable="true"
      :click-to-close="false"
      class="modal-caixa"
      @opened="inicializar"
  >
    <h3>Caixa</h3>
    <b-row>
      <b-col>
        <vs-input label="Movimento*" type="date" class="input-nascimento" v-model="caixa.movimento"/>
      </b-col>
      <b-col>
        <vs-input
            label-placeholder="Valor*"
            ref="despesa_valor"
            class="input-personalizado"
            v-model="caixa.valor"
            v-currency="{ precision: 2, autoDecimalMode: true, distractionFree: false, allowNegative: false,
                    currency:{prefix:'R$ '} }"/>
      </b-col>
      <b-col cols="auto" class="debito_credito">
        <b-form-radio-group v-slot="{ ariaDescribedby }" v-model="caixa.debitoCredito">
          <b-row>
            <b-col>
              <b-form-radio :aria-describedby="ariaDescribedby" value="débito">Débito*</b-form-radio>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-radio :aria-describedby="ariaDescribedby" value="crédito">Crédito*</b-form-radio>
            </b-col>
          </b-row>

        </b-form-radio-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group id="select-caixa" label="Conta">
          <b-form-select value-field="id" text-field="descricao" v-model="caixa.conta">
            <template #first>
              <b-form-select-option :value="null">Selecione</b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group id="select-caixa" label="Imóvel">
          <b-form-select value-field="id" text-field="nome" v-model="caixa.idImovel" :options="imoveis">
            <template #first>
              <b-form-select-option :value="null">Selecione</b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <vs-input label-placeholder="Histórico*" v-model="caixa.historico"/>
      </b-col>
      <b-col>
        <vs-input label-placeholder="Complemento Histórico" v-model="caixa.complementoHistorico"/>
      </b-col>
    </b-row>
    <b-row align-h="end">
      <b-col cols="auto">
        <vs-button color="#24a35a" type="filled" icon="save" class="botao-salvar" @click.native="cadastrar">
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
</template>

<script>

import api from "../../services/api"
import {converterDinherioFloat} from "../../methods/global";

export default {
  name: "ModalCaixa",
  data() {
    return {
      caixa: {
        movimento: '',
        valor: '',
        debitoCredito: '',
        conta: null,
        idImovel: null,
        historico: '',
        complementoHistorico: ''
      },
      imoveis:[]
    }
  },
  methods: {
    esconderModal() {
      this.$modal.hide('modal-caixa')
    },
    async inicializar(){
      this.buscarImoveis()
    },
    async cadastrar() {
      let idUsuario = this.$store.state.usuario.id
      this.caixa.valor = converterDinherioFloat(this.caixa.valor)
      await api.post('/caixa', {caixa: this.caixa, idUsuario: idUsuario}).then(() => {
        this.$vs.notify({
          text: `Registro cadastrado com sucesso !`,
          position: 'top-center',
          color: 'success',
          time: 6000,
          icon: 'check_circle_outline'
        })
        this.recarregarDados()
        this.esconderModal()
      })

    },
    async buscarImoveis(){
      await api.get('/imoveis/simples').then(consulta => {
        this.imoveis = consulta.data
        console.log(consulta)
      })
    },
    recarregarDados(){
      this.$emit('recarregarDados')
    }
  }
}
</script>

<style scoped>
.modal-caixa {
  margin-left: 25px;
}

.debito_credito {
  padding-top: 10px;
}
</style>