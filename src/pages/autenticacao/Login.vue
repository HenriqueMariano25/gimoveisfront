<template>
  <b-container fluid="sm">
    <div >
      <img src="../../assets/fundo-inicial.jpg" alt="" class="imagem-background">
    </div>
    <div class="login-base">
      <div class="titulo text-center">
        <h1>GImóveis</h1>
      </div>
      <b-row>
        <b-col>
          <form @submit.prevent v-on:keyup.enter="login">
            <vs-input icon="person" label-placeholder="Usuário" class="w-100" v-model="usuario" autofocus/>
            <vs-input type="password" icon="lock" label-placeholder="Senha" class="w-100" v-model='senha'/>
          </form>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <b-col cols="12">
          <vs-button color="dark" type="relief" class="btn-login" @click="login">Entrar</vs-button>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div class="alerta-erro">
            <vs-alert :active.sync="erroVisivel" color="danger" closable close-icon="close">{{ mensagemErro }}</vs-alert>
          </div>
        </b-col>
      </b-row>
    </div>

  </b-container>
</template>

<script>

import api from "../../services/api"

export default {
  data() {
    return {
      usuario:'',
      senha:'',
      erroVisivel:false,
      mensagemErro:'',
    }
  },
  methods: {
    async login(){
      await api.post('/autenticacao/login', {usuario:this.usuario, senha: this.senha}).then(response => {
        let usuario = response.data['usuario']
        let token = response.data['Authorization']
        this.$store.commit('DEFINIR_USUARIO_LOGADO', {
          token: token,
          usuario: usuario,
        })
        this.$router.push({name: 'Home'})
      }).catch(erro => {
        this.erroVisivel = true
        let erroAtual = erro.response.data.erro
        this.mensagemErro = erroAtual
      })
    }
  },
};
</script>

<style>

.titulo {
  margin-top:10px;
}
.titulo h1{
  font-size: 48px;
}
.vs-con-input-label{
  margin-top:25px;
}

.input-span-placeholder {
  margin-left: 5px;
  margin-top: 4px;
}

.login-base {
  background-color: white;
  width: 400px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 5px;
  position: absolute;
  margin-left: -200px;
  left: 50%;
  box-shadow: 5px 5px 18px #a6a6a6;
  top: 50%;
  transform: translateY(-50%);
}
.includeIconOnly.large.botao_seta {
  width: 68px !important;
  height: 68px !important;
  box-shadow: 5px 5px 18px #a6a6a6;
}

.botao_seta .vs-icon.material-icons {
  font-size: 43px;
}

.icones-redes .col button {
  width: 50px !important;
  height:50px !important;
  left: 50%;
  transform: translateX(-50%);
}
.icones-redes .col button .vs-icon.material-icons{
  font-size: 35px;
}

.btn-login{
  margin-top:15px;
  margin-bottom: 15px;
  width: 100%;
}
.imagem-background{
  position:fixed;
  top:0;
  left:0;
  height: 100%;
  opacity: .7;
}
.alerta-erro{
  margin-bottom: 15px;
}

@media screen and (max-width: 992px){
  .login-base {
    width: calc(100vw - 20px);
    margin-left: 10px;
    margin-right: 20px;
    left: 0;
  }
}

@media screen and (min-width: 992px){
  .imagem-background{
    width: 100%;
  }
}

</style>

