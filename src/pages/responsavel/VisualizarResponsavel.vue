<template>
  <b-container fluid>
    <b-row class="barraTopCliente " align-v="center">
      <b-col>
        <h1 class="mb-1">Cadastro de Responsável</h1>
      </b-col>
      <b-col class="my-1" cols="3">
        <b-form-group class="mb-0">
          <b-input-group>
            <template #prepend>
              <b-input-group-text>
                <b-icon icon="search"></b-icon>
              </b-input-group-text>
            </template>
            <b-form-input
                id="filter-input"
                v-model="filter"
                type="search"
                placeholder="Ex: João da Silva"
            ></b-form-input>
          </b-input-group>
        </b-form-group>
      </b-col>
    </b-row>
    <!-- Main table element
    stacked="md"
    -->
    <b-row class="tabela-clientes">
      <b-col class="col-tabela-clientes">
        <b-table
            bordered
            head-variant="dark"
            sort-icon-left
            :items="items"
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
            :filter="filter"
            :filter-included-fields="filterOn"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            show-empty
            small
            fixed
            @filtered="onFiltered"
            striped
            hover
            outlined
            :sticky-header="alturaTela"
            no-border-collapse
            @row-clicked="item=>$set(item, '_showDetails', !item._showDetails)">
          <template #cell(nome)="row">
            <p class="tr-cliente">{{ row.item.nome }}</p>
          </template>
          <template #cell(email)="row">
            <p class="tr-cliente">{{ row.item.email }}</p>
          </template>
          <template #cell(cpf_cnpj)="row">
            <p class="tr-cliente">{{ row.item.cpf_cnpj }}</p>
          </template>
          <template #cell(editar)="row">
            <vs-button type="flat" color="dark" @click="editarResponsavelModal(row.item.id)" icon="edit"></vs-button>
          </template>
          <template #cell(deletar)="row">
            <vs-button type="flat" color="dark" @click="deletarResponsavelModal(row.item)" icon="delete"></vs-button>
          </template>


          <template #row-details="row">
            <b-card>
              <p>Rua: {{ row.item.rua }},{{ row.item.numero }} | Bairro: {{ row.item.bairro }} | Cidade:
                {{ row.item.cidade }} |
                Estado: {{ row.item.estado }}</p>
              <p>Complemento: {{ row.item.complemento }}</p>
              <p>Identidade: {{ row.item.identidade }}</p>
              <p>Data de Nascimento: {{ row.item.data_nascimento }}</p>
              <p>Estado Civil: {{ row.item.estado_civil }}</p>
              <p>Referência: {{ row.item.referencia }}</p>
              <vs-button color="#5498ff" type="filled" icon="work" @click="mostrarModalContratos(row.item)">Contratos
              </vs-button>
              button
            </b-card>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row class="divider-personalizado">
      <b-col class="" cols="auto">
        <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            align="left"
            class="my-0"
            first-text="Primeira"
            last-text="Última"
        ></b-pagination>
      </b-col>
      <b-col sm="5" md="auto" class="">
        <b-form-group
            label="Por pagina"
            label-for="per-page-select"
            label-cols-sm="auto"
            label-cols-md="auto"
            label-cols-lg="auto"
            label-align-sm="right"
            label-size="sm"
            align="left"
        >
          <b-form-select
              id="per-page-select"
              v-model="perPage"
              :options="pageOptions"
              size="sm"
          ></b-form-select>
        </b-form-group>
      </b-col>
      <b-col class="ml-auto" cols="auto">
        <vs-button color="#24a35a" type="filled" icon="person_add" @click="mostrarModal">Adicionar
        </vs-button>
      </b-col>
    </b-row>
    <!--  Fim da tabela-->
    <modal name="modal-responsavel" width="60%" height="auto" :scrollable="true" :click-to-close="false"
           class="modal-adicionando-cliente">
      <h3>Adicionando responsável</h3>
      <b-row align-v="center">
        <b-col cols="8">
          <vs-input label-placeholder="Nome*" v-model="responsavel.nome" class="input-personalizado"
          />
        </b-col>

        <b-col cols="4">
          <vs-input label="Data de Nascimento" v-model="responsavel.data_nascimento" type="date" class="input-nascimento"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4">
          <b-form-group id="select-cliente" label="Estado Civil">
            <b-form-select v-model="responsavel.id_estado_civil" :options="estadosCivis" value-field="id" text-field="descricao">
              <template #first>
                <b-form-select-option  :value="null">Selecione</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col cols="4">
          <vs-input onKeyDown="if(this.value.length==15 && event.keyCode!=8) return false;" type="number" label-placeholder="CPF ou CNPJ*" v-model="responsavel.cpf_cnpj" class="input-personalizado"/>
        </b-col>
        <b-col cols="4">
          <vs-input onKeyDown="if(this.value.length==10 && event.keyCode!=8) return false;" type="number" label-placeholder="Identidade" v-model="responsavel.identidade" class="input-personalizado"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          <vs-input type="text" onkeypress="return event.charCode >= 48 && event.charCode <= 57" onKeyDown="if(this.value.length==10 && event.keyCode!=8) return false;" label-placeholder="CEP*" v-model="responsavel.cep" class="input-personalizado"/>
        </b-col>
        <b-col cols="5">
          <vs-input label-placeholder="Rua*" v-model="responsavel.rua" class="input-personalizado"/>
        </b-col>
        <b-col cols="2">
          <vs-input label-placeholder="Número*" v-model="responsavel.numero" class="input-personalizado"/>
        </b-col>
        <b-col cols="3">
          <vs-input label-placeholder="Complemento" v-model="responsavel.complemento" class="input-personalizado"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <vs-input label-placeholder="Bairro*" v-model="responsavel.bairro" class="input-personalizado"/>
        </b-col>
        <b-col>
          <vs-input label-placeholder="Cidade*" v-model="responsavel.cidade" class="input-personalizado"/>
        </b-col>
        <b-col cols="2">
          <vs-input label-placeholder="UF*" v-model="responsavel.estado" class="input-personalizado" maxlength="2"/>
        </b-col>
      </b-row>
      <b-row align-h="end">
        <b-col cols="2">
          <vs-button v-if="editar == true" color="#24a35a" type="filled" icon="edit" class="botao-salvar"
                     @click="editarResponsavel">Salvar
          </vs-button>
          <vs-button v-else color="#24a35a" type="filled" icon="save" class="botao-salvar" @click="cadastrarResponsavel">
            Salvar
          </vs-button>
        </b-col>
        <b-col cols="2">
          <vs-button color="#707070" type="filled" icon="clear" class="botao-salvar" @click="esconderModal">
            Cancelar
          </vs-button>
        </b-col>
      </b-row>
    </modal>
  </b-container>
</template>

<script>

import api from '../../services/api'

export default {
  name: "VisualizarResponsavel",
  data() {
    return {
      alturaTela: `${(window.innerWidth / 3).toString()}px`,
      larguraTela: window.innerHeight,
      items: [],
      fields: [
        {key: 'nome', label: 'Nome', sortable: true},
        {key: 'cpf_cnpj', label: 'CPF ou CNPJ', sortable: true,},
        {key: 'editar', label: 'Editar'},
        {key: 'deletar', label: 'Deletar'},
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 25,
      pageOptions: [25, 50, 100],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
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
      editar: false,
      estadosCivis: []
    }
  },

  methods: {
    async buscarEstadosCivis() {
      await api.get('/estados_civis').then(response => {
        this.estadosCivis = response.data
      })
    },
    async buscarResponsaveis() {
      await api.get('/responsaveis').then(response => {
        console.log(response)
        this.items = response.data
        this.totalRows = this.items.length
      }).catch(erro => {
        console.log(erro)
      })
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    async deletarResponsavel(responsavel) {
      await api.delete(`/responsavel/deletar/${responsavel.id}`).then(() => {
        this.buscarResponsaveis()
      })
    },
    deletarResponsavelModal(responsavel) {
      this.$bvModal.msgBoxConfirm(`Tem certeza que deseja deletar o responsável: ${responsavel.nome} ?`, {
        title: 'Deletar responsável',
        buttonSize: 'sm',
        okTitle: 'Deletar',
        cancelTitle: 'Cancelar',
        okVariant: 'danger',
        footerClass: 'p-2',
        centered: true
      }).then(value => {
        if (value) {
          this.deletarResponsavel(responsavel)
        }
      })
    },


    async editarResponsavelModal(id) {
      await api.get('/responsavel', {params: {idResponsavel: id}}).then(response => {
        this.responsavel = response.data[0]
        console.log(this.responsavel)
        this.mostrarModal()
        this.editar = true
      })
    },
    async editarResponsavel() {
      if (this.validarCamposObrigatorio()) {
        await api.post(`/responsavel/editar`, {
          responsavel: this.responsavel,
        }).then(response => {
          let nomeResponsavel = response.data[0].nome
          this.$vs.notify({
            text: `Responsável editado com sucesso: ${nomeResponsavel} !`,
            position: 'top-center',
            color: 'warning',
            time: 6000,
            icon: 'check_circle_outline'
          })
          this.buscarResponsaveis()
          this.limparModal()
          this.esconderModal()
        }).catch(erro => {

          this.$vs.notify({
            text: `${erro.response.data.erro}`,
            position: 'top-center',
            color: 'danger',
            time: 4000,
            icon: 'check_circle_outline'
          })
        })
      }
    },

    mostrarModal() {
      this.$modal.show('modal-responsavel')
    },
    esconderModal() {
      this.$modal.hide('modal-responsavel');
      this.limparModal()
      this.editar = false
    },
    limparModal() {
      Object.keys(this.responsavel).forEach(key => {
        this.responsavel[key] = ""
      })
      this.responsavel.id_estado_civil = null
    },
    async cadastrarResponsavel() {
      if (this.validarCamposObrigatorio()) {
        await api.post('/responsavel/cadastrar', {responsavel: this.responsavel}).then(response => {
          let nomeResponsavel = response.data[0].nome
          this.esconderModal()
          this.$vs.notify({
            text: `Responsável cadastrado com sucesso: ${nomeResponsavel} !`,
            position: 'top-center',
            color: 'success',
            time: 6000,
            icon: 'check_circle_outline'
          })
          this.buscarResponsaveis()
          this.limparModal()
        }).catch(erro => {
          this.$vs.notify({
            text: `${erro.response.data.erro}`,
            position: 'top-center',
            color: 'danger',
            time: 40000,
            icon: 'check_circle_outline'
          })
        })
      }
    },
    validarCamposObrigatorio() {
      if (this.responsavel['nome'] == "" || this.responsavel['rua'] == "" ||
          this.responsavel['cidade'] == "" || this.responsavel['bairro'] == "" || this.responsavel['estado'] == "" ||
          this.responsavel['cpf_cnpj'] == "" || this.responsavel['numero'] == "" || this.responsavel['cep'] == "") {
        this.$vs.notify({
          text: `Campos obrigatorios vazio.`,
          position: 'top-center',
          color: 'danger',
          time: 4000,
          icon: 'check_circle_outline'
        })
        return false
      } else {
        return true
      }
    },
    atribuirCep(dados) {
      if(this.editar != true){
        this.responsavel.bairro = ""
        this.responsavel.cidade = ""
        this.responsavel.estado = ""
        this.responsavel.complemento = ""
        this.responsavel.rua = ""
        if (dados.bairro != "") {
          this.responsavel['bairro'] = dados.bairro
        }
        if (dados.localidade != "") {
          this.responsavel.cidade = dados.localidade
        }
        if (dados.uf != "") {
          this.responsavel.estado = dados.uf
        }
        if (dados.complemento != "") {
          this.responsavel.complemento = dados.complemento
        }
        if (dados.logradouro != "") {
          this.responsavel.rua = dados.logradouro
        }
      }
    }
  },
  watch: {
    'responsavel.cep': function (cep) {
      if (cep.length == 8) {
        api.get(`/cliente/consultar_cep/${cep}`).then(response => {
          this.atribuirCep(response.data)
        })
      }
    }
  },
  async mounted() {
    this.buscarResponsaveis()
    this.buscarEstadosCivis()
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

.botao-fiador {
  width: 100%;
  margin-bottom: 10px;
}

.vs-input--label {
  color: rgb(160, 160, 160);
  font-size: 11px;
  margin-bottom: 2px;
}

.input-nascimento {
  margin-top: -6px !important;
  margin-bottom: 10px !important;
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
  margin-bottom: 10px;
}

.vs-select--label {
  margin: 0;
}

.vm--modal {
  margin-top: -20px !important;
  bottom: 25px;
  padding: 25px;
}

.tr-cliente {
  margin-top: 6px;
  margin-bottom: 0px;
}

.barraTopCliente {
  border: 1px solid rgb(220, 220, 220);
  padding: 0;
  margin: 0;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 5px 5px 20px rgb(200, 200, 200);
}

.tabela-clientes {
  background-color: white;
  margin: 0;
  padding: 0;
  margin-bottom: 10px;
}

.col-tabela-clientes {
  padding-top: 15px;
}

.divider-personalizado {
  border-top: 1px solid rgb(200, 200, 200);
  padding-top: 10px;
}

.material-icons {
  z-index: 0;
}
#select-cliente__BV_label_{
  margin:0;
  padding:0;
  color:rgb(110,110,110);
  font-size: 12px;
}
#select-cliente{
  margin-bottom: 10px;
}

</style>