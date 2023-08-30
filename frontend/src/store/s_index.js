import { createStore } from 'vuex'
const { log } = require('../../../utils/generalUtils')
const axios = require('axios')
axios.defaults.baseURL = 'http://localhost:3000/'

export default createStore({
  state: {
    // state props
    documents: []
  },
  getters: {
    // getters
  },
  mutations: {
    // mutations
    setDocuments(state, documents){
      state.documents = documents
    },
    
    deleteDocument(state, documentId) {
      state.documents = state.documents.filter(document => document.id !== documentId)
    },
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
    
    
    
    async deleteDocument({commit}, documentId){
      try {
        const response = await axios.delete(`/docs/delete/${documentId}`);
        if (response.data.message === 'Document deleted') {
          commit('deleteDocument', documentId); // Update Vuex state
        }
      } catch(e){
        console.log(`error in delete documents ${e}`)
        commit('deleteDocument', documentId)
      }
    },
    
    // actions cont
  },
  modules: {
  }
})