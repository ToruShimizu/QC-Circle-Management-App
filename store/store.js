import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from './modules/auth'
import * as userInfo from './modules/userInfo'
import * as activityPlans from './modules/activityPlans'
import * as circle from './modules/circle'
import * as commonParts from './modules/commonParts'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    userInfo,
    activityPlans,
    circle,
    commonParts
  }
})
