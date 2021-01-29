const routes = [
    {
        path: '/visualizar/responsavel',
        component: () => import(/* webpackChunkName: "responsavel" */ '../pages/responsavel/VisualizarResponsavel'),
        name: 'VisualizarResponsavel'
    }
]

export default routes