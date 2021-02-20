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
          <template #row-details>
            <b-card>
              <p>Detalhes do imóvel</p>
            </b-card>
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
        <b-tab title="Inf. adicionais">
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
                type="number"
                v-model="imovel.valor_aquisicao"
                class="input-personalizado"
              />
            </b-col>
            <b-col>
              <vs-input
                label-placeholder="Valor da aquisiçao em Dólar"
                type="number"
                v-model="imovel.valor_aquisicao_dolar"
                class="input-personalizado"
              />
            </b-col>
            <b-col>
              <vs-input
                label-placeholder="Valor atual"
                type="number"
                v-model="imovel.valor_atual"
                class="input-personalizado"
              />
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <vs-input
                type="number"
                label-placeholder="N° cliente luz"
                v-model="imovel.numero_cliente_luz"
                class="input-personalizado"
              />
            </b-col>
            <b-col>
              <vs-input
                type="number"
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
                  <vs-input
                    label-placeholder="Quantidade"
                    v-model="comodo.quantidade"
                    class="input-personalizado"
                  />
                </b-col>
                <b-col cols="5">
                  <b-form-group id="select-comodo" label="Status">
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
                <b-col cols="2" class="text-center botao-deletar-comodo">
                  <vs-button
                    type="flat"
                    icon="delete"
                    color="dark"
                    class="botao-salvar"
                    @click="removerComodo(index)"
                  />
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Despesas">
          <b-row class="text-center">
            <b-col cols="auto">
              <vs-button
                color="#5498ff"
                type="filled"
                icon="add"
                class="botao-salvar"
              >
                Adicionar despesa
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
                :items="itemsContratoClientes"
                :fields="cabecalhosDespesas"
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
                no-border-collapse
                @row-clicked="(item) => $set(item, '_showDetails', !item._showDetails)"
              >
              </b-table>
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Contratos">
          <b-row class="text-center mb-2">
            <b-col cols="auto">
              <vs-button
                color="#5498ff"
                type="filled"
                icon="add"
                class="botao-salvar"
              >
                Adicionar contrato
              </vs-button>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <p class="p-contratos">Contratos de:</p>
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
                :items="itemsContratoClientes"
                :fields="cabecalhosContratosClientes"
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
                no-border-collapse
                @row-clicked="
                  (item) => $set(item, '_showDetails', !item._showDetails)
                "
              >
              </b-table>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <p class="p-contratos">Parcelas do contrato:</p>
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
                :items="itemsContratoClientes"
                :fields="cabecalhosContratosParcelas"
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
                no-border-collapse
                @row-clicked="
                  (item) => $set(item, '_showDetails', !item._showDetails)
                "
              >
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
              @click="editarImovel"
              >Salvar
            </vs-button>
            <vs-button
              v-else
              color="#24a35a"
              type="filled"
              icon="save"
              class="botao-salvar"
              @click="cadastrarImovel"
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
              @click="esconderModal"
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

export default {
  name: "VisualizarImovel",
  components:{
    Carregando
  },
  data() {
    return {
      items: [],
      itemsContratoClientes: [],
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
        { key: "categoria", label: "Categoria", sortable: true },
        { key: "descricao", label: "Descricao", sortable: true },
        { key: "data", label: "Data", sortable: true },
        { key: "vencimento", label: "Vencimento" },
        { key: "tipo", label: "Tipo" },
        { key: "editar", label: "Editar" },
        { key: "deletar", label: "Deletar" },
      ],
      cabecalhosContratosClientes: [
        { key: "contrato", label: "Contrato", sortable: true },
        { key: "cliente", label: "Cliente", sortable: true },
        { key: "data_inicio", label: "Data de início", sortable: true },
        { key: "vencimento", label: "Vencimento" },
        { key: "status", label: "Status" },
      ],
      cabecalhosContratosParcelas: [
        { key: "valor", label: "Valor", sortable: true },
        { key: "vencimento", label: "Vencimento" },
        { key: "status", label: "Status" },
        { key: "editar", label: "Editar" },
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
      tiposStatus: [],
      tiposImoveis: [],
      tiposComodos: [],
      comodos: [{ id: "", quantidade: 0, tipo: null }],
      editar: false,
      carregandoCep:false
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
      await api
        .get("/imoveis")
        .then((response) => {
          this.items = response.data;
          this.totalRows = this.items.length;
        })
        .catch((erro) => {
          console.log(erro);
        });
    },
    async buscarTiposComodos() {
      await api.get("/imoveis/tipo_comodo").then((response) => {
        this.tiposComodos = response.data;
      });
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
      this.$bvModal
        .msgBoxConfirm(
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
        )
        .then((value) => {
          if (value) {
            this.deletarImovel(imovel);
          }
        });
    },

    async editarImovelModal(imovel) {
      await api
        .get(`/imovel/`, { params: { id: imovel.id } })
        .then((response) => {
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
      if (this.validarCamposObrigatorio()) {
        // let variaveisString = ['data_nascimento', 'identidade', 'status', 'estado_civil']
        // for (let key in variaveisString) {
        //   if (this.cliente[variaveisString[key]] == "") {
        //     this.cliente[variaveisString[key]] = null
        //   }
        // }
        await api
          .post(`/imovel/editar/${this.imovel.id}`, {
            data: this.imovel,
            comodos: this.comodos,
          })
          .then((response) => {
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
    },
    esconderModal() {
      this.$modal.hide("modal-imovel");
      this.limparModal();
      this.editar = false;
    },
    limparModal() {
      Object.keys(this.imovel).forEach((key) => {
        this.imovel[key] = "";
      });
      this.imovel.id_status = null;
      this.imovel.tipo_imovel = null;
    },
    async cadastrarImovel() {
      if (this.validarCamposObrigatorio()) {
        // let variaveisString = ['data_nascimento', 'identidade', 'status', 'estado_civil']
        // for (let key in variaveisString) {
        //   if (this.cliente[variaveisString[key]] == "") {
        //     this.cliente[variaveisString[key]] = null
        //   }
        // }
        await api
          .post("/imovel/cadastrar", {
            data: this.imovel,
            comodos: this.comodos,
          })
          .then((response) => {
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
        this.imovel["email"] == "" ||
        this.imovel["rua"] == "" ||
        this.imovel["cidade"] == "" ||
        this.imovel["bairro"] == "" ||
        this.imovel["estado"] == "" ||
        this.imovel["cpf_cnpj"] == "" ||
        this.imovel["numero"] == "" ||
        this.imovel["cep"] == ""
      ) {
        // this.$vs.notify({
        //   text: `Campos obrigatorios vazio.`,
        //   position: 'top-center',
        //   color: 'danger',
        //   time: 4000,
        //   icon: 'check_circle_outline'
        // })
        return true;
      } else {
        return true;
      }
    },
    atribuirCep(dados) {
      // this.imovel.bairro = ""
      // this.imovel.cidade = ""
      // this.imovel.uf = ""
      // this.imovel.complemento = ""
      // this.imovel.rua = ""
      // this.imovel.numero = ""
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
      this.comodos.splice(index, 1);
    },
  },
  watch: {
    "imovel.cep": function(cep) {
      if (cep.length == 8) {
        this.carregandoCep = true
        api.get(`/cliente/consultar_cep/${cep}`).then((response) => {
          this.carregandoCep = false
          this.atribuirCep(response.data);
        });
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
</style>
