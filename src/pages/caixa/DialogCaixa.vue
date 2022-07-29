e
<template>
  <v-dialog v-model="mostrar" persistent max-width="1000px">
    <v-card class="pa-3">
      <CabecalhoDialog
          :texto-cadastrando="editando ? 'Editando caixa' : 'Cadastrando caixa'"
          @fechar="cancelar()"
      />
      <v-row>
        <v-col class="pt-0">
          <v-form lazy-validation ref="formulario" v-model="valido">
            <v-row align="center" :class="{'mt-0': !$isMobile}">
              <v-col cols="12" xl="" lg="" md="">
                <v-text-field
                    label="Movimento*"
                    type="date"
                    outlined
                    dense
                    hide-details
                    name="movimento"
                    v-model="caixa.movimento"
                    :rules="[validacoes.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" xl="" lg="" md="">
                <v-text-field
                    label="Valor*"
                    ref="valor"
                    outlined
                    dense
                    hide-details
                    validate-on-blur
                    v-currency="{ precision: 2, autoDecimalMode: true, distractionFree: false, allowNegative: false,
                    currency:{prefix:'R$ '}}"
                    v-model="caixa.valor"
                    :rules="[validacoes.requiredValor, validacoes.required]"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" xl="auto" lg="auto" md="auto">
                <v-radio-group column dense hide-details class="mt-0 pt-0 radio-debito-credito"
                               v-model="caixa.id_debito_credito" :rules="[validacoes.required]">
                  <v-radio
                      label="Débito*"
                      :value="1"
                      class="mb-0"
                  ></v-radio>
                  <v-radio
                      label="Crédito*"
                      :value="2"
                      class="mb-0"
                  ></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row :class="{'mt-0': !$isMobile}">
              <v-col cols="12" xl="" lg="" md="">
                <v-autocomplete
                    :items="contas"
                    outlined
                    hide-details="auto"
                    label="Conta*"
                    item-value="id"
                    item-text="nome"
                    dense
                    v-model="caixa.id_conta"
                    :rules="[validacoes.required]"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" xl="" lg="" md="">
                <v-autocomplete
                    :items="imoveis"
                    outlined
                    hide-details="auto"
                    label="Imóvel"
                    item-value="id"
                    item-text="nome"
                    dense
                    v-model="caixa.id_imovel"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" xl="" lg="" md="">
                <v-text-field
                    label="Número do Documento"
                    outlined
                    dense
                    hide-details
                    v-model="caixa.numero_documento"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row :class="{'mt-0': !$isMobile}">
              <v-col cols="12" xl="" lg="" md="">
                <v-autocomplete
                    :items="historicos"
                    outlined
                    hide-details="auto"
                    label="Histórico"
                    item-value="id"
                    item-text="descricao"
                    dense
                    v-model="caixa.id_historico"
                    :rules="[validacoes.required]"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" xl="" lg="" md="">
                <v-text-field
                    label="Complemento Histórico"
                    outlined
                    dense
                    hide-details
                    v-model="caixa.complemento_historico"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>

      <RodapeDialog
          @cancelar="cancelar()" :editando="editando" @salvar="cadastrar()" @editar="editar()"

      >
      </RodapeDialog>
    </v-card>
  </v-dialog>
</template>

<script>
import CabecalhoDialog from "@/components/shared/Dialog/CabecalhoDialog";
import RodapeDialog from "@/components/shared/Dialog/RodapeDialog";

import api from "../../services/api";
import {setValue} from "vue-currency-input";
import dayjs from 'dayjs'

export default {
  name: "DialogCaixa",
  props: ['mostrar', 'dadosCaixa'],
  components: {
    CabecalhoDialog,
    RodapeDialog
  },
  data() {
    return {
      contas: [],
      imoveis: [],
      historicos: [],
      caixa: {
        movimento: null,
        valor: '0',
        id_debito_credito: null,
        id_imovel: null,
        id_conta: null,
        numero_documento: '',
        complemento_historico: '',
        id_historico: ''
      },
      editando: false,
      valido: false,
      validacoes: {
        required: value => !!value || '',
        requiredValor: value => this.$converterDinherioFloat(value) !== '0.00' || ''
      }
    }
  },
  mounted() {
    this.buscarContas()
    this.buscarImoveis()
    this.buscarHistoricos()
  },
  methods: {
    async buscarContas() {
      await api.get('/ajuste/conta').then(resp => {
        this.contas = resp.data
      })
    },
    async buscarImoveis() {
      await api.get('/imoveis/simples').then(resp => {
        this.imoveis = resp.data
      })
    },
    async buscarHistoricos() {
      await api.get('/ajuste/historico').then(resp => {
        this.historicos = resp.data
      })
    },
    cancelar() {
      this.$emit('cancelar')
    },

    async cadastrar() {
      const isValido = this.$refs.formulario.validate();

      if(isValido){
        let idUsuario = this.$store.state.usuario.id

        var caixaClonado = Object.assign({}, this.caixa)
        caixaClonado.valor = this.$converterDinherioFloat(this.caixa.valor)

        await api.post('/caixa', {caixa: caixaClonado, idUsuario: idUsuario}).then(resp => {
          let { caixa } = resp.data
          this.$emit('cadastrado', caixa)
        })
      }
    },

    async editar() {
      const isValido = this.$refs.formulario.validate();
      if(isValido){
        let idUsuario = this.$store.state.usuario.id

        var caixaClonado = Object.assign({}, this.caixa)
        caixaClonado.valor = this.$converterDinherioFloat(this.caixa.valor)

        await api.put('/caixa', {caixa: caixaClonado, idUsuario: idUsuario}).then(resp => {
          let { caixa } = resp.data
          this.$emit('editado', caixa)
        })
      }
    },
  },
  watch: {
    mostrar: function (valor) {
      if (valor === true) {
        if (Object.keys(this.dadosCaixa).length !== 0) {
          this.editando = true
          this.caixa = Object.assign({}, this.dadosCaixa)
          this.$nextTick(() => {
            let inputValor = this.$refs.valor
            setValue(inputValor, this.caixa.valor)
          })
        }else{
          this.editando = false
          this.caixa.movimento = dayjs().format('YYYY-MM-DD')
          this.$nextTick(() => {
            let inputValor = this.$refs.valor
            setValue(inputValor, '0.00')
          })

        }
      }else{
        this.$refs.formulario.reset();
      }
    }
  }
}
</script>

<style scoped>
.radio-debito-credito >>> label {

  margin-bottom: 0;
}


</style>