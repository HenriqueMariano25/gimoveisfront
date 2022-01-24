<template>
  <v-dialog
      v-model="mostrar"
      persistent
      width="550px">
    <v-card class="pt-3">
      <v-row no-gutters>
        <v-col class="text-center text-h5 ma-1">
          <span>{{ texto }}</span>
        </v-col>
      </v-row>
      <v-card-text class="text-center">
        {{ subTexto }}
      </v-card-text>
      <v-card-actions>
        <v-row justify="space-between" no-gutters>
          <v-col cols="auto">
            <v-btn
                dark
                color="var(--btn-cancelar)"
                @click="emitirCancelar">
              <v-icon>
                mdi-close
              </v-icon>
              Cancelar
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
                dark
                color="var(--btn-deletar)"
                @click="emitirDeletar">
              <v-icon>
                mdi-delete
              </v-icon>
              Deletar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DialogDeletar",
  props: ['texto', 'sub-texto', 'mostrar'],
  methods: {
    emitirDeletar() {
      this.$emit('deletar')
    },
    emitirCancelar() {
      this.$emit('cancelar')
    }
  }
}
</script>

<style scoped>

</style>