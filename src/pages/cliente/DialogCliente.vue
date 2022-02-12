<template>
  <v-dialog v-model="mostrar" persistent max-width="1100px">
    <v-card class="pa-5">
      <v-row>
        <v-col>
          <v-row>
            <v-col>
              <h3 class="ma-0">{{ editando ? 'Editando cliente' : 'Cadastrando cliente' }}</h3>
            </v-col>
          </v-row>
          <v-form lazy-validation ref="formulario" v-model="valido">
            <v-row>
              <v-col>
                <v-tabs
                    v-model="tab"
                    grow
                    class="tab-personalizada"
                >
                  <v-tab>Dados gerais</v-tab>
                  <v-tab>Inf. Adicionais</v-tab>
                  <v-tab :disabled="!editando" @click="buscarTelefones">Telefones</v-tab>
                  <v-tab :disabled="!editando" @click="buscarContratos">Contratos</v-tab>

                  <v-tabs-items v-model="tab">

                    <v-tab-item>
                      <v-row align="center" class="mt-1">
                        <v-col>
                          <v-radio-group row dense hide-details class="radio-debito-credito"
                                         v-model="cliente.tipo_cliente" :rules="[validacoes.required]">
                            <v-radio
                                label="Pessoa física*"
                                value="pessoa física"
                                class="mb-0"
                            ></v-radio>
                            <v-radio
                                label="Pessoa jurídica*"
                                value="pessoa jurícida"
                                class="mb-0"
                            ></v-radio>
                          </v-radio-group>
                        </v-col>
                        <v-col cols="12" lg="3" xl="3" md="3">
                          <v-autocomplete
                              :items="tiposStatus"
                              outlined
                              hide-details="auto"
                              label="Status"
                              item-value="id"
                              :value="1"
                              item-text="descricao"
                              dense
                              v-model="cliente.status"
                          >
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" xl="6" lg="6" md="6">
                          <v-text-field
                              label="Nome*"
                              outlined
                              dense
                              hide-details
                              v-model="cliente.nome"
                              :rules="[validacoes.required]"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-autocomplete
                              :items="tiposEstadosCivis"
                              outlined
                              hide-details="auto"
                              label="Estado Civil"
                              item-value="id"
                              item-text="descricao"
                              dense
                              v-model="cliente.estado_civil"
                          >
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-text-field
                              label="Data de Nascimento"
                              type="date"
                              outlined
                              dense
                              hide-details
                              name="data_nascimento"
                              v-model="cliente.data_nascimento"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" xl="6" lg="6" md="6">
                          <v-text-field
                              label="Email*"
                              outlined
                              dense
                              hide-details
                              v-model="cliente.email"
                              :rules="[validacoes.required]"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-text-field
                              label="CPF ou CNPJ*"
                              outlined
                              dense
                              hide-details
                              v-model="cliente.cpf_cnpj"
                              :rules="[validacoes.required]"
                              v-mask="['###.###.###-##', '##.###.###/####-##']"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-text-field
                              label="Identidade"
                              outlined
                              dense
                              hide-details
                              v-model="cliente.identidade"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" xl="2" lg="2" md="2">
                          <v-text-field
                              label="CEP"
                              outlined
                              dense
                              hide-details
                              v-model="cliente.cep"
                              @focusin="cep_atual = cliente.cep"
                              @focusout="buscarEndereco"
                              v-mask="'#####-###'"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field
                              label="Rua"
                              outlined
                              dense
                              hide-details
                              v-model="cliente.rua"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" xl="2" lg="2" md="2">
                          <v-text-field
                              label="Número"
                              outlined
                              dense
                              hide-details
                              v-model="cliente.numero"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" xl="2" lg="2" md="2">
                          <v-text-field
                              label="UF"
                              outlined
                              dense
                              hide-details
                              v-model="cliente.estado"
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
                              v-model="cliente.bairro"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" xl="4" lg="4" md="4">
                          <v-text-field
                              label="Cidade"
                              outlined
                              dense
                              hide-details
                              v-model="cliente.cidade"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" xl="4" lg="4" md="4">
                          <v-text-field
                              label="Complemento"
                              outlined
                              dense
                              hide-details
                              v-model="cliente.complemento"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-tab-item>

                    <v-tab-item>
                      <v-row class="mt-2">
                        <v-col>
                          <v-text-field
                              label="Indicação"
                              outlined
                              dense
                              hide-details
                              v-model="cliente.referencia"
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-textarea
                              label="Observação"
                              outlined
                              dense
                              hide-details
                              v-model="cliente.observacao"
                          ></v-textarea>
                        </v-col>
                      </v-row>
                    </v-tab-item>


                    <v-tab-item>
                      <v-row class="mt-2">
                        <v-col cols="12" xl="" lg="" md="">
                          <v-text-field
                              label="Número de telefone"
                              outlined
                              dense
                              hide-details
                              v-mask="['(##)####-####', '(##)#####-####']"
                              v-model="telefone.numero"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" xl="" lg="" md="">
                          <v-autocomplete
                              :items="tiposTelefone"
                              outlined
                              hide-details="auto"
                              label="Tipo telefone"
                              item-value="id"
                              item-text="descricao"
                              dense
                              v-model="telefone.id_tipo_telefone"
                          >
                          </v-autocomplete>
                        </v-col>
                        <v-col >
                          <v-text-field
                              label="Observação"
                              outlined
                              dense
                              hide-details
                              v-model="telefone.observacao"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="auto" v-if="editandoTelefone">
                          <v-btn dark color="var(--btn-cancelar)" class="border-radius" fab small depressed
                                 @click="telefone = {};editandoTelefone = false">
                            <v-icon>
                              mdi-close
                            </v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="auto">
                          <v-btn dark color="var(--btn-adicionar-azul)" class="border-radius" fab small depressed
                                 @click="editandoTelefone ? editarTelefone() : cadastrarTelefone()">
                            <v-icon>
                              {{ editandoTelefone ? 'mdi-content-save' : 'mdi-plus' }}
                            </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-data-table
                              :headers="headersTelefone"
                              :items="telefones"
                              class="elevation-1 tabela pointer"
                              mobile-breakpoint="0"
                              disable-pagination
                              hide-default-footer
                              fixed-header
                              item-key="id"
                          >
                            <template v-slot:item="{ item }">
                              <tr>
                                <td>{{ item.numero }}</td>
                                <td>{{ item.descricao }}</td>
                                <td>{{ item.observacao }}</td>
                                <td class="acoes text-center">
                                  <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn icon v-bind="attrs" v-on="on" color="black"
                                             @click="telefone = Object.assign({},item); editandoTelefone = true">
                                        <v-icon dark>
                                          mdi-pencil
                                        </v-icon>
                                      </v-btn>
                                    </template>
                                    <span>Editar</span>
                                  </v-tooltip>
                                  <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn
                                          icon
                                          v-bind="attrs"
                                          v-on="on"
                                          color="black"
                                          @click="dialogDeletarTelefone = true; telefone = item"
                                      >
                                        <v-icon dark>
                                          mdi-delete
                                        </v-icon>
                                      </v-btn>
                                    </template>
                                    <span>Deletar</span>
                                  </v-tooltip>
                                </td>
                              </tr>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                    </v-tab-item>

                    <v-tab-item>
                      <v-row class="mt-2">
                        <v-col>
                          <span><strong>Contratos de: {{ cliente.nome }}</strong></span>
                        </v-col>
                      </v-row>
                      <v-row class="mt-0">
                        <v-col>
                          <v-data-table
                              :headers="headersContratos"
                              :items="contratos"
                              class="elevation-1 tabela pointer"
                              mobile-breakpoint="0"
                              disable-pagination
                              hide-default-footer
                              fixed-header
                              height="280px"
                              item-key="id"
                          >
                            <template v-slot:item="{ item }">
                              <tr>
                                <td @click.prevent="buscarBoletos(item, $event)">{{ ("0000" + item.id).slice(-4) }}</td>
                                <td @click.prevent="buscarBoletos(item, $event)">{{ item.nome }}</td>
                                <td @click.prevent="buscarBoletos(item, $event)">
                                  {{ $dayjs(item.data_inicio).format('DD/MM/YYYY') }}
                                </td>
                                <td @click.prevent="buscarBoletos(item, $event)">
                                  {{ $dayjs(item.data_fim).format('DD/MM/YYYY') }}
                                </td>
                                <td @click.prevent="buscarBoletos(item, $event)">{{ item.status }}</td>
                                <td class="acoes text-center">
                                  <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn icon v-bind="attrs" v-on="on" color="black"
                                             @click="telefone = Object.assign({},item); editandoTelefone = true">
                                        <v-icon dark>
                                          mdi-pencil
                                        </v-icon>
                                      </v-btn>
                                    </template>
                                    <span>Editar</span>
                                  </v-tooltip>
                                </td>
                              </tr>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <span><strong>Boletos do contrato: {{ idContrato }}</strong></span>
                        </v-col>
                      </v-row>
                      <v-row class="mt-0">
                        <v-col>
                          <v-data-table
                              :headers="headersBoletos"
                              :items="boletos"
                              class="elevation-1 tabela"
                              mobile-breakpoint="0"
                              dense
                              disable-pagination
                              hide-default-footer
                              :height="boletos.length > 0 ? '250px' : ''"
                              fixed-header
                              item-key="id"
                          >
                            <template v-slot:item="{ item }">
                              <tr>
                                <td>{{ ("000000" + item.id).slice(-6) }}</td>
                                <td>{{ $dayjs(item.data_vencimento).format('DD/MM/YYYY') }}</td>
                                <td>R$ {{ item.valor.replace('.', ',') }}</td>
                                <td>{{ item.data_quitacao ? $dayjs(item.data_quitacao).format('DD/MM/YYYY') : '' }}</td>
                                <td>{{ item.status }}</td>
                              </tr>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                    </v-tab-item>
                  </v-tabs-items>
                </v-tabs>
              </v-col>
            </v-row>
          </v-form>
          <v-row :justify="$isMobile ? 'space-between' : 'end'">
            <v-col cols="auto">
              <v-btn color="var(--btn-salvar)" dark large @click="editando ? editarCliente() : cadastrarCliente(false)">
                <v-icon class="mr-1">mdi-content-save</v-icon>
                {{ !$isMobile ? 'Salvar' : '' }}
              </v-btn>
            </v-col>
            <v-col cols="auto" v-if="!editando">
              <v-btn color="var(--btn-salvar)" dark large @click="cadastrarCliente(true)">
                <v-icon :class=" $isMobile ? '' : 'mr-1' ">mdi-content-save-move</v-icon>
                {{ !$isMobile ? 'Salvar e sair' : '' }}
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

      <alerta-acoes
          :palavra-chave="palavraChave"
                    @sumir="mostrarAlerta = false"
                    v-bind:mostrar="mostrarAlerta"
                    :funcao="funcao"
                    :texto="textoAlerta"
      ></alerta-acoes>

      <dialog-deletar
          width="610px"
          :texto="`Certeza que deseja deletar o telefone ${ telefone.numero }?`"
          sub-texto="Após deletar esse telefone não é possivel recuperar!"
          :mostrar="dialogDeletarTelefone"
          @cancelar="dialogDeletarTelefone = !dialogDeletarTelefone; telefone = {}"
          @deletar="deletarTelefone"
      >
      </dialog-deletar>
    </v-card>
  </v-dialog>
</template>

<script>

import api from '../../services/api'
import AlertaAcoes from '../../components/shared/AlertaAcoes'
import DialogDeletar from "../../components/shared/DialogDeletar";

export default {
  name: "DialogCliente",
  props: ['mostrar', 'idCliente'],
  components: {
    AlertaAcoes,
    DialogDeletar
  },
  data() {
    return {
      editando: false,
      valido: false,
      tab: null,
      cliente: {
        nome: "",
        rua: "",
        cep: "",
        bairro: "",
        cidade: "",
        estado: "",
        complemento: "",
        cpf_cnpj: "",
        identidade: "",
        email: "",
        referencia: "",
        data_nascimento: "",
        numero: "",
        estado_civil: null,
        status: null,
        observacao: "",
        tipo_cliente: "",
        id: "",
      },
      validacoes: {
        required: value => !!value || '',
      },
      tiposEstadosCivis: [],
      tiposStatus: [],
      tiposTelefone: [],
      telefones: [],
      telefone: {
        id: "",
        numero: "",
        id_tipo_telefone: null,
        observacao: "",
      },
      contratos: [],
      boletos: [],
      headersTelefone: [
        {text: 'Número', value: 'numero', align: 'center'},
        {text: 'Tipo', value: 'descricao', align: 'center'},
        {text: 'Observação', value: 'observacao'},
        {text: '', value: 'acoes', align: 'center', sortable: false, width: '90px'},
      ],
      headersContratos: [
        {text: 'Contrato', value: 'id', align: 'center'},
        {text: 'Ímovel', value: 'nome'},
        {text: 'Data de Início', value: 'data_inicio'},
        {text: 'Data de Término', value: 'data_fim'},
        {text: 'Status', value: 'status'},
        {text: '', value: 'acoes', align: 'center', sortable: false, width: '60px'},
      ],
      headersBoletos: [
        {text: 'Código', value: 'id', align: 'center'},
        {text: 'Vencimento', value: 'data_vencimento', align: 'center'},
        {text: 'Valor', value: 'valor', align: 'center'},
        {text: 'Quitação', value: 'data_quitacao', align: 'center'},
        {text: 'Status', value: 'status', align: 'center'},
      ],
      mostrarAlerta: false,
      funcao: '',
      textoAlerta: '',
      telefonesForamBuscados: false,
      contratosForamBuscados: false,
      editandoTelefone: false,
      dialogDeletarTelefone: false,
      palavraChave: 'cliente',
      idContrato: '',
      cep_atual: '',
      adicionaClienteAItens: false,
      clienteParaAdicionar: {}
    }
  },
  created() {
    this.buscarEstadosCivis()
    this.buscarTipoStatus()
    this.buscarTipoTelefones()
  },
  methods: {
    async buscarEstadosCivis() {
      await api.get('/estados_civis').then(resp => {
        this.tiposEstadosCivis = resp.data
      })
    },
    async buscarTipoStatus() {
      await api.get('/cliente/tipos_status').then(resp => {
        this.tiposStatus = resp.data
      })
    },
    async buscarTipoTelefones() {
      await api.get('/tipos_telefones').then(resp => {
        this.tiposTelefone = resp.data
      })
    },
    async buscarTelefones() {
      if (this.telefonesForamBuscados === false) {
        await api.get("/telefones", {params: {idCliente: this.idCliente}}).then(resp => {
          this.telefonesForamBuscados = true
          this.telefones = resp.data
        })
      }
    },
    async buscarContratos() {
      if (this.contratosForamBuscados === false) {
        await api.get('/cliente/contratos', {params: {idCliente: this.idCliente}}).then(resp => {
          this.contratos = resp.data
        })
      }
    },
    async buscarEndereco(input) {
      let valor = input.target.value
      if(valor.length === 9){
        if(this.cep_atual !== valor){
          let endereco = await this.$buscarEndereco(valor)

          this.cliente.bairro = endereco.bairro
          this.cliente.complemento = endereco.complemento
          this.cliente.cidade = endereco.localidade
          this.cliente.rua = endereco.logradouro
          this.cliente.estado = endereco.uf
          this.cliente.numero = null
        }
      }
    },

    cancelar(){
      if(this.adicionaClienteAItens){
        this.$emit('cancelar', this.clienteParaAdicionar)
      }else{
        this.$emit('cancelar')
      }
      this.tab = null
    },

    async cadastrarCliente(sair) {
      const isValido = this.$refs.formulario.validate()

      if (isValido) {
        let variaveisString = ['status', 'estado_civil']
        for (let key in variaveisString) {
          if (this.cliente[variaveisString[key]] == "") {
            this.cliente[variaveisString[key]] = null
          }
        }
        let variaveisString2 = ['data_nascimento', 'identidade',]
        for (let key in variaveisString2) {
          if (this.cliente[variaveisString2[key]] == null) {
            this.cliente[variaveisString2[key]] = ""
          }
        }
        let idUsuario = this.$store.state.usuario.id
        await api.post('/cliente/cadastrar', {
          data: this.cliente,
          telefones: this.telefones,
          idUsuario: idUsuario
        },).then(resp => {
          let cliente = resp.data.cliente

          if (sair) {
            this.tab = null
            this.$emit('cadastrado', {cliente: cliente, notificar: true})
          } else {
            this.cliente.id = cliente.id
            this.clienteParaAdicionar = cliente
            this.adicionaClienteAItens = true
            this.funcao = 'cadastrado'
            this.palavraChave = 'cliente'
            this.mostrarAlerta = true
            this.editando = true
            this.$emit('cadastrado', {cliente: cliente, notificar: false})
            this.clienteParaAdicionar = {}
          }
        }).catch(erro => {
          let mensagem = erro.response.data.erro
          this.funcao = 'erro'
          this.textoAlerta = mensagem
          this.mostrarAlerta = true
        })


      }
    },

    async editarCliente() {
      const isValido = this.$refs.formulario.validate()

      if (isValido) {
        let variaveisString = ['status', 'estado_civil']
        for (let key in variaveisString) {
          if (this.cliente[variaveisString[key]] == "") {
            this.cliente[variaveisString[key]] = null
          }
        }
        let variaveisString2 = ['data_nascimento', 'identidade',]
        for (let key in variaveisString2) {
          if (this.cliente[variaveisString2[key]] == null) {
            this.cliente[variaveisString2[key]] = ""
          }
        }
        let idUsuario = this.$store.state.usuario.id
        await api.post(`/cliente/editar/${this.cliente.id}`, {
          data: this.cliente,
          telefones: this.telefones,
          idUsuario: idUsuario
        }).then(resp => {
          let cliente = resp.data.cliente
          this.$emit('editado', cliente)
          this.cliente = {}
        }).catch(erro => {
          console.log(erro.response)
        })
      }
      this.tab = null
    },

    async cadastrarTelefone() {
      let idCliente = this.cliente.id
      let idUsuario = this.$store.state.usuario.id
      await api.post('/cliente/telefone/cadastrar', {
        telefone: this.telefone,
        idCliente: idCliente,
        idUsuario: idUsuario
      }).then(resp => {
        this.palavraChave = 'telefone'

        let telefone = resp.data.telefone

        this.telefones.push(telefone)
        this.telefone = {
          id: "",
          numero: "",
          id_tipo_telefone: null,
          observacao: "",
        }

        this.palavraChave = 'telefone'
        this.funcao = 'cadastrado'
        this.mostrarAlerta = true
      })
    },
    async editarTelefone() {
      let idUsuario = this.$store.state.usuario.id
      await api.post('/cliente/telefone/editar', {telefone: this.telefone, idUsuario: idUsuario}).then(resp => {
        let telefone = resp.data.telefone
        let index = this.telefones.findIndex(obj => {
          return obj.id === telefone.id
        })

        this.telefones[index].numero = telefone.numero
        this.telefones[index].observacao = telefone.observacao
        this.telefones[index].id_tipo_telefone = telefone.id_tipo_telefone
        this.telefones[index].descricao = telefone.descricao
        this.telefone = {}
        this.editandoTelefone = false
        this.palavraChave = 'telefone'
        this.funcao = 'editado'
        this.mostrarAlerta = true
      })
    },

    async deletarTelefone() {
      let telefone = this.telefone
      await api.delete('/cliente/telefone/deletar', {params: {idTelefone: telefone.id}}).then(resp => {
        let {id} = resp.data.telefone
        let index = this.telefones.findIndex(obj => {
          return obj.id === id
        })
        this.telefones.splice(index, 1)
        this.dialogDeletarTelefone = false
        this.telefone = {}
        this.palavraChave = 'telefone'
        this.funcao = 'deletado'
        this.mostrarAlerta = true
      })
    },

    async buscarBoletos(contrato) {
      this.idContrato = ("0000" + contrato.id).slice(-4)
      let idContrato = ("0000" + contrato.id).slice(-4)
      await api.get('/cliente/contrato/boletos', {params: {idContrato: idContrato}}).then(resp => {
        this.boletos = resp.data
      })
    }

  },
  watch: {
    mostrar: async function (valor) {
      if (valor === true) {
        if (this.idCliente) {
          await api.get('/cliente', {params: {idCliente: this.idCliente}}).then(resp => {
            this.cliente = resp.data
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

<style scoped src="../../css/dataTableVuetifyCustom.css"/>
<style scoped src="../../css/tabVuetifyCustom.css"/>

<style scoped>



</style>