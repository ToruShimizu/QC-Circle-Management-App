import firebase, { auth } from '~/plugins/firebase'

// initial state
const state = () => ({
  loginUser: null
})

const mutations = {
  // ログインユーザー情報の取得
  setLoginUser(state, userInfo) {
    state.loginUser = userInfo
    console.debug('setLoginUser', state.loginUser)
  },
  updateUsername(state, username) {
    state.loginUser.displayName = username
  },
  updateUserEmail(state, userEmail) {
    state.loginUser.email = userEmail
  },
  updateUserAvatar(state, photoURL) {
    state.loginUser.photoURL = photoURL
  },
  // ログインユーザー情報の削除
  removeAccount(state) {
    state.loginUser = null
  }
}

const actions = {
  // ログインユーザー情報の取得
  setLoginUser({ commit, dispatch }, userInfo) {
    commit('setLoginUser', userInfo)
    dispatch('modules/activityPlans/fetchActivityPlans', null, { root: true })
    dispatch('modules/circle/fetchCircle', null, { root: true })
  },
  // ログインユーザー情報の削除
  removeAccount({ commit }) {
    commit('removeAccount')
  },
  // Googleログイン
  async googleLogin() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider()
      await auth.signInWithPopup(provider).then(result => {
        alert('ようこそ ' + result.user.displayName + 'さん!')
        this.$router.push({ path: '/activityPlans' })
      })
    } catch (err) {
      alert('ログインに失敗しました。もう一度やり直してください。')
    }
  },
  // メールアドレスとパスワードでログイン
  async login({ commit }, { email, password }) {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
      const userInfo = await firebase.auth().currentUser
      alert('ようこそ' + userInfo.displayName + 'さん!')
      // サインイン成功後にトップページに遷移する
      this.$router.push({ path: '/activityPlans' })
    } catch {
      alert('ログインに失敗しました。もう一度やり直してください。')
    }
  },
  // ログアウト
  async logout({ commit }) {
    await auth.signOut()
    alert('ログアウトしました。')
    commit('removeAccount')
  },
  // ユーザー作成してからそのままログインする
  async createUser({ dispatch, commit }, { email, password, username }) {
    try {
      const newUser = await auth.createUserWithEmailAndPassword(email, password)
      await newUser.user.updateProfile({
        displayName: username
      })
      alert('ユーザーの作成に成功しました。このままログインします。')
      await dispatch('login', { email, password })
      commit('updateUsername', username)
    } catch (e) {
      alert('ユーザーの作成に失敗しました。もう一度やり直してください。')
      console.error(e)
    }
  }
}

const getters = {
  // ユーザー名の取得
  gettersUsername: state => (state.loginUser ? state.loginUser.displayName : ''),
  // ユーザーのメールアドレスの取得
  gettersUserEmail: state => (state.loginUser ? state.loginUser.email : ''),
  // ユーザー画像の取得
  photoURL: state => (state.loginUser ? state.loginUser.photoURL : ''),
  // uidの取得
  uid: state => (state.loginUser ? state.loginUser.uid : null)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
