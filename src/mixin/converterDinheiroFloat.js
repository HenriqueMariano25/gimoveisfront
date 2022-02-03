export default {
    methods: {
        $converterDinherioFloat(valor) {
            if(valor && valor !== '0' && valor !== null )
                return valor.replace(/[USR$.\s]/gi, "").replace(',','.')
        },
    },
};