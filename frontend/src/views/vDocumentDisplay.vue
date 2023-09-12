<template lang="pug">
div
    //- document display modal
    mDocumentDisplay
    //- update form
    //- submit update
    button.btn.btn-success.d-flex.flex-column.mb-2(type="button" @click="") Update
</template>

<script>
import mDocumentDisplay from '../components/mDocumentPopout.vue'
export default {
    name:'vDocumentDisplay',
    components:{
        mDocumentDisplay
    },
    methods:{
        async submitForm() {
            if (!this.document.category) {
                this.isCategoryInvalid = true
                alert('Please select a category')
                return
            }
            this.isCategoryInvalid = false
            
            try {
                console.log("Form Data:", this.document)
                await this.$store.dispatch('createAndStoreDocument', this.document)
            } catch (e) {
                console.log(`Error submitting form ${e}`)
            }
        },
    },
    data:{
        pdfHardCodeSource: './devDir/docManager/Docs/SD/SD-I.pdf'
    }
}
</script>
