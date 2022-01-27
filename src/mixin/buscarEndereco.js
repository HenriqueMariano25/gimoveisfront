const axios = require('axios').default;

export default {
    methods: {
        async $buscarEndereco(cep) {
            let cep_formatado = cep.normalize("NFD").replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '')
            let endereco = await axios.get(`https://viacep.com.br/ws/${cep_formatado}/json/`)
            return (endereco.data)
        },
    },
};