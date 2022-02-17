<template>
  <v-dialog v-model="mostrar" persistent max-width="1100px">
    <v-card class="pa-5">
      <v-row>
        <v-col>
          <v-row>
            <v-col>
              <h3 class="ma-0">{{ editando ? 'Editando histórico' : 'Cadastrando histórico' }}</h3>
            </v-col>
          </v-row>
          <v-form lazy-validation ref="formulario" v-model="valido">
            <v-row>
              <v-col>
                <v-text-field
                    label="Descrição do histórico*"
                    outlined
                    dense
                    hide-details
                    v-model="historico.descricao"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row :justify="$isMobile ? 'space-between' : 'end'">
              <v-col cols="auto">
                <v-btn color="var(--btn-salvar)" dark large
                       @click="editando ? editarHistorico() : cadastrarHistorico()">
                  <v-icon class="mr-1">mdi-content-save</v-icon>
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
          </v-form>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import api from "../../services/api";

export default {
  name: "DialogHistorico",
  props: ['mostrar', 'dados'],
  data() {
    return {
      editando: false,
      valido: false,
      historico: {
        descricao: null
      },
    }
  },
  methods: {
    async cadastrarHistorico() {
      const isValido = this.$refs.formulario.validate()

      if (isValido) {
        let idUsuario = this.$store.state.usuario.id
        await api.post('/ajuste/historico', {historico: this.historico, idUsuario: idUsuario}).then(resp => {
          let { historico } = resp.data
          this.historico = {}
          this.$emit('cadastrado', historico)
        })
      }
    },
    async editarHistorico() {
      const isValido = this.$refs.formulario.validate()

      if (isValido) {
        let idUsuario = this.$store.state.usuario.id
        await api.put('/ajuste/historico', {historico: this.historico, idUsuario: idUsuario}).then(resp => {
          let { historico } = resp.data
          this.historico = {}
          this.$emit('editado', historico)
        })
      }
    },
    cancelar() {
      this.$emit('cancelar')
      this.historico = {}
    }
  },
  watch: {
    mostrar: async function (valor) {
      if (valor === true) {
        if (this.dados) {
          this.editando = true
          this.historico = Object.assign({}, this.dados)
        } else {
          this.editando = false
        }
      } else {
        this.$refs.formulario.reset()
      }
    },
  }
}
</script>

<style scoped>

</style>