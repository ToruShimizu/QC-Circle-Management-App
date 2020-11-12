<template>
  <v-app>
    <v-card>
      <v-simple-table fixed-header>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">状態</th>
              <th class="text-left">タスク</th>
              <th class="text-left">日時</th>
              <th class="text-left">削除</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="todo in displayTodos">
              <transition :key="todo.title" name="list">
                <tr>
                  <td>
                    <v-btn icon @click="toggleDoneTask(todo)">
                      <v-icon :class="(!todo.done && 'grey--text') || 'primary--text'"
                        >mdi-check-circle-outline</v-icon
                      >
                    </v-btn>
                  </td>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <td
                        v-bind="attrs"
                        :class="(todo.done && 'grey--text') || 'primary--text'"
                        v-on="on"
                        @click="openUpdateTask(todo)"
                      >
                        {{ todo.title }}
                      </td>
                    </template>
                    <span>{{ todo.title }}の詳細を開く</span>
                  </v-tooltip>
                  <td :class="(todo.done && 'grey--text') || 'black--text'" class="pa-0">
                    {{ todo.date }}
                  </td>
                  <td>
                    <v-btn icon>
                      <v-icon @click="handleRemoveTask(todo)">mdi-delete-outline</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </transition>
            </template>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <div class="text-center py-2">
      <v-pagination v-model="todosPageNumber" :length="todosPageCount" @input="changeTodosPage" />
    </div>
    <UpdateTask
      :edit-todo="editTodo"
      :update-task-dialog="updateTaskDialog"
      @close-update-task="closeUpdateTask"
      @cancel-update-task="cancelUpdateTask"
    />
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import UpdateTask from '@/components/Todos/UpdateTask.vue'
export default {
  components: {
    UpdateTask
  },
  props: {
    todosPage: {
      type: Number,
      required: false,
      default: 1
    },
    todosPageSize: {
      type: Number,
      required: true
    },
    todosFiltered: {
      type: Array,
      required: true
    },
    sortByTask: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      headers: [
        { text: '状態', value: 'task.done', align: 'start', sortable: false },
        {
          text: 'タスク',
          value: 'title',
          sortable: false
        },
        { text: '期限', value: 'date' },
        { text: '削除', value: 'remove', sortable: false }
      ],
      editTodo: {},
      cancelTodo: null,
      updateTaskDialog: false
    }
  },
  computed: {
    displayTodos() {
      return this.sortByTask
    },
    todosPageNumber: {
      get() {
        return this.todosPage
      },
      set(setTodosPage) {
        this.$emit('update:set-todos-page', setTodosPage)
      }
    },
    todosPageCount() {
      const todos = this.todosFiltered
      return Math.ceil(todos.length / this.todosPageSize)
    },
    ...mapState('modules/todos', ['todos'])
  },
  methods: {
    // 選択されたpageNumberによって表示するページを切り替える
    changeTodosPage(pageNumber) {
      this.$emit('change-todos-page', pageNumber)
    },

    handleRemoveTask(todo) {
      if (!confirm(todo.title + 'を削除しますか？')) return
      this.removeTask({ id: todo.id })
    },
    toggleDoneTask(todo) {
      this.doneTask({ todo, id: todo.id })
    },
    async openUpdateTask(todo) {
      const id = String(todo.id)
      await this.fetchComments(id)
      this.editTodo = Object.assign({}, todo)
      this.updateTaskDialog = true
    },
    closeUpdateTask() {
      this.updateTaskDialog = false
    },
    // FIXME キャンセル時の処理はあとで記述
    cancelUpdateTask() {
      this.updateTaskDialog = false
    },
    ...mapActions('modules/todos', ['removeTask', 'doneTask']),
    ...mapActions('modules/comment', ['fetchComments'])
  }
}
</script>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.8s;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
.list-move {
  transition: transform 0.5s;
}
</style>
