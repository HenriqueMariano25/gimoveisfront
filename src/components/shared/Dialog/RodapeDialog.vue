<template>
  <v-row class="rodape-dialog" align="center">
    <v-col cols="">
      <v-btn color="var(--btn-cancelar)"  dark @click="cancelar">
        <v-icon>mdi-close</v-icon>
        Cancelar
      </v-btn>
    </v-col>
    <v-col cols="auto">
      <v-btn
        v-if="btnSalvar"
        @click="editando == true ? editar() : salvar()"
        dark
        color="var(--btn-salvar)"
      >
        <v-icon>mdi-content-save</v-icon>
        Salvar
      </v-btn>
    </v-col>
    <slot name="btnCustom"> </slot>
  </v-row>
</template>

<script>
export default {
  props: {
    editando: { type: Boolean },
    "btn-salvar": { type: Boolean, default: true },
  },
  methods: {
    cancelar() {
      this.$emit("cancelar")
    },
    salvar() {
      this.$emit("salvar")
    },
    editar() {
      this.$emit("editar")
    },
  },
  data() {
    return {
      deletando: false,
    }
  },
}
</script>

<style scoped>
.rodape-dialog {
  background-color: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
