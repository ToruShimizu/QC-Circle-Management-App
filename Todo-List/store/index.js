import firebase from "~/plugins/firebase";
import { auth } from "~/plugins/firebase";
import { db } from "~/plugins/firebase";

export const strict = false;

export const state = () => ({
  todos: [],
  login_user: null
});

export const mutations = {
  // ログインユーザー情報の取得
  setLoginUser(state, user) {
    state.login_user = user;
  },
  // ログインユーザー情報の削除
  deleteLoginUser(state) {
    state.login_user = null;
  },
  // データを初期化する
  initTodos(state) {
    state.todos = [];
  },
  // 取り出したデータを格納
  addTodos(state, todo) {
    state.todos.push(todo);
  },
  // タスク追加
  addTask(state, { id, todo }) {
    todo.id = id;
  },
  // タスク削除
  removeTask(state, { id }) {
    const index = state.todos.findIndex(todo => todo.id === id);
    state.todos.splice(index, 1);
  },
  updateTask(state, { id, task }) {
    // インデックスを取得
    const index = state.todos.findIndex(todo => todo.id === id);
    state.todos[index] = task;
  },
  // 完了、未完了切り替え
  doneTask(state, { todo }) {
    todo.done = !todo.done;
  }
};

export const actions = {
  // ログインユーザー情報の取得
  setLoginUser({ commit }, user) {
    commit("setLoginUser", user);
  },
  // ログインユーザー情報の削除
  deleteLoginUser({ commit }) {
    commit("deleteLoginUser");
  },
  // Googleログイン
  async googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithPopup(provider).then(result => {
      alert("Hello, " + result.user.displayName + "!");
    });
  },
  // アカウントなしでログイン
  async login({ commit }, payload) {
    await firebase
      .auth()
      .signInWithEmailAndPassword(payload.email, payload.password);
    // サインイン成功後にトップページに遷移する
    alert("アカウントなしでログインします");
  },
  // ログアウト
  logout() {
    alert("ログアウトしました");
    auth.signOut();
  },
  // ユーザー作成
  async createUser({ commit }, payload) {
   await firebase.auth().createUserWithEmailAndPassword(payload.userEmail, payload.userPassword)
  },
  // firestoreからデータを取り出す
  async fetchTodos({ getters, commit }) {
    commit("initTodos");
    const snapShot = await db.collection(`users/${getters.uid}/todos`).get();
    snapShot.forEach(doc =>
      commit("addTodos", { id: doc.id, task: doc.data() })
    );
  },
  // タスク追加
  async addTask({ getters, commit }, todo) {
    const task = {
      title: todo.task.title,
      detail: todo.task.detail,
      date: todo.task.date,
      done: false,
      created: firebase.firestore.FieldValue.serverTimestamp()
    };
    if (getters.uid) {
      await db
        .collection(`users/${getters.uid}/todos`)
        .add(task)
        .then(doc => {
          commit("addTask", { id: doc.id, todo });
          console.log(doc.id);
        });
    }
  },
  // タスク更新
  async updateTask({ getters, commit }, { id, task }) {
    if (getters.uid) {
      await db
        .collection(`users/${getters.uid}/todos`)
        .doc(id)
        .update(task);
      commit("updateTask", { id, task });
    }
  },
  // タスク削除
  async removeTask({ getters, commit }, { id }) {
    if (getters.uid) {
      await db
        .collection(`users/${getters.uid}/todos`)
        .doc(id)
        .delete();
      commit("removeTask", { id });
    }
  },
  // 完了、未完了切り替え
  async doneTask({ getters, commit }, { todo }) {
    await db
      .collection(`users/${getters.uid}/todos`)
      .doc(todo.id)
      .update({
        done: !todo.done
      });
    commit("doneTask", { todo });
  }
};

export const getters = {
  // ユーザーネームの取得
  userName: state => (state.login_user ? state.login_user.displayName : ""),
  // ユーザー画像の取得
  photoURL: state => (state.login_user ? state.login_user.photoURL : ""),
  // uidの取得
  uid: state => (state.login_user ? state.login_user.uid : null),
  // idを返す関数
  getTaskById: state => id => state.todos.find(todo => todo.id === id),

  // タスク総数のカウント
  todosCount(state) {
    return state.todos.length;
  },
  // 完了タスクのカウント
  completedTodos(state) {
    return state.todos.filter(todo => todo.done).length;
  },
  // タスクの完了率
  progress(state, getters) {
    let completed = (getters.completedTodos / state.todos.length) * 100;
    return completed.toFixed();
  },
  // 未完了タスクのカウント
  remainingTodos(state, getters) {
    return state.todos.length - getters.completedTodos;
  }
};
