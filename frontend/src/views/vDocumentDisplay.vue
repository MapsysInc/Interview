<template lang="pug">
div
    //- document display modal
    mDocumentDisplay
    //- update form
    //- submit
    button.btn.btn-success.d-flex.flex-column.mb-2(type="button" @click="") Update
</template>

<script>
import mDocumentDisplay from '../components/mDocumentDisplay.vue'
export default {
    name:'vDocumentDisplay',
    components:{
        mDocumentDisplay
    },
}
</script>

<style>

</style>