<template lang="pug">
div
    //- document display
    DocumentDisplay
    //- update form
    //- submit
    button.btn.btn-success.d-flex.flex-column.mb-2(type="button" @click="") Update
</template>

<script>
import DocumentDisplay from '../components/mDocumentDisplay.vue'
export default {
    name:'vDocumentDisplay',
    
    components:{
        DocumentDisplay
    }
}
</script>

<style>

</style>