const routes = [
    {
        path: '/login',
        component: () => import(/* webpackChunkName: "login" */ '../pages/autenticacao/Login.vue'),
        name: 'Login'
    }
]

export default routes