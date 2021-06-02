import firebase, { auth, storageRef } from '~/plugins/firebase'

const actions = {
  // ユーザープロフィール画像の追加
  async uploadUserImageFile({ getters, commit }, userAvatarFile) {
    try {
      const userInfo = await firebase.auth().currentUser
      const imageRef = await storageRef.child(`images/${getters.uid}/${userAvatarFile.name}`)
      const snapShot = await imageRef.put(userAvatarFile)
      const photoURL = await snapShot.ref.getDownloadURL()

      await userInfo.updateProfile({
        photoURL
      })
      // ログインユーザーの情報を更新
      commit('modules/auth/updateUserAvatar', photoURL, { root: true })
      commit('modules/commonParts/openSnackbar', null, { root: true })
    } catch (e) {
      alert('画像の変更に失敗しました。もう一度やり直してください。')
      console.error(e)
    }
  },
  // ユーザー情報の更新
  async updateUsername({ commit }, { username }) {
    try {
      const userInfo = await auth.currentUser
      // テストユーザーの場合は処理から抜ける
      if (userInfo.displayName === 'テストユーザー') return alert('テストユーザーは変更できません')

      await userInfo.updateProfile({
        displayName: username
      })
      commit('modules/auth/updateUsername', username, { root: true })
      commit('modules/commonParts/openSnackbar', null, { root: true })
    } catch (e) {
      alert('ユーザー名の変更に失敗しました。もう一度やり直してください。')
      console.error(e)
    }
  },
  // メールアドレスの変更
  async updateEmail({ commit }, { email }) {
    try {
      const userInfo = await firebase.auth().currentUser
      // テストユーザーの場合は処理から抜ける
      if (userInfo.email === 'test@example.com') return alert('テストユーザーは変更できません')

      await userInfo.updateEmail(email)
      commit('modules/auth/updateUserEmail', email, { root: true })
      commit('modules/commonParts/openSnackbar', null, { root: true })
    } catch (e) {
      alert('新しいメールアドレスの登録に失敗しました。もう一度やり直してください。')
      console.error(e)
    }
  },
  // パスワードの変更
  async updatePassword({ dispatch }, { email, password, updatePassword }) {
    try {
      const user = await firebase.auth().currentUser
      // テストユーザーの場合は処理から抜ける
      if (user.displayName === 'テストユーザー') return alert('テストユーザーは変更できません')

      // 最初に再認証してから変更処理を行う
      const credential = await firebase.auth.EmailAuthProvider.credential(email, password)
      await user.reauthenticateWithCredential(credential)
      await user.updatePassword(updatePassword)
      alert('パスワードの変更が完了しました。ログイン画面に戻ります。')
      dispatch('modules/auth/logout', null, { root: true })
    } catch (e) {
      console.error(e)
    }
  },
  // パスワードの再登録
  async resetPassword({ commit }, { email }) {
    try {
      // 送信されるメールを日本語に変換
      auth.languageCode = 'ja'
      await auth.sendPasswordResetEmail(email)
      alert('送信が完了しました。記載されているURLより再登録をお願いします。')
    } catch {
      alert('送信に失敗しました。もう一度やり直してください。')
    }
  },
  // ユーザー情報削除
  async removeAccount({ commit }, { email, password }) {
    // テストユーザーの場合は処理から抜ける
    if (email === 'test@example.com') return alert('テストユーザーは削除できません')

    // 最初に再認証してから変更処理を行う
    try {
      const user = await firebase.auth().currentUser
      const credential = await firebase.auth.EmailAuthProvider.credential(email, password)
      await user.reauthenticateWithCredential(credential)
      await user.delete()
      alert('ユーザー情報を削除しました。ログイン画面に戻ります。')
      commit('modules/auth/deleteLoginUser', null, { root: true })
    } catch (e) {
      alert('ユーザー情報の削除に失敗しました。もう一度やり直しください。')
      console.error(e)
    }
  }
}

const getters = {
  // uidの取得
  userUid: (state, getters, rootState, rootGetters) => {
    return rootGetters['modules/firebase/auth/uid']
  }
}

export default {
  namespaced: true,
  getters,
  actions
}
