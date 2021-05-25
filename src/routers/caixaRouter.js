const routes = [
    {
        path: '/visualizar/caixa',
        component: () => import(/* webpackChunkName: "caixa" */ '../pages/caixa/VisualizarCaixa'),
        name: 'VisualizarCaixa'
    }
]

export default routes