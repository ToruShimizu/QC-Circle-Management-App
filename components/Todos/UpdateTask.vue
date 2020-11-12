<template>
  <!-- eslint-disable  -->

  <v-dialog
    v-model="updateTaskDialog"
    persistent
    max-width="600px"
    transition="scroll-y-transition"
  >
    <!-- eslint-disable  -->

    <v-app>
      <v-col cols="12" sm="12" md="12">
        <v-card>
          <v-card-title>
            <span class="headline">タスク詳細×編集</span>
          </v-card-title>
          <v-form ref="form" lazy-validation>
            <v-container>
              <v-row>
                <!-- タスク編集エリア -->
                <v-col cols="12">
                  <v-text-field
                    v-model="editTodo.title"
                    label="タスクを変更する"
                    prepend-inner-icon="mdi-pencil-outline"
                    :rules="[validRules.titleRules.required]"
                    clearable
                  />
                </v-col>
                <!-- 日付編集エリア -->
                <v-col cols="12">
                  <v-menu
                    v-model="updateDateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="editTodo.date"
                        label="期限を変更する"
                        prepend-inner-icon="mdi-calendar-today"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="editTodo.date"
                      no-title
                      scrollable
                      @input="updateDateMenu = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <!-- 詳細編集エリア -->
                <v-col cols="12">
                  <v-text-field
                    v-model="editTodo.detail"
                    label="タスクの詳細を変更する"
                    prepend-inner-icon="mdi-briefcase-outline"
                    clearable
                  ></v-text-field>
                </v-col>
                <AddComment :task-id="editTodo.id" />
                <Comment :task-id="editTodo.id" />
              </v-row>
            </v-container>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="cancelUpdateTask">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="handleUpdateTask">Save</v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-app>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AddComment from '@/components/Comment/AddComment'
import Comment from '@/components/Comment/Comment'
import FormValidation from '@/mixins/FormValidation.vue'

export default {
  components: {
    AddComment,
    Comment
  },
  mixins: [FormValidation],
  props: {
    editTodo: {
      type: Object,
      required: false,
      default: () => {}
    },
    updateTaskDialog: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      updateDateMenu: false
    }
  },
  computed: {
    ...mapState('modules/comment', ['comments'])
  },
  methods: {
    async handleUpdateTask() {
      const task = this.editTodo
      if (!task.title) {
        this.$refs.form.validate()
        return
      }
      await this.updateTask(task)
      await this.fetchTodos()
      this.closeUpdateTask()
    },
    closeUpdateTask() {
      this.$refs.form.reset()
      this.$emit('close-update-task')
    },
    cancelUpdateTask() {
      this.$refs.form.reset()
      this.$emit('cancel-update-task')
    },
    ...mapActions('modules/todos', ['fetchTodos', 'updateTask'])
  }
}
</script>
