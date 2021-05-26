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
  removePhotoURL(state, id) {
    const index = state.activityPlans.findIndex(contents => contents.id === id)
    state.activityPlans[index].photoURL = null
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
  },
  // 活動計画追加
  async createActivityPlan({ commit, getters }, planContents) {
    console.debug('input: ', planContents)
    let id = await db.collection(`users/${getters.userUid}/activityPlans`).doc().id
    if (planContents.id) {
      id = planContents.id
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
    try {
      if (getters.userUid) {
        await db
          .collection(`users/${getters.userUid}/activityPlans`)
          .doc(id)
          .set(createActivityPlanInput)
        commit('createActivityPlan', createActivityPlanInput)
        commit('modules/commonParts/openSnackbar', null, { root: true })
      }
    } catch (err) {
      console.log(err)
    }
  },
  async uploadPlanContentsImageFile({ dispatch, getters }, planContents) {
    const id = await db.collection(`users/${getters.userUid}/activityPlans`).doc().id
    const imageFile = planContents.imageFile
    const imageRef = await storageRef.child(`planContentsImages/${id}/${imageFile.name}`)
    const snapShot = await imageRef.put(imageFile)
    const photoURL = await snapShot.ref.getDownloadURL()
    planContents.photoURL = photoURL
    planContents.fileName = imageFile.name
    planContents.id = id
    dispatch('createActivityPlan', planContents)
  },
  // 活動計画更新
  async updateActivityPlan({ getters, commit }, planContents) {
    const id = planContents.id
    const updateActivityPlanInput = {
      id,
      category: planContents.category,
      date: planContents.date,
      detail: planContents.detail,
      inChargeMember: planContents.inChargeMember,
      done: false,
      photoURL: planContents.photoURL,
      fileName: planContents.fileName,
      comments: planContents.comments,
      created: firebase.firestore.FieldValue.serverTimestamp()
    }
    try {
      if (getters.userUid) {
        await db
          .collection(`users/${getters.userUid}/activityPlans`)
          .doc(id)
          .update(updateActivityPlanInput)
        commit('updateActivityPlan', updateActivityPlanInput)
        planContents.imageFile = null
        commit('modules/commonParts/openSnackbar', null, { root: true })
      }
    } catch (err) {
      console.log(err)
    }
  },
  async updateCompletionDate({ commit, getters }, planContents) {
    const id = planContents.id
    const completionDate = new Date().toISOString().substr(0, 10)
    try {
      if (getters.userUid) {
        await db
          .collection(`users/${getters.userUid}/activityPlans`)
          .doc(id)
          .update({ completionDate })
        commit('updateCompletionDate', { completionDate, id })
      }
    } catch (err) {
      console.log(err)
    }
  },
  async updatePlanContentsImageFile({ dispatch }, { planContents, file }) {
    const id = planContents.id
    const imageRef = await storageRef.child(`planContentsImages/${id}/${file.name}`)
    const snapShot = await imageRef.put(file)
    const photoURL = await snapShot.ref.getDownloadURL()
    planContents.fileName = file.name
    planContents.photoURL = photoURL
    dispatch('updateActivityPlan', planContents)
  },
  // 活動計画削除
  async removeActivityPlan({ getters, commit, dispatch }, { id }) {
    const activityPlanId = id
    if (getters.userUid) {
      await db
        .collection(`users/${getters.userUid}/activityPlans`)
        .doc(activityPlanId)
        .delete()
      commit('removeActivityPlan', { activityPlanId })
      dispatch('allRemoveComment', id)
    }
  },
  async allRemoveActivityPlan({ commit, getters }) {
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
  },
  // 活動計画の完了状態切り替え
  async toggleDoneActivityPlan({ getters, commit, dispatch }, planContents) {
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
  },
  async removePlanContentsImage({ commit, getters }, planContents) {
    const id = planContents.id
    const imageRef = await storageRef.child(`planContentsImages/${id}/${planContents.fileName}`)
    try {
      await imageRef.delete()
      await db
        .collection(`users/${getters.userUid}/activityPlans`)
        .doc(id)
        .update({ photoURL: null })
      commit('removePhotoURL', id)
      planContents.photoURL = null
    } catch (err) {
      console.log(err)
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
    if (getters.userUid) {
      await db
        .collection(`users/${getters.userUid}/activityPlans`)
        .doc(id)
        .collection(`comments/${getters.userUid}/message`)
        .doc(commentId)
        .set(comment)
    }
    commit('addComment', { comment, id })
  },
  // コメントの削除
  async removeComment({ getters, commit }, comment) {
    if (getters.userUid) {
      const snapShot = await db
        .collection(`users/${getters.userUid}/activityPlans`)
        .doc(comment.activityPlanId)
        .get()

      await snapShot.ref
        .collection(`comments/${getters.userUid}/message`)
        .doc(comment.id)
        .delete()

      commit('removeComment', comment)
    }
  },
  // コメントの取得
  async fetchComments({ getters, commit }, id) {
    commit('initComments')
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
  },
  async allRemoveComment({ commit, getters }, id) {
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
