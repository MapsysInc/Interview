<!-- 
 * Title: Landing.vue
 * Description:
-->
<template lang="pug">
div
    h2.navbar-header Ready To Rock!
        
</template>
    
    <script>
    import {mapState} from 'vuex'
    
    export default {
    name: "Landing",
    props: {},
    computed:{
        ...mapState(['reviews']),
        showItems(){
        return this.reviews && this.reviews.length > 0
        }
    }
    }
    </script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #000000;
}
</style>