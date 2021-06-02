import { db, storageRef } from '~/plugins/firebase'

const state = () => ({
  circle: {
    name: '',
    id: '',
    photoURL: ''
  },
  circleMember: []
})
const mutations = {
  // 初期化
  initCircle(state) {
    state.circle = {}
  },
  // サークル作成
  createCircle(state, createdCircle) {
    console.debug('data', createdCircle)
    state.circle = createdCircle
  },
  // サークル更新
  updateCircle(state, updatedCircle) {
    console.debug('data:', updatedCircle)
    state.circle = updatedCircle
  },
  // サークル画像削除
  removeImage(state) {
    state.circle.photoURL = ''
    state.circle.fileName = ''
  },
  // メンバー追加
  addMember(state, addedMember) {
    console.debug('data:', addedMember)
    state.circleMember.unshift(addedMember)
  },
  // メンバー更新
  updateMember(state, updatedMember) {
    console.debug('data:', updatedMember)

    const index = state.circleMember.findIndex(member => member.id === updatedMember.id)
    state.circleMember.splice(index, 1, updatedMember)
  },
  // メンバー初期化
  initMember(state) {
    state.circleMember = []
  },
  // サークル削除
  removeCircle(state) {
    state.circle = {}
  },
  // メンバー削除
  removeMember(state, id) {
    console.debug('data:', id)

    const index = state.circleMember.findIndex(member => member.id === id)
    state.circleMember.splice(index, 1)
  }
}
const actions = {
  // サークル取得
  async fetchCircle({ getters, commit, dispatch }) {
    commit('initCircle')

    try {
      const snapShot = await db.collection(`users/${getters.userUid}/circle`).get()
      await snapShot.docs.map(doc => {
        commit('createCircle', doc.data())
      })
      // メンバー取得
      dispatch('fetchMember')
    } catch (e) {
      console.error(e)
    }
  },
  // メンバー取得
  async fetchMember({ state, getters, commit }) {
    try {
      if (state.circle.id) {
        const snapShot = await db
          .collection(`users/${getters.userUid}/circle`)
          .doc(state.circle.id)
          .get()

        const subCollection = await snapShot.ref.collection('circleMember').get()

        commit('initMember')

        subCollection.docs.map(doc => {
          commit('addMember', doc.data())
        })
      }
    } catch (e) {
      console.error(e)
    }
  },
  // サークル作成
  async createCircle({ getters, commit }, { circle, file }) {
    console.debug('input:', circle)
    try {
      const id = await db.collection(`users/${getters.userUid}/circle`).doc().id
      // 画像がある場合
      if (file) {
        const imageRef = await storageRef.child(`circleImages/${id}/${file.name}`)
        const snapShot = await imageRef.put(file)
        circle.photoURL = await snapShot.ref.getDownloadURL()
      }

      const createCircleInput = {
        id,
        name: circle.name,
        fileName: file ? file.name : circle.fileName,
        photoURL: circle.photoURL
      }

      await db
        .collection(`users/${getters.userUid}/circle`)
        .doc(id)
        .set(createCircleInput)

      commit('createCircle', createCircleInput)
      // スナックバー
      commit('modules/commonParts/openSnackbar', null, { root: true })
    } catch (e) {
      alert('サークル作成に失敗しました。もう一度やり直してください')
      console.error(e)
    }
  },

  // サークル更新
  async updateCircle({ getters, commit, dispatch }, { circle, file }) {
    console.debug('circle:', circle, 'file: ', file)
    // 前の画像ファイルがあって、画像の更新、または削除する時は前の画像を削除
    if (circle.fileName && !circle.photoURL) await dispatch('removeImageFile', circle)
    // 画像がある場合
    try {
      if (file) {
        const imageRef = await storageRef.child(`circleImages/${circle.id}/${file.name}`)
        const snapShot = await imageRef.put(file)
        circle.photoURL = await snapShot.ref.getDownloadURL()
      }

      const updateCircleInput = {
        id: circle.id,
        name: circle.name,
        fileName: circle.photoURL ? file.name : '',
        photoURL: circle.photoURL
      }

      await db
        .collection(`users/${getters.userUid}/circle`)
        .doc(circle.id)
        .update(updateCircleInput)
      commit('updateCircle', updateCircleInput)
      // スナックバー
      commit('modules/commonParts/openSnackbar', null, { root: true })
    } catch (e) {
      alert('サークルの更新に失敗しました。もう一度やり直してください')
      console.error(e)
    }
  },
  // 画像ファイル削除
  async removeImageFile({ commit, getters }, circle) {
    console.debug('input: ', circle)
    try {
      const imageRef = await storageRef.child(`circleImages/${circle.id}/${circle.fileName}`)
      await imageRef.delete()
      await db
        .collection(`users/${getters.userUid}/circle`)
        .doc(circle.id)
        .update({ photoURL: null, fileName: null })
      commit('removeImage')
    } catch (e) {
      console.error(e)
    }
  },

  // サークル削除
  async removeCircle({ commit, getters, dispatch }) {
    try {
      await db
        .collection(`users/${getters.userUid}/circle`)
        .doc(getters.circleId)
        .delete()
      commit('removeCircle', getters.circleId)
      await dispatch('modules/activityPlans/allRemoveActivityPlan', null, {
        root: true
      })
      this.$router.push({ path: 'activityPlans' })
    } catch (e) {
      alert('サークルの削除に失敗しました。もう一度やり直してください')
      console.error(e)
    }
  },
  // メンバー追加
  async addMember({ getters, commit }, circeMember) {
    console.debug('input:', circeMember)

    const id = await db
      .collection(`users/${getters.userUid}/circle`)
      .doc(getters.circleId)
      .collection('circleMember')
      .doc().id

    const addMemberInput = {
      id,
      name: circeMember.name,
      role: circeMember.role,
      improvementRole: circeMember.improvementRole
    }

    try {
      await db
        .collection(`users/${getters.userUid}/circle`)
        .doc(getters.circleId)
        .collection('circleMember')
        .doc(id)
        .set(addMemberInput)

      commit('addMember', addMemberInput)
      commit('modules/commonParts/openSnackbar', null, { root: true })
    } catch (e) {
      alert('メンバー追加に失敗しました。もう一度やり直してください。')
      console.error(e)
    }
  },
  // メンバー更新
  async updateMember({ getters, commit }, editMember) {
    console.debug('input:', editMember)

    try {
      const snapShot = await db.collection(`users/${getters.userUid}/circle`).get()

      snapShot.docs.map(async doc => {
        await doc.ref
          .collection('circleMember')
          .doc(editMember.id)
          .update(editMember)
      })
      await commit('updateMember', editMember)
      commit('modules/commonParts/openSnackbar', null, { root: true })
    } catch (e) {
      alert('更新に失敗しました。もう一度やり直しください。')
      console.error(e)
    }
  },
  // メンバー削除
  async removeMember({ commit, getters }, id) {
    try {
      const snapShot = await db.collection(`users/${getters.userUid}/circle`).get()

      snapShot.docs.map(async doc => {
        await doc.ref
          .collection('circleMember')
          .doc(id)
          .delete()
      })
      commit('removeMember', id)
    } catch (e) {
      alert('削除に失敗しました。もう一度やり直してください')
      console.error(e)
    }
  },
  // メンバー全削除
  async allRemoveMember({ commit, getters }, id) {
    console.debug('input:', id)
    try {
      const snapShot = await db
        .collection(`users/${getters.userUid}/circle`)
        .doc(id)
        .get()

      const subCollection = await snapShot.ref.collection('circleMember').get()

      subCollection.docs.map(async doc => {
        await snapShot.ref
          .collection('circleMember')
          .doc(doc.id)
          .delete()
      })
      commit('initMember')
    } catch (e) {
      console.error(e)
    }
  }
}

const getters = {
  // サークル名の取得
  circleName: state => {
    return state.circle.name
  },
  // サークルidの取得
  circleId: state => {
    return state.circle.id
  },
  circlePhotoURL: state => (state.circle.photoURL ? state.circle.photoURL : ''),

  // メンバーの名前を取得
  gettersCircleMember: state => {
    return state.circleMember.map(member => {
      return member.name
    })
  },
  // uidの取得
  userUid: (state, getters, rootState, rootGetters) => {
    return rootGetters['modules/auth/uid']
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
