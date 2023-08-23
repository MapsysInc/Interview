<!-- 
 * Title: Landing.vue
 * Description:
-->
<template lang="pug">
div
    h2.navbar-header Ready To Rock!
    PdfDisplay(:documents="documents")
</template>
    
<script>
import PdfDisplay from "@/components/pdfDisplay.vue"
import { mapState, mapActions } from "vuex";

export default {
    name: "Landing",
    props: {},
    computed:{
        ...mapState(['documents'])
    },
    components:{
        PdfDisplay,
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