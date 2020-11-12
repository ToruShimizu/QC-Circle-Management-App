import { v4 as uuidv4 } from 'uuid'
import firebase, { db } from '~/plugins/firebase'

const state = () => ({
  todos: []
})
const mutations = {
  // データを初期化する
  initTodos(state) {
    state.todos = []
    console.log('initTodos')
  },
  // タスク追加
  addTodos(state, task) {
    state.todos.push(task)
    console.log('addTodos')
  },
  // タスク削除
  removeTask(state, { id }) {
    const index = state.todos.findIndex((todo) => todo.id === id)
    state.todos.splice(index, 1)
    console.log('removeTask')
  },
  updateTask(state, task) {
    // インデックスを取得
    const index = state.todos.findIndex((todo) => todo.id === task.id)
    state.todos[index] = task
    console.log('updateTask')
  },
  // 完了、未完了切り替え
  doneTask(state, todo) {
    todo.done = !todo.done
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
      const task = doc.data()
      commit('addTodos', task)
    })
  },
  // タスク追加
  async addTask({ getters, commit }, task) {
    const taskId = uuidv4()
    const todo = {
      id: taskId,
      title: task.title,
      detail: task.detail,
      date: task.date,
      done: false,
      created: firebase.firestore.FieldValue.serverTimestamp()
    }
    if (getters.userUid) {
      await db.collection(`users/${getters.userUid}/todos`).doc(taskId).set(todo)
    }
    commit('addTodos', todo)
  },
  // タスク更新
  async updateTask({ getters, commit }, task) {
    const id = task.id
    const todo = {
      id,
      title: task.title,
      date: task.date,
      done: false,
      created: firebase.firestore.FieldValue.serverTimestamp()
    }
    if (getters.userUid) {
      await db.collection(`users/${getters.userUid}/todos`).doc(id).update(todo)
      commit('updateTask', todo)
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
    console.log(todo.done)
    await db.collection(`users/${getters.userUid}/todos`).doc(id).update({
      done: !todo.done
    })
    commit('doneTask', todo)
  }
}

const getters = {
  // uidの取得
  userUid: (state, getters, rootState, rootGetters) => {
    return rootGetters['modules/user/auth/uid']
  },

  // タスク総数のカウント
  todosCount(state) {
    return state.todos.length
  },
  remainingTodosLength(state, getters) {
    return state.todos.length - getters.completedTodosLength
  },
  // 完了タスクのカウント
  completedTodosLength(state, getters) {
    return getters.completedTodos.length
  },
  // タスクの完了率
  progress(state, getters) {
    const completed = (getters.completedTodosLength / state.todos.length) * 100
    return completed.toFixed()
  },
  // 未完了状態のタスクの絞り込み
  remainingTodos(state, getters) {
    return state.todos.filter((todo) => !todo.done)
  },
  // 完了状態のタスクの絞り込み
  completedTodos(state) {
    return state.todos.filter((todo) => todo.done)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
