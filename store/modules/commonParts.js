const state = () => ({
  snackbar: false
})
const mutations = {
  openSnackbar(state) {
    state.snackbar = true
  },
  closeSnackbar(state) {
    state.snackbar = false
  }
}

export default {
  namespaced: true,
  state,

  mutations
}
