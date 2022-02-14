<template>
  <v-dialog v-model="mostrar" persistent max-width="1200px">
    <v-card class="pa-5">
      <v-row>
        <v-col>
          <v-row>
            <v-col>
              <h3 class="ma-0">{{ editando ? 'Editando usuário' : 'Cadastrando usuário' }}</h3>
            </v-col>
          </v-row>
          <v-form lazy-validation ref="formulario" v-model="valido">
            <v-row>
              <v-col cols="12" xl="6" lg="6" md="6">
                <v-text-field
                    label="Nome do operador*"
                    outlined
                    dense
                    hide-details
                    v-model="usuario.nome"
                    :rules="[validacoes.required]"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" xl="6" lg="6" md="6">
                <v-text-field
                    label="Usuário*"
                    outlined
                    dense
                    hide-details
                    v-model="usuario.usuario"
                    :rules="[validacoes.required]"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" xl="6" lg="6" md="6">
                <v-text-field
                    label="Email*"
                    outlined
                    dense
                    hide-details
                    v-model="usuario.email"
                    :rules="[validacoes.required]"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" xl="6" lg="6" md="6">
                <v-autocomplete
                    :items="tiposPermissoes"
                    outlined
                    hide-details="auto"
                    label="Permissao*"
                    item-value="value"
                    item-text="text"
                    dense
                    v-model="usuario.permissao"
                    :rules="[validacoes.required]"
                >
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" xl="6" lg="6" md="6" v-if="!editando">
                <v-text-field
                    label="Senha*"
                    outlined
                    dense
                    type="password"
                    hide-details
                    v-model="usuario.senha"
                    :rules="[validacoes.required]"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row :justify="$isMobile ? 'space-between' : 'end'">
              <v-col cols="auto">
                <v-btn color="var(--btn-salvar)" dark large @click="editando ? editarUsuario() : cadastrarUsuario(false)">
                  <v-icon class="mr-1">mdi-content-save</v-icon>
                  {{ !$isMobile ? 'Salvar' : '' }}
                </v-btn>
              </v-col>
              <v-col cols="auto" v-if="!editando">
                <v-btn color="var(--btn-salvar)" dark large @click="cadastrarUsuario(true)">
                  <v-icon :class=" $isMobile ? '' : 'mr-1' ">mdi-content-save-move</v-icon>
                  {{ !$isMobile ? 'Salvar e sair' : '' }}
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn dark color="var(--btn-cancelar)" large @click="cancelar()">
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
  name: "DialogUsuario",
  props: ['mostrar', 'idUsuario'],
  data(){
    return{
      editando: false,
      valido: false,
      usuario: {
        nome: "",
        usuario: "",
        email: "",
        permissao: null,
        senha: "",
      },
      validacoes: {
        required: value => !!value || '',
      },
      tiposPermissoes: [],
      usuarioParaAdicionar: {},
      adicionaUsuarioAItens: false,
      mostrarAlerta: false,
      funcao: ''
    }
  },
  created() {
    this.buscarTiposPermissao()
  },
  methods:{
    async buscarTiposPermissao() {
      await api.get('/usuarios/tipos_permissao').then(resp => {
        this.tiposPermissoes = resp.data
      })
    },

    cancelar(){
      if(this.adicionaUsuarioAItens){
        this.$emit('cancelar', this.usuarioParaAdicionar)
      }else{
        this.$emit('cancelar')
      }
      this.usuarioParaAdicionar = {}
      this.adicionaUsuarioAItens = false
    },


    async cadastrarUsuario(sair) {
      const isValido = this.$refs.formulario.validate()

      if(isValido){
        let idUsuario = this.$store.state.usuario.id
        await api.post('/usuario/cadastrar', {
          usuario: this.usuario,
          idUsuario: idUsuario
        }).then(resp => {
          let { usuario } = resp.data

          if (sair) {
            this.$emit('cadastrado', {usuario: usuario, notificar: true})
            this.usuario = {}
          } else {
            this.usuario.id = usuario.id
            this.usuarioParaAdicionar = usuario
            this.adicionaUsuarioAItens = true
            this.funcao = 'cadastrado'
            this.palavraChave = 'usuário'
            this.mostrarAlerta = true
            this.editando = true
          }
        }).catch(erro => {
          let mensagem = erro.response.data.erro
          this.funcao = 'erro'
          this.textoAlerta = mensagem
          this.mostrarAlerta = true
        });
      }
    },

    async editarUsuario() {
      const isValido = this.$refs.formulario.validate()

      if(isValido){
        let usuario = Object.assign({}, this.usuario)
        let idUsuario = this.$store.state.usuario.id

        await api.post(`/usuario/editar/${this.usuario.id}`, {
          usuario: usuario,
          idUsuario: idUsuario
        }).then(resp => {
          console.log(resp.data)
          this.$emit('editado', resp.data.usuario)
          this.usuario = {}
        }).catch(erro => {
          console.log(erro)
        });
      }
    },
  },
  watch: {
    mostrar: async function (valor) {
      if (valor === true) {
        if (this.idUsuario) {
          await api.get(`/usuario/${this.idUsuario}`).then(resp => {
            this.usuario = resp.data
            this.editando = true
          })
        } else {
          this.editando = false
        }
      } else {
        this.$refs.formulario.reset()
      }
    }
  }
}
</script>

<style scoped>

</style>