<template>
  <v-row class="elevation-1 barra-topo pt-1 pb-1 pr-2" no-gutters >
    <v-col>
      <v-row align="center">
        <v-col v-if="btnGerarRelatorio" cols="5">
          <v-btn
              depressed
              :color="'var(--preto-principal)'"
              dark
              @click="clickBtnImprimirRelatorio"
              :fab="$isMobile"
          >
            <v-icon :class="{ 'mr-2': !$isMobile }"> mdi-printer </v-icon>
            <span v-if="!$isMobile"> Imprimir relatório </span>
          </v-btn>
        </v-col>
        <v-col v-if="inputBusca" >
          <v-row align="center" >
            <v-col class="pr-2">
              <v-text-field
                  outlined
                  hide-details
                  calculate-widths
                  dense
                  label="Busque aqui"
                  prepend-inner-icon="mdi-magnify"
                  v-model="valor"
                  small
              >
              </v-text-field>
            </v-col>
            <v-col cols="auto" class="pr-2 pl-0">
              <v-btn depressed
                     :color="'var(--preto-principal)'" dark @click="buscar">
                <v-icon>
                  mdi-magnify
                </v-icon>
              </v-btn>
            </v-col>
            <v-col cols="auto" class="pl-0">
              <v-btn
                  depressed
                  outlined
                  @click="limparBusca">
                <v-icon>
                  mdi-eraser
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "BarraBuscaRelatorio",
  props: ["btnGerarRelatorio", "inputBusca"],
  data(){
    return{
      valor: ''
    }
  },
  methods: {
    clickBtnAdicionar() {
      this.$emit("clickBtnAdicionar")
    },

    clickBtnImprimirRelatorio() {
      this.$emit("clickBtnImprimirRelatorio")
    },
    buscar(){
      this.$emit('buscar', this.valor)
    },
    limparBusca(){
      this.valor = null
      this.$emit('limparBusca')
    }
  },
}
</script>

<style scoped>
.barra-topo {
  background-color: white;
  position: relative;
  left: 0;
  top: 0;
  width: 100vw;
  margin-top: 8px;
  padding-left: 8px;
}

</style>