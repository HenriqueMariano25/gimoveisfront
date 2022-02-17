<template>
  <v-dialog v-model="mostrar" persistent max-width="1100px">
    <v-card class="pa-5">
      <v-row>
        <v-col>
          <v-row>
            <v-col>
              <h3 class="ma-0">{{ editando ? 'Editando fiador' : 'Cadastrando fiador' }}</h3>
            </v-col>
          </v-row>
          <v-form lazy-validation ref="formulario" v-model="valido">
            <v-row>
              <v-col cols="12" xl="5" lg="5" md="5">
                <v-text-field
                    label="Nome*"
                    outlined
                    dense
                    hide-details
                    v-model="fiador.nome"
                    :rules="[validacoes.required]"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" xl="" lg="" md="">
                <v-text-field
                    label="E-mail"
                    outlined
                    dense
                    hide-details
                    v-model="fiador.email"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="2">
                <v-autocomplete
                    :items="estadosCivis"
                    outlined
                    hide-details="auto"
                    label="Estado Civil"
                    item-value="id"
                    item-text="descricao"
                    dense
                    v-model="fiador.estado_civil"
                >
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" xl="3" lg="3" md="3">
                <v-text-field
                    label="Data de nascimento"
                    outlined
                    dense
                    hide-details
                    type="date"
                    v-model="fiador.data_nascimento"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" xl="3" lg="3" md="3">
                <v-text-field
                    label="CPF / CNPJ"
                    outlined
                    dense
                    hide-details
                    v-model="fiador.cpf_cnpj"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" xl="3" lg="3" md="3">
                <v-text-field
                    label="Identidade"
                    outlined
                    dense
                    hide-details
                    v-model="fiador.identidade"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" xl="3" lg="3" md="3">
                <v-text-field
                    label="Telefone"
                    outlined
                    dense
                    hide-details
                    v-model="fiador.telefone"
                    v-mask="['(##)####-####', '(##)#####-####']"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" xl="2" lg="2" md="2">
                <v-text-field
                    label="CEP"
                    outlined
                    dense
                    hide-details
                    v-model="fiador.cep"
                    v-mask="'#####-###'"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                    label="Rua"
                    outlined
                    dense
                    hide-details
                    v-model="fiador.rua"
                ></v-text-field>
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="2">
                <v-text-field
                    label="Número"
                    outlined
                    dense
                    hide-details
                    v-model="fiador.numero"
                ></v-text-field>
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="2">
                <v-text-field
                    label="UF"
                    outlined
                    dense
                    hide-details
                    v-model="fiador.estado"
                    maxlength="2"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" xl="4" lg="4" md="4">
                <v-text-field
                    label="Bairro"
                    outlined
                    dense
                    hide-details
                    v-model="fiador.bairro"
                ></v-text-field>
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="4">
                <v-text-field
                    label="Cidade"
                    outlined
                    dense
                    hide-details
                    v-model="fiador.cidade"
                ></v-text-field>
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="4">
                <v-text-field
                    label="Complemento"
                    outlined
                    dense
                    hide-details
                    v-model="fiador.complemento"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
          <v-row :justify="$isMobile ? 'space-between' : 'end'">
            <v-col cols="auto">
              <v-btn color="var(--btn-salvar)" dark large @click="editando ? editarFiador() : cadastrarFiador()">
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
import api from "../../services/api"

export default {
  name: "DialogFiador",
  props: ['mostrar', 'idContrato', 'dados'],
  data() {
    return {
      editando: false,
      validacoes: {
        required: value => !!value || '',
      },
      estadosCivis: [],
      fiador: {
        nome: "",
        email: "",
        estado_civil: null,
        data_nascimento: "",
        cpf_cnpj: "",
        identidade: "",
        cep: "",
        rua: "",
        numero: "",
        bairro: "",
        estado: "",
        cidade: "",
        complemento: "",
        telefone: ""
      },
      valido: false
    }
  },
  methods: {
    async buscarEstadosCivis() {
      await api.get('/estados_civis').then(resp => {
        this.estadosCivis = resp.data
      })
    },

    cancelar() {
      this.$emit('cancelar')
    },

    async cadastrarFiador() {
      let idUsuario = this.$store.state.usuario.id
      await api.post(`/contrato/fiador/cadastrar`, {
        fiador: this.fiador,
        idContrato: this.idContrato,
        idUsuario: idUsuario
      }).then(resp => {
        let {fiador} = resp.data
        this.$emit('cadastrado', fiador)
      })
    },

    async editarFiador() {
      let idUsuario = this.$store.state.usuario.id
      await api.post(`/contrato/fiador/editar`, {fiador: this.fiador, idUsuario: idUsuario}).then(resp => {
        let {fiador} = resp.data
        this.$emit('editado', fiador)
      })
    }
  },
  watch: {
    mostrar: async function (valor) {
      if (valor === true) {
        this.buscarEstadosCivis()
        if (Object.keys(this.dados).length > 0) {
          this.fiador = Object.assign({}, this.dados)
          this.editando = true
        } else {
          this.editando = false
        }
      }else{
        this.$refs.formulario.reset()
      }
    }
  }
}
</script>

<style scoped>

</style>