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
    <Carregando :visivel="carregandoVisivel" :style="{ 'height':'198px', 'line-height': '200px' }"></Carregando>
    <b-row>
      <b-col>
        <vs-input label="Movimento*" type="date" class="input-nascimento" v-model="caixa.movimento"/>
      </b-col>
      <b-col>
        <vs-input
            label-placeholder="Valor*"
            ref="valor"
            class="input-personalizado"
            v-model="caixa.valor"
            v-currency="{ precision: 2, autoDecimalMode: true, distractionFree: false, allowNegative: false,
                    currency:{prefix:'R$ '} }"/>
      </b-col>
      <b-col cols="auto" class="debito_credito">
        <b-form-radio-group v-slot="{ ariaDescribedby }" v-model="caixa.id_debito_credito">
          <b-row>
            <b-col>
              <b-form-radio :aria-describedby="ariaDescribedby" value="1">Débito*</b-form-radio>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-radio :aria-describedby="ariaDescribedby" value="2">Crédito*</b-form-radio>
            </b-col>
          </b-row>

        </b-form-radio-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group id="select-caixa" label="Conta*">
          <b-form-select value-field="id" text-field="nome" v-model="caixa.id_conta" :options="contas">
            <template #first>
              <b-form-select-option :value="null">Selecione</b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group id="select-caixa" label="Imóvel">
          <b-form-select value-field="id" text-field="nome" v-model="caixa.id_imovel" :options="imoveis">
            <template #first>
              <b-form-select-option :value="null">Selecione</b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col>
        <vs-input label-placeholder="Numero do Documento*" v-model="caixa.numero_documento"/>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <!--        <vs-input label-placeholder="Histórico*" v-model="caixa.historico"/>-->
        <b-form-group id="select-caixa" label="Históricos">
          <b-form-select value-field="id" text-field="descricao" v-model="caixa.historico" :options="historicos">
            <template #first>
              <b-form-select-option :value="null">Selecione</b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
      </b-col>
      <b-col>
        <vs-input label-placeholder="Complemento Histórico" v-model="caixa.complemento_historico"/>
      </b-col>
    </b-row>
    <b-row align-h="end" class="mt-2">
      <b-col cols="auto">
        <vs-button v-if="caixa.id == ''" color="#24a35a" type="filled" icon="save" class="botao-salvar"
                   @click.native="cadastrar">
          Salvar
        </vs-button>
        <vs-button v-else color="#24a35a" type="filled" icon="save" class="botao-salvar" @click.native="editar">
          Editar
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
import {converterDinherioFloat, validarCamposObrigatorios} from "../../methods/global";
import Carregando from "@/components/shared/Carregando";
import {setValue} from "vue-currency-input";

export default {
  name: "ModalCaixa",
  props: ['dados', 'historicos'],
  components: {Carregando},
  data() {
    return {
      caixa: {
        id: '',
        movimento: '',
        valor: '',
        id_debito_credito: null,
        id_imovel: null,
        historico: null,
        complemento_historico: '',
        id_conta: null,
        numero_documento: ''
      },
      imoveis: [],
      contas: [],
      carregandoVisivel: true
    }
  },
  methods: {
    esconderModal() {
      this.caixa = {}
      this.$modal.hide('modal-caixa')
      this.carregandoVisivel = true
    },
    async inicializar() {
      this.carregandoVisivel = true
      if (this.dados) {
        this.caixa = this.dados
        setValue(this.$refs.valor, this.caixa.valor)
      }
      this.buscarImoveis()
      await this.buscarContas().then(() => this.carregandoVisivel = false)
    },
    async cadastrar() {
      let idUsuario = this.$store.state.usuario.id
      var caixaClonado = Object.assign({}, this.caixa)
      caixaClonado.valor = converterDinherioFloat(this.caixa.valor)
      let camposValidar = {
        'movimento': this.caixa.movimento,
        'histórico': this.caixa.historico,
        'débito ou crédito': this.caixa.id_debito_credito,
        'valor': caixaClonado.valor,
        'conta': this.caixa.id_conta
      }
      await validarCamposObrigatorios(camposValidar).then(() => {
        api.post('/caixa', {caixa: caixaClonado, idUsuario: idUsuario}).then(() => {
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
      }).catch(erros => {
        this.$vs.notify({
          text: `Esses campos estão vazios ou errados: ${erros}`,
          position: 'top-center',
          color: 'danger',
          time: 6000,
          icon: 'check_circle_outline'
        })
      })

    },
    async editar() {
      let idUsuario = this.$store.state.usuario.id
      var caixaClonado = Object.assign({}, this.caixa)
      caixaClonado.valor = converterDinherioFloat(this.caixa.valor)
      let camposValidar = {
        'movimento': this.caixa.movimento,
        'histórico': this.caixa.historico,
        'débito ou crédito': this.caixa.id_debito_credito,
        'valor': caixaClonado.valor,
        'conta': this.caixa.id_conta
      }
      await validarCamposObrigatorios(camposValidar).then(() => {
        api.put('/caixa', {caixa: caixaClonado, idUsuario: idUsuario}).then(() => {
          this.$vs.notify({
            text: `Registro editado com sucessoooooo !`,
            position: 'top-center',
            color: 'warning',
            time: 6000,
            icon: 'check_circle_outline'
          })
          this.recarregarDados()
          this.esconderModal()
        })
      }).catch(erros => {
        this.$vs.notify({
          text: `Esses campos estão vazios ou errados: ${erros}`,
          position: 'top-center',
          color: 'danger',
          time: 6000,
          icon: 'check_circle_outline'
        })
      })
    },

    async buscarImoveis() {
      await api.get('/imoveis/simples').then(consulta => {
        this.imoveis = consulta.data
      })
    },
    async buscarContas() {
      await api.get('/ajuste/conta').then(consulta => {
        this.contas = consulta.data
      })
    },
    recarregarDados() {
      this.$emit('recarregarDados')
    }
  }
}
</script>

<style>
.modal-caixa {
  margin-left: 25px;
}

.debito_credito {
  padding-top: 10px;
}

#select-caixa {
  margin-bottom: 10px;
}

#select-caixa__BV_label_ {
  margin: 0;
  padding: 0;
  color: rgb(110, 110, 110);
  font-size: 12px;
}

</style>