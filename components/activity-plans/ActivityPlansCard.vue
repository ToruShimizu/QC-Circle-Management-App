<template>
  <div class="activity-plans-card">
    <transition-group name="card-anim">
      <v-card :key="contents.id" class="mb-5 elevation-5">
        <v-card-actions class="pa-0">
          <v-card-title class="pa-1">
            <!-- 完了チェックボタン -->
            <v-btn icon @click="toggleDoneActivityPlan(contents)">
              <v-icon :class="(!contents.done && 'grey--text') || 'primary--text'">mdi-check-circle-outline </v-icon>
            </v-btn>
            <!-- カテゴリ表 -->
            <v-card-title :class="(contents.done && 'grey--text') || 'black--text'" class="pa-0"
              >{{ contents.category }}
            </v-card-title>
          </v-card-title>
          <!-- コメント作成ダイアログ -->
          <LazyAddCommentDialog v-model="isOpenedCommentDialog" :plan-contents="contents" />
          <!-- コメントを開くダイアログ -->
          <AppButton width="50" color="success" icon @click="isOpenedCommentDialog = true"
            ><v-icon>mdi-comment-text-outline</v-icon>
          </AppButton>
          {{ contents.comments.length }}
          <v-spacer />
          <!-- 削除・編集選択リスト -->
          <v-menu transition="slide-y-transition" bottom>
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon> mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="openEditActivityPlan(contents)">
                <v-list-item-title class="font-weight-bold">
                  編集する
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="onRemove(contents)">
                <v-list-item-title class="font-weight-bold">
                  削除する
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card-actions>
        <v-card-actions>
          <!-- 完了している場合は完了日時を表示 -->
          <template v-if="contents.done">
            <v-card-subtitle class="pa-0">
              <v-icon> mdi-check </v-icon>
              {{ contents.completionDate }}
            </v-card-subtitle>
          </template>
          <!-- 実施予定日または期間を表示 -->
          <template v-else>
            <v-card-subtitle class="pa-0">
              <v-icon>mdi-calendar-range </v-icon>
              {{ planContentsDateRangeText }}
            </v-card-subtitle>
          </template>
          <v-spacer />
          <!-- 担当者の表示 -->
          <v-card-subtitle class="pa-0">
            <v-icon class="mb-1">mdi-account-outline </v-icon>
            {{ inChargeMember }}
          </v-card-subtitle>
        </v-card-actions>
        <!-- 詳細表示 -->
        <v-card-subtitle v-if="contents.detail" class="mb-2 pa-0 text-center">
          "{{ contents.detail }}"
        </v-card-subtitle>
        <!-- 画像表示 -->
        <v-list-item v-if="contents.photoURL">
          <LoadingImg :src="contents.photoURL" />
        </v-list-item>
      </v-card>
    </transition-group>
    <!-- 活動計画編集ダイアログ -->

    <LazyUpdateActivityPlanDialog v-model="isOpenedUpdateActivityPlanDialog" :contents="selectedItem" :items="items" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'ActivityPlansCard',
  props: {
    contents: {
      type: Object,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedItem: {},
      isOpenedCommentDialog: false,
      isOpenedUpdateActivityPlanDialog: false
    }
  },
  computed: {
    // 担当者の配列を文字列に加工
    inChargeMember() {
      return this.contents.inChargeMember.join(',')
    },
    // 日時の配列を文字列に加工
    planContentsDateRangeText() {
      return this.contents.date.join('~')
    }
  },
  methods: {
    // 活動計画削除
    onRemove(contents) {
      if (!confirm(`${contents.category}を削除しますか?`)) return
      this.removeActivityPlan(contents)
    },
    // 活動計画作成ダイアログを開く
    openEditActivityPlan(contents) {
      this.selectedItem = contents
      this.isOpenedUpdateActivityPlanDialog = true
    },
    ...mapActions('modules/activity-plans/activityPlans', ['removeActivityPlan', 'toggleDoneActivityPlan'])
  }
}
</script>

<style scoped>
.card-anim-enter-active {
  animation: fadeInUp 0.7s;
  animation-delay: 0.4s;
  opacity: 0;
}
.card-anim-leave-active {
  animation: fadeInUp 0.7s reverse;
}

@keyframes fadeInUp {
  0% {
    transform: translateY(60px);
    opacity: 0;
  }
  60% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(0px);
    opacity: 1;
  }
}
</style>
