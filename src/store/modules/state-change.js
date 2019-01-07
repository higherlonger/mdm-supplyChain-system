const state = {
  btnLoading: false
}

const actions = {
  setBtnLoading({
    commit
  }, params) {
    commit({
      type: 'btnLoading',
      data: params
    })
  }
}

const mutations = {
  btnLoading(state, {
    data
  }) {
    state.btnLoading = data;
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
