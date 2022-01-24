<template>
  <v-row class="pa-2 bottom  elevation-2" no-gutters justify="end">
    <v-col>
      <v-btn depressed :color="'var(--preto-principal)'" dark :large="!$isMobile" @click="clickBtnImprimirRelatorio"
             :fab="$isMobile">
        <v-icon :class="{ 'mr-2': !$isMobile}">
          mdi-printer
        </v-icon>
        <span v-if="!$isMobile">

        Imprimir relatório
        </span>
      </v-btn>
    </v-col>
    <v-col cols="auto">
      <v-btn depressed :color="'var(--btn-adicionar)'" dark :large="!$isMobile" @click="clickBtnAdicionar"
             :fab="$isMobile">
        <v-icon :class="{ 'mr-2': !$isMobile}">
          mdi-plus
        </v-icon>
        <span v-if="!$isMobile">
        Adicionar
        </span>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "BarraBottomBotoes",
  methods: {
    clickBtnAdicionar() {
      this.$emit("clickBtnAdicionar")
    },

    clickBtnImprimirRelatorio() {
      this.$emit("clickBtnImprimirRelatorio")
    }
  }
}
</script>

<style scoped>
.bottom {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  background-color: white;
  padding-left: 70px !important;
  padding-right: 30px !important;
}

@media screen and (max-width: 992px) {
  .bottom {
    padding-left: 10px !important;
    padding-right: 10px !important;
  }
}
</style>