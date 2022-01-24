<template>
  <v-container :fluid="$isMobile">
    <div>
      <img src="../../assets/fundo-inicial.jpg" alt="" class="imagem-background">
    </div>
    <div class="login-base pa-5">
      <v-row no-gutters>
        <v-col class="titulo">
          <h1 class="text-center">GImóveis</h1>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col>
          <form @submit.prevent v-on:keyup.enter="login">
            <v-row>
              <v-col>
                <v-text-field
                    outlined
                    hide-details
                    dense
                    autofocus
                    label="Usuário"
                    prepend-inner-icon="mdi-account"
                    v-model="usuario.usuario"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row class="mt-0">
              <v-col>
                <v-text-field
                    outlined
                    type="password"
                    dense
                    hide-details
                    label="Senha"
                    prepend-inner-icon="mdi-lock"
                    v-model="usuario.senha"
                ></v-text-field>
              </v-col>
            </v-row>
          </form>
        </v-col>
      </v-row>
      <v-row no-gutters class="mt-2">
        <v-col>
          <v-alert
              class="mb-2"
              text
              type="error"
              hide-details
              v-if="erroVisivel"
          >
            {{ mensagemErro }}
          </v-alert>
        </v-col>
      </v-row>
      <v-row class="mt-0" no-gutters>
        <v-col>
          <v-btn block dark large @click="login">
            Entrar
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>

import api from "../../services/api"

export default {
  data() {
    return {
      usuario: {
        usuario: '',
        senha: ''
      },
      erroVisivel:false,
      mensagemErro:'',
    }
  },
  methods: {
    async login(){
      let { usuario, senha } = this.usuario

      await api.post('/autenticacao/login', {usuario, senha}).then(response => {
        let usuario = response.data['usuario']
        let token = response.data['Authorization']
        this.$store.commit('DEFINIR_USUARIO_LOGADO', {
          token: token,
          usuario: usuario,
        })
        this.$router.push({name: 'Home'})
      }).catch(erro => {
        let erroAtual
        if(erro.response){
          erroAtual = erro.response.data.erro
        }else{
          erroAtual = 'Erro no servidor, verifique com suporte!'
        }
        this.erroVisivel = true
        this.mensagemErro = erroAtual
      })
    }
  },
};
</script>

<style scoped>
.titulo h1{
  font-size: 48px;
}

.login-base {
  background-color: white;
  width: 400px;
  border-radius: 5px;
  position: absolute;
  margin-left: -200px;
  left: 50%;
  box-shadow: 5px 5px 18px #a6a6a6;
  top: 50%;
  transform: translateY(-50%);
}

.imagem-background{
  position:fixed;
  top:0;
  left:0;
  height: 100%;
  opacity: .7;
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

