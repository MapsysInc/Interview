<!-- 
 * Title: pdfDisplay.vue
 * Description:
-->
<template lang="pug">
div.pdf-display
    h3.form-label PDF DISPLAY
    button(type="button" class="btn btn-success") Create PDF
    ul
        li(v-for="document in documents" :key="document.id")
            a(:href="document._id" target="_blank")
                div 
                  h3 {{ document.title }}
                    p {{ document.description }}
                button(type="button" class="btn btn-secondary") Update
                button(type="button" class="btn btn-danger") Delete
</template>
    
<script>
import {mapState} from 'vuex'
export default {
  name: "PdfDisplay",
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