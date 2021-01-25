import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const estado = {
    token: null,
    usuario: {},
    dolar: 0
}

const mutations = {
    DEFINIR_USUARIO_LOGADO(state, { token, usuario, dolar }) {
        state.token = token
        state.usuario = usuario
        state.dolar = dolar
    },
    DESLOGAR_USUARIO(state) {
        state.token = null
        state.usuario = {}
        state.dolar = 0
    }
}

const getters = {
    usuarioEstaLogado: state => Boolean(state.token)
}

export default new Vuex.Store({
    state: estado,
    mutations,
    getters
})
