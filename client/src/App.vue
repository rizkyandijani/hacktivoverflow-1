<template>
  <v-app>


      <router-view></router-view>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld'
import ax from './api'
import _ from 'underscore'
import { CronJob } from 'cron'
export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data () {
    return {
      
    }
  },
  watch : {
    '$route'(){
      console.log(this.$route)
          if(this.$route.name === 'home'){
            this.$store.dispatch('fetchAllQuestion')
          }else if(this.$route.name === 'profile'){
            console.log('triggerrrrrrr');
            
            this.$store.dispatch('fetchUserQuestion')
          }
    }
  },
  created(){
    if(localStorage.token){
      ax.defaults.headers.common['token'] = localStorage.token;     
      this.$store.commit('setIsLogin',true)
      let arrTag = localStorage.tags.split(',')
      this.$store.commit('setUserTag',arrTag)
      if(localStorage.page === 'home'){
        this.$router.push('/')
      }else if(localStorage.page === 'profile'){
        this.$router.push('/myProfile')
      }else if(localStorage.page === 'detail'){
        console.log('check route',this.$route);
        this.$store.dispatch('getQuestionDetail', this.$route.params.questionId)
      }
      // this.$store.dispatch('fetchAllQuestion')
    }else{
      this.$router.push('/')
      this.$store.dispatch('fetchAllQuestion')

    }

    new CronJob('*/1 * * * *', () =>{
      ax.get('/api')
      .then(({data})=>{
        console.log('CronJob running');
        data = _.shuffle(data).slice(0, 6)
        this.$store.commit('setJobList',data)
      })
      .catch(err =>{
        console.log(err);
      })
    }, null, true, 'America/Los_Angeles')
  }
}
</script>
