<template lang="pug">
div.center-form
  div.form-row
    div.form-group.col-md-6
      label(for='documentTitle') Title of document
      input.form-control(
        id="documentTitle",
        placeholder="Enter Title",
        v-model="form.documentTitle"
      )
      small(id="titleTag") A default roman numeral titled document will be generated otherwise
      
      label(for="documentDescription") Description of Document
      input.form-control(
        id='documentDescription',
        placeholder="Enter Description",
        v-model="form.documentDescription"
      )
      small.mb-3(id="titleTag") A default description will be generated otherwise
      
      select.form-select.form-control.mb-3(
        aria-label="Category",
        style="width:auto",
        v-model="form.category"
      )
        option(v-for="category in categories" :key="category") {{ category }}
  div
    button.btn.btn-success(@click="submitForm") Submit
        
</template>

<script>
import {mapState} from 'vuex'
export default {
    name: 'CreateForm',
  data() {
    return {
      form: {
        documentTitle: '',
        documentDescription: '',
        category: ''
      }
    }
  },
  computed: {
    ...mapState(['categories'])
  },
  methods: {
    async submitForm() {
      try {
        await this.$store.dispatch('createAndStoreDocument', this.form);
      } catch (e) {
        console.log('Error submitting form', e);
      }
    }
  }
}
</script>

<style>
.center-form {
  margin: auto;
  width: 100%;
  padding: 10px;
  
}
</style>