const routes = [
    {
        path: '/visualizar/cliente',
        component: () => import(/* webpackChunkName: "cliente" */ '../pages/cliente/VisualizarCliente'),
        name: 'VisualizarCliente'
    }
]

export default routes