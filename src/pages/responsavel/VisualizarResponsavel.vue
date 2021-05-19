<template>
  <b-container fluid class="centralizar-container">
    <div class="barra-busca-mobile">
      <b-row class="no-gutters">
        <b-col>
          <b-form-group class="barra-busca-mobile__form-group">
            <b-input-group>
              <transition name="slide-down__input-busca">
                <b-form-input
                    v-if="barraBuscaMobile"
                    id="filter-input"
                    v-model="filter"
                    type="search"
                    placeholder="Ex: João da Silva"
                    class="barra-busca-mobile__input">
                </b-form-input>
              </transition>
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col cols="auto">
          <template>
            <b-input-group-text @click="barraBuscaMobile = !barraBuscaMobile" class="barra-busca-mobile__botao">
              <b-icon icon="search"></b-icon>
            </b-input-group-text>
          </template>
        </b-col>
      </b-row>
    </div>
    <b-row class="barra-top-responsavel " align-v="center">
      <b-col>
        <h1 class="mb-1 titulo">Cadastro de Responsável</h1>
      </b-col>
      <b-col class="barra-busca esconder-quando-mobile" cols="3" >
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
    <b-row class="tabela-responsaveis">
      <b-col class="col-tabela-responsaveis">
        <b-table
            id="tabela-responsavel"
            primary-key="nome"
            :tbody-transition-props="transProps"
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
            @filtered="onFiltered"
            striped
            hover
            outlined
            :busy="carregandoTableResponsavel"
            sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px - 00px)"
            no-border-collapse
            @row-clicked="item=>$set(item, '_showDetails', !item._showDetails)">
          <template #cell(nome)="row">
            <p class="tr-responsavel">{{ row.item.nome }}</p>
          </template>
          <template #cell(email)="row">
            <p class="tr-responsavel">{{ row.item.email }}</p>
          </template>
          <template #cell(cpf_cnpj)="row">
            <p class="tr-responsavel">{{ row.item.cpf_cnpj }}</p>
          </template>
          <template #cell(editar)="row">
            <vs-tooltip text="Editar">
              <vs-button type="flat" color="dark" @click="editarResponsavelModal(row.item.id)" icon="edit"></vs-button>
            </vs-tooltip>
          </template>
          <template #cell(deletar)="row">
            <vs-tooltip text="Deletar">
              <vs-button type="flat" color="dark" @click="deletarResponsavelModal(row.item)" icon="delete"></vs-button>
            </vs-tooltip>
          </template>
          <template #table-colgroup>
            <col>
            <col>
            <col style="width: 15px">
            <col style="width: 15px">
          </template>
          <template #row-details="row">
            <b-card>
              <b-row>
                <b-col cols="auto">
                  <p><b>Rua:</b> {{ row.item.rua }},{{ row.item.numero }}</p>
                </b-col>
                <b-col cols="auto">
                  <p><b>Bairro: </b>{{ row.item.bairro }}</p>
                </b-col>
                <b-col cols="auto">
                  <p><b>Cidade: </b>{{ row.item.cidade }}</p>
                </b-col>
                <b-col cols="auto">
                  <p><b>Estado: </b>{{ row.item.estado }}</p>
                </b-col>
                <b-col>
                  <p><b>Complemento: </b>{{ row.item.complemento }}</p>
                </b-col>
              </b-row>
            </b-card>
          </template>
          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle mr-3"></b-spinner>
              <strong>Carregando...</strong>
            </div>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-container fluid class="divider-personalizado esconder-quando-mobile" style="margin-left: -75px">
      <b-row align-v="end">
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
              class="mb-1"
          >
            <b-form-select
                id="per-page-select"
                v-model="perPage"
                :options="pageOptions"
                size="sm"
            ></b-form-select>
          </b-form-group>
        </b-col>
        <b-col>
          <h6>Total: {{ this.totalRows }}</h6>
        </b-col>
        <b-col class="ml-auto" cols="auto" style="margin-bottom: -5px">
          <vs-button color="#24a35a" type="filled" icon="person_add" @click="mostrarModal">Adicionar
          </vs-button>
        </b-col>
      </b-row>
    </b-container>
    <b-container fluid class="container-paginacao-total-mobile">
      <b-row class="barra-paginacao-total-paginas-mobile no-gutters" style="width: 100%">
        <b-col class="mr-2 col-paginacao-mobile">
          <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"

              class="my-0 w-100"
              aria-controls="my-table"
              align="fill">
          </b-pagination>
        </b-col>
        <b-col class="ml-auto" cols="auto" style="max-width: 100px">
          <b-form-group
              label="Por pagina"
              label-for="per-page-select"
              label-cols-sm="auto"
              label-cols-md="auto"
              label-cols-lg="auto"
              label-align-sm="right"
              label-size="sm"
              align="left"
              class="mb-0 mr-0">
            <b-form-select
                id="per-page-select"
                v-model="perPage"
                :options="pageOptions"
                size="sm"

            ></b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
    </b-container>
    <!--  Fim da tabela-->
    <modal name="modal-responsavel" width="90%" height="auto" :scrollable="true" :click-to-close="false"
           class="modal-responsavel">
      <h3>Adicionando responsável</h3>
      <b-row align-v="center">
        <b-col cols="8">
          <vs-input label-placeholder="Nome*" v-model="responsavel.nome" class="input-personalizado"
          />
        </b-col>
        <b-col cols="4">
          <vs-input label="Data de Nascimento" v-model="responsavel.data_nascimento" type="date"
                    class="input-nascimento"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4">
          <b-form-group id="select-responsavel" label="Estado Civil">
            <b-form-select v-model="responsavel.id_estado_civil" :options="estadosCivis" value-field="id"
                           text-field="descricao">
              <template #first>
                <b-form-select-option :value="null">Selecione</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col cols="4">
          <vs-input onKeyDown="if(this.value.length==18 && event.keyCode!=8) return false;" type="text"
                    v-mask="['###.###.###-##', '##.###.###/####-##']" label-placeholder="CPF ou CNPJ*"
                    v-model="responsavel.cpf_cnpj" class="input-personalizado"/>
        </b-col>
        <b-col cols="4">
          <vs-input type="text" label-placeholder="Identidade" v-model="responsavel.identidade" class="input-personalizado"/>
        </b-col>
      </b-row>
      <Carregando :visivel="carregandoCep"/>
      <b-row>
        <b-col cols="2">
          <vs-input
              type="text"
              label-placeholder="CEP*"
              v-model="responsavel.cep"
              class="input-personalizado"
              v-mask="'#####-###'"
              @focusout="buscarEndereco"
              @focusin="cepAtual"
          />
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
          <vs-button v-if="editar == true" color="#24a35a" type="filled" icon="save" class="botao-salvar"
                     @click.native="editarResponsavel">Salvar
          </vs-button>
          <vs-button v-else color="#24a35a" type="filled" icon="save" class="botao-salvar"
                     @click.native="cadastrarResponsavel">
            Salvar
          </vs-button>
        </b-col>
        <b-col cols="2">
          <vs-button color="#707070" type="filled" icon="clear" class="botao-salvar" @click.native="esconderModal">
            Cancelar
          </vs-button>
        </b-col>
      </b-row>
    </modal>
  </b-container>
</template>

<script>

import api from '../../services/api'
import {atribuirCep} from '../../methods/global'
import Carregando from "../../components/shared/Carregando"

export default {
  name: "VisualizarResponsavel",
  components: {
    Carregando
  },
  data() {
    return {
      transProps: {
        name: "flip-list",
      },
      items: [],
      fields: [
        {key: 'nome', label: 'Nome', sortable: true, thClass: 'text-center'},
        {key: 'cpf_cnpj', label: 'CPF ou CNPJ', sortable: true, thClass: 'text-center'},
        {key: 'editar', label: ''},
        {key: 'deletar', label: ''},
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
      estadosCivis: [],
      carregandoCep: false,
      cep_atual:'',
      carregandoTableResponsavel: false,
      barraBuscaMobile: false
    }
  },

  methods: {
    async buscarEstadosCivis() {
      await api.get('/estados_civis').then(response => {
        this.estadosCivis = response.data
      })
    },
    async buscarResponsaveis() {
      this.carregandoTableResponsavel = true
      await api.get('/responsaveis').then(response => {
        this.items = response.data
        this.totalRows = this.items.length
        this.carregandoTableResponsavel = false
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
        this.mostrarModal()
        this.editar = true
      })
    },
    async editarResponsavel() {
      if (this.validarCamposObrigatorio()) {
        let idUsuario = this.$store.state.usuario.id
        await api.post(`/responsavel/editar`, {
          responsavel: this.responsavel,
          idUsuario: idUsuario
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
        let idUsuario = this.$store.state.usuario.id
        await api.post('/responsavel/cadastrar', {
          responsavel: this.responsavel,
          idUsuario: idUsuario
        }).then(response => {
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
            time: 6000,
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
      if (dados.bairro != "") {
        this.responsavel.bairro = dados.bairro
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
    },
    cepAtual(){
      this.cep_atual = this.responsavel.cep
    },
    buscarEndereco(){
      if(this.cep_atual != this.responsavel.cep){
        if (atribuirCep(this.responsavel.cep)) {
          if (this.responsavel.cep.length == 9) {
            this.carregandoCep = true
          }
          atribuirCep(this.responsavel.cep).then(response => {
            this.carregandoCep = false
            this.atribuirCep(response)
          })
        }
      }
    },
  },
  watch: {
    // 'responsavel.cep': function (cep) {
    //   if (atribuirCep(cep)) {
    //     if (cep.length == 9) {
    //       this.carregandoCep = true
    //     }
    //     atribuirCep(cep).then(response => {
    //       this.carregandoCep = false
    //       this.atribuirCep(response)
    //     })
    //   }
    // },
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

.tr-responsavel {
  margin-top: 6px;
  margin-bottom: 0px;
}

.barra-top-responsavel {
  padding: 0;
  margin: 0;
  margin-bottom: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 1px 5px rgba(200, 200, 200, 0.5);
}

.tabela-responsaveis {
  background-color: white;
  margin: 0;
  padding: 0;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0px 1px 5px rgba(200, 200, 200, 0.5);
}

.col-tabela-responsaveis {
  padding-top: 15px;
}

.divider-personalizado {
  border-top: 1px solid rgb(200, 200, 200);
  position: absolute;
  bottom: 0;
  margin-left: -100px;
  width: 100%;
  padding: 10px 100px 15px 100px;
  background-color: white;
}

.material-icons {
  z-index: 0;
}

#select-responsavel__BV_label_ {
  margin: 0;
  padding: 0;
  color: rgb(110, 110, 110);
  font-size: 12px;
}

#select-responsavel {
  margin-bottom: 10px;
}

table#tabela-responsavel .flip-list-move {
  transition: transform 0.4s;
}

.modal-responsavel{
  margin-left:25px;
}

.titulo {
  font-size: 170%;
}

.botao-add-mobile {
  max-width: 300px;
}

.total-mobile {
  padding-top: 9px;
}

.total-mobile h6 {
  font-size: 1.4rem;
}

.container-paginacao-total-mobile {
  position: fixed;
  bottom: 0;
  margin-left: -10px;
  margin-right: 0;
  border-top: 1px solid rgb(200, 200, 200);
  background-color: white;
  padding: 0px 0px 10px 5px;
  display: none;
}

.barra-paginacao-total-paginas-mobile {
  width: 100%;
}

.col-paginacao-mobile {
  max-width: 400px;
  padding-top: 25px;
  margin-bottom: 0;
}

.botao-add-total-mobile {
  padding-top: 15px;
  display: none;
  width: 100%;
}

.barra-busca-mobile {
  position: absolute;
  top: 50px;
  left: 0;
  width: 100%;
  z-index: 2;
  display: none;
}

.barra-busca-mobile__form-group {
  margin-bottom: 0;
}

.barra-busca-mobile__input {
  width: 100%;
  height: 42px;
  margin-bottom: 0 !important;
}

.barra-busca-mobile__botao {
  font-size: 20px;
  padding-bottom: 7px;
  padding-top: 8px;
}

.barra-busca-mobile__imprimir{
  font-size: 20px;
  padding-bottom: 3.5px;

}


.slide-down__input-busca-enter-active {
  transition: all .2s ease;
}

.slide-down__input-busca-leave-active {
  transition: all .2s ease;
}

.slide-down__input-busca-enter, .slide-down__input-busca-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

@media screen and (max-width: 992px) {
  .tabela-responsavel{
    max-height: calc(((((100vh - 82px) - 30px) - 48px) - 52px) - 55px - 20px) !important;
  }
  .barra-busca-mobile {
    display: block;
  }
  .botao-add-total-mobile {
    display: block;
  }

  .col-tabela-responsaveis {
    padding-top: 10px;
  }

  .esconder-quando-mobile {
    display: none;
  }
  .container-paginacao-total-mobile {
    display:block;
  }
}
</style>
