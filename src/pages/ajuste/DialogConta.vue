<template>
  <v-dialog v-model="mostrar" persistent max-width="1100px">
    <v-card class="pa-5">
      <v-row>
        <v-col>
          <v-row>
            <v-col>
              <h3 class="ma-0">{{ editando ? 'Editando conta' : 'Cadastrando conta' }}</h3>
            </v-col>
          </v-row>
          <v-form lazy-validation ref="formulario" v-model="valido">
            <v-row>
              <v-col>
                <v-text-field
                    label="Nome da empresa*"
                    outlined
                    dense
                    hide-details
                    v-model="conta.nome"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row justify="end">
              <v-col cols="auto">
                <v-btn color="var(--btn-salvar)" dark large
                       @click="editando ? editarConta() : cadastrarConta()">
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
  name: "DialogConta",
  props: ['mostrar', 'dados'],
  data() {
    return {
      editando: false,
      valido: false,
      conta: {
        nome: null
      },
    }
  },
  methods: {
    async cadastrarConta() {
      const isValido = this.$refs.formulario.validate()

      if (isValido) {
        let idUsuario = this.$store.state.usuario.id
        await api.post('/ajuste/conta', {conta: this.conta, idUsuario: idUsuario}).then(resp => {
          let { conta } = resp.data
          this.conta = {}
          this.$emit('cadastrado', conta)
        })
      }
    },
    async editarConta() {
      const isValido = this.$refs.formulario.validate()

      if (isValido) {
        let idUsuario = this.$store.state.usuario.id
        await api.put('/ajuste/conta', {conta: this.conta, idUsuario: idUsuario}).then(resp => {
          let {conta} = resp.data
          this.conta = {}
          this.$emit('editado', conta)
        })
      }
    },
    cancelar() {
      this.$emit('cancelar')
      this.conta = {}
    }
  },
  watch: {
    mostrar: async function (valor) {
      if (valor === true) {
        if (this.dados) {
          this.editando = true
          this.conta = Object.assign({}, this.dados)
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