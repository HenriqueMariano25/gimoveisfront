<template>
  <b-container fluid>
    <b-row class="barra-top-imovel " align-v="center">
      <b-col>
        <h1 class="mb-1">Cadastro de Imóveis</h1>
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
    <b-row class="tabela-imoveis">
      <b-col class="col-tabela-imoveis">
        <b-table
          bordered
          head-variant="dark"
          sort-icon-left
          primary-key="nome"
          id="tabela-imovel"
          :tbody-transition-props="transProps"
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
          responsive
          no-border-collapse
          sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px)"
          @row-clicked="
            (item) => $set(item, '_showDetails', !item._showDetails)
          "
        >
          <template #cell(nome)="row">
            <p class="tr-imovel">{{ row.item.nome }}</p>
          </template>
          <template #cell(rua)="row">
            <p class="tr-imovel">{{ row.item.rua }}</p>
          </template>
          <template #cell(cpf_cnpj)="row">
            <p class="tr-imovel">{{ row.item.cpf_cnpj }}</p>
          </template>
          <template #cell(status)="row">
            <p class="tr-imovel">{{ row.item.status }}</p>
          </template>
          <template #cell(editar)="row" >
            <div class="item-coluna-centralizada">
            <vs-button type="flat" color="dark" @click="editarImovelModal(row.item)" icon="edit"></vs-button>
            </div>
          </template>
          <template #table-colgroup>
            <col>
            <col>
            <col>
            <col style="width: 15px">
            <col style="width: 15px">
          </template>
          <template #cell(deletar)="row" >
            <div class="item-coluna-centralizada">
              <vs-button type="flat" color="dark" @click="deletarImovelModal(row.item)" icon="delete"></vs-button>
            </div>
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-container fluid class="divider-personalizado">
      <b-row align-v="end" >
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
        <b-col sm="5" md="auto">
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
        <b-col class="ml-auto" cols="auto" style="margin-bottom: -5px">
          <vs-button
            color="#24a35a"
            type="filled"
            icon="add_business"
            @click="mostrarModal"
            >Adicionar
          </vs-button>
        </b-col>
      </b-row>
    </b-container>
    <!--  Fim da tabela-->
    <modal
      name="modal-imovel"
      width="60%"
      height="auto"
      :scrollable="true"
      :click-to-close="false"
      class="modal-adicionando-imovel"
    >
      <h3>Adicionando imóvel</h3>
      <b-tabs content-class="mt-3">
        <b-tab title="Dados gerais" active>
          <b-row align-v="center">
            <b-col cols="5">
              <vs-input
                label-placeholder="Nome*"
                v-model="imovel.nome"
                class="input-personalizado"
              />
            </b-col>
            <b-col cols="5">
              <vs-input
                label-placeholder="Proprietário*"
                v-model="imovel.proprietario"
                class="input-personalizado"
              />
            </b-col>
            <b-col>
              <b-form-group
                id="select-imovel"
                label="Status"
                class="select-personalizado"
              >
                <b-form-select
                  v-model="imovel.id_status"
                  :options="tiposStatus"
                  value-field="id"
                  text-field="descricao"
                >
                  <template #first>
                    <b-form-select-option :value="null"
                      >Selecione</b-form-select-option
                    >
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <vs-input
                type="number"
                label-placeholder="Inscrição Municipal"
                v-model="imovel.inscricao_municipal"
                class="input-personalizado"
              />
            </b-col>
            <b-col>
              <vs-input
                type="number"
                label-placeholder="Funesbom"
                v-model="imovel.funesbom"
                class="input-personalizado"
              />
            </b-col>
            <b-col cols="3">
              <b-form-group
                id="select-tipo-imovel"
                label="Tipo do Imóvel*"
                class="select-personalizado"
              >
                <b-form-select
                  v-model="imovel.tipo_imovel"
                  :options="tiposImoveis"
                  value-field="id"
                  text-field="descricao"
                >
                  <template #first>
                    <b-form-select-option :value="null"
                      >Selecione</b-form-select-option
                    >
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="2">
              <vs-input
                type="text"
                onkeypress="return event.charCode >= 48 && event.charCode <= 57"
                onKeyDown="if(this.value.length==10 && event.keyCode!=8) return false;"
                label-placeholder="CEP*"
                v-model="imovel.cep"
                v-mask="'#####-###'"
                class="input-personalizado"
              />
            </b-col>
            <Carregando :visivel="carregandoCep"/>
            <b-col cols="5">
              <vs-input
                label-placeholder="Rua*"
                v-model="imovel.rua"
                class="input-personalizado"
              />
            </b-col>
            <b-col cols="2">
              <vs-input
                label-placeholder="Número*"
                v-model="imovel.numero"
                class="input-personalizado"
              />
            </b-col>
            <b-col cols="3">
              <vs-input
                label-placeholder="Complemento"
                v-model="imovel.complemento"
                class="input-personalizado"
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <vs-input
                label-placeholder="Bairro*"
                v-model="imovel.bairro"
                class="input-personalizado"
              />
            </b-col>
            <b-col>
              <vs-input
                label-placeholder="Cidade*"
                v-model="imovel.cidade"
                class="input-personalizado"
              />
            </b-col>
            <b-col cols="2">
              <vs-input
                label-placeholder="UF*"
                v-model="imovel.estado"
                class="input-personalizado"
                maxlength="2"
              />
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Inf. adicionais" @click="tabInfAdicionais">
          <b-row>
            <b-col>
              <vs-input
                label="Data de Aquisição"
                v-model="imovel.data_aquisicao"
                type="date"
                class="input-nascimento"
              />
            </b-col>
            <b-col>
              <vs-input
                label="Data de Venda"
                v-model="imovel.data_venda"
                type="date"
                class="input-nascimento"
              />
            </b-col>
            <b-col>
              <vs-input
                label-placeholder="Área total m²"
                type="number"
                v-model="imovel.area"
                class="input-personalizado"
              />
            </b-col>
            <b-col>
              <vs-input
                label-placeholder="Área construida m²"
                type="number"
                v-model="imovel.area_construida"
                class="input-personalizado"
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <vs-input
                label-placeholder="Valor da aquisição"
                v-model="imovel.valor_aquisicao"
                class="input-personalizado"
                ref="valor_aquisicao"
                v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                        allowNegative: false, currency:'BRL'}"
              />
            </b-col>
            <b-col>
              <vs-input
                label-placeholder="Valor da aquisiçao em Dólar"
                v-model="imovel.valor_aquisicao_dolar"
                class="input-personalizado"
                ref="valor_aquisicao_dolar"
                v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                        allowNegative: false, currency:'USD'}"
              />
            </b-col>
            <b-col>
              <vs-input
                label-placeholder="Valor atual"
                v-model="imovel.valor_atual"
                class="input-personalizado"
                ref="valor_atual"
                v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                        allowNegative: false, currency:'BRL'}"
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <vs-input
                  type="text"
                  label-placeholder="N° cliente luz"
                  v-model="imovel.numero_cliente_luz"
                  class="input-personalizado"
              />
            </b-col>
            <b-col>
              <vs-input
                  type="text"
                  label-placeholder="N° cliente água"
                  v-model="imovel.numero_cliente_agua"
                  class="input-personalizado"
              />
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Cômodos">
          <b-row>
            <b-col cols="auto">
              <vs-button
                type="filled"
                icon="add"
                class="botao-salvar botao-adicionar-comodo"
                color="#5498ff"
                @click.prevent="adicionarComodo()"
                >Adicionar comôdo
              </vs-button>
            </b-col>
          </b-row>
          <b-row class="campos-comodos">
            <b-col cols="6" v-for="(comodo, index) in comodos" :key="index">
              <b-row>
                <b-col cols="5">
                  <b-form-group id="select-comodo" label="Tipo do comôdo">
                    <b-form-select
                      v-model="comodo.tipo"
                      :options="tiposComodos"
                      value-field="id"
                      text-field="descricao"
                    >
                      <template #first>
                        <b-form-select-option :value="null"
                        >Selecione</b-form-select-option
                        >
                      </template>
                    </b-form-select>
                  </b-form-group>
                </b-col>
                <b-col cols="5">
                  <vs-input
                      label-placeholder="Quantidade"
                      type="number"
                      v-model="comodo.quantidade"
                      class="input-personalizado"
                  />
                </b-col>
                <b-col cols="2" class="text-center botao-deletar-comodo">
                  <vs-button
                      type="flat"
                      icon="delete"
                      color="dark"
                      class=""
                      @click.native="removerComodo(index)"
                  />
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Despesas" :disabled="!editar">
          <b-row>
            <b-col >
              <vs-input label-placeholder="Valor" ref="despesa_valor" v-model="despesa.valor" class="input-personalizado"
                        v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                        allowNegative: false, currency:{prefix:'R$ '}}"/>
            </b-col>
            <b-col>
              <vs-input label="Data" type="date" class="input-nascimento" v-model="despesa.data"/>
            </b-col>
            <b-col>
              <vs-input label="Vencimento" type="date" class="input-nascimento" v-model="despesa.data_vencimento"/>
            </b-col>
            <b-col>
              <b-form-group id="select-comodo" label="Tipo de despesa" v-model="despesa.tipo_despesa">
                <b-form-select
                    :options="tiposDespesas"
                    value-field="id"
                    v-model="despesa.tipo_despesa"
                    text-field="descricao"
                >
                  <template #first>
                    <b-form-select-option :value="null"
                    >Selecione</b-form-select-option
                    >
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group id="select-comodo" label="Fixa ou Variável">
                <b-form-select
                    :options="fixaVariavel"
                    value-field="valor"
                    v-model="despesa.fixa_variavel"
                    text-field="descricao"
                >
                  <template #first>
                    <b-form-select-option :value="null"
                    >Selecione</b-form-select-option
                    >
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row align-v="center" style="padding-bottom: 10px;">
            <b-col>
              <vs-input label-placeholder="Descrição" class="mt-2" v-model="despesa.descricao"/>
            </b-col>
            <b-col cols="auto">
              <vs-button
                color="#5498ff"
                type="filled"
                icon="add"
                class="botao-salvar"
                @click.native="cadastrarDespesa"
                v-if="!editandoDespesa"
              >
                Adicionar despesa
              </vs-button>
              <vs-button
                  color="#5498ff"
                  type="filled"
                  icon="add"
                  class="botao-salvar"
                  @click.native="salvarDespesaEditada"
                  v-else
              >
                Salvar edição
              </vs-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="col-tabela-imoveis">
              <b-table
                  primary-key="nome"
                  id="tabela-imovel"
                  :tbody-transition-props="transProps"
                  bordered
                  head-variant="dark"
                  sort-icon-left
                  :fields="cabecalhosDespesas"
                  :items="despesas"
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
                  sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px)"
                  striped
                  hover
                  outlined
                  no-border-collapse
                  @row-clicked="(item) => $set(item, '_showDetails', !item._showDetails)"
              >
                <template #cell(data)="row">
                  {{ $dayjs(row.item.data).format('DD/MM/YYYY') }}
                </template>
                <template #cell(data_vencimento)="row" >
                  <label v-if="row.item.data_vencimento">
                    {{ $dayjs(row.item.data_vencimento).format('DD/MM/YYYY') }}
                  </label>
                </template>
                <template #cell(editar)="row" >
                  <div class="item-coluna-centralizada">
                    <vs-button type="flat" color="dark" icon="edit" @click="editarDespesa(row)"></vs-button>
                  </div>
                </template>
                <template #cell(deletar)="row">
                  <div class="item-coluna-centralizada">
                    <vs-button type="flat" color="dark" icon="delete" @click="deletarDespesa(row)"></vs-button>
                  </div>
                </template>
                <template #table-colgroup>
                  <col>
                  <col>
                  <col>
                  <col>
                  <col style="width: 15px">
                  <col style="width: 15px">
                </template>
                <template #row-details="row">
                  <b-card>
                    <b-row>
                      <b-col>
                        <label><b>Descrição: </b>{{ row.item.descricao }}</label>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col>
                        <label><b>Fixa ou Variável: </b>{{ row.item.fixa_variavel }}</label>
                      </b-col>
                    </b-row>
                  </b-card>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Contratos" :disabled="!editar">
<!--          <b-row class="text-center mb-2">-->
<!--            <b-col cols="auto">-->
<!--              <vs-button-->
<!--                color="#5498ff"-->
<!--                type="filled"-->
<!--                icon="add"       implantar essa ação futuramente-->
<!--                class="botao-salvar"-->
<!--              >-->
<!--                Adicionar contrato-->
<!--              </vs-button>-->
<!--            </b-col>-->
<!--          </b-row>-->
          <b-row>
            <b-col>
              <p class="p-contratos">Contratos de: {{ imovel.nome }}</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="tabelas-contrato">
              <b-table
                primary-key="nome"
                id="tabela-imovel"
                :tbody-transition-props="transProps"
                bordered
                head-variant="dark"
                sort-icon-left
                :fields="cabecalhosContratosClientes"
                :current-page="currentPage"
                :per-page="perPage"
                :filter="filter"
                :filter-included-fields="filterOn"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :sort-direction="sortDirection"
                show-empty
                :items="contratos"
                small
                @filtered="onFiltered"
                selectable
                select-mode="single"
                @row-selected="selecionandoContrato"
                striped
                hover
                outlined
                no-border-collapse
                sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px - 00px)"
                @row-clicked="
                  (item) => $set(item, '_showDetails', !item._showDetails)
                "
              >
                <template #cell(contrato)="row">
                  <label>
                    {{ ("0000" + row.item.contrato).slice(-4) }}
                  </label>
                </template>
                <template #cell(data_inicio)="row">
                  <label>
                    {{ $dayjs(row.item.data_inicio).format('DD/MM/YYYY') }}
                  </label>
                </template>
                <template #cell(data_fim)="row">
                  <label>
                    {{ $dayjs(row.item.data_fim).format('DD/MM/YYYY') }}
                  </label>
                </template>
              </b-table>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <p class="p-contratos">Boletos do contrato: {{ idContrato }}</p>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="tabelas-contrato">
              <b-table
                primary-key="nome"
                id="tabela-imovel"
                :tbody-transition-props="transProps"
                bordered
                head-variant="dark"
                sort-icon-left
                :items="boletos"
                :fields="cabecalhosContratosBoletos"
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
                sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px - 300px)"
                outlined
                no-border-collapse
                @row-clicked="
                  (item) => $set(item, '_showDetails', !item._showDetails)
                "
              >
                <template #cell(id)="row">
                  <label >
                    {{ ("000000" + row.item.id).slice(-6) }}
                  </label>
                </template>
                <template #cell(valor)="row">
                  <label >
                    R$ {{ row.item.valor }}
                  </label>
                </template>
                <template #cell(data_vencimento)="row">
                  <label>
                    {{ $dayjs(row.item.data_vencimento).format('DD/MM/YYYY') }}
                  </label>
                </template>
                <template #cell(data_quitacao)="row">
                  <label v-if="(row.item.data_quitacao)">
                    {{ $dayjs(row.item.data_quitacao).format('DD/MM/YYYY') }}
                  </label>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
      <div class="text-center">
        <b-row align-h="end">
          <b-col cols="2">
            <vs-button
                v-if="editar == true"
                color="#24a35a"
                type="filled"
                icon="save"
                class="botao-salvar"
                @click.native="editarImovel"
            >
              Salvar
            </vs-button>
            <vs-button
              v-else
              color="#24a35a"
              type="filled"
              icon="save"
              class="botao-salvar"
              @click.native="cadastrarImovel"
            >
              Salvar
            </vs-button>
          </b-col>
          <b-col cols="2">
            <vs-button
              color="#707070"
              type="filled"
              icon="clear"
              class="botao-salvar"
              @click.native="esconderModal"
            >
              Cancelar
            </vs-button>
          </b-col>
        </b-row>
      </div>
    </modal>
  </b-container>
</template>

<script>
import api from "../../services/api";
import Carregando from "../../components/shared/Carregando";
import {atribuirCep, converterDinherioFloat} from "../../methods/global"
import { setValue } from "vue-currency-input"

export default {
  name: "VisualizarImovel",
  components:{
    Carregando
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
      transProps: {
        name: "flip-list",
      },
      fields: [
        { key: "nome", label: "Nome", sortable: true, thClass: 'text-center' },
        { key: "rua", label: "Rua", sortable: true, thClass: 'text-center' },
        { key: "status", label: "Status", sortable: true, class: 'text-center' },
        { key: "editar", label: "" },
        { key: "deletar", label: "" },
      ],
      cabecalhosDespesas: [
        { key: "valor", label: "Valor", sortable: true, class: 'text-center' ,tdClass:"td-centralizado" },
        { key: "data", label: "Data", sortable: true , class: 'text-center',tdClass:"td-centralizado"},
        { key: "data_vencimento", label: "Vencimento", sortable: true , class: 'text-center',tdClass:"td-centralizado"},
        { key: "descricao_tipo_despesa", label: "Tipo", sortable: true , thClass: 'text-center' ,tdClass:"td-centralizado"},
        { key: "editar", label: "" },
        { key: "deletar", label: "" },
      ],
      cabecalhosContratosClientes: [
        { key: "contrato", label: "Contrato", sortable: true, class: 'text-center'},
        { key: "cliente", label: "Cliente", sortable: true, thClass: 'text-center' },
        { key: "data_inicio", label: "Data de início", sortable: true, class: 'text-center' },
        { key: "data_fim", label: "Data de Término", class: 'text-center', sortable: true  },
        { key: "status", label: "Status", class: 'text-center', sortable: true  },
      ],
      cabecalhosContratosBoletos: [
        { key: "id", label: "Codigo", sortable: true, class: 'text-center' },
        { key: "valor", label: "Valor", sortable: true, class: 'text-center' },
        { key: "data_vencimento", label: "Vencimento", sortable: true, class: 'text-center' },
        { key: "data_quitacao", label: "Quitação", sortable: true, class: 'text-center' },
        { key: "status", label: "Status", sortable: true, class: 'text-center' },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 25,
      pageOptions: [25, 50, 100],
      sortBy: "",
      sortDesc: false,
      sortDirection: "asc",
      filter: null,
      filterOn: [],
      imovel: {
        id: "",
        nome: "",
        proprietario: "",
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
        numero_cliente_luz: "",
        numero_cliente_agua: "",
      },
      despesa:{
        valor:"",
        data:"",
        data_vencimento:"",
        tipo_despesa:null,
        fixa_variavel:null,
        descricao:""
      },
      tiposStatus: [],
      tiposImoveis: [],
      tiposComodos: [],
      tiposDespesas:[],
      comodos: [{ id: "", quantidade: 0, tipo: null }],
      editar: false,
      carregandoCep:false,
      contratos:[],
      idContrato:"",
      boletos:"",
      fixaVariavel:[
        {valor:'fixa', descricao:'Fixa'},
        {valor:'variavel', descricao:"Variável"}
      ],
      despesas:[],
      editandoDespesa:false
    };
  },

  methods: {
    async buscarTiposStatus() {
      await api.get("/imovel/status").then((response) => {
        this.tiposStatus = response.data;
      });
    },
    async buscarTiposImoveis() {
      await api.get("/imovel/tipos_imoveis").then((response) => {
        this.tiposImoveis = response.data;
      });
    },
    async buscarImoveis() {
      await api.get("/imoveis").then((response) => {
        this.items = response.data;
        this.totalRows = this.items.length;
      }).catch((erro) => {
        console.log(erro);
      });
    },
    async buscarTiposComodos() {
      await api.get("/imoveis/tipo_comodo").then((response) => {
        this.tiposComodos = response.data;
      });
    },
    async buscarContratos(){
      await api.get('/imoveis/contratos', {params:{idContrato:this.imovel.id}}).then(response => {
        this.contratos = response.data
      })
    },
    async buscarTiposDespesas(){
      await api.get('/imoveis/despesas/tipo_despesas').then(consulta =>{
        this.tiposDespesas = consulta.data
      })
    },
    async buscarDespesas(){
      await api.get('/imoveis/despesas', {params:{idImovel:this.imovel.id}}).then(consulta => {
        this.despesas = Object.freeze(consulta.data)
      })
    },

    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    async deletarImovel(imovel) {
      await api.delete(`/imovel/deletar/${imovel.id}`).then(() => {
        this.buscarImoveis();
      });
    },
    deletarImovelModal(imovel) {
      this.$bvModal.msgBoxConfirm(
          `Tem certeza que deseja deletar o imóvel: ${imovel.nome} ?`,
          {
            title: "Deletar imóvel",
            buttonSize: "sm",
            okTitle: "Deletar",
            cancelTitle: "Cancelar",
            okVariant: "danger",
            footerClass: "p-2",
            centered: true,
          }
      ).then((value) => {
        if (value) {
          this.deletarImovel(imovel);
        }
      });
    },

    async editarImovelModal(imovel) {
      await api.get(`/imovel/`, { params: { id: imovel.id } }).then((response) => {
        this.comodos = [];
        this.imovel = response.data[0];
        for (let x = 0; x < this.imovel.quantidade.length; x++) {
          let quantidade = this.imovel.quantidade[x];
          let tipo = this.imovel.tipo_comodo[x];
          let id = this.imovel.id_comodo[x];
          this.comodos.push({ id: id, quantidade: quantidade, tipo: tipo });
        }
        this.editar = true;
        this.mostrarModal();
      });
    },
    async editarImovel() {
      this.imovel.valor_aquisicao = converterDinherioFloat(this.imovel.valor_aquisicao)
      this.imovel.valor_atual = converterDinherioFloat(this.imovel.valor_atual)
      this.imovel.valor_aquisicao_dolar = converterDinherioFloat(this.imovel.valor_aquisicao_dolar)
      if (this.validarCamposObrigatorio()) {
        let idUsuario = this.$store.state.usuario.id
        await api.post(`/imovel/editar/${this.imovel.id}`, {
          data: this.imovel,
          comodos: this.comodos,
          idUsuario: idUsuario
        }).then((response) => {
          let nomeImovel = response.data[0].nome;
          this.$vs.notify({
            text: `Imóvel editado com sucesso: ${nomeImovel} !`,
            position: "top-center",
            color: "warning",
            time: 6000,
            icon: "check_circle_outline",
          });
          this.buscarImoveis();
          this.limparModal();
          this.esconderModal();
        });
      }
    },

    mostrarModal() {
      this.$modal.show("modal-imovel");
      this.buscarTiposStatus();
      this.buscarTiposComodos();
      if(this.editar){
        this.buscarContratos()
        this.buscarTiposDespesas()
        this.buscarDespesas()
      }
    },
    esconderModal() {
      this.$modal.hide("modal-imovel");
      this.limparModal();
      this.editar = false;
      this.boletos = []
      this.contratos = []
      this.idContrato = ""
    },
    limparModal() {
      Object.keys(this.imovel).forEach((key) => {
        this.imovel[key] = "";
      });
      this.imovel.id_status = null;
      this.imovel.tipo_imovel = null;
      this.despesa = {
        valor:"",
        data:"",
        data_vencimento:"",
        tipo_despesa:null,
        fixa_variavel:null,
        descricao:""
      }
    },
    async cadastrarImovel() {
      this.imovel.valor_aquisicao = converterDinherioFloat(this.imovel.valor_aquisicao)
      this.imovel.valor_atual = converterDinherioFloat(this.imovel.valor_atual)
      this.imovel.valor_aquisicao_dolar = converterDinherioFloat(this.imovel.valor_aquisicao_dolar)
      let idUsuario = this.$store.state.usuario.id
      if (this.validarCamposObrigatorio()) {
        await api.post("/imovel/cadastrar", {
          data: this.imovel,
          comodos: this.comodos,
          idUsuario: idUsuario
        }).then((response) => {
          let nomeImovel = response.data[0].nome;
          this.esconderModal();
          this.$vs.notify({
            text: `Imóvel cadastrado com sucesso: ${nomeImovel} !`,
            position: "top-center",
            color: "success",
            time: 6000,
            icon: "check_circle_outline",
          });
          this.buscarImoveis();
          this.limparModal();
        });
      }
    },
    validarCamposObrigatorio() {
      if (
          this.imovel["nome"] == "" ||
          this.imovel["proprietario"] == "" ||
          this.imovel["rua"] == "" ||
          this.imovel["cidade"] == "" ||
          this.imovel["bairro"] == "" ||
          this.imovel["estado"] == "" ||
          this.imovel["cpf_cnpj"] == "" ||
          this.imovel["numero"] == "" ||
          this.imovel["cep"] == "" ||
          this.imovel["tipo_imovel"] == ""
      ){
        this.$vs.notify({
          text: `Campos obrigatorios vazio.`,
          position: 'top-center',
          color: 'danger',
          time: 4000,
          icon: 'check_circle_outline'
        })
        return false;
      } else {
        return true;
      }
    },
    atribuirCep(dados) {
      if (dados.bairro != "") {
        this.imovel["bairro"] = dados.bairro;
      }
      if (dados.localidade != "") {
        this.imovel.cidade = dados.localidade;
      }
      if (dados.uf != "") {
        this.imovel.estado = dados.uf;
      }
      if (dados.complemento != "") {
        this.imovel.complemento = dados.complemento;
      }
      if (dados.logradouro != "") {
        this.imovel.rua = dados.logradouro;
      }
    },
    adicionarComodo() {
      this.comodos.push({
        quantidade: 0,
        tipo: null,
      });
    },
    removerComodo(index) {
      let comodo = this.comodos[index]
      if (comodo.id) {
        this.$bvModal.msgBoxConfirm(`Tem certeza que deseja remover esse cômodo ?`, {
          title: 'Remover cômodo',
          buttonSize: 'sm',
          okTitle: 'Remover',
          cancelTitle: 'Cancelar',
          okVariant: 'danger',
          footerClass: 'p-2',
          centered: true
        }).then(value => {
          if (value) {
            api.post('/imoveis/deletar/comodo', {idComodo: comodo.id}).then(() => {
              if (this.comodos.length > 1) {
                this.comodos.splice(index, 1)
              } else {
                this.comodos = [{ id: "", quantidade: 0, tipo: null }]
              }
            })
          }
        })
      } else {
        if (this.comodos.length > 1) {
          this.comodos.splice(index, 1)
        } else {
          this.comodos = [{ id: "", quantidade: 0, tipo: null }]
        }
      }
    },
    async selecionandoContrato(contrato){
      this.idContrato = ("0000" + contrato[0].contrato).slice(-4)
      await api.get('/contrato/boletos', {params:{idContrato: contrato[0].contrato}}).then(response => {
        this.boletos = response.data
      })
    },
    async cadastrarDespesa(){
      this.despesa.valor = converterDinherioFloat(this.despesa.valor)
      await api.post('/imoveis/despesas/cadastrar', {despesa: this.despesa, idImovel: this.imovel.id}).then(() => {
        this.buscarDespesas()
        Object.keys(this.despesa).forEach((key) => {
          this.despesa[key] = "";
        });
        this.despesa.fixa_variavel = null
        this.despesa.tipo_despesa = null
        this.despesa.valor = ""
      })
    },
    tabInfAdicionais(){
      setValue(this.$refs.valor_aquisicao, this.imovel.valor_aquisicao)
      setValue(this.$refs.valor_aquisicao_dolar, this.imovel.valor_aquisicao_dolar)
      setValue(this.$refs.valor_atual, this.imovel.valor_atual)
    },
    editarDespesa(despesa){
      setValue(this.$refs.despesa_valor, despesa.item.valor)
      this.despesa.data = despesa.item.data
      this.despesa.data_vencimento = despesa.item.data_vencimento
      this.despesa.descricao = despesa.item.descricao
      this.despesa.fixa_variavel = despesa.item.fixa_variavel
      this.despesa.tipo_despesa = despesa.item.id_tipo_despesa
      this.despesa.id = despesa.item.id
      this.editandoDespesa = true
    },
    async salvarDespesaEditada(){
      this.despesa.valor = converterDinherioFloat(this.despesa.valor)
      await api.post('/imoveis/despesas/editar', {despesa: this.despesa}).then(response => {
        console.log(response)
        this.despesa = {
          valor:"",
          data:"",
          data_vencimento:"",
          tipo_despesa:null,
          fixa_variavel:null,
          descricao:""
        }
        this.buscarDespesas()
      })
    },
    async deletarDespesa(despesa){
      this.despesa = {
        valor:"",
        data:"",
        data_vencimento:"",
        tipo_despesa:null,
        fixa_variavel:null,
        descricao:""
      }
      this.$bvModal.msgBoxConfirm(`Tem certeza que deseja remover essa despesa ?`, {
        title: 'Remover despesa',
        buttonSize: 'sm',
        okTitle: 'Despesa',
        cancelTitle: 'Cancelar',
        okVariant: 'danger',
        footerClass: 'p-2',
        centered: true
      }).then(value => {
        if (value) {
          let idDespesa = despesa.item.id
          api.delete(`/imoveis/despesa/${idDespesa}/deletar`).then(() => {
            this.buscarDespesas()
          })
        }
      })
    },
  },
  watch: {
    "imovel.cep": function(cep) {
      if (atribuirCep(cep)) {
        if (cep.length == 9) {
          this.carregandoCep = true
        }
        atribuirCep(cep).then(response => {
          this.carregandoCep = false
          this.atribuirCep(response)
        })
      }
    },
  },
  async mounted() {
    this.buscarImoveis();
    this.buscarTiposImoveis();
  },
};
</script>
<style>

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
  box-shadow: 0px 1px 5px rgba(200,200,200,0.5);
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
  box-shadow: 0px 1px 5px rgba(200,200,200,0.5);
}

.col-tabela-imoveis {
  padding-top: 15px;
}

.divider-personalizado {
  border-top: 1px solid rgb(200, 200, 200);
  position: absolute;
  bottom: 0;
  margin-left:-100px;
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

.td-centralizado{
  padding-top: 10px !important;
}

</style>
