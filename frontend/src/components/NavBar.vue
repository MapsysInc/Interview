<template lang="pug">
nav.navbar.navbar-expand-lg.navbar-light.bg-light
    router-link.navbar-brand.nav-item.nav-link(:to="{ path: '/#' }" active-class="active")
        img(src="../assets/images/documentStacked.svg" 
            width="30" 
            height="30" 
            class="d-inline-block align-top" 
            alt="") 
        a Document Manager
    div.navbar-collapse#navbarNavAltMarkup
        div.navbar-nav
            router-link.nav-item.nav-link(:to="{ path: '/newDocument' }" active-class="active") Create A PDF
            router-link.nav-item.nav-link(:to="{ path: '/pdfList' }" exact-active-class="active") All Current PDFs
            
            //- router-link.nav-item.nav-link(:to="{ path: '/#' }" active-class="active") Upload a Document
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