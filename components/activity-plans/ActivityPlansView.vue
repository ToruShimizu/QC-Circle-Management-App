<template>
  <div>
    <!-- 活動計画一覧表示 -->
    <ActivityPlansCard
      v-for="contents in displayActivityPlans"
      :key="contents.id"
      :contents="contents"
      @toggle-done-activity-plan="toggleDoneActivityPlan"
      @handle-remove-activity-plan="runRemoveActivityPlan"
      @open-activity-plan="openUpdateActivityPlan"
    />
    <!-- 活動計画編集ダイアログ -->
    <LazyUpdateActivityPlanDialog v-model="updateActivityPlanDialog" :todo-categorys="todoCategorys" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    displayActivityPlans: {
      type: Array,
      required: true
    },
    todoCategorys: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      editPlanContents: {},
      updateActivityPlanDialog: false
    }
  },
  methods: {
    // 活動計画削除ボタン
    async runRemoveActivityPlan(contents) {
      if (!confirm(contents.category + 'を削除しますか？')) return
      await this.removeActivityPlan({ id: contents.id })
    },
    // 完了・未完了切り替えボタン
    toggleDoneActivityPlan(contents) {
      this.doneActivityPlan({ planContents: contents, id: contents.id })
    },
    // 活動計画編集ダイアログを開く
    openUpdateActivityPlan(contents) {
      this.editPlanContents = Object.assign({}, contents)
      this.updateActivityPlanDialog = true
    },

    ...mapActions('modules/activity-plans/activityPlans', ['removeActivityPlan', 'doneActivityPlan']),
    ...mapActions('modules/activity-plans/activityPlans', ['fetchComments'])
  }
}
</script>
