<!-- 
 * Title: Landing.vue
 * Description:
-->
<template lang="pug">
div
    h1.text-bg-info Landing Page!
</template>
    
<script>

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