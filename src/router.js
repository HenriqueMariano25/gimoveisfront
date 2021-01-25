import Vue from 'vue'
import Router from 'vue-router'

import Autenticacao from './routers/autenticacaoRouter'
import Cliente from './routers/clienteRouter'
import Usuario from './routers/usuarioRouter'
import Imovel from  './routers/imovelRouter'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [ {
        path: '/',
        component: () => import(/* webpackChunkName: "home" */ './pages/Home'),
        name: 'Home'
    },
        ...Autenticacao,
        ...Cliente,
        ...Usuario,
        ...Imovel
    ]
})


export default router