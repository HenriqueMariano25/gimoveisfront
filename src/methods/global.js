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

export function converterDinherioFloat(valor){
    return valor.replace(/[USR$.\s]/gi, "").replace(',','.')
}

export function validarCamposObrigatorios(campos){
    return new Promise((resolve, reject)=> {
        console.log(campos)
        let tipoCampo
        let valorCampo
        let camposErrados = []
        for (var key in campos){
            tipoCampo = typeof campos[key]
            valorCampo = campos[key]
            if(tipoCampo == 'number'){
                if(valorCampo === 0 || valorCampo === null){
                    camposErrados.push(key.toUpperCase())
                }
            }else if(tipoCampo === 'string'){
                if(valorCampo === '' || valorCampo == '0.00') {
                    camposErrados.push(key.toUpperCase())
                }
            }else if(valorCampo === null){
                camposErrados.push(key.toUpperCase())
            }
        }
        if(camposErrados.length > 0) return reject(camposErrados)
        else return resolve()
    })
}
