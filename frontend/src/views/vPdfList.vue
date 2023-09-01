<!-- 
* Title:
* Description:
-->
<template lang="pug">
div
    PdfListDisplay(:documents="documents")
</template>
    
<script>
import PdfListDisplay from "@/components/pdfListDisplay.vue"

import { mapState, mapActions } from "vuex"

export default {
    name: "vPdfList",
    props: {},
    computed:{
        ...mapState(['documents'])
    },
    components:{
        PdfListDisplay,
    },
    methods:{
        ...mapActions(['fetchAllDocuments'])
    },
    data(){ //store & manage reactive data
        return{
            documents: []
        }
    }, 
    async created(){
        await this.fetchAllDocuments()
    }
}
</script>

<style scoped lang="scss">

</style>