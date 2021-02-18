const routes = [
    {
        path: '/visualizar/contrato',
        component: () => import(/* webpackChunkName: "cliente" */ '../pages/contrato/VisualizarContrato'),
        name: 'VisualizarContrato'
    }
]

export default routes