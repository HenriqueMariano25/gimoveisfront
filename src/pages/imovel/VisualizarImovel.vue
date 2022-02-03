<template>
  <v-row no-gutters>
    <v-col>
      <v-row no-gutters>
        <v-col>
          <barra-topo-busca titulo="Imóvel" :busca="busca" @buscar="busca = $event"></barra-topo-busca>
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
              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length" style="background-color: #d5e6fd">
                  <ul class="pa-3" style="list-style-type: none;">
                    <li v-if="item.rua && item.cep">
                      <v-row>
                        <v-col cols="auto">
                          <span><strong>Rua: </strong>{{ item.rua }}</span>
                        </v-col>
                        <v-col cols="auto">
                          <span><strong>Número: </strong>{{ item.numero }}</span>
                        </v-col>
                        <v-col cols="auto">
                          <span><strong>Bairro: </strong>{{ item.bairro }}</span>
                        </v-col>
                        <v-col cols="auto">
                          <span><strong>Cidade: </strong>{{ item.cidade }}</span>
                        </v-col>
                        <v-col cols="auto">
                          <span><strong>Estado: </strong>{{ item.estado }}</span>
                        </v-col>
                        <v-col cols="auto">
                          <span><strong>CEP: </strong>{{ item.cep }}</span>
                        </v-col>
                        <v-col cols="auto" v-if="item.complemento">
                          <span><strong>Complemento: </strong>{{ item.complemento }}</span>
                        </v-col>
                      </v-row>
                    </li>
                    <li><span><strong>Proprietário: </strong>{{ item.proprietario }}</span></li>
                    <li><span><strong>Tipo de imóvel: </strong>{{ item.tipo_imovel }}</span></li>
                    <li><span><strong>Inscrição Municipal: </strong>{{ item.inscricao_municipal }}</span></li>
                    <li><span><strong>Funesbom: </strong>{{ item.funesbom }}</span></li>
                  </ul>
                </td>
              </template>
              <template v-slot:item="{ item }">
                <tr>
                  <td @click.prevent="abrirDetalhes(item, $event)">{{ item.nome }}</td>
                  <td @click.prevent="abrirDetalhes(item, $event)"><span v-if="item.rua && item.cep">{{ item.rua }}, N°{{ item.numero}}, {{item.complemento}}</span></td>
                  <td @click.prevent="abrirDetalhes(item, $event)">{{ item.status }}</td>
                  <td class="acoes text-center">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on" color="black" @click="dialogImovel = true; idImovel = item.id">
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

        <barra-bottom-botoes
            :btn-adicionar="true"
            @clickBtnAdicionar="dialogImovel = true"
            @clickBtnImprimirRelatorio="gerarRelatorio"
            :btn-gerar-relatorio="true"
        ></barra-bottom-botoes>

        <dialog-imovel
            :mostrar="dialogImovel"
            @cancelar="cancelar"
            @cadastrado="cadastrado"
            @editado="editado"
            :idImovel="idImovel"

        ></dialog-imovel>

      </v-row>
    </v-col>

    <alerta-acoes
        palavra-chave='imóvel'
        @sumir="mostrarAlerta = false"
        v-bind:mostrar="mostrarAlerta"
        :funcao="funcao"
    ></alerta-acoes>
  </v-row>
</template>

<script>
import api from "../../services/api"
import {jsPDF} from "jspdf"
import 'jspdf-autotable'
import dayjs from 'dayjs'


import BarraTopoBusca from "../../components/shared/BarraTopoBusca"
import BarraBottomBotoes from "../../components/shared/BarraBottomBotoes"
import DialogImovel from "./DialogImovel";
import AlertaAcoes from "../../components/shared/AlertaAcoes"

export default {
  name: "VisualizarImovel",
  components: {
    BarraTopoBusca,
    BarraBottomBotoes,
    DialogImovel,
    AlertaAcoes,
  },
  data() {
    return {
      real: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        suffix: '',
        precision: 2,
      },
      dolar: {
        decimal: ',',
        thousands: '.',
        prefix: 'US$ ',
        suffix: '',
        precision: 2,
      },
      items: [],
      headers: [
        {text: 'Nome', value: 'nome'},
        {text: 'Endereço', value: 'rua'},
        {text: 'Status', value: 'status'},
        {text: '', value: 'acoes', align: 'center', sortable: false, width: '90px'},
      ],
      despesa: {
        valor: "",
        data: "",
        data_vencimento: "",
        tipo_despesa: null,
        fixa_variavel: null,
        descricao: "",
        id_responsavel_pagamento: null
      },
      comodo: {
        id: "",
        descricao: "",
        id_tipo_comodo: null,
        quantidade: ""
      },
      tiposStatus: [],
      tiposImoveis: [],
      tiposComodos: [],
      tiposDespesas: [],
      tiposResponsaveisPagamento: [],
      editar: false,
      carregandoCep: false,
      contratos: [],
      idContrato: "",
      boletos: "",
      fixaVariavel: [
        {valor: 'fixa', descricao: 'Fixa'},
        {valor: 'variavel', descricao: "Variável"}
      ],
      despesas: [],
      editandoDespesa: false,
      comodos: [],
      carregandoComodos: false,
      editandoComodo: false,
      idContratoModal: "",
      modal_visivel: false,
      recarregarImovel: false,
      cep_atual: "",
      proprietarios: [],
      filtrados: [],
      dayjs: dayjs,
      barraBuscaMobile: false,


      busca: '',
      expanded: [],
      dialogImovel: false,
      idImovel: null,
      funcao: '',
      mostrarAlerta: false,
      dialogDeletar: false,
      imovel: {}
    };
  },

  methods: {
    async buscarImoveis() {
      await api.get("/imoveis").then((response) => {
        this.items = response.data
        this.filtrados = response.data
      }).catch((erro) => {
        console.log(erro);
      });
    },

    gerarRelatorio() {
      let novosDados = JSON.parse(JSON.stringify(this.filtrados))
      for (let i in novosDados) {
        let rua_formatada = `${novosDados[i].rua}, N° ${novosDados[i].numero}, ${novosDados[i].complemento}`
        novosDados[i].rua = rua_formatada
      }
      let hojeAgr = dayjs().format('DD/MM/YYYY hh:mm:ss')
      var doc = new jsPDF()
      doc.page = 1
      doc.setProperties({
        title: "Relátorio de Imóveis"
      });
      doc.setFontSize(10)
      doc.text(hojeAgr, 200, 10, null, null, "right")
      doc.line(10, 12, 200, 12);
      doc.setFontSize(24)
      doc.text(`Relátorio de Imóveis`, 10, 22)
      doc.setFontSize(14)
      doc.text(`Total: ${this.filtrados.length}`, 200, 21, null, null, "right")
      doc.autoTable({
        head: [['Nome', 'Endereço', 'Status']],
        columns: [
          {header: 'Nome', dataKey: 'nome'},
          {header: 'Endereço', dataKey: 'rua'},
          {header: 'Status', dataKey: 'status'}
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
      window.open(doc.output('bloburl', {filename: 'tabela_imoveis.pdf'}));
    },

    abrirDetalhes(item, evento) {
      let removerClass = document.querySelector('.aberto')
      if (removerClass)
        removerClass.classList.remove('aberto')

      let tr = evento.target.parentElement

      if (this.expanded[0] === item) {
        this.expanded = []
      } else {
        this.expanded = []
        tr.classList.add('aberto')
        this.expanded.push(item)
      }
    },

    cancelar(imovel){
      if(imovel){
        this.items.push(imovel)
      }

      this.dialogImovel = false
      this.idImovel = null
    },

    cadastrado(dados) {
      let { imovel, notificar } = dados
      this.items.push(imovel)

      if(notificar){
        this.mostrarAlerta = true
        this.funcao = 'cadastrado'
        this.dialogImovel = false
        this.imovel = {}
      }
    },

    editado(imovel){
      let index = this.items.findIndex(obj => {
        return obj.id === imovel.id
      })
      for(let key of Object.keys(imovel)){
        this.items[index][key] = imovel[key]
      }
      this.dialogImovel = false
      this.funcao = 'editado'
      this.mostrarAlerta = true
      this.idImovel = null
    },
  },
  async mounted() {
    this.buscarImoveis();
  },
};
</script>

<style scoped src="../../css/dataTableVuetifyCustom.css"/>

<style scoped>

html,
body {
  height: 100%;
}

.input-personalizado {
  width: 100%;
  margin-bottom: 10px;
}

.botao-salvar {
  width: 100%;
  margin-top: 5px;
}

.botao-adicionar-comodo {
  margin-top: 16px;
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

.item-coluna-centralizada {
  display: flex;
  align-items: center;
  justify-content: center;
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

.tr-imovel {
  margin-top: 6px;
  margin-bottom: 0px;
}

.barra-top-imovel {
  padding: 0;
  margin: 0;
  margin-bottom: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 1px 5px rgba(200, 200, 200, 0.5);
}

.botao-deletar-comodo {
  margin-top: 17px;
}

.tabela-imoveis {
  background-color: white;
  margin: 0;
  padding: 0;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0px 1px 5px rgba(200, 200, 200, 0.5);
}

.col-tabela-imoveis {
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

.select-personalizado {
  margin-bottom: 10px;
}

.bv-no-focus-ring {
  margin: 0;
  padding: 0;
  color: rgb(110, 110, 110);
  font-size: 12px;
}

.tabelas-contrato {
  padding-top: 0;
}

.p-contratos {
  margin: 0;
}

table#tabela-imovel .flip-list-move {
  transition: transform 0.3s;
}

.td-centralizado {
  padding-top: 10px !important;
}

.modal-adicionando-imovel {
  margin-left: 25px;
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

.barra-busca-mobile__imprimir {
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
  .tabela-imovel {
    max-height: calc(((((100vh - 82px) - 30px) - 48px) - 52px) - 55px - 20px) !important;
  }

  .barra-busca-mobile {
    display: block;
  }

  .botao-add-total-mobile {
    display: block;
  }

  .col-tabela-imoveis {
    padding-top: 10px;
  }

  .esconder-quando-mobile {
    display: none;
  }

  .container-paginacao-total-mobile {
    display: block;
  }
}

</style>
