<template>
  <v-dialog v-model="mostrar" persistent max-width="1200px">
    <v-card class="pa-5">
      <v-row>
        <v-col>
          <v-row>
            <v-col>
              <h3 class="ma-0">{{ editando ? 'Editando responsável' : 'Cadastrando responsável' }}</h3>
            </v-col>
          </v-row>
          <v-form lazy-validation ref="formulario" v-model="valido">
            <v-row>
              <v-col cols="12" xl="8" lg="8" md="8">
                <v-text-field
                    label="Nome*"
                    outlined
                    dense
                    hide-details
                    v-model="responsavel.nome"
                    :rules="[validacoes.required]"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="4">
                <v-text-field
                    label="Data de nascimento"
                    outlined
                    dense
                    hide-details
                    v-model="responsavel.data_nascimento"
                    type="date"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" xl="4" lg="4" md="4">
                <v-autocomplete
                    :items="estadosCivis"
                    outlined
                    hide-details="auto"
                    label="Estado civil"
                    item-value="id"
                    item-text="descricao"
                    dense
                    v-model="responsavel.id_estado_civil"
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="4">
                <v-text-field
                    label="CPF / CNPJ*"
                    outlined
                    dense
                    hide-details
                    v-model="responsavel.cpf_cnpj"
                    :rules="[validacoes.required]"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="4">
                <v-text-field
                    label="Identidade"
                    outlined
                    dense
                    hide-details
                    v-model="responsavel.identidade"
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
                    v-model="responsavel.cep"
                    v-mask="'#####-###'"
                ></v-text-field>
              </v-col>
              <v-col>
                <v-text-field
                    label="Rua"
                    outlined
                    dense
                    hide-details
                    v-model="responsavel.rua"
                ></v-text-field>
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="2">
                <v-text-field
                    label="Número"
                    outlined
                    dense
                    hide-details
                    v-model="responsavel.numero"
                ></v-text-field>
              </v-col>
              <v-col cols="12" xl="2" lg="2" md="2">
                <v-text-field
                    label="UF"
                    outlined
                    dense
                    hide-details
                    v-model="responsavel.estado"
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
                    v-model="responsavel.bairro"
                ></v-text-field>
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="4">
                <v-text-field
                    label="Cidade"
                    outlined
                    dense
                    hide-details
                    v-model="responsavel.cidade"
                ></v-text-field>
              </v-col>
              <v-col cols="12" xl="4" lg="4" md="4">
                <v-text-field
                    label="Complemento"
                    outlined
                    dense
                    hide-details
                    v-model="responsavel.complemento"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row :justify="$isMobile ? 'space-between' : 'end'">
              <v-col cols="auto">
                <v-btn color="var(--btn-salvar)" dark large @click="editando ? editarResponsavel() : cadastrarResponsavel(false)">
                  <v-icon class="mr-1">mdi-content-save</v-icon>
                  {{ !$isMobile ? 'Salvar' : '' }}
                </v-btn>
              </v-col>
              <v-col cols="auto" v-if="!editando">
                <v-btn color="var(--btn-salvar)" dark large @click="cadastrarResponsavel(true)">
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

      <alerta-acoes
          palavra-chave="responsável"
          @sumir="mostrarAlerta = false"
          v-bind:mostrar="mostrarAlerta"
          :funcao="funcao"
      ></alerta-acoes>

    </v-card>
  </v-dialog>
</template>

<script>
import api from "../../services/api";
import AlertaAcoes from "../../components/shared/AlertaAcoes";

export default {
  name: "DialogResponsavel",
  props:['mostrar', 'idResponsavel'],
  components:{
    AlertaAcoes
  },
  data(){
    return{
      editando: false,
      valido: false,
      responsavel: {
        nome: "",
        rua: "",
        cep: "",
        bairro: "",
        cidade: "",
        estado: "",
        complemento: "",
        cpf_cnpj: "",
        identidade: "",
        data_nascimento: "",
        id_estado_civil: null,
        numero: "",
      },
      validacoes: {
        required: value => !!value || '',
      },
      estadosCivis: [],
      responsavelParaAdicionar: {},
      adicionaResponsavelAItens: false,
      mostrarAlerta: false,
      funcao: ''
    }
  },
  created(){
    this.buscarEstadosCivis()
  },
  methods:{
    async buscarEstadosCivis() {
      await api.get('/estados_civis').then(resp => {
        this.estadosCivis = resp.data
      })
    },

    cancelar(){
      if(this.adicionaResponsavelAItens){
        this.$emit('cancelar', this.responsavelParaAdicionar)
      }else{
        this.$emit('cancelar')
      }
      this.tab = null
      this.responsavelParaAdicionar = {}
      this.adicionaResponsavelAItens = false
    },


    async cadastrarResponsavel(sair) {
      const isValido = this.$refs.formulario.validate()

      if(isValido){
        let idUsuario = this.$store.state.usuario.id
        await api.post('/responsavel/cadastrar', {
          responsavel: this.responsavel,
          idUsuario: idUsuario
        }).then(resp => {
          let responsavel = resp.data.responsavel
          if (sair) {
            this.tab = null
            this.$emit('cadastrado', {responsavel: responsavel, notificar: true})
          } else {
            this.responsavel.id = responsavel.id
            this.responsavelParaAdicionar = responsavel
            this.adicionaResponsavelAItens = true
            this.funcao = 'cadastrado'
            this.palavraChave = 'responsável'
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

    async editarResponsavel() {
      const isValido = this.$refs.formulario.validate()

      if(isValido){
        let responsavel = Object.assign({}, this.responsavel)
        let idUsuario = this.$store.state.usuario.id

        await api.post(`/responsavel/editar/${this.responsavel.id}`, {
          responsavel: responsavel,
          idUsuario: idUsuario
        }).then(resp => {
          this.tab = null
          this.$emit('editado', resp.data.responsavel)
          this.responsavel = {}
        }).catch(erro => {
          console.log(erro)
        });
      }
    },
  },
  watch: {
    mostrar: async function (valor) {
      if (valor === true) {
        if (this.idResponsavel) {
          await api.get(`/responsavel/${this.idResponsavel}`).then(resp => {
            this.responsavel = resp.data
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