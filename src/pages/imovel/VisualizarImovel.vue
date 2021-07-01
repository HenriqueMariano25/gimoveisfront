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
        <b-col cols="auto">
          <b-button
              variant="dark"
              @click="gerarRelatorio"
              class="barra-busca-mobile__imprimir">
            <b-icon icon="printer-fill"></b-icon>
          </b-button>
        </b-col>
      </b-row>
    </div>
    <b-row class="barra-top-imovel " align-v="center">
      <b-col>
        <h1 class="mb-1 titulo">Cadastro de Imóveis</h1>
      </b-col>
      <b-col class="barra-busca esconder-quando-mobile" cols="3">
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
      <b-col cols="auto" class="esconder-quando-mobile">
        <b-button
            v-b-tooltip.hover
            title="Imprimir relatório"
            variant="dark"
            @click="gerarRelatorio"
        >
          <b-icon icon="printer-fill"></b-icon>
        </b-button>
      </b-col>
    </b-row>
    <b-row class="tabela-imoveis">
      <b-col class="botao-add-total-mobile" cols="12">
        <b-row>
          <b-col>
            <vs-button color="#24a35a" type="filled" icon="person_add" @click="mostrarModal" style="width: 100%"
                       class="botao-add-mobile">
              Adicionar
            </vs-button>
          </b-col>
          <b-col class="ml-auto total-mobile" cols="auto">
            <h6>Total: {{ this.totalRows }}</h6>
          </b-col>
        </b-row>
      </b-col>
      <b-col class="col-tabela-imoveis">
        <b-table
            class="tabela-imovel"
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
            :busy="carregandoTableImovel"
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
            <p class="tr-imovel">{{ row.item.rua }}, N°{{ row.item.numero}}, {{row.item.complemento}}</p>
          </template>
          <template #cell(cpf_cnpj)="row">
            <p class="tr-imovel">{{ row.item.cpf_cnpj }}</p>
          </template>
          <template #cell(status)="row">
            <p class="tr-imovel">{{ row.item.status }}</p>
          </template>
          <template #cell(editar)="row">
            <div class="item-coluna-centralizada">
              <vs-tooltip text="Editar">
                <vs-button type="flat" color="dark" @click="editarImovelModal(row.item)" icon="edit"></vs-button>
              </vs-tooltip>
            </div>
          </template>
          <template #table-colgroup>
            <col>
            <col>
            <col>
            <col style="width: 15px">
            <col style="width: 15px">
          </template>
          <template #cell(deletar)="row">
            <div class="item-coluna-centralizada">
              <vs-tooltip text="Deletar">
                <vs-button type="flat" color="dark" @click="deletarImovelModal(row.item)" icon="delete"></vs-button>
              </vs-tooltip>
            </div>
          </template>
          <template #row-details="row">
            <b-card>
              <b-row>
                <b-col cols="auto">
                  <span><b>Rua:</b> {{ row.item.rua }}, {{ row.item.numero }}</span>
                </b-col>
                <b-col cols="auto">
                  <span><b>Bairro: </b>{{ row.item.bairro }}</span>
                </b-col>
                <b-col cols="auto">
                  <span><b>Cidade: </b>{{ row.item.cidade }}</span>
                </b-col>
                <b-col cols="auto">
                  <span><b>Estado: </b>{{ row.item.estado }}</span>
                </b-col>
                <b-col cols="auto">
                  <span><b>CEP: </b>{{ row.item.cep }}</span>
                </b-col>
                <b-col>
                  <span><b>Complemento: </b>{{ row.item.complemento }}</span>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <span><b>Proprietário: </b>{{ row.item.proprietario }}</span>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <span><b>Tipo de imóvel: </b>{{ row.item.tipo_imovel }}</span>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <span><b>Inscrição Municipal: </b>{{ row.item.inscricao_municipal }}</span>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <span><b>Funesbom: </b>{{ row.item.funesbom }}</span>
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
        <b-col>
          <h6>Total: {{ this.totalRows }}</h6>
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
    <modal
        name="modal-imovel"
        width='90%'
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
            <!--            <b-col cols="5">-->
            <!--              <vs-input-->
            <!--                label-placeholder="Proprietário*"-->
            <!--                v-model="imovel.proprietario"-->
            <!--                class="input-personalizado"-->
            <!--              />-->
            <!--            </b-col>-->
            <b-col>
              <b-form-group id="select-imovel" label="Proprietário*">
                <b-form-select v-model="imovel.id_responsavel" :options="proprietarios" value-field="id"
                               text-field="nome">
                  <template #first>
                    <b-form-select-option :value="null">Selecione</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
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
                    >Selecione
                    </b-form-select-option
                    >
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <vs-input
                  type="text"
                  label-placeholder="Inscrição Municipal"
                  v-model="imovel.inscricao_municipal"
                  class="input-personalizado"
              />
            </b-col>
            <b-col>
              <vs-input
                  type="text"
                  label-placeholder="Funesbom"
                  v-model="imovel.funesbom"
                  class="input-personalizado"
                  v-mask="'#######-#'"
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
                    >Selecione
                    </b-form-select-option
                    >
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <!--          onkeypress="return event.charCode >= 48 && event.charCode <= 57"-->
          <!--          onKeyDown="if(this.value.length==10 && event.keyCode!=8) return false;"-->
          <b-row>
            <b-col cols="2">
              <vs-input
                  type="text"
                  v-mask="'#####-###'"
                  label-placeholder="CEP*"
                  v-model="imovel.cep"
                  class="input-personalizado"
                  @focusout="buscarEndereco"
                  @focusin="cepAtual"
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
                  v-model="imovel.valor_aquisicao_mascara"
                  class="input-personalizado"
                  ref="valor_aquisicao"
                  v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                        allowNegative: false, currency:'BRL'}"
              />
            </b-col>
            <b-col>
              <vs-input
                  label-placeholder="Valor da aquisiçao em Dólar"
                  v-model="imovel.valor_aquisicao_dolar_mascara"
                  class="input-personalizado"
                  ref="valor_aquisicao_dolar"
                  v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                        allowNegative: false, currency:'USD'}"
              />
            </b-col>
            <b-col>
              <vs-input
                  label-placeholder="Valor atual"
                  v-model="imovel.valor_atual_mascara"
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
          <b-row>
            <b-col>
              <b-form-group
                  id="textarea"
                  label="Observação"
                  label-for="input-1">
                <b-form-textarea
                    id="textarea"
                    v-model="imovel.observacao"
                    rows="3"
                    max-rows="6"
                ></b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Cômodos" :disabled="imovel.id == ''">
          <b-row>
            <b-col cols="3">
              <b-form-group id="select-comodo" label="Tipo do comôdo">
                <b-form-select
                    :options="tiposComodos"
                    value-field="id"
                    text-field="descricao"
                    v-model="comodo.id_tipo_comodo"
                >
                  <template #first>
                    <b-form-select-option :value="null"
                    >Selecione
                    </b-form-select-option
                    >
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <vs-input
                  label-placeholder="Quantidade"
                  type="number"
                  class="input-personalizado"
                  v-model="comodo.quantidade"
              />
            </b-col>
            <b-col cols="6">
              <vs-input
                  label-placeholder="Descrição"
                  type="text"
                  class="input-personalizado"
                  v-model="comodo.descricao"
              />
            </b-col>
            <b-col cols="auto">
              <vs-button
                  type="filled"
                  icon="add"
                  class="botao-salvar botao-adicionar-comodo"
                  color="#5498ff"
                  @click.prevent="adicionarComodo()"
                  v-if="!editandoComodo"
              />
              <vs-button
                  type="filled"
                  icon="save"
                  class="botao-salvar botao-adicionar-comodo"
                  color="#5498ff"
                  @click.prevent="salvarEdicaoComodo()"
                  v-else
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-table
                  primary-key="nome"
                  id="tabela-imovel"
                  :tbody-transition-props="transProps"
                  bordered
                  head-variant="dark"
                  sort-icon-left
                  :fields="cabecalhosComodos"
                  :items="comodos"
                  :sort-by.sync="sortBy"
                  :sort-desc.sync="sortDesc"
                  :sort-direction="sortDirection"
                  show-empty
                  small
                  sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px)"
                  striped
                  hover
                  :busy="carregandoComodos"
                  outlined
                  no-border-collapse
              >
                <template #table-colgroup>
                  <col>
                  <col>
                  <col>
                  <col style="width: 15px">
                  <col style="width: 15px">
                </template>
                <template #table-busy>
                  <div class="text-center text-danger my-2">
                    <b-spinner class="align-middle"></b-spinner>
                    <strong class="ml-2">Carregando...</strong>
                  </div>
                </template>
                <template #cell(editar)="row">
                  <div class="item-coluna-centralizada">
                    <vs-tooltip text="Editar">
                      <vs-button type="flat" color="dark" icon="edit" @click="editarComodo(row)"></vs-button>
                    </vs-tooltip>
                  </div>
                </template>
                <template #cell(deletar)="row">
                  <div class="item-coluna-centralizada">
                    <vs-tooltip text="Deletar">
                      <vs-button type="flat" color="dark" icon="delete" @click="deletarComodo(row)"></vs-button>
                    </vs-tooltip>
                  </div>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Despesas" :disabled="imovel.id == ''">
          <b-row>
            <b-col>
              <vs-input
                  label-placeholder="Valor*"
                  ref="despesa_valor"
                  v-model="despesa.valor"
                  class="input-personalizado"
                  v-currency="{
                    precision: 2,
                    autoDecimalMode: true,
                    distractionFree: false,
                    allowNegative: false,
                    currency:{prefix:'R$ '}
                  }"
              />
            </b-col>
            <b-col>
              <vs-input label="Data" type="date" class="input-nascimento" v-model="despesa.data"/>
            </b-col>
            <b-col>
              <vs-input label="Vencimento" type="date" class="input-nascimento" v-model="despesa.data_vencimento"/>
            </b-col>
            <b-col>
              <b-form-group id="select-comodo" label="Tipo de despesa*" v-model="despesa.tipo_despesa">
                <b-form-select
                    :options="tiposDespesas"
                    value-field="id"
                    v-model="despesa.tipo_despesa"
                    text-field="descricao"
                >
                  <template #first>
                    <b-form-select-option :value="null"
                    >Selecione
                    </b-form-select-option
                    >
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row align-v="center" style="padding-bottom: 10px;">
            <b-col cols="3">
              <b-form-group id="select-comodo" label="Fixa ou Variável*">
                <b-form-select
                    :options="fixaVariavel"
                    value-field="valor"
                    v-model="despesa.fixa_variavel"
                    text-field="descricao"
                >
                  <template #first>
                    <b-form-select-option :value="null"
                    >Selecione
                    </b-form-select-option
                    >
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col cols="3">
              <b-form-group id="select-comodo" label="Responsável*" v-model="despesa.tipo_despesa">
                <b-form-select
                    :options="tiposResponsaveisPagamento"
                    value-field="id"
                    v-model="despesa.id_responsavel_pagamento"
                    text-field="descricao"
                >
                  <template #first>
                    <b-form-select-option :value="null"
                    >Selecione
                    </b-form-select-option
                    >
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
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
              </vs-button>
              <vs-button
                  color="#5498ff"
                  type="filled"
                  icon="save"
                  class="botao-salvar"
                  @click.native="salvarDespesaEditada"
                  v-else
              >
              </vs-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col class="col-tabela-imoveis">
              <b-table
                  primary-key="nome"
                  :tbody-transition-props="transProps"
                  id="tabela-imovel"
                  bordered
                  head-variant="dark"
                  sort-icon-left
                  :fields="cabecalhosDespesas"
                  :items="despesas"
                  show-empty
                  small
                  @filtered="onFiltered"
                  sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px - 100px)"
                  striped
                  hover
                  outlined
                  no-border-collapse
                  @row-clicked="item=>$set(item, '_showDetails', !item._showDetails)">
                >
                <template #cell(data)="row">
                  <label v-if="row.item.data">
                    {{ $dayjs(row.item.data).format('DD/MM/YYYY') }}
                  </label>
                </template>
                <template #cell(valor)="row">
                  <label>R$ {{ row.item.valor.replace('.', ',') }}</label>
                </template>
                <template #cell(data_vencimento)="row">
                  <label v-if="row.item.data_vencimento">
                    {{ $dayjs(row.item.data_vencimento).format('DD/MM/YYYY') }}
                  </label>
                </template>
                <template #cell(editar)="row">
                  <div class="item-coluna-centralizada">
                    <vs-tooltip text="Editar">
                      <vs-button type="flat" color="dark" icon="edit" @click="editarDespesa(row)"></vs-button>
                    </vs-tooltip>
                  </div>
                </template>
                <template #cell(deletar)="row">
                  <div class="item-coluna-centralizada">
                    <vs-tooltip text="Deletar">
                      <vs-button type="flat" color="dark" icon="delete" @click="deletarDespesa(row)"></vs-button>
                    </vs-tooltip>
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
                        <label v-if="row.item.data">
                          <b>Data: </b>{{ $dayjs(row.item.data).format('DD/MM/YYYY') }}
                        </label>
                        <label v-else><b>Data: </b>Sem data</label>
                      </b-col>
                    </b-row>
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
                    <b-row>
                      <b-col>
                        <label><b>Responsável: </b>{{ row.item.responsavel_pagamento }}</label>
                      </b-col>
                    </b-row>
                  </b-card>
                </template>
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Contratos" :disabled="imovel.id == ''">
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
                <template #cell(editar)="row">
                  <div class="item-coluna-centralizada">
                    <vs-tooltip text="Editar">
                      <vs-button type="flat" color="dark" icon="edit"
                                 @mousedown.stop="mostrarModalContrato(row)"></vs-button>
                    </vs-tooltip>
                  </div>
                </template>
                <template #cell(status)="row">
                  <label v-if="!row.item.nome_pdf" style="color:red">
                    <b>
                      Falta PDF
                    </b>
                  </label>
                  <label v-else>
                    {{ row.item.status }}
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
                  <label>
                    {{ ("000000" + row.item.id).slice(-6) }}
                  </label>
                </template>
                <template #cell(valor)="row">
                  <label>
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
          <b-col cols="auto">
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
                @click.native="cadastrarImovelSair(false)"
            >
              Salvar
            </vs-button>
          </b-col>
          <b-col cols="auto" v-if="!editar">
            <vs-button
                color="#39a324"
                type="filled"
                icon="save"
                class="botao-salvar"
                @click.native="cadastrarImovelSair(true)">
              Salvar e Sair
            </vs-button>
          </b-col>
          <b-col cols="auto">
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
    <ModalContrato :idContrato="idContratoModal" :visivel="modal_visivel" @esconder-modal="modal_visivel = $event"/>
  </b-container>
</template>

<script>
import api from "../../services/api"
import Carregando from "../../components/shared/Carregando"
import {atribuirCep, converterDinherioFloat} from "../../methods/global"
import {setValue} from "vue-currency-input"
import ModalContrato from "../../components/shared/ModalContrato"
import {jsPDF} from "jspdf"
import 'jspdf-autotable'
import dayjs from 'dayjs'

export default {
  name: "VisualizarImovel",
  components: {
    Carregando,
    ModalContrato,
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
        {key: "nome", label: "Nome", sortable: true, thClass: 'text-center'},
        {key: "rua", label: "Rua", sortable: true, thClass: 'text-center'},
        {key: "status", label: "Status", sortable: true, class: 'text-center'},
        {key: "editar", label: ""},
        {key: "deletar", label: ""},
      ],
      cabecalhosComodos: [
        {key: "tipo_comodo", label: "Tipo", sortable: true, class: 'text-center', tdClass: "td-centralizado"},
        {key: "quantidade", label: "Quantidade", sortable: true, class: 'text-center', tdClass: "td-centralizado"},
        {key: "descricao", label: "Descrição", sortable: true, class: 'text-center', tdClass: "td-centralizado"},
        {key: "editar", label: ""},
        {key: "deletar", label: ""},
      ],
      cabecalhosDespesas: [
        {key: "valor", label: "Valor", sortable: true, class: 'text-center', tdClass: "td-centralizado"},
        {key: "descricao", label: "Descrição", sortable: true, tdClass: "td-centralizado"},
        {key: "data_vencimento", label: "Vencimento", sortable: true, class: 'text-center', tdClass: "td-centralizado"},
        {
          key: "descricao_tipo_despesa",
          label: "Tipo",
          sortable: true,
          thClass: 'text-center',
          tdClass: "td-centralizado"
        },
        {key: "editar", label: ""},
        {key: "deletar", label: ""},
      ],
      cabecalhosContratosClientes: [
        {key: "contrato", label: "Contrato", sortable: true, class: 'text-center', tdClass: "td-centralizado"},
        {key: "cliente", label: "Cliente", sortable: true, thClass: 'text-center', tdClass: "td-centralizado"},
        {key: "data_inicio", label: "Data de início", sortable: true, class: 'text-center', tdClass: "td-centralizado"},
        {key: "data_fim", label: "Data de Término", class: 'text-center', sortable: true, tdClass: "td-centralizado"},
        {key: "status", label: "Status", class: 'text-center', sortable: true, tdClass: "td-centralizado"},
        {key: "editar", label: ""},
      ],
      cabecalhosContratosBoletos: [
        {key: "id", label: "Codigo", sortable: true, class: 'text-center'},
        {key: "valor", label: "Valor", sortable: true, class: 'text-center'},
        {key: "data_vencimento", label: "Vencimento", sortable: true, class: 'text-center'},
        {key: "data_quitacao", label: "Quitação", sortable: true, class: 'text-center'},
        {key: "status", label: "Status", sortable: true, class: 'text-center'},
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
      primeiraTabInfAdicionais: false,
      carregandoTableImovel: false,
      filtrados: [],
      dayjs: dayjs,
      barraBuscaMobile: false
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
      this.carregandoTableImovel = true
      await api.get("/imoveis").then((response) => {
        this.items = response.data
        this.filtrados = response.data
        this.totalRows = this.items.length
        this.carregandoTableImovel = false
      }).catch((erro) => {
        console.log(erro);
      });
    },
    async buscarContratos() {
      await api.get('/imoveis/contratos', {params: {idContrato: this.imovel.id}}).then(response => {
        this.contratos = response.data
      })
    },
    async buscarTiposDespesas() {
      await api.get('/imoveis/despesas/tipo_despesas').then(consulta => {
        this.tiposDespesas = consulta.data
      })
    },
    async buscarDespesas() {
      await api.get('/imoveis/despesas', {params: {idImovel: this.imovel.id}}).then(consulta => {
        this.despesas = consulta.data
        // this.rows = consulta.data.length
      })
    },
    async buscarTiposResponsaveisPagamento() {
      await api.get('/imoveis/despesas/responsavel_pagamento').then(consulta => {
        this.tiposResponsaveisPagamento = consulta.data
      })
    },
    async buscarProprietarios() {
      await api.get('/imoveis/proprietarios').then(response => {
        this.proprietarios = response.data
      })
    },


    onFiltered(filteredItems) {
      this.filtrados = filteredItems
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
      await api.get(`/imovel/`, {params: {id: imovel.id}}).then((response) => {
        this.editar = true
        this.imovel = response.data[0]
        this.buscarDespesas()
        this.buscarComodos()
        this.buscarContratos()
        this.mostrarModal()
      });
    },
    async editarImovel() {
      console.log(this.imovel.valor_aquisicao.includes(','))
      if (this.imovel.valor_aquisicao.includes(',')) this.imovel.valor_aquisicao = converterDinherioFloat(this.imovel.valor_aquisicao_mascara)
      if (this.imovel.valor_atual.includes(',')) this.imovel.valor_atual = converterDinherioFloat(this.imovel.valor_atual_mascara)
      if (this.imovel.valor_aquisicao_dolar.includes(',')) this.imovel.valor_aquisicao_dolar = converterDinherioFloat(this.imovel.valor_aquisicao_dolar_mascara)

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
        }).catch(erro => {
          console.log(erro)
          this.$vs.notify({
            text: `${erro.response.data.erro}`,
            position: 'top-center',
            color: 'danger',
            time: 4000,
            icon: 'check_circle_outline'
          })
        });
      }
    },

    mostrarModal() {
      this.$modal.show("modal-imovel");
      this.buscarTiposStatus();
      this.buscarTiposComodos();
      this.buscarTiposDespesas()
      this.buscarProprietarios()
      this.buscarTiposResponsaveisPagamento()
    },
    esconderModal() {
      this.$modal.hide("modal-imovel");
      this.limparModal();
      this.editar = false;
      this.boletos = []
      this.contratos = []
      this.idContrato = ""
      if (this.recarregarImovel) {
        this.buscarImoveis()
      }
      this.primeiraTabInfAdicionais = false
    },
    mostrarModalContrato(contrato) {
      this.$modal.show('modal-contrato')
      this.modal_visivel = true
      this.idContratoModal = contrato.item.contrato
    },
    limparModal() {
      Object.keys(this.imovel).forEach((key) => {
        this.imovel[key] = "";
      });
      this.imovel.id_status = null
      this.imovel.tipo_imovel = null
      this.imovel.id_responsavel = null
      this.despesa = {
        valor: "",
        data: "",
        data_vencimento: "",
        tipo_despesa: null,
        fixa_variavel: null,
        id_responsavel_pagamento: null,
        descricao: ""
      }
      this.despesas = []
      this.comodos = []
    },
    async cadastrarImovelSair(sair) {
      this.imovel.valor_aquisicao = converterDinherioFloat(this.imovel.valor_aquisicao_mascara)
      this.imovel.valor_atual = converterDinherioFloat(this.imovel.valor_atual_mascara)
      this.imovel.valor_aquisicao_dolar = converterDinherioFloat(this.imovel.valor_aquisicao_dolar_mascara)
      let idUsuario = this.$store.state.usuario.id
      if (this.validarCamposObrigatorio()) {
        await api.post("/imovel/cadastrar", {
          data: this.imovel,
          comodos: this.comodos,
          idUsuario: idUsuario
        }).then((response) => {
          let nomeImovel = response.data[0].nome;
          this.imovel.id = response.data[0].id
          this.$vs.notify({
            text: `Imóvel cadastrado com sucesso: ${nomeImovel} !`,
            position: "top-center",
            color: "success",
            time: 6000,
            icon: "check_circle_outline",
          });
          if (sair) {
            this.esconderModal();
            this.buscarImoveis();
            this.limparModal();
          } else {
            this.recarregarImovel = true
            this.buscarTiposDespesas()
            this.editar = true
          }
        }).catch(erro => {
          console.log(erro)
          this.$vs.notify({
            text: `${erro.response.data.erro}`,
            position: 'top-center',
            color: 'danger',
            time: 4000,
            icon: 'check_circle_outline'
          })
        });
      }
    },
    validarCamposObrigatorio() {
      if (
          this.imovel["nome"] == "" ||
          this.imovel["id_responsavel"] == "" ||
          this.imovel["rua"] == "" ||
          this.imovel["cidade"] == "" ||
          this.imovel["bairro"] == "" ||
          this.imovel["estado"] == "" ||
          this.imovel["cpf_cnpj"] == "" ||
          this.imovel["numero"] == "" ||
          this.imovel["cep"] == "" ||
          this.imovel["tipo_imovel"] == null
      ) {
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
    async selecionandoContrato(contrato) {
      this.idContrato = ("0000" + contrato[0].contrato).slice(-4)
      await api.get('/contrato/boletos', {params: {idContrato: contrato[0].contrato}}).then(response => {
        this.boletos = response.data
      })
    },
    validarCamposObrigatorioDespesa() {
      if (
          this.despesa.valor == "" ||
          this.despesa.tipo_despesa == null ||
          this.despesa.fixa_variavel == null ||
          this.despesa.id_responsavel_pagamento == null
      ) {
        this.$vs.notify({
          text: `Campos obrigatório em despesa vazio.`,
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
    async cadastrarDespesa() {
      let idUsuario = this.$store.state.usuario.id
      if (this.validarCamposObrigatorioDespesa()) {
        this.despesa.valor = converterDinherioFloat(this.despesa.valor)
        await api.post('/imoveis/despesas/cadastrar', {
          despesa: this.despesa,
          idImovel: this.imovel.id,
          idUsuario: idUsuario
        }).then(() => {
          this.buscarDespesas()
          Object.keys(this.despesa).forEach((key) => {
            this.despesa[key] = "";
          });
          this.despesa.fixa_variavel = null
          this.despesa.tipo_despesa = null
          this.despesa.id_responsavel_pagamento = null
          this.despesa.valor = ""
        })
      }
    },
    tabInfAdicionais() {
      if (this.primeiraTabInfAdicionais === false) {
        setValue(this.$refs.valor_aquisicao, this.imovel.valor_aquisicao)
        setValue(this.$refs.valor_aquisicao_dolar, this.imovel.valor_aquisicao_dolar)
        setValue(this.$refs.valor_atual, this.imovel.valor_atual)
      }
      this.primeiraTabInfAdicionais = true
    },
    editarDespesa(despesa) {
      setValue(this.$refs.despesa_valor, despesa.item.valor)
      this.despesa.data = despesa.item.data
      this.despesa.data_vencimento = despesa.item.data_vencimento
      this.despesa.descricao = despesa.item.descricao
      this.despesa.fixa_variavel = despesa.item.fixa_variavel
      this.despesa.id_responsavel_pagamento = despesa.item.id_responsavel_pagamento
      this.despesa.tipo_despesa = despesa.item.id_tipo_despesa
      this.despesa.id = despesa.item.id
      this.editandoDespesa = true
    },
    async salvarDespesaEditada() {
      let idUsuario = this.$store.state.usuario.id
      this.despesa.valor = converterDinherioFloat(this.despesa.valor)
      await api.post('/imoveis/despesas/editar', {despesa: this.despesa, idUsuario: idUsuario}).then(() => {
        this.despesa = {
          valor: "",
          data: "",
          data_vencimento: "",
          tipo_despesa: null,
          fixa_variavel: null,
          id_responsavel_pagamento: null,
          descricao: ""
        }
        this.buscarDespesas()
        this.editandoDespesa = false
      })
    },
    async deletarDespesa(despesa) {
      this.despesa = {
        valor: "",
        data: "",
        data_vencimento: "",
        tipo_despesa: null,
        fixa_variavel: null,
        id_responsavel_pagamento: null,
        descricao: ""
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

    async buscarTiposComodos() {
      await api.get("/imoveis/tipo_comodo").then((response) => {
        this.tiposComodos = response.data;
      });
    },
    async buscarComodos() {
      this.carregandoComodos = true
      let idImovel = this.imovel.id
      await api.get('/imoveis/comodos', {params: {idImovel: idImovel}}).then(consulta => {
        this.comodos = consulta.data
        this.carregandoComodos = false
      })
    },
    async adicionarComodo() {
      let idImovel = this.imovel.id
      let idUsuario = this.$store.state.usuario.id
      await api.post('/imoveis/comodo/cadastrar', {
        comodo: this.comodo,
        idImovel: idImovel,
        idUsuario: idUsuario
      }).then(() => {
        this.buscarComodos()
        this.comodo = {}
        this.comodo.id_tipo_comodo = null
      })
    },
    async editarComodo(comodo) {
      this.comodo.id_tipo_comodo = comodo.item.id_tipo_comodo
      this.comodo.quantidade = comodo.item.quantidade
      this.comodo.descricao = comodo.item.descricao
      this.comodo.id = comodo.item.id
      this.editandoComodo = true
    },
    async salvarEdicaoComodo() {
      let idUsuario = this.$store.state.usuario.id
      await api.post('/imoveis/comodo/editar', {comodo: this.comodo, idUsuario: idUsuario}).then(() => {
        this.comodo = {
          id: "",
          descricao: "",
          id_tipo_comodo: null,
          quantidade: ""
        }
        this.buscarComodos()
      })
    },

    async deletarComodo(comodo) {
      let idComodo = comodo.item.id
      this.$bvModal.msgBoxConfirm(`Tem certeza que deseja deletar esse cômodo ?`, {
        title: 'Deletar cômodo',
        buttonSize: 'sm',
        okTitle: 'Deletar',
        cancelTitle: 'Cancelar',
        okVariant: 'danger',
        footerClass: 'p-2',
        centered: true
      }).then(value => {
        if (value) {
          api.delete('/imoveis/comodo/deletar', {params: {idComodo: idComodo}}).then(() => {
            this.buscarComodos()
          })
        }
      })
    },


    cepAtual() {
      this.cep_atual = this.imovel.cep
    },
    buscarEndereco() {
      if (this.cep_atual != this.imovel.cep) {
        if (atribuirCep(this.imovel.cep)) {
          if (this.imovel.cep.length == 9) {
            this.carregandoCep = true
          }
          atribuirCep(this.imovel.cep).then(response => {
            this.carregandoCep = false
            this.atribuirCep(response)
          })
        }
      }
    },
    gerarRelatorio() {

      let novosDados = JSON.parse(JSON.stringify(this.filtrados))
      for (let i in novosDados){
        let rua_formatada = `${novosDados[i].rua}, N° ${novosDados[i].numero}, ${novosDados[i].complemento}`
        novosDados[i].rua = rua_formatada
      }


      let hojeAgr = dayjs().format('DD/MM/YYYY hh:mm:ss')
      var doc = new jsPDF()
      doc.page=1
      doc.setProperties({
        title: "Tabela de Imóveis"
      });
      doc.setFontSize(10)
      doc.text(hojeAgr, 200, 10, null, null, "right")
      doc.line(10, 12, 200, 12);
      doc.setFontSize(24)
      doc.text(`Tabela de Imovéis.`, 10, 22)
      doc.setFontSize(14)
      doc.text(`Total: ${this.filtrados.length}`, 200, 21, null, null, "right")
      doc.autoTable({
        head: [['Nome', 'Rua', 'Status']],
        columns: [
          {header: 'Nome', dataKey: 'nome'},
          {header: 'Rua', dataKey: 'rua'},
          {header: 'Status', dataKey: 'status'}
        ],
        body: novosDados,
        theme: 'striped',
        headStyles: {
          fillColor: [50,50,50]
        },
        startY: 25,
        pageBreak: 'auto',
        margin: {left:10, right:10, top: 10},
      })
      const totalPaginas = doc.internal.getNumberOfPages()
      doc.setFontSize(8)
      for (var i = 1; i <= totalPaginas; i++) {
        doc.setPage(i)
        doc.text(`Página ${String(i)} de ${String(totalPaginas)}`, 205, 293, null, null, "right")
      }
      window.open(doc.output('bloburl', {filename: 'tabela_imovel.pdf'}));
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
  .tabela-imovel{
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
    display:block;
  }
}

</style>
