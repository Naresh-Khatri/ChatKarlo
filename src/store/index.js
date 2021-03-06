import Vue from "vue";
import Vuex from "vuex";

// import example from './module-example'

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  });

  return Store;
}
export const store = new Vuex.Store({
  state: {
    username:'',
    users:[],
    usersCount:0,
    typingUsers: [],
    messagesData: [
      // {
      //   name: "me",
      //   text: "this was sent first",
      //   stamp: "7 minutes ago",
      //   sent: true,
      //   id: "",
      //   bgColor: "amber-7"
      // }
    ]
  },
  getters:{
    messagesData(){
      return messagesData
    }
  },
  
  mutations: {}
});
