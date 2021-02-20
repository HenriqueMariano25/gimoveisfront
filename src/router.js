import Vue from 'vue'
import Router from 'vue-router'
import store from "./services/store";

import Autenticacao from './routers/autenticacaoRouter'
import Cliente from './routers/clienteRouter'
import Usuario from './routers/usuarioRouter'
import Imovel from  './routers/imovelRouter'
import Responsavel from './routers/responsavelRouter'
import Contrato from './routers/contratoRouter'

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
        ...Imovel,
        ...Responsavel,
        ...Contrato
    ]
})

router.beforeEach((to, from, next) => {
    const token = store.state.token

    if (to.name !== 'Login' && !token && to.name !== 'Testes') next({name: 'Login'})
    else next()
})


export default router
