import {
  getNavList
} from '../../api'
import { setToken, removeToken } from '../../assets/js/auth'

const state = {
  navList: [], //导航列表
  loginInfo: {}
}

const actions = {
  async createNavList({
    commit,
    state
  }, params) {
    if (state.navList.length) return
    const response = await getNavList();
    commit({
      type: "navInfo",
      data: response.data || params
    })
  },
  createLoginInfo({
    commit
  }, params) {
    setToken(params.name)
    commit({
      type: 'login',
      data: params
    })
  },
  createLogout ({ commit }){
    removeToken()
    commit({
        type: 'outLogin',
        data: null
    })
  }
}

const mutations = {
  navInfo(state, {
    data
  }) {
    state.navList = data
  },
  login(state, {
    data
  }) {
    state.loginInfo = data
  },
  outLogin(state, {
    data
  }) {
    state.loginInfo = data
  }
}

const getters = {

}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
