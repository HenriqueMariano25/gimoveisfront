<template>
  <v-dialog v-model="mostrar" persistent max-width="1200px">
    <v-card class="pa-5">
      <v-row>
        <v-col>
          <v-row>
            <v-col>
              <h3 class="ma-0">{{ editando ? 'Editando imóvel' : 'Cadastrando imóvel' }}</h3>
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
                  <v-tab :disabled="!editando" @click="buscarComodos()">Cômodos</v-tab>
                  <v-tab :disabled="!editando" @click="buscarDespesas()">Despesas</v-tab>
                  <v-tab :disabled="!editando" @click="buscarContratos()">Contratos</v-tab>

                  <v-tabs-items v-model="tab">

                    <v-tab-item>
                      <v-row align="center" class="mt-1">
                        <v-col cols="12" xl="6" lg="6" md="6">
                          <v-text-field
                              label="Nome*"
                              outlined
                              dense
                              hide-details
                              v-model="imovel.nome"
                              :rules="[validacoes.required]"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" xl="4" lg="4" md="4">
                          <v-autocomplete
                              :items="proprietarios"
                              outlined
                              hide-details="auto"
                              label="Proprietário*"
                              item-value="id"
                              item-text="nome"
                              dense
                              v-model="imovel.id_responsavel"
                              :rules="[validacoes.required]"
                          >
                          </v-autocomplete>
                        </v-col>
                        <v-col>
                          <v-autocomplete
                              :items="tiposStatus"
                              outlined
                              hide-details="auto"
                              label="Status"
                              item-value="id"
                              item-text="descricao"
                              dense
                              v-model="imovel.id_status"
                          >
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" xl="5" lg="5" md="5">
                          <v-text-field
                              label="Inscrição Municipal"
                              outlined
                              dense
                              hide-details
                              v-model="imovel.inscricao_municipal"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" xl="5" lg="5" md="5">
                          <v-text-field
                              label="Funesbom"
                              outlined
                              dense
                              hide-details
                              v-model="imovel.funesbom"
                              v-mask="'#######-#'"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col>
                          <v-autocomplete
                              :items="tiposImoveis"
                              outlined
                              hide-details="auto"
                              label="Tipo do Imóvel*"
                              item-value="id"
                              item-text="descricao"
                              dense
                              v-model="imovel.tipo_imovel"
                              :rules="[validacoes.required]"
                          >
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" xl="2" lg="2" md="2">
                          <v-text-field
                              label="CEP"
                              outlined
                              dense
                              hide-details
                              v-model="imovel.cep"
                              v-mask="'#####-###'"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field
                              label="Rua"
                              outlined
                              dense
                              hide-details
                              v-model="imovel.rua"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" xl="2" lg="2" md="2">
                          <v-text-field
                              label="Número"
                              outlined
                              dense
                              hide-details
                              v-model="imovel.numero"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" xl="2" lg="2" md="2">
                          <v-text-field
                              label="UF"
                              outlined
                              dense
                              hide-details
                              v-model="imovel.estado"
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
                              v-model="imovel.bairro"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" xl="4" lg="4" md="4">
                          <v-text-field
                              label="Cidade"
                              outlined
                              dense
                              hide-details
                              v-model="imovel.cidade"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" xl="4" lg="4" md="4">
                          <v-text-field
                              label="Complemento"
                              outlined
                              dense
                              hide-details
                              v-model="imovel.complemento"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-tab-item>

                    <v-tab-item eager>
                      <v-row class="mt-1">
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-text-field
                              label="Data de aquisição"
                              outlined
                              dense
                              hide-details
                              v-model="imovel.data_aquisicao"
                              type="date"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-text-field
                              label="Data de venda"
                              outlined
                              dense
                              hide-details
                              v-model="imovel.data_venda"
                              type="date"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-text-field
                              label="Área total m²"
                              outlined
                              dense
                              hide-details
                              v-model="imovel.area"
                              type="number"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-text-field
                              label="Área construída m²"
                              outlined
                              dense
                              hide-details
                              v-model="imovel.area_construida"
                              type="number"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" xl="4" lg="4" md="4">
                          <v-text-field
                              label="Valor da aquisição"
                              outlined
                              dense
                              hide-details
                              ref="valor_aquisicao"
                              v-model="imovel.valor_aquisicao"
                              v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                            allowNegative: false, currency:'BRL'}"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" xl="4" lg="4" md="4">
                          <v-text-field
                              label="Valor da aquisiçao em Dólar"
                              outlined
                              dense
                              hide-details
                              ref="valor_aquisicao_dolar"
                              v-model="imovel.valor_aquisicao_dolar"
                              v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                          allowNegative: false, currency:'USD'}"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" xl="4" lg="4" md="4">
                          <v-text-field
                              label="Valor atual"
                              outlined
                              dense
                              hide-details
                              ref="valor_atual"
                              v-model="imovel.valor_atual"
                              v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                          allowNegative: false, currency:'BRL'}"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" xl="6" lg="6" md="6">
                          <v-text-field
                              label="Nº cliente luz"
                              outlined
                              dense
                              hide-details
                              v-model="imovel.numero_cliente_luz"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" xl="6" lg="6" md="6">
                          <v-text-field
                              label="Nº cliente água"
                              outlined
                              dense
                              hide-details
                              v-model="imovel.numero_cliente_agua"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-textarea
                              label="Observação"
                              outlined
                              dense
                              hide-details
                              v-model="imovel.observacao"
                          ></v-textarea>
                        </v-col>
                      </v-row>
                    </v-tab-item>

                    <v-tab-item>
                      <v-row class="mt-2">
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-autocomplete
                              :items="tiposComodos"
                              outlined
                              hide-details="auto"
                              label="Tipo do comôdo"
                              item-value="id"
                              item-text="descricao"
                              dense
                              v-model="comodo.id_tipo_comodo"
                          >
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="12" xl="2" lg="2" md="2">
                          <v-text-field
                              label="Quantidade"
                              outlined
                              dense
                              hide-details
                              type="number"
                              v-model="comodo.quantidade"
                          >
                          </v-text-field>
                        </v-col>

                        <v-col>
                          <v-text-field
                              label="Descricao"
                              outlined
                              dense
                              hide-details
                              v-model="comodo.descricao"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="auto" v-if="editandoComodo">
                          <v-btn dark color="var(--btn-cancelar)" class="border-radius" fab small depressed
                                 @click="comodo = {};editandoComodo = false">
                            <v-icon>
                              mdi-close
                            </v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="auto">
                          <v-btn dark color="var(--btn-adicionar-azul)"
                                 class="border-radius"
                                 fab
                                 small
                                 depressed
                                 @click="editandoComodo ? editarComodo() : cadastrarComodo()">
                            <v-icon>
                              {{ editandoComodo ? 'mdi-content-save' : 'mdi-plus' }}
                            </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-data-table
                              :headers="headersComodo"
                              :items="comodos"
                              class="elevation-1 tabela"
                              mobile-breakpoint="0"
                              dense
                              disable-pagination
                              hide-default-footer
                              :height="comodos.length > 0 ? '250px' : ''"
                              fixed-header
                              item-key="id"
                          >
                            <template v-slot:item="{ item }">
                              <tr>
                                <td>{{ item.tipo_comodo }}</td>
                                <td>{{ item.quantidade }}</td>
                                <td>{{ item.descricao }}</td>
                                <td class="acoes text-center">
                                  <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn icon v-bind="attrs" v-on="on" color="black"
                                             @click="comodo = Object.assign({},item);editandoComodo = true;">
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
                                          @click="dialogDeletarComodo = true; comodo = item"
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
                      <v-row class="mt-1">
                        <v-col>
                          <v-text-field
                              label="Valor*"
                              outlined
                              dense
                              hide-details
                              ref="despesa_valor"
                              v-model="despesa.valor"
                              v-currency="{
                                precision: 2,
                                autoDecimalMode: true,
                                distractionFree: false,
                                allowNegative: false,
                                currency:{prefix:'R$ '}
                              }"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field
                              label="Data"
                              outlined
                              dense
                              hide-details
                              v-model="despesa.data"
                              type="date"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field
                              label="Vencimento"
                              outlined
                              dense
                              hide-details
                              v-model="despesa.data_vencimento"
                              type="date"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col>
                          <v-autocomplete
                              :items="tiposDespesas"
                              outlined
                              hide-details="auto"
                              label="Tipo de despesa*"
                              item-value="id"
                              item-text="descricao"
                              dense
                              v-model="despesa.id_tipo_despesa"
                          >
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-autocomplete
                              :items="fixaVariavel"
                              outlined
                              hide-details="auto"
                              label="Fixa ou Variável*"
                              item-value="valor"
                              item-text="descricao"
                              dense
                              v-model="despesa.fixa_variavel"
                          >
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-autocomplete
                              :items="tiposResponsaveisPagamento"
                              outlined
                              hide-details="auto"
                              label="Responsável*"
                              item-value="id"
                              item-text="descricao"
                              dense
                              v-model="despesa.id_responsavel_pagamento"
                          >
                          </v-autocomplete>
                        </v-col>
                        <v-col>
                          <v-text-field
                              label="Descrição"
                              outlined
                              dense
                              hide-details
                              v-model="despesa.descricao"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="auto" v-if="editandoDespesa">
                          <v-btn dark color="var(--btn-cancelar)" class="border-radius" fab small depressed
                                 @click="despesa = {};editandoDespesa = false">
                            <v-icon>
                              mdi-close
                            </v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="auto">
                          <v-btn dark color="var(--btn-adicionar-azul)"
                                 class="border-radius"
                                 fab
                                 small
                                 depressed
                                 @click="editandoDespesa ? editarDespesa() : cadastrarDespesa()">
                            <v-icon>
                              {{ editandoDespesa ? 'mdi-content-save' : 'mdi-plus' }}
                            </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-data-table
                              :headers="headersDespesa"
                              :items="despesas"
                              class="elevation-1 tabela"
                              mobile-breakpoint="0"
                              dense
                              disable-pagination
                              hide-default-footer
                              :height="despesas.length > 0 ? '250px' : ''"
                              fixed-header
                              :expanded="expandedDespesa"
                              single-expand
                              item-key="id"
                          >
                            <template v-slot:expanded-item="{ headers, item }">
                              <td :colspan="headers.length" style="background-color: #d5e6fd">
                                <ul class="pa-3" style="list-style-type: none;">
                                 <li v-if="item.data"><span><strong>Data: </strong>{{ dayjs(item.data).format('DD/MM/YYYY') }}</span></li>
                                 <li v-if="item.fixa_variavel"><span><strong>Fixa ou Variável: </strong>{{ item.fixa_variavel }}</span></li>
                                 <li v-if="item.responsavel_pagamento"><span><strong>Responsável: </strong>{{ item.responsavel_pagamento }}</span></li>
                                </ul>
                              </td>
                            </template>
                          <template v-slot:item="{ item }">
                              <tr>
                                <td @click.prevent="abrirDetalhesDespesa(item, $event)">R$ {{ item.valor.replace('.', ',') }}</td>
                                <td @click.prevent="abrirDetalhesDespesa(item, $event)">{{ item.descricao }}</td >
                                <td @click.prevent="abrirDetalhesDespesa(item, $event)">{{item.data_vencimento ? dayjs(item.data_vencimento).format('DD/MM/YYYY') : '' }}</td>
                                <td @click.prevent="abrirDetalhesDespesa(item, $event)">{{ item.descricao_tipo_despesa }}</td>
                                <td class="acoes text-center">
                                  <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">

                                      <v-btn icon v-bind="attrs" v-on="on" color="black"
                                             @click="despesa = Object.assign({},item);editandoDespesa = true;setarValor($refs.despesa_valor, item.valor);">
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
                                          @click="dialogDeletarDespesa = true; despesa = item"
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
                          <span><strong>Contratos de: {{ imovel.nome }}</strong></span>
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
                                <td @click.prevent="buscarBoletos(item, $event)">{{ ("0000" + item.contrato).slice(-4) }}</td>
                                <td @click.prevent="buscarBoletos(item, $event)">{{ item.cliente }}</td>
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
                          <span><strong>Boletos do contrato:
<!--                            {{ idContrato }}-->
                          </strong></span>
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
              <v-btn color="var(--btn-salvar)" dark large @click="editando ? editarImovel() : cadastrarImovel(false)">
                <v-icon class="mr-1">mdi-content-save</v-icon>
                {{ !$isMobile ? 'Salvar' : '' }}
              </v-btn>
            </v-col>
            <v-col cols="auto" v-if="!editando">
              <v-btn color="var(--btn-salvar)" dark large @click="cadastrarImovel(true)">
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
          :texto="`Certeza que deseja deletar o cômodo: ${ comodo.tipo_comodo } - ${comodo.descricao}?`"
          sub-texto="Após deletar esse cômodo não é possivel recuperar!"
          :mostrar="dialogDeletarComodo"
          @cancelar="dialogDeletarComodo = !dialogDeletarComodo; comodo = {}"
          @deletar="deletarComodo"
      >
      </dialog-deletar>

      <dialog-deletar
          width="650px"
          :texto="`Certeza que deseja deletar essa despesa: R$${ despesa.valor ? despesa.valor.replace('.', ',') : '' } - ${despesa.descricao} ?`"
          sub-texto="Após deletar essa despesa não é possivel recuperar!"
          :mostrar="dialogDeletarDespesa"
          @cancelar="dialogDeletarDespesa = !dialogDeletarDespesa; despesa = {}"
          @deletar="deletarDespesa()"
      >
      </dialog-deletar>

    </v-card>
  </v-dialog>
</template>

<script>
import api from "../../services/api";
import AlertaAcoes from '../../components/shared/AlertaAcoes'
import {setValue} from "vue-currency-input";
import DialogDeletar from "../../components/shared/DialogDeletar";
import dayjs from 'dayjs'

export default {
  name: "DialogImovel",
  props: ['mostrar', 'idImovel'],
  components:{
    AlertaAcoes,
    DialogDeletar
  },
  data() {
    return {
      dayjs: dayjs,
      proprietarios: [],
      tiposStatus: [],
      tiposImoveis: [],
      tiposComodos: [],
      tiposDespesas: [],
      fixaVariavel: [
        {valor: 'fixa', descricao: 'Fixa'},
        {valor: 'variavel', descricao: "Variável"}
      ],
      tiposResponsaveisPagamento: [],
      comodos: [],
      despesas: [],
      contratos: [],
      boletos: [],
      editando: false,
      valido: false,
      tab: null,
      headersComodo: [
        {text: 'Tipo', value: 'tipo_comodo', align: 'center'},
        {text: 'Quantidade', value: 'quantidade', align: 'center'},
        {text: 'Descrição', value: 'descricao'},
        {text: '', value: 'acoes', align: 'center', sortable: false, width: '90px'},
      ],
      headersDespesa: [
        {text: 'Valor', value: 'valor', align: 'center'},
        {text: 'Descrição', value: 'descricao', align: 'center'},
        {text: 'Vencimento', value: 'data_vencimento'},
        {text: 'Tipo', value: 'descricao_tipo_despesa'},
        {text: '', value: 'acoes', align: 'center', sortable: false, width: '90px'},
      ],
      headersContratos: [
        {text: 'Contrato', value: 'id', align: 'center'},
        {text: 'Cliente', value: 'cliente'},
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
      imovel: {
        id: "",
        nome: "",
        id_responsavel: null,
        status: "",
        id_status: null,
        inscricao_municipal: "",
        funesbom: "",
        tipo_imovel: null,
        rua: "",
        cep: "",
        bairro: "",
        cidade: "",
        estado: "",
        numero: "",
        complemento: "",
        identidade: "",
        data_aquisicao: "",
        data_venda: "",
        area: "",
        area_construida: "",
        valor_aquisicao: "",
        valor_atual: "",
        valor_aquisicao_dolar: "",
        valor_aquisicao_mascara: "",
        valor_atual_mascara: "",
        valor_aquisicao_dolar_mascara: "",
        numero_cliente_luz: "",
        numero_cliente_agua: "",
        observacao: ""
      },
      comodo: {
        id: "",
        descricao: "",
        id_tipo_comodo: null,
        quantidade: ""
      },
      despesa: {
        valor: "",
        data: "",
        data_vencimento: "",
        tipo_despesa: null,
        fixa_variavel: null,
        descricao: "",
        id_responsavel_pagamento: null
      },
      validacoes: {
        required: value => !!value || '',
        requiredValor: value => this.$converterDinherioFloat(value) !== '0.00' || ''
      },
      editandoComodo: false,
      mostrarAlerta: false,
      funcao: '',
      textoAlerta: '',
      palavraChave: 'imóvel',
      comodosForamBuscados: false,
      dialogDeletarComodo: false,
      despesasForamBuscados: false,
      dialogDeletarDespesa: false,
      expandedDespesa: [],
      editandoDespesa: false,
      contratosForamBuscados: false,
      imovelParaAdicionar: {},
      adicionaImovelAItens: false
    }
  },
  created() {
    this.buscarProprietarios()
    this.buscarTiposStatus()
    this.buscarTiposImoveis()
    this.buscarTiposComodos()
    this.buscarTiposDespesas()
    this.buscarTiposResponsaveisPagamento()
  },
  methods: {
    async buscarProprietarios() {
      await api.get('/imoveis/proprietarios').then(resp => {
        this.proprietarios = resp.data
      })
    },
    async buscarTiposStatus() {
      await api.get("/imovel/status").then(resp => {
        this.tiposStatus = resp.data;
      });
    },
    async buscarTiposImoveis() {
      await api.get("/imovel/tipos_imoveis").then(resp => {
        this.tiposImoveis = resp.data;
      });
    },
    async buscarTiposComodos() {
      await api.get("/imoveis/tipo_comodo").then(resp => {
        this.tiposComodos = resp.data;
      });
    },
    async buscarTiposDespesas() {
      await api.get('/imoveis/despesas/tipo_despesas').then(resp => {
        this.tiposDespesas = resp.data
      })
    },
    async buscarTiposResponsaveisPagamento() {
      await api.get('/imoveis/despesas/responsavel_pagamento').then(resp => {
        this.tiposResponsaveisPagamento = resp.data
      })
    },
    async buscarContratos() {
      if (this.contratosForamBuscados === false) {
        await api.get('/imoveis/contratos', {params: {idContrato: this.imovel.id}}).then(resp => {
          this.contratos = resp.data
          this.contratosForamBuscados = true
        })
      }
    },
    async buscarBoletos(contrato) {
      this.idContrato = ("0000" + contrato.contrato).slice(-4)
      let idContrato = ("0000" + contrato.contrato).slice(-4)
      await api.get('/cliente/contrato/boletos', {params: {idContrato: idContrato}}).then(resp => {
        this.boletos = resp.data
      })
    },

    setarValor (elemento, valor){
      setValue(elemento, valor)
    },

    cancelar(){
      if(this.adicionaImovelAItens){
        this.$emit('cancelar', this.imovelParaAdicionar)
      }else{
        this.$emit('cancelar')
      }
      this.tab = null
    },


    async cadastrarImovel(sair) {
      const isValido = this.$refs.formulario.validate()

      if(isValido){
        this.imovel.valor_aquisicao = this.$converterDinherioFloat(this.imovel.valor_aquisicao)
        this.imovel.valor_atual = this.$converterDinherioFloat(this.imovel.valor_atual)
        this.imovel.valor_aquisicao_dolar = this.$converterDinherioFloat(this.imovel.valor_aquisicao_dolar)
        let idUsuario = this.$store.state.usuario.id
        await api.post("/imovel/cadastrar", {
          imovel: this.imovel,
          comodos: this.comodos,
          idUsuario: idUsuario
        }).then(resp => {
          let imovel = resp.data.imovel
          if (sair) {
            this.tab = null
            this.$emit('cadastrado', {imovel: imovel, notificar: true})
          } else {
            this.imovel.id = imovel.id
            this.imovelParaAdicionar = imovel
            this.adicionaImovelAItens = true
            this.funcao = 'cadastrado'
            this.palavraChave = 'imóvel'
            this.mostrarAlerta = true
            this.editando = true
            this.$emit('cadastrado', {imovel: imovel, notificar: false})
            this.imovelParaAdicionar = {}
          }
        }).catch(erro => {
          let mensagem = erro.response.data.erro
          this.funcao = 'erro'
          this.textoAlerta = mensagem
          this.mostrarAlerta = true
        });
      }
    },

    async editarImovel() {
      const isValido = this.$refs.formulario.validate()

      if(isValido){
        let imovel = Object.assign({}, this.imovel)

        imovel.valor_aquisicao = this.$converterDinherioFloat(this.imovel.valor_aquisicao)
        imovel.valor_atual = this.$converterDinherioFloat(this.imovel.valor_atual)
        imovel.valor_aquisicao_dolar = this.$converterDinherioFloat(this.imovel.valor_aquisicao_dolar)

        let idUsuario = this.$store.state.usuario.id

        await api.post(`/imovel/editar/${this.imovel.id}`, {
          imovel: imovel,
          comodos: this.comodos,
          idUsuario: idUsuario
        }).then(resp => {
          this.tab = null
          let imovel = resp.data.imovel
          this.$emit('editado', imovel)
          this.imovel = {}
        }).catch(erro => {
          console.log(erro)
        });
      }
    },


    async buscarComodos() {
      if (this.comodosForamBuscados === false) {
        await api.get('/imoveis/comodos', {params: {idImovel: this.idImovel}}).then(resp => {
          this.comodos = resp.data
          this.comodosForamBuscados = true
        })
      }
    },
    async cadastrarComodo() {
      let idImovel = this.imovel.id
      let idUsuario = this.$store.state.usuario.id
      await api.post('/imoveis/comodo/cadastrar', {
        comodo: this.comodo,
        idImovel: idImovel,
        idUsuario: idUsuario
      }).then(resp => {
        this.palavraChave = 'cômodo'

        let comodo = resp.data.comodo
        this.comodos.push(comodo)
        this.comodo = {}
        this.funcao = 'cadastrado'
        this.mostrarAlerta = true
      })
    },
    async editarComodo(){
      let idUsuario = this.$store.state.usuario.id

      await api.post('/imoveis/comodo/editar', {comodo: this.comodo, idUsuario: idUsuario}).then(resp => {
        this.comodo = {}
        let comodo = resp.data.comodo
        let index = this.comodos.findIndex(obj => {
          return obj.id === comodo.id
        })
        this.comodos[index].descricao = comodo.descricao
        this.comodos[index].quantidade = comodo.quantidade
        this.comodos[index].tipo_comodo = comodo.tipo_comodo
        this.comodos[index].id_tipo_comodo = comodo.id_tipo_comodo

        this.editandoComodo = false
        this.palavraChave = 'cômodo'
        this.funcao = 'editado'
        this.mostrarAlerta = true
      })
    },
    async deletarComodo(){
      let comodo = this.comodo
      api.delete('/imoveis/comodo/deletar', {params: {idComodo: comodo.id}}).then(resp => {
        let {id} = resp.data.comodo
        let index = this.comodos.findIndex(obj => {
          return obj.id === id
        })
        this.comodos.splice(index, 1)
        this.dialogDeletarComodo = false
        this.comodo = {}
        this.palavraChave = 'cômodo'
        this.funcao = 'deletado'
        this.mostrarAlerta = true
      })
    },


    async buscarDespesas() {
      if (this.despesasForamBuscados === false) {
        await api.get('/imoveis/despesas', {params: {idImovel: this.imovel.id}}).then(resp => {
          this.despesas = resp.data
          this.despesasForamBuscados = true
        })
      }
    },
    abrirDetalhesDespesa(item, evento) {
      let removerClass = document.querySelector('.aberto')
      if (removerClass)
        removerClass.classList.remove('aberto')

      let tr = evento.target.parentElement

      if (this.expandedDespesa[0] === item) {
        this.expandedDespesa = []
      } else {
        this.expandedDespesa = []
        tr.classList.add('aberto')
        this.expandedDespesa.push(item)
      }
    },
    async cadastrarDespesa() {
      let idUsuario = this.$store.state.usuario.id
      this.despesa.valor = this.$converterDinherioFloat(this.despesa.valor)

      await api.post('/imoveis/despesas/cadastrar', {
        despesa: this.despesa,
        idImovel: this.imovel.id,
        idUsuario: idUsuario
      }).then(resp => {
        this.palavraChave = 'despesa'

        let despesa = resp.data.despesa
        this.despesas.push(despesa)
        this.despesa = {}
        this.funcao = 'cadastrado'
        this.mostrarAlerta = true
      })
    },

    async editarDespesa(){
      let idUsuario = this.$store.state.usuario.id
      this.despesa.valor = this.$converterDinherioFloat(this.despesa.valor)

      await api.post('/imoveis/despesas/editar', {despesa: this.despesa, idUsuario: idUsuario}).then(resp => {
        this.despesa = {}
        let despesa = resp.data.despesa
        let index = this.despesas.findIndex(obj => {
          return obj.id === despesa.id
        })
        for(let key of Object.keys(despesa)){
          this.despesas[index][key] = despesa[key]
        }
        this.editandoDespesa = false
        this.palavraChave = 'despesa'
        this.funcao = 'editado'
        this.mostrarAlerta = true
      })
    },

    async deletarDespesa(){
      let despesa = this.despesa

      api.delete(`/imoveis/despesa/${despesa.id}/deletar`).then(resp => {
        let {id} = resp.data.despesa
        let index = this.despesas.findIndex(obj => {
          return obj.id === id
        })
        this.despesas.splice(index, 1)
        this.dialogDeletarDespesa = false
        this.despesa = {}
        this.palavraChave = 'despesa'
        this.funcao = 'deletado'
        this.mostrarAlerta = true
      })
    }
  },

  watch: {
    mostrar: async function (valor) {
      if (valor === true) {
        if (this.idImovel) {
          await api.get(`/imovel/${this.idImovel}`).then(resp => {
            this.imovel = resp.data
            let imovel = resp.data
            this.$nextTick(() => {
              setValue(this.$refs.valor_aquisicao_dolar, imovel.valor_aquisicao_dolar)
              setValue(this.$refs.valor_aquisicao, imovel.valor_aquisicao)
              setValue(this.$refs.valor_atual, imovel.valor_atual)
            })
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