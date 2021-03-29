<template>
  <b-container fluid style="padding-right:15px;padding-left:75px">
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
            sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px)"
            no-border-collapse
            @row-clicked="item=>$set(item, '_showDetails', !item._showDetails)">
          <template #cell(nome)="row">
            <p class="tr-usuario">{{ row.item.nome }}</p>
          </template>
          <template #cell(email)="row">
            <p class="tr-usuario">{{ row.item.email }}</p>
          </template>
          <template #cell(usuario)="row">
            <p class="tr-usuario">{{ row.item.usuario }}</p>
          </template>
          <template #cell(permissao)="row">
            <p class="tr-usuario">{{ row.item.permissao }}</p>
          </template>
          <template #cell(editar)="row">
            <vs-button type="flat" color="dark" @click="editarUsuarioModal(row.item.id)" icon="edit"></vs-button>
          </template>
          <template #cell(deletar)="row">
            <vs-button type="flat" color="dark" @click="deletarUsuarioModal(row.item)" icon="delete"></vs-button>
          </template>
          <template #table-colgroup>
            <col>
            <col>
            <col>
            <col>
            <col style="width: 15px">
            <col style="width: 15px">
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-container fluid class="divider-personalizado" style="margin-left: -75px">
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
    <!--  Fim da tabela-->
    <modal name="usuario-modal" width="90%" height="auto" :scrollable="true" :click-to-close="false" class="modal-usuario">
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
        {key: 'nome', label: 'Nome do Operador', sortable: true, thClass: 'text-center'},
        {key: 'email', label: 'Email', sortable: true, thClass: 'text-center'},
        {key: 'usuario', label: 'Usuário', sortable: true, thClass: 'text-center'},
        {key: 'permissao', label: 'Nivel de permissão', sortable: true, class: 'text-center'},
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
      usuario: {
        nome: "",
        usuario: "",
        email: "",
        permissao: null,
        senha: "",
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
    deletarUsuarioModal(usuario) {
      this.$bvModal.msgBoxConfirm(`Tem certeza que deseja deletar o usuário: ${usuario.nome} ?`, {
        title: 'Deletar usuário',
        buttonSize: 'sm',
        okTitle: 'Deletar',
        cancelTitle: 'Cancelar',
        okVariant: 'danger',
        footerClass: 'p-2',
        centered: true
      }).then(value => {
        if (value) {
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
      let idUsuario = this.$store.state.usuario.id
      await api.post(`/usuario/editar/${this.usuario.id}`, {data: this.usuario, idUsuario: idUsuario}).then(response => {
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
      if (this.validarCamposObrigatorio()) {
        let idUsuario = this.$store.state.usuario.id
        await api.post('/usuario/cadastrar', {data: this.usuario, idUsuario: idUsuario}).then(response => {
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
  margin-top: -20px !important;
  bottom: 25px;
  padding: 25px;
}

.tr-usuario {
  margin-top: 6px;
  margin-bottom: 0px;
}

.barra-top-usuario {
  background-color: white;
  padding: 0;
  margin: 0;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0px 1px 5px rgba(200, 200, 200, 0.5);
}

.tabela-usuarios {
  background-color: white;
  margin: 0;
  padding: 0;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0px 1px 5px rgba(200, 200, 200, 0.5);
}

.col-tabela-usuarios {
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

#select-permissao__BV_label_ {
  margin: 0;
  padding: 0;
  color: rgb(110, 110, 110);
  font-size: 12px;
}

#select-permissao {
  margin-bottom: 10px;
}

table#tabela-usuario .flip-list-move {
  transition: transform 0.4s;
}

.modal-usuario{
  margin-left:25px;
}
</style>
