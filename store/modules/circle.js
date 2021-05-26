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
  async createCircle({ getters, commit }, circle) {
    console.debug('input:', circle)
    let id = await db.collection(`users/${getters.userUid}/circle`).doc().id
    // 画像登録後の場合はidを代入
    if (circle.id) id = circle.id

    const createCircleInput = {
      id,
      name: circle.name,
      fileName: circle.fileName,
      photoURL: circle.photoURL
    }

    try {
      if (getters.userUid) {
        await db
          .collection(`users/${getters.userUid}/circle`)
          .doc(id)
          .set(createCircleInput)
      }
      commit('createCircle', createCircleInput)
      // スナックバー
      commit('modules/common-parts/commonParts/openSnackbar', null, { root: true })
    } catch (e) {
      alert('サークル作成に失敗しました。もう一度やり直してください')
      console.error(e)
    }
  },
  // サークル画像更新
  async uploadCircleImageFile({ getters, dispatch }, circle) {
    console.debug('input:', circle)

    try {
      const id = await db.collection(`users/${getters.userUid}/circle`).doc().id
      const imageFile = circle.imageFile
      const imageRef = await storageRef.child(`circleImages/${id}/${imageFile.name}`)
      const snapShot = await imageRef.put(imageFile)
      const photoURL = await snapShot.ref.getDownloadURL()

      circle.fileName = imageFile.name
      circle.photoURL = photoURL
      circle.id = id
      // サークルを作成する
      dispatch('createCircle', circle)
    } catch (e) {
      console.error(e)
    }
  },
  // サークル更新
  async updateCircle({ getters, commit }, circle) {
    console.debug('input:', circle)
    const id = await db.collection(`users/${getters.userUid}/circle`).doc().id

    const updateCircleInput = {
      id,
      name: circle.name,
      fileName: circle.fileName,
      photoURL: circle.photoURL
    }

    try {
      if (getters.userUid) {
        await db
          .collection(`users/${getters.userUid}/circle`)
          .doc(getters.circleId)
          .update(updateCircleInput)
        commit('updateCircle', updateCircleInput)
        // スナックバー
        commit('modules/common-parts/commonParts/openSnackbar', null, { root: true })
      }
    } catch (e) {
      alert('サークルの更新に失敗しました。もう一度やり直してください')
      console.error(e)
    }
  },
  // サークル画像更新
  async updateCircleImageFile({ dispatch, getters }, circle) {
    console.debug('input:', circle)

    try {
      const id = await db.collection(`users/${getters.userUid}/circle`).doc().id
      const imageFile = circle.imageFile
      const imageRef = await storageRef.child(`circleImages/${id}/${imageFile.name}`)
      const snapShot = await imageRef.put(imageFile)
      const photoURL = await snapShot.ref.getDownloadURL()
      circle.fileName = imageFile.name
      circle.photoURL = photoURL
      // サークルを更新する
      dispatch('updateCircle', circle)
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
      await dispatch('modules/activity-plans/activityPlans/allRemoveActivityPlan', null, {
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
      if (getters.userUid) {
        await db
          .collection(`users/${getters.userUid}/circle`)
          .doc(getters.circleId)
          .collection('circleMember')
          .doc(id)
          .set(addMemberInput)
      }
      commit('addMember', addMemberInput)
      commit('modules/common-parts/commonParts/openSnackbar', null, { root: true })
    } catch (e) {
      alert('メンバー追加に失敗しました。もう一度やり直してください。')
      console.error(e)
    }
  },
  // メンバー更新
  async updateMember({ getters, commit }, editMember) {
    console.debug('input:', editMember)

    try {
      if (getters.userUid) {
        const snapShot = await db.collection(`users/${getters.userUid}/circle`).get()

        snapShot.docs.map(async doc => {
          await doc.ref
            .collection('circleMember')
            .doc(editMember.id)
            .update(editMember)
        })
        await commit('updateMember', editMember)
        commit('modules/common-parts/commonParts/openSnackbar', null, { root: true })
      }
    } catch (e) {
      alert('更新に失敗しました。もう一度やり直しください。')
      console.error(e)
    }
  },
  // メンバー削除
  async removeMember({ commit, getters }, id) {
    try {
      if (getters.userUid) {
        const snapShot = await db.collection(`users/${getters.userUid}/circle`).get()

        snapShot.docs.map(async doc => {
          await doc.ref
            .collection('circleMember')
            .doc(id)
            .delete()
        })
        commit('removeMember', id)
      }
    } catch (e) {
      alert('削除に失敗しました。もう一度やり直してください')
      console.error(e)
    }
  },
  // メンバー全削除
  async allRemoveMember({ commit, getters }, id) {
    console.debug('input:', id)

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
  }
}

const getters = {
  // チームネームの取得
  circleName: state => {
    return state.circle.name
  },
  // チームidの取得
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
    return rootGetters['modules/user/auth/uid']
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
