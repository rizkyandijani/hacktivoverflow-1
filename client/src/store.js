import Vue from 'vue'
import Vuex from 'vuex'
import ax from './api'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin : false,
    userTag : [],
    allQuestion : [],
    questionEditData : '',
    detailQuestion : '',
    answerEditData : '',
    jobList : []
  },
  mutations: {
    setJobList(state,data){
      
      state.jobList = data
    },

    setIsLogin(state,data){
      state.isLogin = data
    },
    setUserTag(state,data){
      state.userTag = data
    },
    setAllQuestion(state,data){
      
      state.allQuestion = data
    },
    setQuestionEdit(state,data){
      state.questionEditData = data
    },
    setDetailQuestion(state,data){
      state.detailQuestion = data
    },
    setEditAnswerData(state,data){
      state.answerEditData = data
    }
  },
  actions: {
    filterByTag(context,data){
      let query = data
      ax.get('/questions')
      .then(({data})=>{
        let arr = []
        data.forEach(el =>{
          if(el.tags.indexOf(query) !== -1){
            arr.push(el)
          }
        })
        context.commit('setAllQuestion',arr)

      })
    },

    register(context,data){
      console.log('masuk store',data);
      ax.post('/register',data)
      .then(({data})=>{
        console.log(data);
      })
      .catch(err =>{
        console.log(err);
      })
    },

    login(context,data){
      ax.post('/login',data)
      .then(({data})=>{
        console.log(data);
        localStorage.setItem('token', data.token)
        localStorage.setItem('userId', data.id)
        localStorage.setItem('username', data.username)
        localStorage.setItem('email', data.email)
        localStorage.setItem('page', 'home')
        localStorage.setItem('tags', [data.tags])
        ax.defaults.headers.common['token'] = data.token;   

        context.commit('setIsLogin',true)
      })
      .catch(err =>{
        console.log(err);
        
      })
    },

    updateWatchedTag(context,data){
      
      // console.log('--------------',passing);
      
      ax.patch(`/users/${localStorage.userId}/watchTag`,{tags : data})
      .then(({data})=>{
        console.log(data);
       localStorage.tags = data.watchedTags
       context.commit('setUserTag',data.watchedTags)
      })
      .catch(err =>{
        console.log(err);
        
      })
    },

    signout(context,data){
      localStorage.clear()
      context.commit('setIsLogin', false)
    },

    createQuestion(context,data){
      console.log('data dicreate store',data);
      ax.post('/questions/',data)
      .then(({data})=>{
        console.log(data);
        this.dispatch('fetchAllQuestion')
      })
      .catch(err =>[
        console.log(err)
      ])
    },

    fetchAllQuestion(context,data){
      console.log('go fetch for all');

      ax.get('/questions')
      .then(({data})=>{
        console.log('pokoke iso all',data);
        
        context.commit('setAllQuestion',data)
      })
      .catch(err =>{
        console.log(err);
      })
    },

    fetchUserQuestion(context,data){
      console.log('go fetch for user');
      
      ax.get(`/questions/profile/${localStorage.userId}`)
      .then(({data})=>{
        console.log('pokoke iso user',data);

        context.commit('setAllQuestion', data)
      })
      .catch(err =>{
        console.log(err);
      })
    },

    upvote(context,data){
      ax.patch(`/questions/${data}/upvote`)
      .then(({data})=>{
        if(localStorage.page === 'profile'){
          this.dispatch('fetchUserQuestion')
        }else if(localStorage.page === 'home'){
          this.dispatch('fetchAllQuestion')
        }else if(localStorage.page === 'detail'){
          // console.log('===',data);

          this.dispatch('getQuestionDetail',data._id)
        }
    })
      .catch(err =>{
        console.log(err);
        
      })
    },

    upvoteAnswer(context,data){
      // console.log('data upvote answer',data);

      ax.patch(`/answers/${data._id}/upvote`)
      .then(({data})=>{
        // console.log('hasil upvoteeee',data);
          this.dispatch('getQuestionDetail',data.questionId)
      })
      .catch(err =>{
        console.log(err);
      })
    },

    downvote(context,data){
      ax.patch(`/questions/${data}/downvote`)
      .then(({data})=>{
        if(localStorage.page === 'profile'){
          this.dispatch('fetchUserQuestion')
        }else if(localStorage.page === 'home'){
          this.dispatch('fetchAllQuestion')
        }else if(localStorage.page === 'detail'){
          this.dispatch('getQuestionDetail',data._id)
        }
      })
      .catch(err =>{
        console.log(err);
        
      })
    },

    downvoteAnswer(context,data){      
      ax.patch(`/answers/${data._id}/downvote`)
      .then(({data})=>{
          this.dispatch('getQuestionDetail',data.questionId)        
      })
      .catch(err =>{
        console.log(err);
        
      })
    },

    getQuestionDetail(context,data){
      ax.get(`/questions/${data}`)
      .then(({data})=>{
        // console.log(data);
        context.commit('setQuestionEdit', data)
        context.commit('setDetailQuestion',data)
      })
      .catch(err =>{
        console.log(err);
      })
    },

    editQuestion(context,data){
      console.log('mau edit ==========================');
      
      ax.patch(`/questions/${data.id}`,data)
      .then(({data})=>{
        console.log('updateee',data);
        
        if(localStorage.page === 'home'){
          this.dispatch('fetchAllQuestion')
        }else if(localStorage.page === 'profile'){
          this.dispatch('fetchUserQuestion')

        }
      })
      .catch(err =>{
        console.log(err);
      })
    },

    deleteQuestion(context,data){
      ax.delete(`/questions/${data}`)
      .then(({data})=>{
        if(localStorage.page === 'home'){
          this.dispatch('fetchAllQuestion')
        }else if(localStorage.page === 'profile'){
          this.dispatch('fetchUserQuestion')

        }
      })
      .catch(err =>{
        console.log(err);
        
      })
    },

    createAnswer(context,data){
      ax.post(`/answers/${data.id}`, data)
      .then(({data})=>{
        console.log('===================-------',data);
        this.dispatch('getQuestionDetail',data.questionId)
      })
      .catch(err =>{
        console.log(err);
        
      })
    },

    getAnswerDetail(context,data){
      ax.get(`/answers/${data}`)
      .then(({data})=>{
        console.log('ini data nyaaa answer',data);
        context.commit('setEditAnswerData',data)
      })
      .catch(err =>{
        console.log(err);
        
      })
    },

    editAnswer(context,data){
      console.log('data di storeee',data);
      let passing = {
        title : data.title,
        description : data.description
      }
      ax.patch(`/answers/${data.id}`, passing)
      .then(({data})=>{
        console.log('data',data)
        this.dispatch('getQuestionDetail',data.questionId)
      })
      .catch(err =>[
        console.log(err)
        
      ])
    },

    deleteAnswer(context,data){
      ax.delete(`/answers/${data.questionId}/${data._id}`)
      .then(({data})=>{
        console.log('hasil data abis delete',data);
        
        if(localStorage.page === 'home'){
          this.dispatch('fetchAllQuestion')
        }else if(localStorage.page === 'profile'){
          this.dispatch('fetchUserQuestion')
        }else if(localStorage.page === 'detail'){
          this.dispatch('getQuestionDetail',data.questionId)
        }
      })
      .catch(err =>{
        console.log(err);
        
      })
    },
  }
})
