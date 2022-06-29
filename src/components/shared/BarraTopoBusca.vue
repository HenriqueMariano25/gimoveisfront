<template>
  <v-row class="elevation-1 barra-topo pa-2" no-gutters align="center">
    <v-col>
      <h3 class="titulo ma-0 ml-1">{{ titulo }}</h3>
    </v-col>
    <v-col cols="auto" xl="3" lg="3" md="3" v-if="temBusca">
      <v-text-field
        outlined
        hide-details
        calculate-widths
        dense
        label="Busque aqui"
        prepend-inner-icon="mdi-magnify"
        :value="busca"
        @input="buscar"
        width="100%"
        small
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "BarraTopoBusca",
  t: ["titulo", "busca"],
  props: {
    titulo: String,
    busca: String,
    temBusca: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      valor: "",
    }
  },
  methods: {
    buscar(valor) {
      this.$emit("buscar", valor)
    },
  },
}
</script>

<style scoped>
.barra-topo {
  background-color: white;
  border-radius: 10px;
  width: 100%;
}

.titulo {
  font-size: 170%;
}
</style>
