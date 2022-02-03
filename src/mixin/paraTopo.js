export default {
    methods: {
        $paraTopo () {
            this.$vuetify.goTo(
                '.tabela tbody tr',
                {
                    offset: 50,
                    container: '.v-data-table__wrapper'
                }
            )
        },
    },
};

