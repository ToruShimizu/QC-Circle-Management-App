import { auth } from '~/plugins/firebase'

export default function({ store, redirect }) {
  if (store.state.modules.user.auth.loginUser !== null) return

  auth.onAuthStateChanged(user => {
    if (user) {
      const userInfo = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid
      }
      // ログインユーザーの情報をstateに入れる
      store.dispatch('modules/user/auth/setLoginUser', userInfo)
    } else {
      return redirect('/signIn')
    }
  })
}
