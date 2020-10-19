import { v4 as uuidv4 } from 'uuid'
import firebase, { db } from '~/plugins/firebase'

const state = () => ({
  todos: [],
  comments: []
})
const mutations = {
  // データを初期化する
  initTodos(state) {
    state.todos = []
    console.log('initTodos')
  },
  // タスク追加
  addTodos(state, { task }) {
    state.todos.push({ task })
    console.log('addTodos')
  },
  // タスク削除
  removeTask(state, { id }) {
    const index = state.todos.findIndex((todo) => todo.task.id === id)
    state.todos.splice(index, 1)
    console.log('removeTask')
  },
  updateTask(state, { id, task }) {
    // インデックスを取得
    const index = state.todos.findIndex((todo) => todo.task.id === id)
    state.todos[index] = task
    console.log('updateTask')
  },
  // 完了、未完了切り替え
  doneTask(state, { todo }) {
    todo.task.done = !todo.task.done
  },
  addComment(state, comment) {
    state.comments.push(comment)
    console.log('addComments')
  },
  removeComment(state, { id }) {
    const index = state.comments.findIndex((comment) => comment.id === id)
    state.comments.splice(index, 1)
    console.log('removeComment')
  },
  initComments(state) {
    state.comments = []
    console.log('initComments')
  }
}
const actions = {
  // firestoreからTodosのデータを取り出す
  async fetchTodos({ getters, commit }) {
    const snapShot = await db
      .collection(`users/${getters.userUid}/todos`)
      .orderBy('created', 'desc')
      .get()
    commit('initTodos')
    snapShot.docs.map((doc) => {
      commit('addTodos', { task: doc.data() })
    })
  },
  // タスク追加
  async addTask({ getters, commit }, todo) {
    const taskId = uuidv4()
    const task = {
      id: taskId,
      title: todo.task.title,
      detail: todo.task.detail,
      date: todo.task.date,
      done: false,
      created: firebase.firestore.FieldValue.serverTimestamp()
    }
    if (getters.userUid) {
      await db.collection(`users/${getters.userUid}/todos`).doc(taskId).set(task)
    }
    commit('addTodos', { task })
  },
  // タスク更新
  async updateTask({ getters, commit }, { id, task }) {
    if (getters.userUid) {
      await db.collection(`users/${getters.userUid}/todos`).doc(id).update(task)
      commit('updateTask', { id, task })
    }
  },
  // タスク削除
  async removeTask({ getters, commit }, { id }) {
    if (getters.userUid) {
      await db.collection(`users/${getters.userUid}/todos`).doc(id).delete()
      commit('removeTask', { id })
    }
  },
  // 完了、未完了切り替え
  async doneTask({ getters, commit }, { todo, id }) {
    await db.collection(`users/${getters.userUid}/todos`).doc(id).update({
      done: !todo.task.done
    })
    commit('doneTask', { todo })
  },
  async addComment({ getters, commit }, { id, message }) {
    const commentId = uuidv4()
    const comment = {
      message,
      id: commentId,
      created: firebase.firestore.FieldValue.serverTimestamp()
    }
    if (getters.userUid) {
      await db
        .collection(`users/${getters.userUid}/todos`)
        .doc(id)
        .collection(`comments/${getters.userUid}/message`)
        .doc(commentId)
        .set(comment)
    }
    commit('addComment', comment)
  },
  async removeComment({ getters, commit }, { id }) {
    if (getters.userUid) {
      const snapShot = await db.collection(`users/${getters.userUid}/todos`).get()
      snapShot.forEach(async (doc) => {
        await doc.ref.collection(`comments/${getters.userUid}/message`).doc(id).delete()
      })
      commit('removeComment', { id })
    }
  },
  // FIXME: id指定してログインユーザーのコメントを表示
  async fetchComments({ getters, commit }, id) {
    commit('initComments')
    const snapShot = await db.collection(`users/${getters.userUid}/todos`).doc(id).get()
    const subCollection = await snapShot.ref.collection(`comments/${getters.userUid}/message`).get()
    subCollection.forEach((doc) => {
      const comment = doc.data()
      commit('addComment', comment)
    })
  }
}

const getters = {
  // uidの取得
  userUid: (state, getters, rootState, rootGetters) => {
    return rootGetters['modules/auth/uid']
  },

  // タスク総数のカウント
  todosCount(state) {
    return state.todos.length
  },
  // 完了タスクのカウント
  completedTodos(state) {
    return state.todos.filter((todo) => todo.task.done).length
  },
  // タスクの完了率
  progress(state, getters) {
    const completed = (getters.completedTodos / state.todos.length) * 100
    return completed.toFixed()
  },
  // 未完了タスクのカウント
  remainingTodos(state, getters) {
    return state.todos.length - getters.completedTodos
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
