<template>
  <v-menu offset-y :close-on-content-click="false" ref="menu">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon
          small
          :style="
            textoBuscado != null ? 'color: rgb(62, 174, 248) !important' : ''
          "
        >
          mdi-filter</v-icon
        >
      </v-btn>
    </template>
    <v-row
      class="busca-individual"
      no-gutters
      align="center"
      v-on:keyup.enter="enviarFiltro"
    >
      <v-col class="pa-1">
        <v-row no-gutters>
          <v-col
            ><v-text-field
              :label="textoFiltro"
              type="text"
              outlined
              dense
              hide-details
              v-model="texto"
            />
          </v-col>
          <v-col cols="auto" class="ml-1">
            <v-btn @click="enviarFiltro" fab small dark>
              <v-icon> mdi-magnify </v-icon>
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn @click="limpar" color="var(--btn-escuro)" icon class="ml-1">
              <v-icon> mdi-eraser </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-menu>
</template>

<script>
export default {
  name: "FiltroSimples",
  props: {
    textoFiltro: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      texto: null,
      textoBuscado: null,
    }
  },
  methods: {
    limpar() {
      this.$refs.menu.isActive = false
      this.textoBuscado = null
      this.$emit("limpar-filtro")
    },

    enviarFiltro() {
      this.$refs.menu.isActive = false
      let texto = this.texto
      this.textoBuscado = texto
      this.texto = null
      this.$emit("enviar-filtro", texto)
    },
  },
  watch: {
    opcoes(novoValor, antigoValor) {
      if (novoValor.toString() !== antigoValor.toString()) {
        this.selecionarTodos()
      }
    },
  },
}
</script>

<style scoped>
.busca-individual {
  background-color: white;
  width: 350px;
}
</style>
