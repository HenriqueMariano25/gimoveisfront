<template>
  <v-menu offset-y :close-on-content-click="false" ref="menu">
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon
          small
          :style="
            colorirIcone == true ? 'color: rgb(62, 174, 248) !important' : ''
          "
        >
          mdi-filter</v-icon
        >
      </v-btn>
    </template>
    <v-row class="busca-individual" no-gutters align="center">
      <v-col class="pa-3">
        <v-row>
          <v-col class="pb-0 pt-1">
            <span>{{ textoFiltro }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="">
            <v-text-field
              label="Data início"
              type="date"
              outlined
              dense
              hide-details
              v-model="data.inicio"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-1 pb-0">
            <v-text-field
              label="Data fim"
              type="date"
              outlined
              dense
              hide-details
              v-model="data.fim"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              @click="limpar"
              fab
              small
              dark
            >
              <v-icon> mdi-eraser </v-icon>
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              @click="enviarFiltro"
              fab
              small
              :disabled="!validarDatas"
              :dark="validarDatas"
            >
              <v-icon> mdi-magnify </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-menu>
</template>

<script>
export default {
  props: {
    textoFiltro: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      data: {
        inicio: "",
        fim: "",
      },
      colorirIcone: false,
    }
  },
  computed: {
    validarDatas() {
      if (this.data.inicio > this.data.fim) return false
      return this.data.inicio != "" || this.data.fim != ""
    },
  },
  methods: {
    limpar() {
      this.$refs.menu.isActive = false
      this.data = {
        inicio: "",
        fim: "",
      }
      this.colorirIcone = false
      this.$emit("limpar-filtro")
    },

    enviarFiltro() {
      this.$refs.menu.isActive = false
      this.$emit("enviar-filtro", this.data)
      this.data = {
        inicio: "",
        fim: "",
      }
      this.colorirIcone = true
    },
  },
}
</script>

<style scoped>
.lista-checkbox {
  height: 200px;
  overflow: auto;
  padding-top: 2px;
}

.cada-checkbox {
  margin-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 270px;
}

.busca-individual {
  background-color: white;
  width: 300px;
}
</style>
