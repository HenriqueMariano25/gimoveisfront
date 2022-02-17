<template>
  <v-dialog v-model="mostrar" persistent max-width="1100px">
    <v-card class="pa-5">
      <v-row>
        <v-col>
          <v-row>
            <v-col>
              <h3 class="ma-0">{{ editando ? `Editando boleto: ${("000000" + boleto.id).slice(-6)}` : 'Cadastrando boleto' }}</h3>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" xl="3" lg="3" md="3">
              <v-text-field
                  label="Data de vencimento"
                  outlined
                  dense
                  hide-details
                  type="date"
                  v-model="boleto.data_vencimento"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" xl="3" lg="3" md="3">
              <v-text-field
                  label="Data de quitação"
                  outlined
                  dense
                  hide-details
                  type="date"
                  v-model="boleto.data_quitacao"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" xl="3" lg="3" md="3">
              <v-text-field
                  label="Valor"
                  outlined
                  dense
                  hide-details
                  v-model="boleto.valor"
                  ref="valor_boleto"
                  v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                        allowNegative: false, currency:'BRL'}"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" xl="3" lg="3" md="3">
              <v-autocomplete
                  :items="statusBoleto"
                  outlined
                  hide-details="auto"
                  label="Status"
                  item-value="id"
                  item-text="descricao"
                  dense
                  v-model="boleto.id_status_boleto"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row :justify="$isMobile ? 'space-between' : 'end'">
            <v-col cols="auto">
              <v-btn color="var(--btn-salvar)" dark large @click="editando ? editarBoleto() : cadastrarBoleto()">
                <v-icon class="mr-1">
                  mdi-content-save
                </v-icon>
                {{ !$isMobile ? 'Salvar' : '' }}
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn dark color="var(--btn-cancelar)" large @click="cancelar">
                <v-icon class="mr-1">
                  mdi-close
                </v-icon>
                {{ !$isMobile ? 'Cancelar' : '' }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import {setValue} from "vue-currency-input";
import api from "../../services/api";

export default {
  name: "DialogBoleto",
  props: ['mostrar', 'dados', 'idContrato'],
  data(){
    return{
      editando: false,
      boleto: {
        valor: "",
        valor_formatado: "",
        data_vencimento: "",
        data_quitacao: "",
        id: "",
        id_status_boleto: null,
      },
      statusBoleto: []
    }
  },
  methods:{
    cancelar(){
      this.boleto = {}
      this.$emit('cancelar')
    },
    async buscarStatusBoleto() {
      await api.get('/contrato/boleto/status').then(resp => {
        this.statusBoleto = resp.data
      })
    },
    async editarBoleto(){
      let idUsuario = this.$store.state.usuario.id
      if (this.boleto.data_quitacao == null) {
        this.boleto.data_quitacao = ''
      }
      let boletoCopia = Object.assign({}, this.boleto)
      boletoCopia.valor = this.$converterDinherioFloat(this.boleto.valor)

      api.post('/contrato/boleto/editar', {boleto: boletoCopia, idUsuario:idUsuario}).then(resp => {
        let { boleto } = resp.data
        this.$emit('editado', boleto)
      })
    },

    async cadastrarBoleto(){
      let idUsuario = this.$store.state.usuario.id
      if (this.boleto.data_quitacao == null) {
        this.boleto.data_quitacao = ""
      }

      let boletoCopia = Object.assign({}, this.boleto)
      boletoCopia.valor = this.$converterDinherioFloat(this.boleto.valor)

      await api.post('/contrato/boleto/cadastrar', {
        boleto: boletoCopia,
        idContrato: this.idContrato,
        idUsuario: idUsuario
      }).then(resp => {
        let { boleto } = resp.data
        this.$emit('cadastrado', boleto)
      })
    }
  },
  watch: {
    mostrar: async function (valor) {
      if (valor === true) {
        this.buscarStatusBoleto()
        if (Object.keys(this.dados).length > 0) {
          this.boleto = Object.assign({}, this.dados)
          this.$nextTick(() => {
            setValue(this.$refs.valor_boleto, this.dados.valor)
          })
          this.editando = true
        } else {
          this.editando = false
        }
      }
    }
  }
}
</script>

<style scoped>

</style>