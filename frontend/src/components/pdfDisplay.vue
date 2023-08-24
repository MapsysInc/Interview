<!-- 
 * Title: pdfDisplay.vue
 * Description:
-->
<template lang="pug">
div.pdf-display
    h3 PDF DISPLAY 
    ul
        li(v-for="document in documents" :key="document._id")
            a(:href="document.fileUrl" target="_blank")
                p {{ document.title }}
</template>
    
<script>
import {mapState} from 'vuex'
export default {
  name: "pdfDisplay",
  props: {},
  computed:{
    ...mapState(['documents'])
  }
}
</script>

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
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
}
</style>