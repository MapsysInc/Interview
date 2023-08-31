<template lang="pug">
div(v-if="showModal" class="modal")
    div(class="modal-content")
        span(class="close" @click="closeModal") &times;
        embed(:src="pdfSrc" type="application/pdf" width="600" height="500")

</template>

<script>
export default {
    name: 'DocumentDisplay',
    
}
</script>

<style>

</style>