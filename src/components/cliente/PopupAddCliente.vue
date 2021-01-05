<template>
  <div class="">
    <vs-popup title="" :active.sync="visivel">
      <h1 class="text-center">Cadastrar cliente{{ editar }}</h1>
      <b-container>
        <b-row>
          <b-col cols="8">
            <vs-input label-placeholder="Nome*" v-model="cliente.nome" class="input-personalizado"/>
          </b-col>
          <b-col cols="4">
            <vs-select placeholder="Selecione" label-placeholder="Selecione" label="Estado civil"
                       v-model="cliente.estado_civil">
              <vs-select-item :key="index" :value="item.id" :text="item.descricao" v-for="(item,index) in estadoCivil"/>
            </vs-select>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="8">
            <vs-input label-placeholder="Email*" v-model="cliente.email" class="input-personalizado"/>
          </b-col>
          <b-col class="input-nascimento" cols="4">
            <vs-input label="Data de Nascimento" v-model="cliente.data_nascimento" type="date"/>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="5">
            <vs-input label-placeholder="Rua*" v-model="cliente.rua" class="input-personalizado"/>
          </b-col>
          <b-col cols="3">
            <vs-input label-placeholder="Número*" v-model="cliente.numero" class="input-personalizado"/>
          </b-col>
          <b-col cols="4">
            <vs-input label-placeholder="CEP*" v-model="cliente.cep" class="input-personalizado"/>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <vs-input label-placeholder="Bairro*" v-model="cliente.bairro" class="input-personalizado"/>
          </b-col>
          <b-col>
            <vs-input label-placeholder="Cidade*" v-model="cliente.cidade" class="input-personalizado"/>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <vs-input label-placeholder="Estado*" v-model="cliente.estado" class="input-personalizado"/>
          </b-col>
          <b-col>
            <vs-input label-placeholder="Complemento" v-model="cliente.complemento" class="input-personalizado"/>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <vs-input label-placeholder="CPF ou CNPJ*" v-model="cliente.cpf_cnpj" class="input-personalizado"/>
          </b-col>
          <b-col>
            <vs-input label-placeholder="Identidade" v-model="cliente.identidade" class="input-personalizado"/>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <vs-input label-placeholder="Referência" v-model="cliente.referencia" class="input-personalizado"/>
          </b-col>
        </b-row>
        <b-row class="campos-telefone" v-for="(telefone, index) in telefones" :key="index">
            <b-col>
              <vs-input label-placeholder="Numero de telefone" v-model="telefone.numero"
                        class="input-personalizado"/>
            </b-col>
            <b-col >
              <vs-select placeholder="Selecione" label-placeholder="Selecione" label="Tipo de número"
                         v-model="telefone.tipo">
                <vs-select-item :key="index" :value="item.id" :text="item.descricao"
                                v-for="(item,index) in tiposTelefone"/>
              </vs-select>
            </b-col>
        </b-row>
        <b-row>
          <b-col>
            <vs-button type="filled" icon="add_ic_call" class="botao-salvar botao-adicionar-telefone" color="#696969" @click.prevent="adicionarTelefone()">Mais
              telefone
            </vs-button>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <vs-button v-if="editar == true" color="#007bff" type="filled" icon="edit" class="botao-salvar" @click="editarCliente">Editar</vs-button>
            <vs-button v-else color="#007bff" type="filled" icon="add" class="botao-salvar" @click="cadastrarCliente">Salvar</vs-button>
          </b-col>
        </b-row>
      </b-container>
    </vs-popup>
  </div>
</template>

<script>
import api from "@/services/api";

export default {
  name: "PopupAddCliente",
  props: {
    visivel:Boolean,
    cliente:Object,
    telefones:Object,
    editar:{
      type:Boolean,
      default:false,
    },
  },

  data() {
    return {
      estadoCivil: [],
      tiposTelefone: [],
    }
  },
  async mounted() {
    this.buscarEstadosCivis()
    this.buscarTipoTelefones()
    const background = document.querySelector('.vs-popup--background')
    const btn = document.querySelector('.vs-popup--close')
    background.addEventListener('click', this.fecharpopup)
    btn.addEventListener('click', this.fecharpopup)
  },
  methods: {
    adicionarTelefone() {
      this.telefones.push({
        numero: '',
        tipo: ''
      })
    },
    async buscarEstadosCivis() {
      await api.get('/estados_civis').then(response => {
        this.estadoCivil = response.data
      })
    },
    async cadastrarCliente() {
      for (let key in this.cliente) {
        if (this.cliente[key] == "") {
          this.cliente[key] = null
        }
      }
      await api.post('/cliente/cadastrar', {data: this.cliente, telefones: this.telefones}).then(response => {
        let nomeCliente = response.data[0].nome
        this.fecharpopup()
        this.$vs.notify({
          text: `Cliente cadastrado com sucesso: ${nomeCliente} !`,
          position: 'top-center',
          color: 'success',
          time: 6000,
          icon: 'check_circle_outline'
        })
        this.$emit('atualizar')
        this.cliente = ""
        this.cliente.estado_civil = 0
        this.telefones = [{numero:"", tipo:""}]
      })
    },
    async buscarTipoTelefones() {
      await api.get('/tipos_telefones').then(response => {
        this.tiposTelefone = response.data
      })
    },
    async editarCliente() {
      for (let key in this.cliente) {
        if (this.cliente[key] == "") {
          this.cliente[key] = null
        }
      }
      await api.post(`/cliente/editar/${this.cliente.id}`, {data: this.cliente, telefones: this.telefones}).then(response => {
        let nomeCliente = response.data[0].nome
        this.fecharpopup()
        this.$vs.notify({
          text: `Cliente editado com sucesso: ${nomeCliente} !`,
          position: 'top-center',
          color: 'warning',
          time: 6000,
          icon: 'check_circle_outline'
        })
        this.$emit('atualizar')
        this.cliente = ""
        this.cliente.estado_civil = 0
        this.telefones = [{id:"",numero:"", tipo:""}]
      })
    },
    fecharpopup() {
      this.$emit('fecharpopup', false)
    },

  },
}
</script>

<style>
.input-personalizado {
  width: 100%;
  margin-bottom: 10px;
}

.botao-salvar {
  width: 100%;
  margin-top: 5px;
}

.botao-adicionar-telefone{
  margin-bottom: 5px;
}

.vs-input--label {
  color: rgb(160, 160, 160);
  font-size: 11px;
  margin-bottom: 2px;
}

.input-nascimento {
  margin-top: -6px;
}

.vs-con-input-label {
  width: 100%;
}

.vs-notifications {
  max-width: 100% !important;
}

.con-select {
  width: 100%;
  margin-top: -6px;
}

.vs-select--label {
  margin: 0;
}
</style>