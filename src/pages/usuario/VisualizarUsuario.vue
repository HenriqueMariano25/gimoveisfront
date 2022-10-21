<template>
  <v-row no-gutters>
    <BarraTopoBusca titulo="Usuário"
                    :btnAdicionar="true"
                    @clickBtnAdicionar="dialogUsuario = true" />

    <BarraBuscaRelatorio
        :btn-gerar-relatorio="true"
        :input-busca="true"
        @buscar="buscar"
        @limparBusca="buscarUsuarios"
        @clickBtnImprimirRelatorio="gerarRelatorio"
    />
    <v-col>
      <v-row class="mt-0">
        <v-col class="pt-2">
          <v-card>
            <v-data-table
              :search="busca"
              @update:page="$paraTopo"
              fixed-header
              :headers="headers"
              :items="filtrarUsuarios"
              :footer-props="{
                itemsPerPageOptions: [50, 100, 220, -1],
              }"
              class="tabela pointer"
              :height="
                $isMobile ? 'calc(100vh - 300px)' : 'calc(100vh - 184px)'
              "
              single-expand
              :expanded="expanded"
              mobile-breakpoint="0"
              item-key="id"
              dense
              :loading="carregando"
            >
              <template v-slot:[`loading`]>
                <v-row
                    style="margin-top: 2px; padding-botton: 100px"
                    justify="center"
                    align="center"
                >
                  <v-col cols="auto" class="pb-5">
                    <v-progress-circular
                        indeterminate
                        color="primary"
                    ></v-progress-circular>
                  </v-col>
                  <v-col cols="auto" class="pb-5">
                    <h2>Recebendo informações... Favor aguarde !</h2>
                  </v-col>
                </v-row>
              </template>
              <template v-slot:item="{ item }">
                <tr>
                  <td>{{ item.nome }}</td>
                  <td>{{ item.email }}</td>
                  <td>{{ item.usuario }}</td>
                  <td>{{ item.permissao }}</td>
                  <td class="acoes text-center">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          color="black"
                          @click="
                            dialogUsuario = true
                            idUsuario = item.id
                          "
                        >
                          <v-icon dark> mdi-pencil </v-icon>
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
                          @click.prevent="
                            dialogDeletar = true
                            usuario = item
                          "
                        >
                          <v-icon dark> mdi-delete </v-icon>
                        </v-btn>
                      </template>
                      <span>Deletar</span>
                    </v-tooltip>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-col>

    <dialog-usuario
      :mostrar="dialogUsuario"
      @cancelar="cancelar"
      @cadastrado="cadastrado"
      @editado="editado"
      :idUsuario="idUsuario"
    ></dialog-usuario>

    <alerta-acoes
      palavra-chave="usuário"
      @sumir="mostrarAlerta = false"
      v-bind:mostrar="mostrarAlerta"
      :funcao="funcao"
      :texto="textoAlerta"
    ></alerta-acoes>

    <dialog-deletar
      :texto="`Certeza que deseja deletar o usuário: ${
        usuario ? usuario.nome : ''
      } ?`"
      sub-texto="Após deletar esse responsável não é possivel recuperar!"
      :mostrar="dialogDeletar"
      @cancelar="
        dialogDeletar = !dialogDeletar
        usuario = {}
      "
      @deletar="deletar"
    >
    </dialog-deletar>
  </v-row>
</template>

<script>
import api from "../../services/api"
import BarraTopoBusca from "../../components/shared/BarraTopoBusca"
import { jsPDF } from "jspdf"
import dayjs from "dayjs"
import "jspdf-autotable"

import DialogUsuario from "./DialogUsuario"
import AlertaAcoes from "../../components/shared/AlertaAcoes"
import DialogDeletar from "../../components/shared/DialogDeletar"
import BarraBuscaRelatorio from "@/components/shared/BarraBuscaRelatorio";

export default {
  name: "VisualizarUsuario",
  components: {
    BarraTopoBusca,
    DialogUsuario,
    AlertaAcoes,
    DialogDeletar,
    BarraBuscaRelatorio
  },

  data() {
    return {
      busca: "",
      expanded: [],
      headers: [
        {
          text: "Nome do Operador",
          value: "nome",
          align: "center",
          width: "200px",
        },
        { text: "Email", value: "email" },
        { text: "Usuário", value: "usuario" },
        { text: "Nivel de permissão", value: "permissao" },
        {
          text: "",
          value: "acoes",
          align: "center",
          sortable: false,
          width: "90px",
        },
      ],
      items: [],
      dialogUsuario: false,
      idUsuario: null,
      funcao: "",
      mostrarAlerta: false,
      textoAlerta: "",
      dialogDeletar: false,
      usuario: {},
      buscaNome: null,
      buscaEmail: null,
      buscaUsuario: null,
      buscaPermissao: null,
      carregando: false,
    }
  },
  async mounted() {
    this.buscarUsuarios()
  },
  computed: {
    filtrarUsuarios() {
      return this.items
    },
  },

  methods: {
    async buscar(valor){
      this.carregando = true;

      await api.get("/usuarios/busca", { params: { busca:valor } }).then((consulta) => {
        this.items = consulta.data
        this.filtrados = consulta.data
        this.carregando = false;
        if(consulta.data.length > 0){
          this.totalItens = parseInt(consulta.data[0].total_itens)
        }
      })
    },

    async buscarUsuarios() {
      this.carregando = true;

      await api
        .get("/usuarios")
        .then((response) => {
          this.items = response.data
          this.carregando = false;
        })
        .catch((erro) => {
          console.log(erro)
        })
    },

    gerarRelatorio() {
      let novosDados = JSON.parse(JSON.stringify(this.items))
      let hojeAgr = dayjs().format("DD/MM/YYYY HH:mm:ss")
      var doc = new jsPDF()
      doc.page = 1
      doc.setProperties({
        title: "Relátorio de Usuários",
      })
      doc.setFontSize(10)
      doc.text(hojeAgr, 200, 10, null, null, "right")
      doc.line(10, 12, 200, 12)
      doc.setFontSize(24)
      doc.text(`Relátorio de Usuários`, 10, 22)
      doc.setFontSize(14)
      doc.text(`Total: ${this.items.length}`, 200, 21, null, null, "right")
      doc.autoTable({
        head: [["Nome", "Email", "Usuário", "Permissão"]],
        columns: [
          { header: "Nome", dataKey: "nome" },
          { header: "Email", dataKey: "email" },
          { header: "Usuário", dataKey: "usuario" },
          { header: "Permissão", dataKey: "permissao" },
        ],
        body: novosDados,
        theme: "striped",
        headStyles: {
          fillColor: [50, 50, 50],
        },
        startY: 25,
        pageBreak: "auto",
        margin: { left: 10, right: 10, top: 10 },
      })
      const totalPaginas = doc.internal.getNumberOfPages()
      doc.setFontSize(8)
      for (var i = 1; i <= totalPaginas; i++) {
        doc.setPage(i)
        doc.text(
          `Página ${String(i)} de ${String(totalPaginas)}`,
          205,
          293,
          null,
          null,
          "right"
        )
      }
      window.open(doc.output("bloburl", { filename: "tabela_usuarios.pdf" }))
    },
    cancelar(usuario) {
      if (usuario) {
        this.items.push(usuario)
      }
      this.dialogUsuario = false
      this.idUsuario = null
    },

    cadastrado(dados) {
      let { usuario, notificar } = dados
      if (notificar) {
        this.items.push(usuario)
        this.mostrarAlerta = true
        this.funcao = "cadastrado"
        this.dialogUsuario = false
        this.usuario = {}
      }
    },

    editado(usuario) {
      let index = this.items.findIndex((obj) => {
        return obj.id === usuario.id
      })
      for (let key of Object.keys(usuario)) {
        this.items[index][key] = usuario[key]
      }
      this.dialogUsuario = false
      this.funcao = "editado"
      this.mostrarAlerta = true
      this.idUsuario = null
    },

    async deletar() {
      let usuario = this.usuario
      await api
        .delete(`/usuario/deletar/${usuario.id}`)
        .then(() => {
          let index = this.items.findIndex((obj) => {
            return obj.id === usuario.id
          })
          this.dialogDeletar = false
          this.items.splice(index, 1)
          this.funcao = "deletado"
          this.mostrarAlerta = true
          this.usuario = {}
        })
        .catch((erro) => {
          let mensagem = erro.response.data.erro
          this.funcao = "erro"
          this.textoAlerta = mensagem
          this.mostrarAlerta = true
        })
    },
    filtrarNome(item) {
      return item.nome.toLowerCase().includes(this.buscaNome.toLowerCase())
    },

    filtrarEmail(item) {
      return item.email.toLowerCase().includes(this.buscaEmail.toLowerCase())
    },

    filtrarUsuario(item) {
      return item.usuario
          .toLowerCase()
          .includes(this.buscaUsuario.toLowerCase())
    },

    filtrarPermissao(item) {
      return item.permissao
          .toLowerCase()
          .includes(this.buscaPermissao.toLowerCase())
    },

  },
}
</script>

<style scoped src="../../css/dataTableVuetifyCustom.css" />
<style></style>
