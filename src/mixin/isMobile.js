export default {
    computed: {
        $isMobile() {
            if(this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm')
                return true
        },
    },
};