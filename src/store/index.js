import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/application'
import dict from './modules/dictionary'
import stateChange from './modules/state-change'

Vue.use(Vuex)

const store=new Vuex.Store({
    modules:{
        app,
        dict,
        stateChange
    }
})

export default store