import api from "../services/api";

export function atribuirCep (cep) {
    return new Promise(resolve => {
        let cep_formatado = cep.normalize("NFD").replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '')
        if (cep_formatado.length == 8) {
             api.get(`/cliente/consultar_cep/${cep_formatado}`).then(response => {
                return resolve(response.data)
            })
        }
        return false
    })
}