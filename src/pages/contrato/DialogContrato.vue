<template>
  <v-dialog v-model="mostrar" persistent max-width="1200px">
    <v-card class="pa-3">
      <CabecalhoDialog
          :texto-cadastrando="editando ? 'Editando contrato' : 'Cadastrando contrato'"
          @fechar="cancelar()"
      />

      <v-row class="mt-0">
        <v-col>
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
                  <v-tab :disabled="!editando" @click="buscarBoletos">Boletos</v-tab>
                  <v-tab :disabled="!editando" @click="buscarFiadores">Fiador</v-tab>

                  <v-tabs-items v-model="tab" touchless>

                    <v-tab-item>
                      <v-row class="mt-1">
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-autocomplete
                              :items="clientes"
                              outlined
                              hide-details="auto"
                              label="Cliente 1*"
                              item-value="id"
                              item-text="nome"
                              dense
                              v-model="contrato.id_cliente"
                              :rules="[validacoes.required]"
                          >
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-autocomplete
                              :items="clientes"
                              outlined
                              hide-details="auto"
                              label="Cliente 2"
                              item-value="id"
                              item-text="nome"
                              dense
                              v-model="contrato.id_cliente2"
                          >
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-autocomplete
                              :items="responsaveis"
                              outlined
                              hide-details="auto"
                              label="Responsável*"
                              item-value="id"
                              item-text="nome"
                              dense
                              v-model="contrato.id_responsavel"
                              :rules="[validacoes.required]"
                          >
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-autocomplete
                              :items="imoveis"
                              outlined
                              hide-details="auto"
                              label="Imóvel*"
                              item-value="id"
                              item-text="nome"
                              dense
                              v-model="contrato.id_imovel"
                              :rules="[validacoes.required]"
                          >
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-autocomplete
                              :items="statusContrato"
                              outlined
                              hide-details="auto"
                              label="Status*"
                              item-value="id"
                              item-text="descricao"
                              dense
                              v-model="contrato.status"
                              :rules="[validacoes.required]"
                          >
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-text-field
                              label="Data de início*"
                              outlined
                              dense
                              hide-details
                              v-model="contrato.data_inicio"
                              type="date"
                              :rules="[validacoes.required]"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-text-field
                              label="Data de término*"
                              outlined
                              dense
                              hide-details
                              v-model="contrato.data_fim"
                              type="date"
                              :rules="[validacoes.required]"
                              :disabled="!ativo_data_termino"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-text-field
                              label="Vigência (mês)"
                              outlined
                              dense
                              hide-details
                              readonly
                              v-model="contrato.vigencia"
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" xl="4" lg="4" md="4">
                          <v-text-field
                              label="Carencia"
                              outlined
                              v-model="contrato.carencia"
                              dense
                              hide-details
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" xl="4" lg="4" md="4">
                          <v-text-field
                              label="Dia do vencimento*"
                              outlined
                              v-model="contrato.data_vencimento"
                              dense
                              hide-details
                              v-mask="'##'"
                              :rules="[validacoes.dia]"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" xl="4" lg="4" md="4">
                          <v-text-field
                              label="Valor do boleto*"
                              outlined
                              v-model="contrato.valor_boleto"
                              dense
                              hide-details
                              ref="valor_boleto"
                              :rules="[validacoes.required]"
                              v-currency="{useGrouping: false, precision: 2,autoDecimalMode: true, currencyDisplay: 'symbol',
                                allowNegative: false, currency:'BRL', autoSign: true,
                              }"
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field
                              label="Garantia"
                              outlined
                              v-model="contrato.garantia"
                              dense
                              hide-details
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-tab-item>


                    <v-tab-item eager>
                      <v-row class="mt-1">
                        <v-col cols="12" xl="" lg="" md="">
                          <v-file-input
                              label="Importar contrato"
                              outlined
                              dense
                              hide-details
                              prepend-icon="mdi-file-document"
                              :placeholder="textoInputImportarContrato"
                              :disabled="!editando"
                              multiple
                              persistent-placeholder
                              v-model="contratoPDF"
                          ></v-file-input>
                        </v-col>
                        <v-col cols="12" xl="auto" lg="auto" md="auto">
                          <v-btn color="var(--btn-salvar)" :dark="editando" block :disabled="!editando"
                                 @click="importarPDF()">
                            <v-icon>
                              mdi-upload
                            </v-icon>
                            Importar
                          </v-btn>
                        </v-col>
                        <v-col cols="12" xl="auto" lg="auto" md="auto">
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn v-bind="attrs"
                                     v-on="on"
                                     color="var(--btn-deletar)"
                                     :dark="editando && ( contrato.nome_pdf != null && contrato.nome_pdf != '')"
                                     block
                                     :disabled="!editando || ( contrato.nome_pdf == null || contrato.nome_pdf == '')"
                                     @dblclick="removerPDF()">
                                <v-icon>
                                  mdi-delete
                                </v-icon>
                                Remover
                              </v-btn>
                            </template>
                            <span>Clique duas vezes para remover</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                      <v-row class="">
                        <v-col cols="12" xl="" lg="" md="">
                          <v-file-input
                              label="Importar aditivo"
                              outlined
                              dense
                              hide-details
                              prepend-icon="mdi-file-edit"
                              :placeholder="textoInputImportarAditivo"
                              :disabled="!contrato.nome_pdf"
                              multiple
                              persistent-placeholder
                              v-model="aditivoPDF"
                          ></v-file-input>
                        </v-col>
                        <v-col cols="12" xl="auto" lg="auto" md="auto">
                          <v-btn color="var(--btn-salvar)" :dark="editando" block :disabled="!editando"
                                 @click="importarAditivo()">
                            <v-icon>
                              mdi-upload
                            </v-icon>
                            Importar
                          </v-btn>
                        </v-col>
                        <v-col cols="12" xl="auto" lg="auto" md="auto">
                          <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn v-bind="attrs"
                                     v-on="on"
                                     color="var(--btn-deletar)"
                                     :dark="editando && ( contrato.nome_aditivo != null && contrato.nome_aditivo != '')"
                                     block
                                     :disabled="!editando || ( contrato.nome_aditivo == null || contrato.nome_aditivo == '')"
                                     @dblclick="removerAditivo()">
                                <v-icon>
                                  mdi-delete
                                </v-icon>
                                Remover
                              </v-btn>
                            </template>
                            <span>Clique duas vezes para remover</span>
                          </v-tooltip>

                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col class="ml-2" cols="12" xl="auto" lg="auto" md="auto">
                          <v-checkbox
                              dense
                              hide-details
                              label="Juros e multa"
                              v-model="contrato.juros_multa"
                              :disabled="!editando"
                          ></v-checkbox>
                        </v-col>
                        <v-col cols="12" xl="" lg="" md="">
                          <v-text-field
                              label="Juros ao mês"
                              outlined
                              dense
                              hide-details
                              v-model="contrato.juros_mes"
                              v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                            allowNegative: false, currency:{suffix:'%'},
                              'valueRange': {
                                'min': 0,
                                'max': 999
                              },
                              }"
                              ref="juros"
                              :disabled="!editando"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" xl="" lg="" md="">
                          <v-text-field
                              label="Multa"
                              outlined
                              dense
                              hide-details
                              ref="multa"
                              v-model="contrato.multa"
                              v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                            allowNegative: false, currency:{suffix:'%'},
                            'valueRange': {
                                'min': 0,
                                'max': 999
                              },
                              }"
                              :disabled="!editando"
                          >
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row align="center">
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-text-field
                              label="Reajuste do aluguel"
                              outlined
                              dense
                              hide-details
                              v-model="contrato.reajuste"
                              v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                            allowNegative: false, currency:{suffix:'%'}}"
                              :disabled="!editando"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-btn color="var(--btn-salvar)" :dark="editando" large block @click="aplicarReajuste()"
                                 :disabled="!editando">
                            <v-icon>
                              mdi-plus
                            </v-icon>
                            Aplicar reajuste
                          </v-btn>
                        </v-col>
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-text-field
                              label="Valor reajustado"
                              outlined
                              dense
                              hide-details
                              v-model="contrato.valor_reajustado"
                              readonly
                              ref="valor_reajustado"
                              v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                        allowNegative: false, currency:'BRL'}"
                              :disabled="!editando"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-text-field
                              label="Último reajuste"
                              outlined
                              dense
                              hide-details
                              type="date"
                              v-model="contrato.ultimo_reajuste"
                              readonly
                              :disabled="!editando"
                              v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                          allowNegative: false, currency:'BRL'}"
                            >
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row align="center">
                        <v-col cols="12" xl="3" lg="3" md="3">
                          <v-text-field
                              label="Valor anterior"
                              outlined
                              dense
                              hide-details
                              v-model="contrato.valor_anterior_reajustado"
                              readonly
                              ref="valor_anterior"
                              :disabled="!editando"
                              v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                          allowNegative: false, currency:'BRL'}"
                          >
                          </v-text-field>
                        </v-col>
                        <v-col cols="12" xl="3" lg="3" md="3">
                            <v-btn color="var(--azul-secundaria)" :dark="podeReveter" large block @click="confirmacaoReveterAjuste = true"
                                   :disabled="!podeReveter">
                              <v-icon>
                                mdi-eraser
                              </v-icon>
                              Reverter reajuste
                            </v-btn>
                        </v-col>
                        <v-col cols="12" xl="auto" lg="auto" md="auto" v-if="confirmacaoReveterAjuste">
                          <span><strong>Certeza que deseja reverter reajuste ?</strong></span>
                        </v-col>
                        <v-col cols="auto" v-if="confirmacaoReveterAjuste">
                          <v-btn color="var(--btn-salvar)" block dark @click="reverterReajuste()">
                            Sim
                          </v-btn>
                        </v-col>
                        <v-col cols="auto" v-if="confirmacaoReveterAjuste">
                          <v-btn color="var(--btn-deletar)" block dark @click="confirmacaoReveterAjuste = false">
                            Não
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-textarea
                              label="Observação"
                              outlined
                              dense
                              hide-details
                              rows="2"
                              v-model="contrato.observacao"
                          ></v-textarea>
                        </v-col>
                      </v-row>
                    </v-tab-item>

                    <v-tab-item>
                      <v-row class="mt-1">
                        <v-col>
                          <v-data-table
                              :headers="headersBoletos"
                              :items="boletos"
                              class="elevation-1 tabela pointer"
                              mobile-breakpoint="0"
                              disable-pagination
                              hide-default-footer
                              height="450px"
                              fixed-header
                              item-key="id"
                          >
                            <template v-slot:item="{ item }">
                              <tr>
                                <td class="text-center">{{ ("000000" + item.id).slice(-6) }}</td>
                                <td class="text-center">{{ $dayjs(item.data_vencimento).format('DD/MM/YYYY') }}</td>
                                <td class="text-center">R$ {{ item.valor.replace('.', ',') }}</td>
                                <td class="text-center"><span
                                    v-if="item.valor_juros">R$ {{ item.valor_juros.replace('.', ',') }}</span></td>
                                <td class="text-center"><span v-if="item.data_quitacao">{{
                                    $dayjs(item.data_quitacao).format('DD/MM/YYYY')
                                  }}</span></td>
                                <td class="text-center">{{ item.status }}</td>
                                <td class="acoes text-center">
                                  <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn icon v-bind="attrs" v-on="on" color="black"
                                             @click="dialogBoleto = true; boleto = item">
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
                                          @click.prevent="dialogDeletarBoleto = true; boleto = item"
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
                          <v-data-table
                              :headers="headersFiador"
                              :items="fiadores"
                              class="elevation-1 tabela pointer"
                              mobile-breakpoint="0"
                              disable-pagination
                              hide-default-footer
                              fixed-header
                              item-key="id"
                              single-expand
                              :expanded="expanded"
                          >
                            <template v-slot:item="{ item }">
                              <tr>
                                <td class="text-center" @click.prevent="abrirDetalhes(item, $event)">{{ item.nome }}</td>
                                <td class="text-center" @click.prevent="abrirDetalhes(item, $event)">{{ item.telefone }}</td>
                                <td class="text-center" @click.prevent="abrirDetalhes(item, $event)">{{ item.email }}</td>
                                <td class="text-center" @click.prevent="abrirDetalhes(item, $event)">{{ item.cpf_cnpj }}</td>
                                <td class="acoes text-center">
                                  <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                      <v-btn icon v-bind="attrs" v-on="on" color="black"
                                             @click="dialogFiador = true; fiador = item">
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
                                          @click.prevent="dialogDeletarFiador = true; fiador = item"
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
                            <template v-slot:expanded-item="{ headers, item }">
                              <td :colspan="headers.length" style="background-color: #d5e6fd">
                                <ul class="pa-3" style="list-style-type: none">
                                  <li>
                                    <span><strong>Endereço: </strong> {{ item.rua}}, N°{{ item.numero}}, {{ item.complemento}}, {{ item.cep }}, {{ item.bairro}}, {{ item.cidade}}, {{ item.estado }}</span>
                                  </li>
                                  <li>
                                    <span><strong>E-mail: </strong>{{ item.email}}</span>
                                  </li>
                                  <li>
                                    <span><strong>Identidade: </strong>{{ item.identidade}}</span>
                                  </li>
                                </ul>
                              </td>
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
            <v-col v-if="tab === 3" cols="12" xl="" lg="" md="">
              <v-btn color="var(--btn-salvar)" dark large @click="dialogFiador = true" :block="$isMobile">
                <v-icon>
                  mdi-plus
                </v-icon>
                Adicionar fiador
              </v-btn>
            </v-col>
            <v-col v-if="tab === 2" cols="12" xl="" lg="" md="">
              <v-btn color="var(--btn-salvar)" dark large @click="dialogBoleto = true;" :block="$isMobile">
                <v-icon>
                  mdi-plus
                </v-icon>
                Adicionar boleto
              </v-btn>
            </v-col>
            <v-col cols="auto">
              <v-btn color="var(--btn-salvar)" dark large
                     @click="editando ? editarContrato() : cadastrarContrato(false)">
                <v-icon class="mr-1">mdi-content-save</v-icon>
                {{ !$isMobile ? 'Salvar' : '' }}
              </v-btn>
            </v-col>
            <v-col cols="auto" v-if="!editando">
              <v-btn color="var(--btn-salvar)" dark large @click="cadastrarContrato(true)">
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

      <dialog-fiador
          :mostrar="dialogFiador"
          :idContrato="idContrato"
          :dados="fiador"
          @cancelar="dialogFiador = false; fiador = {}"
          @editado="fiadorEditado"
          @cadastrado="fiadorCadastrado"
      ></dialog-fiador>

      <dialog-boleto
          :mostrar="dialogBoleto"
          :idBoleto="idBoleto"
          :dados="boleto"
          :idContrato="idContrato"
          @cancelar="dialogBoleto = false; boleto = {}"
          @editado="boletoEditado"
          @cadastrado="boletoCadastrado"
      ></dialog-boleto>

      <alerta-acoes
          :palavra-chave="palavraChave"
          @sumir="mostrarAlerta = false"
          v-bind:mostrar="mostrarAlerta"
          :funcao="funcao"
      ></alerta-acoes>

      <dialog-deletar
          :texto="`Certeza que deseja deletar o fiador: ${ fiador ? fiador.nome : ''} ?`"
          sub-texto="Após deletar esse fiador não é possivel recuperar!"
          :mostrar="dialogDeletarFiador"
          @cancelar="dialogDeletarFiador = !dialogDeletarFiador; fiador = {}"
          @deletar="deletarFiador"
      >
      </dialog-deletar>

      <dialog-deletar
          :texto="`Certeza que deseja deletar o boleto: ${ boleto ? ('000000' + boleto.id).slice(-6) : ''} ?`"
          sub-texto="Após deletar esse boleto não é possivel recuperar!"
          :mostrar="dialogDeletarBoleto"
          @cancelar="dialogDeletarBoleto = !dialogDeletarBoleto; boleto = {}"
          @deletar="deletarBoleto"
      >
      </dialog-deletar>

      <dialog-carregando
          :mostrar="dialogCarregando"
      >
      </dialog-carregando>

    </v-card>
  </v-dialog>
</template>

<script>
import api from "../../services/api"
import dayjs from 'dayjs'

import DialogFiador from "../../components/Dialogs/DialogFiador"
import AlertaAcoes from '../../components/shared/AlertaAcoes'
import DialogBoleto from "../../components/Dialogs/DialogBoleto"
import {setValue} from "vue-currency-input"
import DialogDeletar from "../../components/shared/DialogDeletar"
import DialogCarregando from "../../components/shared/DialogCarregando";
import CabecalhoDialog from "@/components/shared/Dialog/CabecalhoDialog";

export default {
  name: "DialogContrato",
  props: ['mostrar', 'idContrato'],
  components: {
    DialogFiador,
    AlertaAcoes,
    DialogBoleto,
    DialogDeletar,
    DialogCarregando,
    CabecalhoDialog
  },
  data() {
    return {
      headersBoletos: [
        {text: 'Código', value: 'id', align: 'center'},
        {text: 'Vencimento', value: 'data_vencimento', align: 'center'},
        {text: 'Valor', value: 'valor', align: 'center'},
        {text: 'Valor c/ juros', value: 'valor_juros'},
        {text: 'Quitacao', value: 'data_quitacao'},
        {text: 'Status', value: 'status'},
        {text: '', value: 'acoes', align: 'center', sortable: false, width: '90px'},
      ],
      headersFiador: [
        {text: 'Nome', value: 'nome', align: 'center'},
        {text: 'Telefone', value: 'telefone', align: 'center'},
        {text: 'Email', value: 'email', align: 'center'},
        {text: 'CPF / CNPJ', value: 'cpf_cnpj'},
        {text: '', value: 'acoes', align: 'center', sortable: false, width: '90px'},
      ],
      dayjs: dayjs,
      editando: false,
      valido: false,
      tab: null,
      clientes: [],
      imoveis: [],
      responsaveis: [],
      contrato: {
        id: '',
        id_responsavel: null,
        id_cliente: null,
        id_cliente2: null,
        id_imovel: null,
        data_inicio: "",
        data_fim: "",
        vigencia: "",
        data_vencimento: "",
        valor_boleto: "",
        carencia: "",
        garantia: "",
        fiador: null,
        locador: "",
        nome_pdf: "",
        observacao: "",
        status: null,
        juros_multa: false,
        juros_mes: '',
        multa: '',
        reajuste: '',
        valor_reajustado: '',
        ultimo_reajuste: null,
        valor_anterior_reajustado:null
      },
      boletos: [],
      fiadores: [],
      validacoes: {
        required: value => !!value || '',
        dia: value => value > 0 && value <= 31,
      },
      statusContrato: [],
      dialogFiador: false,
      funcao: '',
      palavraChave: 'contrato',
      mostrarAlerta: false,
      adicionaContratoAItens: false,
      contratoParaAdicionar: {},
      boletosForamBuscados: false,
      idBoleto: null,
      dialogBoleto: false,
      boleto: {},
      fiador: {},
      fiadoresForamBuscados: false,
      dialogDeletarFiador: false,
      dialogDeletarBoleto: false,
      contratoPDF: null,
      aditivoPDF: null,
      ativo_data_termino: false,
      textoInputImportarContrato: '',
      textoInputImportarAditivo: '',
      dialogCarregando: false,
      confirmacaoReveterAjuste: false,
      expanded: [],
    }
  },
  created() {
    this.buscarClientes()
    this.buscarResponsaveis()
    this.buscarImoveis()
    this.buscarStatusContrato()
  },
  computed:{
    podeReveter(){
      return this.contrato.valor_anterior_reajustado !== null && this.contrato.valor_anterior_reajustado !== ""
    }
  },
  methods: {
    async buscarResponsaveis() {
      await api.get('/contrato/responsaveis').then(resp => {
        this.responsaveis = resp.data
      })
    },
    async buscarClientes() {
      await api.get('/contrato/clientes').then(resp => {
        this.clientes = resp.data
      })
    },
    async buscarImoveis() {
      await api.get('/contrato/imoveis').then(resp => {
        this.imoveis = resp.data
      })
    },
    async buscarStatusContrato() {
      await api.get('/contrato/status').then(resp => {
        this.statusContrato = resp.data
      })
    },
    async buscarBoletos() {
      if (this.boletosForamBuscados === false) {
        await api.get('/contrato/boletos', {params: {idContrato: this.contrato.id}}).then(resp => {
          this.boletos = resp.data
          this.boletosForamBuscados = true
        })
      }
    },
    async buscarFiadores() {
      if (this.fiadoresForamBuscados === false) {
        await api.get('/contrato/fiadores', {params: {idContrato: this.idContrato}}).then(resp => {
              this.fiadores = resp.data
              this.fiadoresForamBuscados = true
            }
        )
      }
    },

    cancelar() {
      if (this.adicionaContratoAItens) {
        this.$emit('cancelar', this.contratoParaAdicionar)
      } else {
        this.$emit('cancelar')
      }
      this.tab = null
      this.contrato = {}
      this.boletos = []
      this.boletosForamBuscados = false
    },

    async cadastrarContrato(sair) {
      this.contrato.valor_boleto_convertido = this.$converterDinherioFloat(this.contrato.valor_boleto)
      const isValido = this.$refs.formulario.validate()

      if (isValido) {
        let inicio = this.contrato.data_inicio
        let fim = this.contrato.data_fim

        if (fim > inicio) {
          let idUsuario = this.$store.state.usuario.id

          await api.post('/contrato/cadastrar', {
            contrato: this.contrato,
            idUsuario: idUsuario,
          }).then(resp => {
            let contrato = resp.data
            if (sair) {
              this.tab = null
              this.contrato = {}
              this.$emit('cadastrado', {contrato: contrato, notificar: true})
            } else {
              this.contrato.vigencia = contrato.vigencia
              this.contratoParaAdicionar = contrato
              this.adicionaContratoAItens = true
              this.contrato.id = contrato.id
              this.funcao = 'cadastrado'
              this.palavraChave = 'contrato'
              this.mostrarAlerta = true
              this.editando = true
              this.$emit('cadastrado', {contrato: contrato, notificar: false})
            }
          }).catch(erro => {
            console.log(erro.response)
          })
        }
      }
    },

    async editarContrato() {
      const isValido = this.$refs.formulario.validate()
      if (isValido) {
        this.contrato.valor_boleto_convertido = this.$converterDinherioFloat(this.contrato.valor_boleto)
        if (this.contrato.juros_mes)
          this.contrato.juros_mes = this.contrato.juros_mes.replace('%', '').replace(',', '.')
        else
          this.contrato.juros_mes = ''

        if (this.contrato.multa)
          this.contrato.multa = this.contrato.multa.replace('%', '').replace(',', '.')
        else
          this.contrato.multa = ''

        let idUsuario = this.$store.state.usuario.id
        await api.post(`/contrato/editar`, {
          contrato: this.contrato,
          idUsuario: idUsuario,
        }).then(resp => {
          let {contrato} = resp.data
          this.$emit('editado', contrato)
          this.tab = 0
        }).catch(erro => {
          console.log(erro.response)
        })
      }
    },

    boletoEditado(boleto) {
      let index = this.boletos.findIndex(obj => {
        return obj.id === boleto.id
      })

      for (let key of Object.keys(boleto)) {
        this.boletos[index][key] = boleto[key]
      }
      this.funcao = 'editado'
      this.palavraChave = 'boleto'
      this.mostrarAlerta = true
      this.dialogBoleto = false

    },

    boletoCadastrado(boleto) {
      this.boletos.push(boleto)
      this.dialogBoleto = false
      this.funcao = 'cadastrado'
      this.palavraChave = 'boleto'
      this.mostrarAlerta = true
    },

    async deletarBoleto() {
      let {id} = this.boleto
      await api.delete('/contrato/boleto/deletar', {params: {id: id}}).then(resp => {
        let {id} = resp.data.boleto
        let index = this.boletos.findIndex(obj => {
          return obj.id === id
        })
        this.boletos.splice(index, 1)
        this.funcao = 'deletado'
        this.palavraChave = 'boleto'
        this.mostrarAlerta = true
        this.dialogDeletarBoleto = false
      })
    },

    fiadorCadastrado(fiador) {
      this.fiadores.push(fiador)
      this.dialogFiador = false
      this.funcao = 'cadastrado'
      this.palavraChave = 'fiador'
      this.mostrarAlerta = true
    },

    fiadorEditado(fiador) {
      let index = this.fiadores.findIndex(obj => {
        return obj.id === fiador.id
      })

      for (let key of Object.keys(fiador)) {
        this.fiadores[index][key] = fiador[key]
      }
      this.funcao = 'editado'
      this.palavraChave = 'fiador'
      this.mostrarAlerta = true
      this.dialogFiador = false

    },

    async deletarFiador() {
      let fiador = this.fiador
      await api.delete('/contrato/fiador/deletar', {params: {idFiador: fiador.id}}).then(resp => {
        let {id} = resp.data.fiador
        let index = this.fiadores.findIndex(obj => {
          return obj.id === id
        })
        this.fiadores.splice(index, 1)
        this.funcao = 'deletado'
        this.palavraChave = 'fiador'
        this.mostrarAlerta = true
        this.dialogDeletarFiador = false
      })
    },

    async aplicarReajuste() {
      let reajusteFormatado = this.contrato.reajuste.replace('%', '').replace(',', '.')
      let valorFormatado = this.$converterDinherioFloat(this.contrato.valor_boleto)
      let valorReajustadoFormatado
      if (this.contrato.valor_reajustado === null) {
        valorReajustadoFormatado = valorFormatado
      } else {
        valorReajustadoFormatado = this.$converterDinherioFloat(this.contrato.valor_reajustado)
      }
      let id = this.contrato.id
      await api.patch('/contrato/reajuste', {
        reajuste: reajusteFormatado, valor: valorFormatado, valor_reajustado: valorReajustadoFormatado, id: id
      }).then(resp => {
        let {valor_reajustado, ultimo_reajuste, valor_anterior} = resp.data
        setValue(this.$refs.valor_reajustado, valor_reajustado)
        setValue(this.$refs.valor_anterior, valor_anterior)
        this.contrato.ultimo_reajuste = ultimo_reajuste
        this.contrato.reajuste = ''
      })
    },

    async reverterReajuste(){
      let { valor_anterior_reajustado, id } = this.contrato

      let valor_anterior_formatado = this.$converterDinherioFloat(valor_anterior_reajustado)

      await api.patch("/contrato/reverter_reajuste", { valor_anterior: valor_anterior_formatado, id }).then(resp => {
        let {valor_reajustado, ultimo_reajuste} = resp.data
        setValue(this.$refs.valor_reajustado, valor_reajustado)
        this.contrato.ultimo_reajuste = ultimo_reajuste
        this.contrato.reajuste = ''
        this.confirmacaoReveterAjuste = false
      })
    },

    async importarPDF() {
      const formData = new FormData();
      for (const i of Object.keys(this.contratoPDF)) {
        formData.append('files', this.contratoPDF[i])
      }
      api.post(`/contrato/${this.contrato.id}/importar/pdf`, formData, {}).then((resp) => {
        let pdf = resp.data[0]
        this.contrato.nome_pdf = pdf.nome
        this.contrato.url = pdf.url
        this.textoInputImportarContrato = 'CONTRATO importado com sucesso'
        this.contratoPDF = []
        if (!this.contrato.nome_aditivo)
          this.textoInputImportarAditivo = 'Escolha um ADITIVO para importar'
      })
    },
    async removerPDF(){

      await api.delete(`/contrato/${this.contrato.id}/remover/pdf`).then(() => {
        this.contrato.nome_pdf = null
        this.textoInputImportarContrato = 'Escolha um CONTRATO para importar'
      })
    },

    async importarAditivo() {
      const formData = new FormData();
      for (const i of Object.keys(this.aditivoPDF)) {
        formData.append('files', this.aditivoPDF[i])
      }
      api.post(`/contrato/${this.contrato.id}/importar/aditivo`, formData, {}).then((resp) => {
        this.textoInputImportarAditivo = 'ADITIVO importado com sucesso'
        this.contrato.nome_aditivo = resp.data[0].nome
        this.aditivoPDF = []
      })
    },

    async removerAditivo(){

      await api.delete(`/contrato/${this.contrato.id}/remover/aditivo`).then(() => {
        this.contrato.nome_aditivo = null
        this.textoInputImportarAditivo = 'Escolha um ADITIVO para importar'
      })
    },

    abrirDetalhes(item, evento) {
      let removerClass = document.querySelector(".aberto")
      if (removerClass) removerClass.classList.remove("aberto")

      let tr = evento.target.parentElement

      if (this.expanded[0] === item) {
        this.expanded = []
      } else {
        this.expanded = []
        tr.classList.add("aberto")
        this.expanded.push(item)
      }
    },
  },
  watch: {
    mostrar: async function (valor) {
      if (valor === true) {
        if (this.idContrato) {
          console.log(this.idContrato)

          this.$nextTick(() => {
            this.dialogCarregando = true
          })
          await api.get('/contrato', {params: {id: this.idContrato}}).then(resp => {

            console.log(resp.data)

            this.dialogCarregando = false
            let {contrato} = resp.data
            this.contrato = contrato
            if (contrato.data_vencimento.length > 2) {
              this.contrato.data_vencimento = dayjs(contrato.data_vencimento).get('date')
            }
            setValue(this.$refs.valor_boleto, contrato.valor_boleto)
            setValue(this.$refs.valor_reajustado, contrato.valor_reajustado)

            if(contrato.valor_anterior_reajustado) {
              setValue(this.$refs.valor_anterior, contrato.valor_anterior_reajustado)
            }
            setValue(this.$refs.multa, contrato.multa)
            setValue(this.$refs.juros, contrato.juros_mes)
            this.editando = true

            if (contrato.nome_pdf) {
              this.textoInputImportarContrato = 'Contrato já importado'
            } else {
              this.textoInputImportarContrato = 'Escolha um CONTRATO para importar'
            }

            if (contrato.nome_aditivo) {
              this.textoInputImportarAditivo = 'Aditivo já importado'
            } else if (contrato.nome_pdf) {
              this.textoInputImportarAditivo = 'Escolha um ADITIVO para importar'
            } else {
              this.textoInputImportarAditivo = 'Para realizar a importação primeiro importe um contrato'
            }

          })
        } else {
          this.editando = false
          this.textoInputImportarContrato = 'Para realizar a importação primeiro cadastre esse contrato'
          this.textoInputImportarAditivo = 'Para realizar a importação primeiro importe um contrato'
        }
      } else {
        this.$refs.formulario.reset()
      }
    },

    'contrato.data_inicio': function (inicio) {
      if (inicio) {
        if (inicio.length == 10) {
          this.ativo_data_termino = true
        } else {
          this.ativo_data_termino = false
          this.contrato.data_fim = ""
          this.contrato.vigencia = ""
        }
      }
    },
  }
}
</script>

<style scoped src="../../css/dataTableVuetifyCustom.css"/>
<style scoped src="../../css/tabVuetifyCustom.css"/>

<style scoped>

</style>