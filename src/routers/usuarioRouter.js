const routes = [
    {
        path: '/visualizar/usuario',
        component: () => import(/* webpackChunkName: "usuario" */ '../pages/usuario/VisualizarUsuario'),
        name: 'VisualizarUsuario'
    }
]

export default routes