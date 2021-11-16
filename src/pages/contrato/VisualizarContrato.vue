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
    <b-row class="barra-top-contrato" align-v="center">
      <b-col>
        <h1 class="mb-1 titulo">Cadastro de Contrato</h1>
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
    </b-row>
    <b-row class="tabela-contratos">
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
      <b-col class="col-tabela-contratos">
        <b-table
            class="tabela-contrato"
            id="tabela-contrato"
            primary-key="id"
            :tbody-transition-props="transProps"
            bordered
            head-variant="dark"
            sort-icon-left
            :items="items"
            :fields="fields"
            :current-page="currentPage"
            :per-page="perPage"
            :filter="filter"
            :filter-included-fields="colunasPrFiltro"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            :sort-direction="sortDirection"
            show-empty
            small
            :busy="carregandoContratos"
            @filtered="onFiltered"
            striped
            hover
            outlined
            sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px)"
            no-border-collapse
            @row-clicked="item=>$set(item, '_showDetails', !item._showDetails)">
          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong class="ml-2">Carregando...</strong>
            </div>
          </template>
          <template #cell(id)="row">
            <p class="tr-contrato">{{ ("0000" + row.item.id).slice(-4) }}</p>
          </template>
          <template #cell(nome_cliente)="row">
            <p class="tr-contrato">{{ row.item.nome_cliente }}</p>
          </template>
          <template #cell(nome_responsavel)="row">
            <p class="tr-contrato">{{ row.item.nome_responsavel }}</p>
          </template>
          <template #cell(nome_imovel)="row">
            <p class="tr-contrato">{{ row.item.nome_imovel }}</p>
          </template>
          <template #cell(status)="row">
            <p v-if="!row.item.nome_pdf" class="tr-contrato" style="color:red"><b>Falta PDF</b></p>
            <p v-else class="tr-contrato text-capitalize">{{ row.item.status }}</p>
          </template>
          <template #cell(contrato)="row">
            <div class="item-coluna-centralizada">
              <vs-tooltip text="Mostrar contrato">
                <vs-button type="flat" color="dark" :disabled="!row.item.url" target :href="row.item.url"
                           icon="description"></vs-button>
              </vs-tooltip>
            </div>
          </template>
          <template #cell(aditivo)="row">
            <div class="item-coluna-centralizada">
              <vs-tooltip text="Mostrar aditivo">
                <vs-button type="flat" color="dark" :disabled="!row.item.url_aditivo" target :href="row.item.url_aditivo"
                           icon="note_add"></vs-button>
              </vs-tooltip>
            </div>
          </template>
          <template #cell(editar)="row">
            <div class="item-coluna-centralizada">
              <vs-tooltip text="Editar">
                <vs-button type="flat" color="dark" @click="editarContratoModal(row.item.id)" icon="edit"></vs-button>
              </vs-tooltip>
            </div>
          </template>
          <template #cell(deletar)="row">
            <div class="item-coluna-centralizada">
              <vs-tooltip text="Deletar">
                <vs-button type="flat" color="dark" @click="deletarContratoModal(row.item)" icon="delete"></vs-button>
              </vs-tooltip>
            </div>
          </template>
          <template #table-colgroup>
            <col>
            <col>
            <col>
            <col>
            <col>
            <col style="width: 15px">
            <col style="width: 15px">
            <col style="width: 15px">
            <col style="width: 15px">
          </template>
          <template #row-details="row">
            <b-card>
              <b-row>
                <b-col cols="auto">
                  <span v-if="row.item.data_inicio">
                    <span><b>Data de início: </b>{{ $dayjs(row.item.data_inicio).format('DD/MM/YYYY') }}</span>
                  </span>
                  <span v-else><b>Data de início:</b></span>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="auto">
                  <span v-if="row.item.data_fim">
                    <span><b>Data de término: </b>{{ $dayjs(row.item.data_fim).format('DD/MM/YYYY') }}</span>
                  </span>
                  <span v-else><b>Data de término:</b></span>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="auto">
                  <span v-if="row.item.data_vencimento">
                    <span><b>Data de vencimento: </b>{{ $dayjs(row.item.data_vencimento).format('DD/MM/YYYY') }}</span>
                  </span>
                  <span v-else><b>Data de vencimento:</b></span>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="auto">
                  <span v-if="row.item.valor_boleto">
                    <span><b>Valor: </b>R$ {{ row.item.valor_boleto.replace('.', ',') }}</span>
                  </span>
                  <span v-else><b>Valor: </b></span>
                </b-col>
              </b-row>
              <span><b>Fiadores: </b></span>
              <div v-for="(fiador, index) in row.item.fiadores" :key="index">
                <b-row>
                  <b-col cols="auto"><span>{{ fiador }}</span></b-col>
                </b-row>
              </div>
              <b-row>
                <b-col cols="auto">
                    <span><b>Carencia: </b>{{ row.item.carencia }}</span>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <span><b>Vigência: </b>{{ $dayjs(row.item.data_fim).diff(row.item.data_inicio, 'month') }} meses</span>
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
          <vs-button color="#24a35a" type="filled" icon="note_add" @click="mostrarModal">Adicionar
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
    <modal name="modal-contrato" id="modal-contrato" width="90%" height="auto" :scrollable="true"
           class="modal-contrato">
      <h3>Adicionando contrato</h3>
      <b-tabs content-class="mt-3" v-model="tabBoleto">
        <b-tab title="Dados gerais" active>
          <b-row>
            <b-col>
              <b-form-group id="select-contrato" label="Cliente 1*">
                <b-form-select v-model="contrato.id_cliente" :options="clientes" value-field="id"
                               text-field="nome">
                  <template #first>
                    <b-form-select-option :value="null">Selecione</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group id="select-contrato" label="Cliente 2">
                <b-form-select v-model="contrato.id_cliente2" :options="clientes" value-field="id"
                               text-field="nome">
                  <template #first>
                    <b-form-select-option :value="null">Selecione</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group id="select-contrato" label="Responsável*">
                <b-form-select v-model="contrato.id_responsavel" :options="responsaveis" value-field="id"
                               text-field="nome">
                  <template #first>
                    <b-form-select-option :value="null">Selecione</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group id="select-contrato" label="Imóvel*">
                <b-form-select v-model="contrato.id_imovel" :options="imoveis" value-field="id"
                               text-field="nome">
                  <template #first>
                    <b-form-select-option :value="null">Selecione</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group id="select-contrato" label="Status*">
                <b-form-select v-model="contrato.status" :options="status_contrato" value-field="id"
                               text-field="descricao">
                  <template #first>
                    <b-form-select-option :value="null">Selecione</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <vs-input label="Data de Início*" v-model="contrato.data_inicio" type="date"
                        class="input-nascimento"/>
            </b-col>
            <b-col>
              <vs-input label="Data de Término*" v-model="contrato.data_fim" type="date"
                        class="input-nascimento" :disabled="!ativo_data_termino"/>
            </b-col>
            <b-col>
              <vs-input label-placeholder="Vigência" v-model="contrato.vigencia" class="input-personalizado" readonly
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <vs-input label-placeholder="Carência" v-model="contrato.carencia" class="input-personalizado"/>
            </b-col>
            <b-col>
              <vs-input label="Vencimento*" v-model="contrato.data_vencimento" type="date"
                        class="input-nascimento"/>
            </b-col>
            <b-col>
              <vs-input ref="valor_boleto" label-placeholder="Valor do Boleto*" v-model="contrato.valor_boleto"
                        class="input-personalizado"
                        v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                        allowNegative: false, currency:'BRL'}"
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <vs-input label-placeholder="Garantia" v-model="contrato.garantia" class="input-personalizado"/>
            </b-col>
            <!--            <b-col>-->
            <!--              <b-form-group id="select-contrato" label="Fiador">-->
            <!--                <b-form-select v-model="contrato.fiador" :options="idFiador" value-field="id"-->
            <!--                               text-field="descricao">-->
            <!--                  <template #first>-->
            <!--                    <b-form-select-option :value="null">Selecione</b-form-select-option>-->
            <!--                  </template>-->
            <!--                </b-form-select>-->
            <!--              </b-form-group>-->
            <!--            </b-col>-->
          </b-row>
        </b-tab>
        <b-tab title="Inf. adicionais">
          <b-row>
            <b-col xs="12" md="12" lg="">
              <b-form-file @change="importarPDF" type="file" ref="file" class="mt-3 arquivo-pdf" accept=".pdf"
                           placeholder="Escolha um arquivo para importar"
                           drop-placeholder="Solte o arquivo aqui!" :disabled="!editar">
              </b-form-file>
            </b-col>
            <b-col lg="auto" xs="12" md="12">
              <div v-if="carregandoImportarPDF">
                <label class="p-contrato" style="margin-bottom: 2px; margin-right: 5px;"><b>Importando... </b></label>
                <b-spinner label="Loading..." small></b-spinner>
              </div>
              <div v-else>
                <p v-if="!editar" class="p-contrato"><b>Para realizar a importação primeiro cadastre esse contrato</b>
                </p>
                <template v-else>
                  <p v-if="contrato.nome_pdf" style="color:green" class="p-contrato"><b>Contrato importado</b></p>
                  <p v-else style="color:red" class="p-contrato"><b>Contrato não importado</b></p>
                </template>
              </div>
            </b-col>
            <b-col xs="12" md="12" lg="">
              <div>
                <b-form-file @change="importarAditivo" type="file" ref="file" class="mt-3 arquivo-pdf" accept=".pdf"
                             placeholder="Escolha um ADITIVO para importar"
                             drop-placeholder="Solte o arquivo aqui!" :disabled="!editar || !contrato.nome_pdf">
                </b-form-file>
              </div>
            </b-col>
            <b-col lg="auto" xs="12" md="12">
              <div v-if="carregandoImportarAditivo">
                <label class="p-contrato" style="margin-bottom: 2px; margin-right: 5px;"><b>Importando... </b></label>
                <b-spinner label="Loading..." small></b-spinner>
              </div>
              <div v-else>
                <p v-if="!editar" class="p-contrato"><b>Para realizar a importação do aditivo primeiro importe um contrato</b>
                </p>
                <template v-else>
                  <p v-if="contrato.nome_aditivo" style="color:green" class="p-contrato"><b>Aditivo importado</b></p>
                  <p v-else style="color:red" class="p-contrato"><b>Aditivo não importado</b></p>
                </template>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="auto">
              <div class="div-check-juros-multa">
                <b-form-checkbox
                    v-model="contrato.juros_multa"
                    value="true"
                    unchecked-value="false"
                    :disabled="!editar"
                >
                  Juros e multa:
                  <span v-if="contrato.juros_multa == 'true' || contrato.juros_multa == true">Sim</span>
                  <span v-else>Não</span>
                </b-form-checkbox>
              </div>
            </b-col>
            <b-col>
              <vs-input label-placeholder="Juros ao mês"
                        v-model="contrato.juros_mes"
                        :disabled="!editar"
                        class="input-personalizado"
                        v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                        allowNegative: false, currency:{suffix:'%'} }"/>
            </b-col>
            <b-col>
              <vs-input label-placeholder="Multa"
                        v-model="contrato.multa"
                        :disabled="!editar"
                        class="input-personalizado"
                        v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                        allowNegative: false, currency:{suffix:'%'} }"/>
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="auto">
              <vs-input label-placeholder="Reajuste do aluguel"
                        v-model="contrato.reajuste"
                        class="input-personalizado"
                        :disabled="!editar"
                        v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                        allowNegative: false, currency:{suffix:'%'} }"/>
            </b-col>
            <b-col>
              <vs-button color="#24a35a" type="filled" icon="add" class="btn-aplicar-reajuste"
                         @click="aplicarReajuste()" :disabled="!editar">
                Aplicar reajuste
              </vs-button>
            </b-col>
            <b-col>
              <vs-input label-placeholder="Valor reajustado"
                        v-model="contrato.valor_reajustado"
                        class="input-personalizado"
                        v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                        allowNegative: false, currency:'BRL'}"
                        readonly
                        :disabled="!editar"
              />
            </b-col>
            <b-col>
              <vs-input type="date" label-placeholder="Ultimo reajuste"
                        v-model="contrato.ultimo_reajuste"
                        class="input-personalizado"
                        :disabled="!editar"
                        readonly
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
                    rows="1s"
                    max-rows="6"
                    v-model="contrato.observacao"
                ></b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Boletos" :disabled="!editar">
          <b-row>
            <b-col>
              <b-table
                  id="tabela-boleto"
                  primary-key="id"
                  :tbody-transition-props="transProps"
                  bordered
                  head-variant="dark"
                  sort-icon-left
                  :items="boletos"
                  :fields="fieldsBoletos"
                  :current-page="currentPage"
                  show-empty
                  small
                  striped
                  hover
                  outlined
                  sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px)"
                  no-border-collapse
                  @row-clicked="item=>$set(item, '_showDetails', !item._showDetails)">
                <template #cell(data_vencimento)="row">
                  <label class="tr-contrato">{{ dayjs(row.item.data_vencimento).format('DD/MM/YYYY') }}</label>
                </template>
                <template #cell(valor)="row">
                  <label class="tr-contrato">R$ {{ row.item.valor.replace('.', ',') }}</label>
                </template>
                <template #cell(valor_juros)="row">
                  <label class="tr-contrato" v-if="row.item.valor_juros">R$ {{ row.item.valor_juros.replace('.', ',') }}</label>
                </template>
                <template #cell(status)="row">
                  <label class="tr-contrato">{{ row.item.status }}</label>
                </template>
                <template #cell(id)="row">
                  <label class="tr-contrato">{{ ("000000" + row.item.id).slice(-6) }}</label>
                </template>
                <template #cell(data_quitacao)="row">
                  <label v-if="row.item.data_quitacao != null && row.item.data_quitacao != ''" class="tr-contrato">
                    {{ dayjs(row.item.data_quitacao).format('DD/MM/YYYY') }}</label>
                  <label v-else class="tr-contrato">{{ row.item.data_quitacao }}</label>
                </template>
                <template #cell(editar)="row">
                  <div class="item-coluna-centralizada">
                    <vs-tooltip text="Editar">
                      <vs-button type="flat" color="dark" @click="editarBoletoModal(row.item)" icon="edit"></vs-button>
                    </vs-tooltip>
                  </div>
                </template>
                <template #cell(deletar)="row">
                  <div class="item-coluna-centralizada">
                    <vs-tooltip text="Deletar">
                      <vs-button v-if="row.item.status == 'Pago'" :disabled="true" type="flat" color="dark"
                                 @click="deletarBoletoAlerta(row)" icon="delete"></vs-button>
                      <vs-button v-else type="flat" color="dark" @click="deletarBoletoAlerta(row)"
                                 icon="delete"></vs-button>
                    </vs-tooltip>
                  </div>
                </template>
                <template #table-colgroup>
                  <col>
                  <col>
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
        </b-tab>
        <b-tab title="Fiador" :disabled="!editar">
          <b-row>
            <b-col cols="auto">
              <vs-button color="#24a35a" type="filled" icon="add" class="botao-salvar"
                         @click="mostrarModalFiador()">
                Adicionar Fiador
              </vs-button>
            </b-col>
          </b-row>
          <b-row class="mt-2">
            <b-col>
              <b-table
                  id="tabela-boleto"
                  primary-key="id"
                  :tbody-transition-props="transProps"
                  bordered
                  head-variant="dark"
                  sort-icon-left
                  :items="fiadores"
                  :fields="fieldsFiador"
                  :current-page="currentPage"
                  :per-page="perPage"
                  :filter="filter"
                  :sort-by.sync="sortBy"
                  :sort-desc.sync="sortDesc"
                  :sort-direction="sortDirection"
                  show-empty
                  small
                  striped
                  hover
                  outlined
                  sticky-header="calc(100vh - 82px - 30px - 48px - 52px - 55px)"
                  no-border-collapse
              >
                <template #cell(nome)="row">
                  <p class="tr-contrato">{{ row.item.nome }}</p>
                </template>
                <template #cell(email)="row">
                  <p class="tr-contrato">{{ row.item.email }}</p>
                </template>
                <template #cell(cpf_cnpj)="row">
                  <p class="tr-contrato">{{ row.item.cpf_cnpj }}</p>
                </template>
                <template #cell(editar)="row">
                  <div class="item-coluna-centralizada">
                    <vs-tooltip text="Editar">
                      <vs-button type="flat" color="dark" @click.native="editarFiadorModal(row.item)"
                                 icon="edit"></vs-button>
                    </vs-tooltip>
                  </div>
                </template>
                <template #cell(deletar)="row">
                  <div class="item-coluna-centralizada">
                    <vs-tooltip text="Deletar">
                      <vs-button type="flat" color="dark" @click.native="deletarFiadorAlerta(row)"
                                 icon="delete"></vs-button>
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
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
      <b-row align-h="end">
        <b-col cols="auto" align="left">
          <vs-button v-if="tabBoleto == 2" color="#24a35a" type="filled" icon="add" class="botao-salvar"
                     @click.native="mostrarModalAdicionarBoleto()">
            Adicionar Boleto
          </vs-button>
        </b-col>
        <b-col cols="auto" class="ml-auto">

          <vs-button v-if="editar" color="#24a35a" type="filled" icon="save" class="botao-salvar"
                     @click.native="editarContrato">
            Salvar
          </vs-button>
          <vs-button v-else color="#24a35a" type="filled" icon="save" class="botao-salvar"
                     @click.native="cadastrarContrato(false)">
            Salvar
          </vs-button>
        </b-col>
        <b-col cols="auto" v-if="!editar">
          <vs-button color="#24a35a" type="filled" icon="save" class="botao-salvar"
                     @click.native="cadastrarContrato(true)">
            Salvar e Sair
          </vs-button>
        </b-col>
        <b-col cols="auto">
          <vs-button color="#707070" type="filled" icon="clear" class="botao-salvar" @click.native="esconderModal">
            Cancelar
          </vs-button>
        </b-col>

      </b-row>
    </modal>
    <modal name="modal-fiador" id="modal-fiador" width="90%" height="auto" :scrollable="true" class="modal-contrato">
      <b-row>
        <b-col>
          <h1>Adicionando fiador</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="5">
          <vs-input label-placeholder="Nome" v-model="fiador.nome" class="input-personalizado"/>
        </b-col>
        <b-col>
          <b-form-group id="select-contrato" label="Estado Civil">
            <b-form-select v-model="fiador.estado_civil" :options="estadosCivis" value-field="id"
                           text-field="descricao">
              <template #first>
                <b-form-select-option :value="null">Selecione</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>
        </b-col>
        <b-col>
          <vs-input label="Data de Nascimento" v-model="fiador.data_nascimento" type="date"
                    class="input-nascimento"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="4">
          <vs-input label-placeholder="Email" v-model="fiador.email" class="input-personalizado"
          />
        </b-col>
        <b-col>
          <vs-input onKeyDown="if(this.value.length==18 && event.keyCode!=8) return false;" type="text"
                    v-mask="['###.###.###-##', '##.###.###/####-##']" label-placeholder="CPF ou CNPJ"
                    v-model="fiador.cpf_cnpj"
                    class="input-personalizado"/>
        </b-col>
        <b-col>
          <vs-input type="text"
                    label-placeholder="Identidade" v-model="fiador.identidade" class="input-personalizado"/>
        </b-col>
        <b-col>
          <vs-input label-placeholder="Celular/Telefone" v-model="fiador.telefone" class="input-personalizado"
                    v-mask="['(##)####-####', '(##)#####-####']"
          />
        </b-col>
      </b-row>
      <Carregando :visivel="carregandoCep"/>
      <b-row>
        <b-col cols="2">
          <vs-input
              type="text"
              label-placeholder="CEP"
              v-model="fiador.cep"
              class="input-personalizado"
              v-mask="'#####-###'"
              @focusout="buscarEndereco"
              @focusin="cepAtual"
          />
        </b-col>
        <b-col cols="5">
          <vs-input label-placeholder="Rua" v-model="fiador.rua" class="input-personalizado"/>
        </b-col>
        <b-col cols="2">
          <vs-input label-placeholder="Número" v-model="fiador.numero" class="input-personalizado"/>
        </b-col>
        <b-col cols="3">
          <vs-input label-placeholder="Complemento" v-model="fiador.complemento" class="input-personalizado"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <vs-input label-placeholder="Bairro" v-model="fiador.bairro" class="input-personalizado"/>
        </b-col>
        <b-col>
          <vs-input label-placeholder="Cidade" v-model="fiador.cidade" class="input-personalizado"/>
        </b-col>
        <b-col cols="2">
          <vs-input label-placeholder="UF" v-model="fiador.estado" class="input-personalizado" maxlength="2"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="auto" class="ml-auto" v-if="!fiador.id">
          <vs-button color="#24a35a" type="filled" icon="save" class="botao-salvar"
                     @click="cadastrarFiador()">
            Salvar
          </vs-button>
        </b-col>
        <b-col cols="auto" class="ml-auto" v-else>
          <vs-button color="#24a35a" type="filled" icon="save" class="botao-salvar"
                     @click="editarFiador()">
            Salvar
          </vs-button>
        </b-col>
        <b-col cols="auto">
          <vs-button color="#707070" type="filled" icon="clear" class="botao-salvar" @click="esconderModalFiador">
            Cancelar
          </vs-button>
        </b-col>
      </b-row>
    </modal>
    <modal name="modal-editar-boleto" width="90%" height="auto" :scrollable="true" :click-to-close="false"
           class="modal-contrato">
      <b-container>
        <b-row>
          <b-col>
            <h4>Editando boleto: {{ ("000000" + boleto.id).slice(-6) }}</h4>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <vs-input label="Data Vencimento" v-model="boleto.data_vencimento" type="date"
                      class="input-nascimento"/>
          </b-col>
          <b-col>
            <vs-input label="Data Quitação" v-model="boleto.data_quitacao" type="date"
                      class="input-nascimento"/>
          </b-col>
          <b-col>
            <vs-input label-placeholder="Valor" ref="inputValor" v-model="boleto.valor" class="input-personalizado"
                      v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                        allowNegative: false, currency:'BRL'}"/>
          </b-col>
          <b-col>
            <b-form-group id="select-contrato" label="Status">
              <b-form-select v-model="boleto.id_status_boleto" :options="status_boleto" value-field="id"
                             text-field="descricao">
                <template #first>
                  <b-form-select-option :value="null" disabled>Selecione</b-form-select-option>
                </template>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row align-h="end">
          <b-col cols="auto">
            <vs-button color="#24a35a" type="filled" icon="save" class="botao-salvar"
                       @click="editarBoleto">
              Salvar
            </vs-button>
          </b-col>
          <b-col cols="auto">
            <vs-button color="#707070" type="filled" icon="clear" class="botao-salvar"
                       @click="esconderModalEditarBoleto">
              Cancelar
            </vs-button>
          </b-col>
        </b-row>
      </b-container>
    </modal>
    <modal name="modal-adicionar-boleto" width="90%" height="auto" :scrollable="true" :click-to-close="false"
           class="modal-contrato">
      <b-container>
        <b-row>
          <b-col>
            <h4>Adicionando boleto:</h4>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <vs-input label="Data Vencimento" v-model="boleto.data_vencimento" type="date"
                      class="input-nascimento"/>
          </b-col>
          <b-col>
            <vs-input label="Data Quitação" v-model="boleto.data_quitacao" type="date"
                      class="input-nascimento"/>
          </b-col>
          <b-col>
            <vs-input label-placeholder="Valor" ref="inputValor" v-model="boleto.valor" class="input-personalizado"
                      v-currency="{precision: 2,autoDecimalMode: true,distractionFree: false,
                        allowNegative: false, currency:'BRL'}"/>
          </b-col>
          <b-col>
            <b-form-group id="select-contrato" label="Status">
              <b-form-select v-model="boleto.id_status_boleto" :options="status_boleto" value-field="id"
                             text-field="descricao">
                <template #first>
                  <b-form-select-option :value="null">Selecione</b-form-select-option>
                </template>
              </b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row align-h="end">
          <b-col cols="2">
            <vs-button color="#24a35a" type="filled" icon="save" class="botao-salvar"
                       @click.native="adicionarBoleto">
              Salvar
            </vs-button>
          </b-col>
          <b-col cols="2">
            <vs-button color="#707070" type="filled" icon="clear" class="botao-salvar"
                       @click.native="esconderModalAdicionarBoleto">
              Cancelar
            </vs-button>
          </b-col>
        </b-row>
      </b-container>
    </modal>
  </b-container>
</template>

<script>

import api from '../../services/api'
import dayjs from 'dayjs'
import {atribuirCep, converterDinherioFloat} from "../../methods/global";
import Carregando from "@/components/shared/Carregando";

export default {
  name: "VisualizarContrato",
  components: {
    Carregando,
  },
  data() {
    return {
      transProps: {
        name: "flip-list",
      },
      items: [],
      fields: [
        {key: 'id', label: 'Código', sortable: true, class: 'text-center'},
        {key: 'nome_cliente', label: 'Cliente', sortable: true, thClass: 'text-center'},
        {key: 'nome_responsavel', label: 'Responsável', sortable: true, thClass: 'text-center'},
        {key: 'nome_imovel', label: 'Imóvel', sortable: true, thClass: 'text-center'},
        {key: 'status', label: 'Status', class: 'text-center'},
        {key: 'contrato', label: ''},
        {key: 'aditivo', label: ''},
        {key: 'editar', label: ''},
        {key: 'deletar', label: ''},
      ],
      fieldsBoletos: [
        {key: 'id', label: 'Código', sortable: true, class: 'text-center'},
        {key: 'data_vencimento', label: 'Vencimento', sortable: true, class: 'text-center'},
        {key: 'valor', label: 'Valor', sortable: true, class: 'text-center'},
        {key: 'valor_juros', label: 'Valor c/ juros', sortable: true, class: 'text-center'},
        {key: 'data_quitacao', label: 'Data Quitação', sortable: true, class: 'text-center'},
        {key: 'status', label: 'Status', sortable: true, class: 'text-center'},
        {key: 'editar', label: '', class: 'text-center'},
        {key: 'deletar', label: '', class: 'text-center'},
      ],
      fieldsFiador: [
        {key: 'nome', label: 'Nome', sortable: true, thClass: 'text-center'},
        {key: 'email', label: 'Email', sortable: true, thClass: 'text-center'},
        {key: 'cpf_cnpj', label: 'CPF/CNPJ', sortable: true, thClass: 'text-center'},
        // {key: 'nome_imovel', label: 'Imóvel', sortable: true, thClass: 'text-center'},
        // {key: 'status', label: 'Status', class: 'text-center'},
        // {key: 'contrato', label: ''},
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
      colunasPrFiltro: ['id', 'nome_cliente', 'nome_responsavel', 'nome_imovel', 'status'],
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
        valor_reajustado:'',
        ultimo_reajuste:null
      },
      fiador: {
        nome: "",
        email: "",
        estado_civil: null,
        data_nascimento: "",
        cpf_cnpj: "",
        identidade: "",
        cep: "",
        rua: "",
        numero: "",
        bairro: "",
        estado: "",
        cidade: "",
        complemento: ""
      },
      estadosCivis: [],
      boletos: [],
      boleto: {
        valor: "",
        valor_formatado: "",
        data_vencimento: "",
        data_quitacao: "",
        id: "",
        id_status_boleto: null,
      },
      status_contrato: [],
      editar: false,
      responsaveis: [],
      clientes: [],
      imoveis: [],
      btn_desabilitado: false,
      ativo_data_termino: false,
      dayjs: dayjs,
      status_boleto: [],
      files: null,
      btn_importa_desabilitado: true,
      carregandoContratos: false,
      recarregarContratos: false,
      tabBoleto: 0,
      idFiador: [],
      carregandoImportarPDF: false,
      carregandoImportarAditivo: false,
      cep_atual: '',
      carregandoCep: false,
      fiadores: [],
      barraBuscaMobile: false
    }
  },

  methods: {
    async buscarResponsaveis() {
      await api.get('/contrato/responsaveis').then(response => {
        this.responsaveis = response.data
      })
    },
    async buscarClientes() {
      await api.get('/contrato/clientes').then(response => {
        this.clientes = response.data
      })
    },
    async buscarImoveis() {
      await api.get('/contrato/imoveis').then(response => {
        this.imoveis = response.data
      })
    },
    async buscarIdFiador() {
      await api.get('/contrato/id_fiador').then(response => {
        this.idFiador = response.data
      })
    },
    async buscarContratos() {
      this.carregandoContratos = true
      await api.get('/contratos').then(response => {
        this.items = response.data
        this.totalRows = this.items.length
        this.carregandoContratos = false
      })
    },
    async buscarBoletos(idContrato) {
      await api.get('/contrato/boletos', {params: {idContrato: idContrato}}).then(response => {
        this.boletos = response.data
      })
    },
    async buscarStatusBoleto() {
      await api.get('/contrato/boleto/status').then(response => {
        this.status_boleto = response.data
      })
    },
    async buscarStatusContrato() {
      await api.get('/contrato/status').then(consulta => {
        this.status_contrato = consulta.data
      })
    },
    async buscarEstadosCivis() {
      await api.get('/estados_civis').then(response => {
        this.estadosCivis = response.data
      })
    },
    async buscarFiadores() {
      await api.get('/contrato/fiadores', {params: {idContrato: this.contrato.id}}).then(resposta => {
            this.fiadores = resposta.data
          }
      )
    },

    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    async deletarContrato(contrato) {
      await api.delete(`/contrato/deletar/`, {params: contrato}).then(() => {
        this.buscarContratos()
      })
    },
    deletarContratoModal(contrato) {
      this.$bvModal.msgBoxConfirm(`Tem certeza que deseja deletar o contrato: ${contrato.id} ?`, {
        title: 'Deletar contrato',
        buttonSize: 'sm',
        okTitle: 'Deletar',
        cancelTitle: 'Cancelar',
        okVariant: 'danger',
        footerClass: 'p-2',
        centered: true
      }).then(value => {
        if (value) {
          this.deletarContrato(contrato)
        }
      })
    },
    async editarContratoModal(id) {
      await api.get('/contrato', {params: {idContrato: id}}).then(response => {
        this.contrato = response.data.contrato[0]
        this.contrato.valor_boleto = `R$ ${response.data.contrato[0].valor_boleto.replace('.', ',')}`
        if(this.contrato.valor_reajustado)
          this.contrato.valor_reajustado = `R$ ${response.data.contrato[0].valor_reajustado.replace('.', ',')}`
        else
          this.contrato.valor_reajustado = ''
        this.buscarBoletos(id)
        this.mostrarModal()
        this.editar = true
      })
    },
    async editarContrato() {
      this.contrato.valor_boleto_convertido = converterDinherioFloat(this.contrato.valor_boleto)
      if(this.contrato.juros_mes)
        this.contrato.juros_mes = this.contrato.juros_mes.replace('%','')
      else
        this.contrato.juros_mes = ''
      if(this.contrato.multa)
        this.contrato.multa = this.contrato.multa.replace('%','')
      else
        this.contrato.multa = ''
      if (this.validarCamposObrigatorio()) {
        let idUsuario = this.$store.state.usuario.id
        await api.post(`/contrato/editar`, {
          contrato: this.contrato,
          idUsuario: idUsuario,
          fiador: this.fiador
        }).then(response => {
          let codigo = response.data[0].id
          this.$vs.notify({
            text: `Contrato editado com sucesso: ${codigo} !`,
            position: 'top-center',
            color: 'warning',
            time: 6000,
            icon: 'check_circle_outline'
          })
          this.buscarContratos()
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
    editarBoletoModal(boleto) {
      api.get('/contrato/boleto', {params: {idBoleto: boleto.id}}).then(response => {
        this.buscarStatusBoleto()
        this.mostrarModalEditarBoleto()
        this.boleto = response.data[0]
        this.boleto.valor = `R$ ${response.data[0].valor.replace('.', ',')}`
      })
    },
    editarBoleto() {
      let idUsuario = this.$store.state.usuario.id
      if (this.boleto.data_quitacao == null) {
        this.boleto.data_quitacao = ''
      }
      this.boleto.valor = converterDinherioFloat(this.boleto.valor)
      api.post('/contrato/boleto/editar', {boleto: this.boleto, idUsuario:idUsuario}).then(response => {
        this.buscarBoletos(response.data[0].id_contrato)
        this.esconderModalEditarBoleto()
      })
    },

    async mostrarModal() {
      this.buscarResponsaveis()
      this.buscarClientes()
      this.buscarImoveis()
      this.buscarIdFiador()
      this.buscarStatusContrato()
      this.buscarEstadosCivis()
      this.buscarFiadores()
      this.$modal.show('modal-contrato')
    },

    esconderModal() {
      this.$modal.hide('modal-contrato');
      this.limparModal()
      this.editar = false
      if (this.recarregarContratos) {
        this.buscarContratos()
        this.recarregarContratos = false
      }
    },
    limparModal() {
      Object.keys(this.contrato).forEach(key => {
        this.contrato[key] = ""
      })
      this.contrato.id_cliente = null
      this.contrato.id_cliente2 = null
      this.contrato.id_imovel = null
      this.contrato.id_responsavel = null
      this.contrato.status = null
      this.contrato.juros_multa = false
      this.boletos = []
      this.fiadores = []
    },
    mostrarModalEditarBoleto() {
      this.$modal.show('modal-editar-boleto')
    },
    esconderModalEditarBoleto() {
      this.$modal.hide('modal-editar-boleto');
      this.boleto = {}
      this.boleto.id_status_boleto = null
    },
    limparModalEditarBoleto() {
      Object.keys(this.boleto).forEach(key => {
        this.contrato[key] = ""
      })
    },
    importarPDF(event) {
      if (this.editar) {
        this.carregandoImportarPDF = true
        this.btn_importa_desabilitado = false
        this.files = event.target.files
        const formData = new FormData();
        for (const i of Object.keys(this.files)) {
          formData.append('files', this.files[i])
        }
        api.post(`/contrato/${this.contrato.id}/importar/pdf`, formData, {}).then((res) => {
          this.contrato.nome_pdf = res.data[0].nome
          this.buscarContratos()
          this.$vs.notify({
            text: `Contrato importado com sucesso!`,
            position: 'top-center',
            color: 'success',
            time: 4000,
            icon: 'check_circle_outline'
          })
          this.carregandoImportarPDF = false
        })
      }
    },
    importarAditivo(event){
      if (this.editar) {
        this.carregandoImportarAditivo = true
        this.btn_importa_desabilitado = false
        this.files = event.target.files
        const formData = new FormData();
        for (const i of Object.keys(this.files)) {
          formData.append('files', this.files[i])
        }
        api.post(`/contrato/${this.contrato.id}/importar/aditivo`, formData, {}).then((res) => {
          this.contrato.nome_aditivo = res.data[0].nome
          this.buscarContratos()
          this.$vs.notify({
            text: `Aditivo importado com sucesso!`,
            position: 'top-center',
            color: 'success',
            time: 4000,
            icon: 'check_circle_outline'
          })
          this.carregandoImportarAditivo = false
        })
      }
    },
    mostrarModalAdicionarBoleto() {
      this.$modal.show('modal-adicionar-boleto')
      this.buscarStatusBoleto()
    },
    esconderModalAdicionarBoleto() {
      this.$modal.hide('modal-adicionar-boleto')
      this.boleto = {}
      this.boleto.id_status_boleto = null
    },
    async adicionarBoleto() {
      let idUsuario = this.$store.state.usuario.id
      this.boleto.valor = converterDinherioFloat(this.boleto.valor)
      if (this.boleto.data_quitacao == "" || this.boleto.data_quitacao == null) {
        this.boleto.data_quitacao = ""
      }
      await api.post('/contrato/boleto/cadastrar', {
        boleto: this.boleto,
        idContrato: this.contrato.id,
        idUsuario: idUsuario
      }).then(() => {
        this.esconderModalAdicionarBoleto()
        this.buscarBoletos(this.contrato.id)
      })
    },
    async deletarBoletoAlerta(boleto) {
      this.$bvModal.msgBoxConfirm(`Tem certeza que deseja deletar o boleto: ${("000000" + boleto.item.id).slice(-6)} ?`, {
        title: 'Deletar boleto',
        buttonSize: 'sm',
        okTitle: 'Deletar',
        cancelTitle: 'Cancelar',
        okVariant: 'danger',
        footerClass: 'p-2',
        centered: true
      }).then(value => {
        if (value) {
          this.deletarBoleto(boleto.item.id)
        }
      })
    },
    async deletarBoleto(idBoleto) {
      await api.delete('/contrato/boleto/deletar', {params: {idBoleto: idBoleto}}).then(() => {
        this.buscarBoletos(this.contrato.id)
      })
    },
    async cadastrarContrato(sair) {
      this.contrato.valor_boleto_convertido = converterDinherioFloat(this.contrato.valor_boleto)
      this.contrato.juros_mes = this.contrato.juros_mes.replace('%','')
      this.contrato.multa = this.contrato.multa.replace('%','')
      if (this.validarCamposObrigatorio()) {
        if (this.validarDataInicioFim()) {
          let idUsuario = this.$store.state.usuario.id
          await api.post('/contrato/cadastrar', {
            contrato: this.contrato,
            idUsuario: idUsuario,
            fiador: this.fiador
          }).then(response => {
            this.contrato.id = response.data[0].id
            this.$vs.notify({
              text: `Contrato cadastrado com sucesso!`,
              position: 'top-center',
              color: 'success',
              time: 6000,
              icon: 'check_circle_outline'
            })
            if (sair) {
              this.esconderModal()
              this.buscarContratos()
              this.limparModal()
            } else {
              this.recarregarContratos = true
              this.editar = true
              this.buscarBoletos(this.contrato.id)
            }
          }).catch(erro => {
            this.$vs.notify({
              text: `${erro.response.data.erro}`,
              position: 'top-center',
              color: 'danger',
              time: 40000,
              icon: 'check_circle_outline'
            })
          })
        }
      }
    },
    validarCamposObrigatorio() {
      if (this.contrato['id_responsavel'] == "" || this.contrato['id_cliente'] == "" || this.contrato['id_imovel'] == "" ||
          this.contrato['data_inicio'] == "" || this.contrato['data_fim'] == "" ||
          this.contrato['valor_boleto'] == "" || this.contrato['data_vencimento'] == "" || this.contrato['status'] == null) {
        this.$vs.notify({
          text: `Campos obrigatórios vazio.`,
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
    limparModalFiador() {
      Object.keys(this.fiador).forEach(key => {
        this.fiador[key] = ""
      })
      this.fiador.estado_civil = null
    },
    mostrarModalFiador() {
      this.$modal.show('modal-fiador')
    },
    esconderModalFiador() {
      this.$modal.hide('modal-fiador')
      this.limparModalFiador()
    },
    async cadastrarFiador() {
      let idUsuario = this.$store.state.usuario.id
      let idContrato = this.contrato.id
      await api.post(`/contrato/fiador/cadastrar`, {fiador: this.fiador, idContrato: idContrato, idUsuario: idUsuario}).then(() => {
        this.$vs.notify({
          text: `Fiador cadastrado com sucesso!`,
          position: 'top-center',
          color: 'success',
          time: 6000,
          icon: 'check_circle_outline'
        })
        this.esconderModalFiador()
        this.buscarFiadores()
      })
    },
    editarFiadorModal(fiador) {
      let alterandoFiador = JSON.parse(JSON.stringify(fiador))
      this.fiador = alterandoFiador
      this.fiador.estado_civil = alterandoFiador.id_estado_civil
      this.mostrarModalFiador()
    },
    async editarFiador() {
      let idUsuario = this.$store.state.usuario.id
      await api.post(`/contrato/fiador/editar`, {fiador: this.fiador, idUsuario: idUsuario}).then(() => {
        this.$vs.notify({
          text: `Fiador editado com sucesso!`,
          position: 'top-center',
          color: 'warning',
          time: 6000,
          icon: 'check_circle_outline'
        })
        this.esconderModalFiador()
        this.buscarFiadores()
      })
    },
    deletarFiadorAlerta(fiador) {
      this.$bvModal.msgBoxConfirm(`Tem certeza que deseja deletar o fiador: ${fiador.item.nome} ?`, {
        title: 'Deletar fiador',
        buttonSize: 'sm',
        okTitle: 'Deletar',
        cancelTitle: 'Cancelar',
        okVariant: 'danger',
        footerClass: 'p-2',
        centered: true
      }).then(value => {
        if (value) {
          this.deletarFiador(fiador)
        }
      })
    },
    async deletarFiador(fiador) {
      await api.delete('/contrato/fiador/deletar', {params: {idFiador: fiador.item.id}}).then(() => {
        this.fiadores.splice(fiador.index, 1)
      })
    },
    validarDataInicioFim() {
      let inicio = this.contrato.data_inicio
      let fim = this.contrato.data_fim
      if (fim <= inicio) {
        this.$vs.notify({
          text: `Datas de Início ou Fim inválidas`,
          position: 'top-center',
          color: 'danger',
          time: 5000,
          icon: 'check_circle_outline'
        })
        return false
      } else {
        return true
      }
    },
    atribuirCep(dados) {
      if (dados.bairro != "") {
        this.fiador['bairro'] = dados.bairro
      }
      if (dados.localidade != "") {
        this.fiador.cidade = dados.localidade
      }
      if (dados.uf != "") {
        this.fiador.estado = dados.uf
      }
      if (dados.complemento != "") {
        this.fiador.complemento = dados.complemento
      }
      if (dados.logradouro != "") {
        this.fiador.rua = dados.logradouro
      }
    },
    cepAtual() {
      this.cep_atual = this.fiador.cep
    },
    buscarEndereco() {
      if (this.cep_atual != this.fiador.cep) {
        if (atribuirCep(this.fiador.cep)) {
          if (this.fiador.cep.length == 9) {
            this.carregandoCep = true
          }
          atribuirCep(this.fiador.cep).then(response => {
            this.carregandoCep = false
            this.atribuirCep(response)
          })
        }
      }
    },
    async aplicarReajuste(){
      let reajusteFormatado = this.contrato.reajuste.replace('%','').replace(',','.')
      let valorFormatado = this.contrato.valor_boleto.replace('R$','').replace(',','.').trim()
      let valorReajustadoFormatado = this.contrato.valor_reajustado.replace('R$','').replace(',','.').trim()
      await api.patch('/contrato/reajuste', {reajuste:reajusteFormatado, valor:valorFormatado, valor_reajustado:valorReajustadoFormatado ,contrato: this.contrato}).then(resposta => {
        let valor_reajustado = resposta.data.valor_reajustado
        this.contrato.valor_reajustado = `R$ ${valor_reajustado.replace('.', ',')}`
        this.contrato.ultimo_reajuste = resposta.data.ultimo_reajuste
        this.contrato.reajuste = ''
      })
    }
  },
  watch: {
    'contrato.data_inicio': function (inicio) {
      if (inicio.length == 10) {
        this.ativo_data_termino = true
      } else {
        this.ativo_data_termino = false
        this.contrato.data_fim = ""
        this.contrato.vigencia = ""
      }
    },
    'contrato.data_fim': function (fim) {
      if (fim.length == 10) {
        let inicio = this.contrato.data_inicio
        this.contrato.vigencia = dayjs(fim).diff(inicio, 'month')
      } else {
        this.contrato.vigencia = ""
      }
    },
  },
  async mounted() {
    this.buscarContratos()
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
  margin-top: -40px !important;
  bottom: 25px;
  padding: 25px;
}

.tr-contrato {
  margin-top: 6px;
  margin-bottom: 0px;
}

.tr-cliente {
  margin-top: 6px;
  margin-bottom: 0px;
}

.barra-top-contrato {
  padding: 0;
  margin: 0;
  margin-bottom: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 1px 5px rgba(200, 200, 200, 0.5);
}

.tabela-contratos {
  background-color: white;
  margin: 0;
  padding: 0;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0px 1px 5px rgba(200, 200, 200, 0.5);
}

.col-tabela-contratos {
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

#select-contrato__BV_label_ {
  margin: 0;
  padding: 0;
  color: rgb(110, 110, 110);
  font-size: 12px;
}

#select-contrato {
  margin-bottom: 10px;
}

.item-coluna-centralizada {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-importar-pdf {
  margin-top: 5px;
}

.arquivo-pdf {
  margin-top: 10px !important;
}

.custom-file-input:lang(pt-br) ~ .custom-file-label::after {
  content: 'Importar';
}

.p-contrato {
  margin-top: 15px;
}

table#tabela-contrato .flip-list-move {
  transition: transform 0.4s;
}

table#tabela-boleto .flip-list-move {
  transition: transform 0.4s;
}

.modal-contrato {
  margin-left: 25px;
}

#select-cliente {
  margin-bottom: 10px;
}

.div-check-juros-multa{
  width: 160px;
  margin-top: 25px;
}
.btn-aplicar-reajuste{
  margin-top:13px;
  width: 100%;
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
  .tabela-contrato{
    max-height: calc(((((100vh - 82px) - 30px) - 48px) - 52px) - 55px - 20px) !important;
  }
  .barra-busca-mobile {
    display: block;
  }
  .botao-add-total-mobile {
    display: block;
  }

  .col-tabela-contratos {
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
