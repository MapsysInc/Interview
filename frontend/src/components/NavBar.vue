<template lang="pug">
nav.navbar.navbar-expand-lg.navbar-light.bg-light
    a.navbar-brand(href="#") Document Manager
    button.navbar-toggler(
        type="button" 
        data-toggle="collapse" 
        data-target="#navbarNavAltMarkup" 
        aria-controls="navbarNavAltMarkup" 
        aria-expanded="false" 
        aria-label="Toggle navigation")
    span.navbar-toggler-icon
    
    div.collapse.navbar-collapse#navbarNavAltMarkup
        div.navbar-nav
            a.nav-item.nav-link.active(href="/newDocument") Create PDF
                span.sr-only (current)
            a.nav-item.nav-link(href="/pdfList") All Current PDFs
            a.nav-item.nav-link(href="/uploadDocument") Upload a Document
            //- a.nav-item.nav-link.disabled(href="") Disabled
</template>

<script>
export default {
    name: "NavBar",
    props: {},
    computed:{},
    components:{},
    methods:{},
}
</script>

<style>

</style>