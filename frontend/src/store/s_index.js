import { createStore } from 'vuex'
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
    
    
    
    async deleteDocument({commit}, documentId){
      try{
        const response = await axios.delete(`/docs/delete/${documentId}`)
        commit('deleteDocument', documentId)
      }catch(e){
        console.log(`error in delete documents ${e}`)
        commit('setDocuments)',[])
      }
    },
    
    
    
    // actions cont
  },
  modules: {
  }
})