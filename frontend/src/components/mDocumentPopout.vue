<template lang="pug">
vuePdf(src='./devDir/docManager/Docs/SD/SD-I.pdf')
//- div(v-if="showModal")
    //- div
    //-     span(class="close" @click="closeModal")
    //-         PdfViewer(:src="pdfSrc" type="application/pdf" width="600" height="500")
</template>

<script>
import {vuePdf} from 'vue-pdf'

export default {
    name: 'DocumentPopout',
    components:{ vuePdf },
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
