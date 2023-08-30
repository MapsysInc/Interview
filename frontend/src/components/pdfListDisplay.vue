<!-- 
 * Title: PdfListDisplay.vue
 * Description:
-->
<template lang="pug">
div
    h3.form-label PDF LIST
    ul.list-group.container
        li(v-for="document in documents" 
          :key="document.id" 
          :class="{ 'list-group-item': true, 'active': isActive(document) }"
        )
          a(:href="document._id" target="#")
          div.text-center.row
              div.d-flex.align-items.justify-content-between.col
                    a(:href="document._id" target="#")
                        button.btn.btn-primary.btn-lg.mb-auto {{ document.title }}
                        //- p.fs-2 Description
                        p.text-wrap.fs-4 {{ document.description }}
              div.col
                  
                  button.btn.btn-outline-danger.d-flex.flex-column(type="button" @click="confirmDelete(document._id, document.title)") Delete
                  //- input.form-check-input#checkBoxDefault(type="checkbox")
                  //- label.form-check-label(for="checkBoxDefault") Select
</template>
    
<script>
import {mapState, mapActions} from 'vuex'
export default {
  name: "PdfListDisplay",
  props: {},
  computed:{
    ...mapState(['documents']),
  },
  data(){
    return{
        selectedId: null
    }
  },
  methods:{
    ...mapActions(['deleteDocument']),
    isActive(document){
        return document && document.id === this.selectedId
    },
    async confirmDelete(documentId, documentTitle){
      console.log('documentId:', documentId);
  console.log('documentTitle:', documentTitle);

      const willDelete = window.confirm(`Confirm you would like to delete ${documentTitle}` )
      if(willDelete){
        await this.deleteDocument(documentId)
      }
    }
    
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
// .pdfTitleButton{
//   @extend .btn;
//   @extend .btn-primary;
//   @extend .btn-lg;
// }
</style>