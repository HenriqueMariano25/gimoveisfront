<template>
  <v-row class="elevation-1 barra-topo" no-gutters align="center">
    <v-col>
      <h3 class="titulo ma-0 ml-1">{{ titulo }}</h3>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "BarraTopoBusca",
  props: {
    titulo: String,
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
