<!-- 
 * Title: Landing.vue
 * Description:
-->
<template lang="pug">
div
    Landing
    PdfListDisplay(:documents="documents")
</template>
    
<script>
import Landing from "@/components/Landing.vue"
import PdfListDisplay from "@/components/pdfListDisplay.vue"

import { mapState, mapActions } from "vuex"

export default {
    name: "Layout",
    props: {},
    computed:{
        ...mapState(['documents'])
    },
    components:{
        Landing,
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