<template lang="pug">
div(v-if="showModal")
    div
        span(class="close" @click="closeModal")
            vue-pdf-embed(:source="pdfSrc" width="600" height="500")
</template>

<script>
import VuePdfEmbed from 'vue-pdf-embed'

export default {
    name: 'DocumentPopout',
    components:{ VuePdfEmbed },
    data(){
        return{
        
    }},
    computed: {
        showModal(){
            return this.$store.state.showModal
        },
        pdfSrc(){
            return this.$store.state.pdfSrc
        }
    },
    methods: {
        closeModal(){
            this.$store.commit('toggleModal', false)
        }
    }
}
</script>