<!-- 
 * Title: PdfListDisplay.vue
 * Description:
-->
<template lang="pug">
div
  div(v-if='documents && documents.length > 0')
    mDocumentPopout.modal-fade(role="dialog")
    h3.form-label PDF List
    ul.list-group.container
        li(v-for="document in documents" 
          :key="document._id"
          :class="{ 'list-group-item': true, 'active': isActive(document) }"
        )
          a(:href="document._id" target="#")
          div.text-center.row
              div.d-flex.align-items.justify-content-between.col
                    a(@click.prevent="openModal(document)")
                        button.btn.btn-primary.btn-lg.mb-auto {{ document.title }}
                        p.text-wrap.fs-4 {{ document.description }}
              div.col
                button.btn.btn-outline-danger.d-flex.flex-column(
                  type="button"
                  @click="confirmDelete(document._id, document.title)"
                ) Delete
</template>

<script>
import {mapState, mapActions} from 'vuex'
import mDocumentPopout from './mDocumentPopout.vue'
export default {
  name: "PdfListDisplay",
  props: {},
  components:{
    mDocumentPopout
  },
  computed:{
    ...mapState(['documents']),
  },
  data(){
    return{
        selectedId: null
    }
  },
  methods:{
    ...mapActions(['deleteDocument','toggleModal','setPdfSrc', 'fetchDocumentById']),
    isActive(document){
        return document && document?._id === this.selectedId
    },
    async confirmDelete(documentId, documentTitle){
      const willDelete = window.confirm(`Confirm you would like to delete ${documentTitle}` )
      
      if(willDelete){
        await this.deleteDocument(documentId)
      }
    },
    
    async openModal(document){
      await this.fetchDocumentById(document._id)
      console.log(`the current pdfSrc state: ${this.$store.state.pdfSrc}`)
      
      this.toggleModal(true)
      console.log(`the current toggleModal state: ${this.$store.state.showModal}`)
    }
  },
  watch:{
    '$store.state.pdfSrc':{ // watcher for pdfSrc changes
      handler: function(newVal, oldVal){
        console.log(`pdfSrc has changed to: ${newVal}`)
      },
      deep: true
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
</style>