const routes = [
    {
        path: '/ajuste',
        component: () => import(/* webpackChunkName: "login" */ '../pages/ajuste/VisualizarAjuste.vue'),
        name: 'Ajuste'
    }
]

export default routes