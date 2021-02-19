<template>
  <b-container fluid>
    <b-row class="barra-top-usuario" align-v="center">
      <b-col>
        <h1 class="mb-1">Cadastro de Usuários</h1>
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
    <b-row class="tabela-usuarios">
      <b-col class="col-tabela-usuarios">
        <b-table
            id="tabela-usuario"
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
            :sticky-header="alturaTela"
            no-border-collapse
            @row-clicked="item=>$set(item, '_showDetails', !item._showDetails)">
          <template #cell(nome)="row">
            <p class="tr-usuario">{{ row.item.nome }}</p>
          </template>
          <template #cell(email)="row">
            <p class="tr-usuario">{{ row.item.email }}</p>
          </template>
          <template #cell(cpf_cnpj)="row">
            <p class="tr-usuario">{{ row.item.cpf_cnpj }}</p>
          </template>
          <template #cell(status)="row">
            <p class="tr-usuario">{{ row.item.status }}</p>
          </template>
          <template #cell(editar)="row">
            <vs-button type="flat" color="dark" @click="editarUsuarioModal(row.item.id)" icon="edit"></vs-button>
          </template>
          <template #cell(deletar)="row">
            <vs-button type="flat" color="dark" @click="deletarUsuarioModal(row.item)" icon="delete"></vs-button>
          </template>
          <template #row-details="row">
            <b-card>
              <p>Nome: {{ row.item.nome }}</p>
              <p>Usuário: {{ row.item.usuario }}</p>
              <p>Email: {{ row.item.email }}</p>
              <p>Permissão: {{ row.item.permissao }}</p>
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
    <modal name="usuario-modal" width="60%" height="auto" :scrollable="true" :click-to-close="false">
      <h3>Adicionando usuário</h3>
      <b-row align-v="center">
        <b-col cols="6">
          <vs-input label-placeholder="Nome do operador*" v-model="usuario.nome" class="input-personalizado"
          />
        </b-col>
        <b-col cols="6">
          <vs-input label-placeholder="Usuário*" v-model="usuario.usuario" class="input-personalizado"/>
        </b-col>
      </b-row>
      <b-row align-v="center">
        <b-col cols="6">
          <vs-input label-placeholder="Email*" v-model="usuario.email" class="input-personalizado"/>
        </b-col>
        <b-col>
          <b-form-group id="select-permissao" label="Permissão">
            <b-form-select v-model="usuario.permissao" :options="tiposPermissoes">
              <template #first>
                <b-form-select-option :value="null">Selecione</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="6">
          <vs-input label-placeholder="Senha*" v-model="usuario.senha" type="password" class="input-personalizado"/>
        </b-col>
      </b-row>
      <b-row align-h="end">
        <b-col cols="2">
          <vs-button v-if="editar == true" color="#24a35a" type="filled" icon="save" class="botao-salvar"
                     @click="editarUsuario">Salvar
          </vs-button>
          <vs-button v-else color="#24a35a" type="filled" icon="save" class="botao-salvar" @click="cadastrarUsuario">
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
  name: "VisualizarUsuario",
  data() {
    return {
      transProps: {
        name: "flip-list",
      },
      items: [],
      fields: [
        {key: 'nome', label: 'Nome do Operador', sortable: true},
        {key: 'email', label: 'Email', sortable: true},
        {key: 'usuario', label: 'Usuário', sortable: true,},
        {key: 'permissao', label: 'Nivel de permissão'},
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
      usuario: {
        nome: "",
        usuario:"",
        email: "",
        permissao:null,
        senha:"",
        },
      tiposPermissoes: [],
      editar: false
    }
  },
  async mounted() {
    this.buscarUsuarios()
  },
  methods: {
    async buscarUsuarios() {
      await api.get('/usuarios').then(response => {
        this.items = response.data
        this.totalRows = this.items.length
      }).catch(erro => {
        console.log(erro)
      })
    },
    async buscarTiposPermissao() {
      await api.get('/usuarios/tipos_permissao').then(response => {
        this.tiposPermissoes = response.data
      })
    },

    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    async deletarUsuario(usuario) {
      await api.delete(`/usuario/deletar/${usuario.id}`).then(() => {
        this.buscarUsuarios()
      })
    },
    deletarUsuarioModal(usuario){
      this.$bvModal.msgBoxConfirm(`Tem certeza que deseja deletar o usuário: ${usuario.nome} ?`, {
        title: 'Deletar usuário',
        buttonSize: 'sm',
        okTitle: 'Deletar',
        cancelTitle: 'Cancelar',
        okVariant: 'danger',
        footerClass: 'p-2',
        centered: true
      }).then(value =>{
        if(value){
          this.deletarUsuario(usuario)
        }
      })
    },


    async editarUsuarioModal(id) {
      await api.get(`/usuario/${id}`).then(response => {
        this.usuario = response.data
        this.mostrarModal()
        this.editar = true
      })
    },
    async editarUsuario() {
      await api.post(`/usuario/editar/${this.usuario.id}`, {data: this.usuario,}).then(response => {
        let nomeUsuario = response.data.nome
        this.$vs.notify({
          text: `Usuário editado com sucesso: ${nomeUsuario} !`,
          position: 'top-center',
          color: 'warning',
          time: 6000,
          icon: 'check_circle_outline'
        })
        this.buscarUsuarios()
        this.limparModal()
        this.esconderModal()
      })
    },

    mostrarModal() {
      this.$modal.show('usuario-modal')
      this.buscarTiposPermissao()
    },
    esconderModal() {
      this.$modal.hide('usuario-modal');
      this.limparModal()
      this.editar = false
    },
    limparModal() {
      Object.keys(this.usuario).forEach(key => {
        this.usuario[key] = ""
      })
      this.usuario.permissao = null
    },
    async cadastrarUsuario() {
      if(this.validarCamposObrigatorio()) {
        await api.post('/usuario/cadastrar', {data: this.usuario}).then(response => {
          let nomeUsuario = response.data[0].nome
          this.esconderModal()
          this.$vs.notify({
            text: `Usuário cadastrado com sucesso: ${nomeUsuario}!`,
            position: 'top-center',
            color: 'success',
            time: 6000,
            icon: 'check_circle_outline'
          })
          this.buscarUsuarios()
          this.limparModal()
        })
      }
    },
    validarCamposObrigatorio() {
      if (this.usuario['nome'] == "" || this.usuario['email'] == "" || this.usuario['usuario'] == "" ||
          this.usuario['permissao'] == null) {
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
  margin-top:-20px !important;
  bottom: 25px;
  padding: 25px;
}

.tr-usuario {
  margin-top: 6px;
  margin-bottom: 0px;
}

.barra-top-usuario {
  border: 1px solid rgb(220, 220, 220);
  padding: 0;
  margin: 0;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 5px 5px 20px rgb(200, 200, 200);
}

.tabela-usuarios {
  background-color: white;
  margin:0;
  padding: 0;
  margin-bottom: 10px;
}
.col-tabela-usuarios{
  padding-top: 15px;
}
.divider-personalizado{
  border-top: 1px solid rgb(200,200,200);
  padding-top: 10px;
}
.material-icons{
  z-index: 0;
}
#select-permissao__BV_label_{
  margin:0;
  padding:0;
  color:rgb(110,110,110);
  font-size: 12px;
}
#select-permissao{
  margin-bottom: 10px;
}
table#tabela-usuario .flip-list-move {
  transition: transform 0.4s;
}
</style>
