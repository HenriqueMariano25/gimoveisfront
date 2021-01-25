const routes = [
    {
        path: '/visualizar/imovel',
        component: () => import(/* webpackChunkName: "imovel" */ '../pages/imovel/VisualizarImovel'),
        name: 'VisualizarImovel'
    }
]

export default routes