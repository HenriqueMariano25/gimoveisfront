<template>
  <v-row class="elevation-1 barra-topo pt-1 pb-1 pr-2" no-gutters align="center">
    <v-col>
      <h3 class="titulo ma-0 ml-1">{{ titulo }}</h3>
    </v-col>
    <v-col cols="auto" v-if="btnAdicionar">
      <v-btn
          depressed
          :color="'var(--btn-adicionar)'"
          dark
          @click="clickBtnAdicionar"
          :fab="$isMobile"
      >
        <v-icon :class="{ 'mr-2': !$isMobile }"> mdi-plus </v-icon>
        <span v-if="!$isMobile"> Adicionar </span>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "BarraTopoBusca",
  props: {
    titulo: String,
    btnAdicionar: {
      type: Boolean,
    },
  },
  methods: {
    clickBtnAdicionar() {
      this.$emit("clickBtnAdicionar")
    },
  }
}
</script>

<style scoped>
.barra-topo {
  background-color: white;
  position: relative;
  left: 0;
  top: 0;
  width: 100vw;
  padding-top: 4px;
  margin-left: -16px;
  margin-right: -12px;
  margin-top: -12px;
  padding-left: 15px;
}

.titulo {
  font-size: 170%;
}
</style>
