<template>
  <v-dialog
      v-model="mostrar"
      persistent
      width="400"
  >
    <v-card
        color="primary"
        dark
        class="pa-3"
    >
      <h3 class="text-center">
        Buscando dados, aguarde...
      </h3>
      <v-progress-linear
          indeterminate
          color="white"
          class="mb-0">
      </v-progress-linear>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DialogCarregando",
  props: ['mostrar']
}
</script>

<style scoped>

</style>