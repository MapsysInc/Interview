<template lang="pug">
div(v-if="showModal")
    div
        span(class="close" @click="closeModal")
        pdf-viewer(:src="pdfSrc" type="application/pdf" width="600" height="500")
</template>

<script>
import PdfViewer from 'vue-pdf-embed'
export default {
    name: 'DocumentPopout',
    components:{ PdfViewer },
    computed: {
        showModal() {
            return this.$store.state.showModal
        },
        pdfSrc() {
            return this.$store.state.pdfSrc
        }
    },
    methods: {
        closeModal() {
            this.$store.commit('toggleModal', false)
        }
    }
}
</script>
