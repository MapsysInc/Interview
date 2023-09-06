import { createStore } from 'vuex'
const { log } = require('../../../utils/generalUtils')
const axios = require('axios')
axios.defaults.baseURL = 'http://localhost:3000/'

export default createStore({
  state: {
    // state props
    documents: [],
    showModal: false,
    pdfSrc: '',
    categories: ['signatures', 'supporting documents'] // TODO dynamically allocate
  },
  getters: {
    // getters
  },
  mutations: {
    addDocument(state,document){
      state.documents.push(document)
    },
    
    setDocuments(state, documents){
      state.documents = documents
    },
    
    deleteDocument(state, documentId) {
      state.documents = state.documents.filter(document => document._id !== documentId)
    },
    
    toggleModal(state, payload){
      state.showModal = payload
    },
    
    setPdfSrc(state, payload){
      state.pdfSrc = payload
    }
  },
  actions: {
    
    async fetchAllDocuments({commit}){
      try{
        const response = await axios.get('/docs/all')
        commit('setDocuments', response.data)
      }catch(e){
        console.log('ERROR || s_Index fetchAllDcouments(): ', e)
        commit('setDocuments',[]) // clear array
      }
    },
    
    async createAndStoreDocument({ commit }, payload) {
      try {
        const response = await axios.post('/docs/create', payload)
        if (response.data.message.includes('saved successfully')) {
          commit('addDocument', response.data.result)
          this.dispatch('fetchAllDocuments') // hard reload
        }
      } catch (e) {
        console.log('Error in createAndStoreDocument', e)
      }
    },    
    
    async deleteDocument({commit}, documentId){
      try {
        const response = await axios.delete(`/docs/delete/${documentId}`);
        if (response.data.message === 'Document deleted') {
          commit('deleteDocument', documentId); // Update Vuex state
          this.dispatch('fetchAllDocuments') // hard reload
        }
      } catch(e){
        console.log(`error in delete documents ${e}`)
        commit('deleteDocument', documentId)
      }
    },
    
    toggleModal({commit}, payload){
      commit('toggleModal', payload)
    },
    
    setPdfSrc({commit}, payload){
      commit('setPdfSrc', payload)
    }
  },
  modules: {
  }
})