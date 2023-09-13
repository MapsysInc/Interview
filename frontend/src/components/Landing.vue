<!-- 
 * Title: Landing.vue
 * Description:
-->
<template lang="pug">
div
    h1 Welcome
    br
    span This is where user auth will occur
    br
    span nav bar will only populate when logged in 
    br
</template>
    
<script>

export default {
    name: "Landing",
    props: {},
    computed:{
      
    },
    components:{
        
    },
    methods:{
        
    },
    data(){ //store & manage reactive data
        return{
            documents: []
        }
    },
    async created(){
        
    }
}
</script>

<style scoped lang="scss">

</style>