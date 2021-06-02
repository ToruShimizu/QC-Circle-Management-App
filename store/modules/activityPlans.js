import firebase, { storageRef, db } from '~/plugins/firebase'

const state = () => ({
  activityPlans: []
})
const mutations = {
  // データを初期化する
  initActivityPlans(state) {
    state.activityPlans = []
  },
  // 活動計画追加
  createActivityPlan(state, activityPlan) {
    state.activityPlans.unshift(activityPlan)
  },
  // 活動計画削除
  removeActivityPlan(state, { activityPlanId }) {
    const index = state.activityPlans.findIndex(activityPlan => activityPlan.id === activityPlanId)
    state.activityPlans.splice(index, 1)
  },
  // 活動計画更新
  updateActivityPlan(state, updateActivityPlan) {
    const index = state.activityPlans.findIndex(contents => contents.id === updateActivityPlan.id)
    state.activityPlans.splice(index, 1, updateActivityPlan)
  },
  // 活動計画の完了状態切り替え
  toggleDoneActivityPlan(state, planContents) {
    planContents.done = !planContents.done
  },
  removeImage(state, id) {
    const index = state.activityPlans.findIndex(contents => contents.id === id)
    state.activityPlans[index].photoURL = ''
    state.activityPlans[index].fileName = ''
  },
  updateCompletionDate(state, { completionDate, id }) {
    const index = state.activityPlans.findIndex(contents => contents.id === id)
    state.activityPlans[index].completionDate = completionDate
  },
  // コメントの初期化
  initComments(state) {
    state.comments = []
  },
  addComment(state, { comment, id }) {
    const index = state.activityPlans.findIndex(contents => contents.id === id)
    state.activityPlans[index].comments.unshift(comment)
  },
  // コメント削除
  removeComment(state, comment) {
    const id = comment.id
    const activityPlanIndex = state.activityPlans.findIndex(contents => contents.id === comment.activityPlanId)
    const commentIndex = state.activityPlans[activityPlanIndex].comments.findIndex(comment => comment.id === id)
    state.activityPlans[activityPlanIndex].comments.splice(commentIndex, 1)
  }
}
const actions = {
  // firestoreからactivityPlanのデータを取り出す
  async fetchActivityPlans({ getters, commit, dispatch }) {
    try {
      const snapShot = await db
        .collection(`users/${getters.userUid}/activityPlans`)
        .orderBy('created', 'desc')
        .get()
      commit('initActivityPlans')
      const id = snapShot.docs.map(doc => {
        const planContents = doc.data()
        commit('createActivityPlan', planContents)
        return doc.data().id
      })
      id.map(doc => {
        const activityPlansId = doc
        dispatch('fetchComments', activityPlansId)
      })
    } catch (e) {
      console.error(e)
    }
  },
  // 活動計画追加
  async createActivityPlan({ commit, getters }, { planContents, file }) {
    console.debug('planContents: ', planContents, 'file: ', file)
    try {
      const id = await db.collection(`users/${getters.userUid}/activityPlans`).doc().id
      // 画像ファイルがある場合
      if (file) {
        const imageRef = await storageRef.child(`planContentsImages/${id}/${file.name}`)
        const snapShot = await imageRef.put(file)
        planContents.photoURL = await snapShot.ref.getDownloadURL()
        planContents.fileName = file.name
      }

      const createActivityPlanInput = {
        id,
        category: planContents.category,
        detail: planContents.detail,
        date: planContents.date,
        completionDate: null,
        inChargeMember: planContents.inChargeMember,
        done: false,
        fileName: planContents.fileName,
        photoURL: planContents.photoURL,
        comments: [],
        created: firebase.firestore.FieldValue.serverTimestamp()
      }
      await db
        .collection(`users/${getters.userUid}/activityPlans`)
        .doc(id)
        .set(createActivityPlanInput)
      commit('createActivityPlan', createActivityPlanInput)
      commit('modules/commonParts/openSnackbar', null, { root: true })
    } catch (e) {
      console.error(e)
    }
  },
  // 活動計画更新
  async updateActivityPlan({ getters, commit, dispatch }, { planContents, file }) {
    console.debug('planContents: ', planContents, 'file: ', file)
    // 前の画像ファイルがあって、画像の更新、または削除する時は前の画像を削除
    if (planContents.fileName && !planContents.photoURL) await dispatch('removeImageFile', planContents)
    try {
      // 画像ファイルを更新する場合
      if (file) {
        const imageRef = await storageRef.child(`planContentsImages/${planContents.id}/${file.name}`)
        const snapShot = await imageRef.put(file)
        planContents.photoURL = await snapShot.ref.getDownloadURL()
      }
      const updateActivityPlanInput = {
        id: planContents.id,
        category: planContents.category,
        date: planContents.date,
        detail: planContents.detail,
        inChargeMember: planContents.inChargeMember,
        done: false,
        fileName: planContents.photoURL ? file.name : '',
        photoURL: planContents.photoURL,
        comments: planContents.comments,
        created: firebase.firestore.FieldValue.serverTimestamp()
      }

      await db
        .collection(`users/${getters.userUid}/activityPlans`)
        .doc(planContents.id)
        .update(updateActivityPlanInput)
      commit('updateActivityPlan', updateActivityPlanInput)
      commit('modules/commonParts/openSnackbar', null, { root: true })
    } catch (e) {
      console.error(e)
    }
  },
  // 完了日更新
  async updateCompletionDate({ commit, getters }, planContents) {
    const id = planContents.id
    const completionDate = new Date().toISOString().substr(0, 10)
    try {
      await db
        .collection(`users/${getters.userUid}/activityPlans`)
        .doc(id)
        .update({ completionDate })
      commit('updateCompletionDate', { completionDate, id })
    } catch (e) {
      console.error(e)
    }
  },
  // 画像ファイル削除
  async removeImageFile({ commit, getters }, planContents) {
    const imageRef = await storageRef.child(`planContentsImages/${planContents.id}/${planContents.fileName}`)
    try {
      await imageRef.delete()
      await db
        .collection(`users/${getters.userUid}/activityPlans`)
        .doc(planContents.id)
        .update({ photoURL: null, fileName: null })
      commit('removeImage', planContents.id)
    } catch (e) {
      console.error(e)
    }
  },
  // 活動計画削除
  async removeActivityPlan({ getters, commit, dispatch }, { id }) {
    console.debug('input: ', id)
    try {
      await db
        .collection(`users/${getters.userUid}/activityPlans`)
        .doc(id)
        .delete()
      commit('removeActivityPlan', { activityPlanId: id })
      dispatch('allRemoveComment', id)
    } catch (e) {
      console.error(e)
    }
  },
  async allRemoveActivityPlan({ commit, getters }) {
    try {
      const snapShot = await db
        .collection(`users/${getters.userUid}/activityPlans`)
        .orderBy('created', 'desc')
        .get()
      snapShot.docs.map(async doc => {
        await db
          .collection(`users/${getters.userUid}/activityPlans`)
          .doc(doc.id)
          .delete()
        commit('initActivityPlans')
      })
    } catch (e) {
      console.error(e)
    }
  },
  // 活動計画の完了状態切り替え
  async toggleDoneActivityPlan({ getters, commit, dispatch }, planContents) {
    try {
      await db
        .collection(`users/${getters.userUid}/activityPlans`)
        .doc(planContents.id)
        .update({
          done: !planContents.done
        })
      if (!planContents.done) {
        dispatch('updateCompletionDate', planContents)
      }
      commit('toggleDoneActivityPlan', planContents)
    } catch (e) {
      console.error(e)
    }
  },

  // コメントの追加処理
  async addComment({ getters, commit }, { id, message }) {
    const date = new Date()
    const createTime =
      date.getFullYear() +
      '年' +
      (date.getMonth() + 1) +
      '月' +
      date.getDate() +
      '日' +
      date.getHours() +
      '時' +
      date.getMinutes() +
      '分'
    try {
      const commentId = await db
        .collection(`users/${getters.userUid}/activityPlans`)
        .doc(id)
        .collection(`comments/${getters.userUid}/message`)
        .doc().id

      const comment = {
        activityPlanId: id,
        message,
        id: commentId,
        created: createTime
      }
      await db
        .collection(`users/${getters.userUid}/activityPlans`)
        .doc(id)
        .collection(`comments/${getters.userUid}/message`)
        .doc(commentId)
        .set(comment)

      commit('addComment', { comment, id })
    } catch (e) {
      console.error(e)
    }
  },
  // コメントの削除
  async removeComment({ getters, commit }, comment) {
    try {
      const snapShot = await db
        .collection(`users/${getters.userUid}/activityPlans`)
        .doc(comment.activityPlanId)
        .get()

      await snapShot.ref
        .collection(`comments/${getters.userUid}/message`)
        .doc(comment.id)
        .delete()

      commit('removeComment', comment)
    } catch (e) {
      console.error(e)
    }
  },
  // コメントの取得
  async fetchComments({ getters, commit }, id) {
    commit('initComments')
    try {
      const snapShot = await db
        .collection(`users/${getters.userUid}/activityPlans`)
        .doc(id)
        .get()
      const subCollection = await snapShot.ref
        .collection(`comments/${getters.userUid}/message`)
        .orderBy('created', 'desc')
        .get()
      subCollection.docs.map(doc => {
        const comment = doc.data()
        const commentId = comment.activityPlanId
        commit('addComment', { comment, id: commentId })
      })
    } catch (e) {
      console.error(e)
    }
  },
  async allRemoveComment({ commit, getters }, id) {
    try {
      const snapShot = await db
        .collection(`users/${getters.userUid}/activityPlans`)
        .doc(id)
        .get()
      const subCollection = await snapShot.ref.collection(`comments/${getters.userUid}/message`).get()
      subCollection.docs.map(
        async doc =>
          await snapShot.ref
            .collection(`comments/${getters.userUid}/message`)
            .doc(doc.id)
            .delete()
      )
    } catch (e) {
      console.error(e)
    }
  }
}

const getters = {
  // uidの取得
  userUid: (state, getters, rootState, rootGetters) => {
    return rootGetters['modules/auth/uid']
  },

  // 活動計画総数のカウント
  activityPlansCount(state) {
    return state.activityPlans.length
  },
  remainingActivityPlansLength(state, getters) {
    return state.activityPlans.length - getters.completedActivityPlansLength
  },
  // 完了活動計画のカウント
  completedActivityPlansLength(state, getters) {
    return getters.completedActivityPlans.length
  },
  // 活動計画の完了率
  completionRateOfActivityPlans(state, getters) {
    const completed = (getters.completedActivityPlansLength / state.activityPlans.length) * 100
    return completed.toFixed()
  },
  // 未完了状態の活動計画の絞り込み
  remainingActivityPlans(state, getters) {
    return state.activityPlans.filter(activityPlan => !activityPlan.done)
  },
  // 完了状態の絞り込み
  completedActivityPlans(state) {
    return state.activityPlans.filter(activityPlan => activityPlan.done)
  },
  sortByCategory(state) {
    return state.activityPlans.slice().sort((a, b) => {
      if (a.category < b.category) return -1
    })
  },
  sortByAscDate(state) {
    return state.activityPlans.slice().sort((a, b) => {
      if (a.date > b.date) return -1
    })
  },
  sortByDescDate(state) {
    return state.activityPlans.slice().sort((a, b) => {
      if (a.date < b.date) return -1
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
