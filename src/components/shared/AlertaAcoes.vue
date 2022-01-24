<template>
  <div>
    <v-snackbar
        :timeout="4000"
        v-model="mostrarAlerta"
        outlined
        :color="corEditada"
        border="left"
        dense
        text
    >
      <v-icon :color="corEditada" class="icone">{{ iconeEditado }}</v-icon>
      <span class="ml-3 mt-2 texto">{{ textoEditado }}</span>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "AlertaAcoes",
  props: ['icone', 'texto', 'cor', 'mostrar', 'funcao', 'palavra-chave'],
  data(){
    return{
      mostrarAlerta: this.mostrar,
      textoEditado: '',
      corEditada: '',
      iconeEditado: ''
    }
  },
  mounted() {
    let capitalizePalavraChave = this.palavraChave[0].toUpperCase() + this.palavraChave.slice(1)

    if(this.funcao === 'cadastrado'){
      this.textoEditado = `${capitalizePalavraChave} cadastrado com sucesso!`
      this.corEditada = '#539051'
      this.iconeEditado = 'mdi-check'
    }
    if(this.funcao === 'editado'){
      this.textoEditado = `${capitalizePalavraChave} editado com sucesso!`
      this.corEditada = '#539051'
      this.iconeEditado = 'mdi-pencil'
    }

    if(this.funcao === 'deletado'){
      this.textoEditado = `${capitalizePalavraChave} deletado com sucesso!`
      this.corEditada = '#539051'
      this.iconeEditado = 'mdi-delete'
    }

    if(this.funcao === 'finalizado'){
      this.textoEditado = `${capitalizePalavraChave} finalizado com sucesso!`
      this.corEditada = '#539051'
      this.iconeEditado = 'mdi-check-underline'
    }

    if(this.funcao === 'erro'){
      this.textoEditado = this.texto
      this.corEditada = '#FF0000'
      this.iconeEditado = 'mdi-alert'
    }

    if(this.funcao === null){
      this.textoEditado = this.texto
      this.corEditada = this.cor
      this.iconeEditado = this.icone
    }
  },
  watch:{
    mostrar: function (valor) {
      this.mostrarAlerta = valor
    },
    mostrarAlerta: function (valor) {
      if(valor === false){
        this.$emit('sumir')
      }
    },
    funcao: function (valor) {
      this.funcao = valor

      let capitalizePalavraChave = this.palavraChave[0].toUpperCase() + this.palavraChave.slice(1)

      if(this.funcao === 'cadastrado'){
        this.textoEditado = `${capitalizePalavraChave} cadastrado(a) com sucesso!`
        this.corEditada = '#539051'
        this.iconeEditado = 'mdi-check'
      }
      if(this.funcao === 'editado'){
        this.textoEditado = `${capitalizePalavraChave} editado(a) com sucesso!`
        this.corEditada = '#539051'
        this.iconeEditado = 'mdi-pencil'
      }

      if(this.funcao === 'deletado'){
        this.textoEditado = `${capitalizePalavraChave} deletado(a) com sucesso!`
        this.corEditada = '#539051'
        this.iconeEditado = 'mdi-delete'
      }

      if(this.funcao === 'finalizado'){
        this.textoEditado = `${capitalizePalavraChave} finalizado(a) com sucesso!`
        this.corEditada = '#539051'
        this.iconeEditado = 'mdi-check-underline'
      }

      if(this.funcao === 'erro'){
        this.textoEditado = this.texto
        this.corEditada = '#FF0000'
        this.iconeEditado = 'mdi-alert'
      }

      if(this.funcao === null){
        this.textoEditado = this.texto
        this.corEditada = this.cor
        this.iconeEditado = this.icone
      }


    },
  }
}
</script>

<style scoped>
.texto {
  font-size: 20px;
}

.icone {
  font-size: 22px;
  margin-top: 0px;
}
</style>