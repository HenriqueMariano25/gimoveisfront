<template>
  <v-row no-gutters>
    <v-col>
      <v-row no-gutters>
        <v-col>
          <barra-topo-busca titulo="Usuário" :busca="busca" @buscar="busca = $event"></barra-topo-busca>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col>
          <v-card class="border-radius pa-3">
            <v-data-table
                :search="busca"
                @update:page="$paraTopo"
                fixed-header
                :headers="headers"
                :items="items"
                :footer-props="{
                   itemsPerPageOptions:[10,25,50,-1]
                }"
                class="elevation-1 tabela pointer"
                :height="$isMobile ? 'calc(100vh - 300px)' : 'calc(100vh - 310px)'"
                single-expand
                :expanded="expanded"
                mobile-breakpoint="0"
                item-key="id"
            >
              <template v-slot:item="{ item }">
                <tr>
                  <td >{{ item.nome }}</td>
                  <td >{{ item.email }}</td>
                  <td >{{ item.usuario }}</td>
                  <td >{{ item.permissao }}</td>
                  <td class="acoes text-center">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on" color="black" @click="dialogUsuario = true; idUsuario = item.id">
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
                            @click.prevent="dialogDeletar = true; usuario = item"
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
          </v-card>
        </v-col>
      </v-row>
    </v-col>

    <barra-bottom-botoes
        :btn-adicionar="true"
        @clickBtnAdicionar="dialogUsuario = true"
        @clickBtnImprimirRelatorio="gerarRelatorio"
        :btn-gerar-relatorio="true"
    ></barra-bottom-botoes>

    <dialog-usuario
        :mostrar="dialogUsuario"
        @cancelar="cancelar"
        @cadastrado="cadastrado"
        @editado="editado"
        :idUsuario="idUsuario"
    ></dialog-usuario>

    <alerta-acoes
        palavra-chave='usuário'
        @sumir="mostrarAlerta = false"
        v-bind:mostrar="mostrarAlerta"
        :funcao="funcao"
        :texto="textoAlerta"
    ></alerta-acoes>

    <dialog-deletar
        :texto="`Certeza que deseja deletar o usuário: ${ usuario ? usuario.nome : ''} ?`"
        sub-texto="Após deletar esse responsável não é possivel recuperar!"
        :mostrar="dialogDeletar"
        @cancelar="dialogDeletar = !dialogDeletar; usuario = {}"
        @deletar="deletar"
    >
    </dialog-deletar>

  </v-row>
</template>

<script>

import api from '../../services/api'
import BarraTopoBusca from "../../components/shared/BarraTopoBusca"
import BarraBottomBotoes from "../../components/shared/BarraBottomBotoes"
import {jsPDF} from "jspdf";
import dayjs from 'dayjs'
import 'jspdf-autotable'

import DialogUsuario from "./DialogUsuario";
import AlertaAcoes from "../../components/shared/AlertaAcoes"
import DialogDeletar from "../../components/shared/DialogDeletar";

export default {
  name: "VisualizarUsuario",
  components:{
    BarraTopoBusca,
    BarraBottomBotoes,
    DialogUsuario,
    AlertaAcoes,
    DialogDeletar
  },

  data() {
    return {
      busca: '',
      expanded: [],
      headers: [
        {text: 'Nome do Operador', value: 'nome', align: 'center', width: '120px'},
        {text: 'Email', value: 'email'},
        {text: 'Usuário', value: 'usuario'},
        {text: 'Nivel de permissão', value: 'permissao'},
        {text: '', value: 'acoes', align: 'center', sortable: false, width: '90px'},
      ],
      items: [],
      dialogUsuario: false,
      idUsuario: null,
      funcao: '',
      mostrarAlerta: false,
      textoAlerta: '',
      dialogDeletar: false,
      usuario: {}
    }
  },
  async mounted() {
    this.buscarUsuarios()
  },
  methods: {
    async buscarUsuarios() {
      await api.get('/usuarios').then(response => {
        this.items = response.data
      }).catch(erro => {
        console.log(erro)
      })
    },

    gerarRelatorio() {
      let novosDados = JSON.parse(JSON.stringify(this.items))
      let hojeAgr = dayjs().format('DD/MM/YYYY HH:mm:ss')
      var doc = new jsPDF()
      doc.page = 1
      doc.setProperties({
        title: "Relátorio de Usuários"
      });
      doc.setFontSize(10)
      doc.text(hojeAgr, 200, 10, null, null, "right")
      doc.line(10, 12, 200, 12);
      doc.setFontSize(24)
      doc.text(`Relátorio de Usuários`, 10, 22)
      doc.setFontSize(14)
      doc.text(`Total: ${this.items.length}`, 200, 21, null, null, "right")
      doc.autoTable({
        head: [['Nome', 'Email', 'Usuário', 'Permissão']],
        columns: [
          {header: 'Nome', dataKey: 'nome'},
          {header: 'Email', dataKey: 'email'},
          {header: 'Usuário', dataKey: 'usuario'},
          {header: 'Permissão', dataKey: 'permissao'},
        ],
        body: novosDados,
        theme: 'striped',
        headStyles: {
          fillColor: [50, 50, 50]
        },
        startY: 25,
        pageBreak: 'auto',
        margin: {left: 10, right: 10, top: 10},
      })
      const totalPaginas = doc.internal.getNumberOfPages()
      doc.setFontSize(8)
      for (var i = 1; i <= totalPaginas; i++) {
        doc.setPage(i)
        doc.text(`Página ${String(i)} de ${String(totalPaginas)}`, 205, 293, null, null, "right")
      }
      window.open(doc.output('bloburl', {filename: 'tabela_usuarios.pdf'}));
    },
    cancelar(usuario){
      if(usuario){
        this.items.push(usuario)
      }
      this.dialogUsuario = false
      this.idUsuario = null
    },

    cadastrado(dados) {
      let { usuario, notificar } = dados
      if(notificar){
        this.items.push(usuario)
        this.mostrarAlerta = true
        this.funcao = 'cadastrado'
        this.dialogUsuario = false
        this.usuario = {}
      }
    },

    editado(usuario){
      let index = this.items.findIndex(obj => {
        return obj.id === usuario.id
      })
      for(let key of Object.keys(usuario)){
        this.items[index][key] = usuario[key]
      }
      this.dialogUsuario = false
      this.funcao = 'editado'
      this.mostrarAlerta = true
      this.idUsuario = null
    },

    async deletar() {
      let usuario = this.usuario
      await api.delete(`/usuario/deletar/${usuario.id}`).then(() => {
        let index = this.items.findIndex(obj => {
          return obj.id === usuario.id
        })
        this.dialogDeletar = false
        this.items.splice(index, 1)
        this.funcao = 'deletado'
        this.mostrarAlerta = true
        this.usuario = {}
      }).catch(erro => {
        let mensagem = erro.response.data.erro
        this.funcao = 'erro'
        this.textoAlerta = mensagem
        this.mostrarAlerta = true
      })
    },
  },

}
</script>

<style scoped src="../../css/dataTableVuetifyCustom.css"/>
<style>

</style>
