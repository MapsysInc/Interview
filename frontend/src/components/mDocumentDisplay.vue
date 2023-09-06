<template lang="pug">
div(v-if="showModal")
    div()
        span(class="close" @click="closeModal")
        embed(:src="pdfSrc" type="application/pdf" width="600" height="500")

</template>

<script>
export default {
    name: 'DocumentDisplay',
}
</script>

<style>

</style>