<template lang="pug">
div(v-if="showModal")
    div
        button.btn.btn-primary(
            type='button',
            @click='openModal'
        ) Launch demo modal

    div.modal.fade.show.d-block(
        v-if="showModal", 
        id='docDisplay', 
        tabindex='-1', 
        role='dialog', 
        aria-labelledby='docDisplayLabel', 
        aria-hidden='false'
    )
      div.modal-dialog.modal-lg(role='document')
        div.modal-content
          div.modal-content
            h5.modal-title.m-3(id='docDisplayLabel') View & Update
                button(
                    type='button', 
                    class='close', 
                    @click='closeModal', 
                    aria-label='Close'
                )
                    span(
                        aria-hidden='true'
                    ) &times;
          div.modal-body
            vue-pdf-embed(
                :source="pdfSrc" 
                width="600" 
                height="500"
            )
          div.modal-footer
            UpdateForm
            button.btn.btn-secondary(
                type='button',
                @click='closeModal'
            ) Close
            button.btn.btn-primary(
                type='button'
            ) Save changes

</template>

<script>
import VuePdfEmbed from 'vue-pdf-embed'
import UpdateForm from './UpdateForm.vue'
export default {
    name: 'DocumentPopout',
    components:{ 
        VuePdfEmbed,
        UpdateForm
     },
    data(){
        return{
        
    }},
    computed: {
        showModal(){
            return this.$store.state.showModal
        },
        pdfSrc(){
            return this.$store.state.pdfSrc
        }
    },
    methods: {
        openModal(){
            this.$store.commit('toggleModal', true)
        },
        closeModal(){
            this.$store.commit('toggleModal', false)
        }
    }
}
</script>

<style>
.modal.fade.show {
  display: block;
  background: rgba(0, 0, 0, 0.5);
}
</style>
