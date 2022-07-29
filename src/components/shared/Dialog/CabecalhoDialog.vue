<template>
  <v-row class="titulo-dialog" align="center">
    <v-col class="pb-0 pt-0">
      <h2 class="titulo">
        {{ estaEditando ? textoEditando : textoCadastrando }}
      </h2>
    </v-col>
    <v-col class="pt-0 pb-0" cols="auto">
      <v-btn icon dark @click="fecharDialog">
        <v-icon small> mdi-close </v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["esta-editando", "texto-cadastrando", "texto-editando"],
  methods: {
    fecharDialog() {
      this.$emit("fechar");
    },
  },
};
</script>

<style scoped>
.titulo-dialog {
  background-color: var(--azul-secundaria);
  color: white;
}
</style>