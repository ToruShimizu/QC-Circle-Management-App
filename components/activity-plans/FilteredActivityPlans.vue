<template>
  <!-- 完了、未完了のタブ切り替え -->
  <v-tabs>
    <v-tab @click="$emit('update', 'all')">全て:{{ activityPlans.length }}</v-tab>
    <v-divider vertical />
    <v-tab @click="$emit('update', 'active')">実施前:{{ remainingActivityPlansLength }}</v-tab>
    <v-divider vertical />
    <v-tab @click="$emit('update', 'done')">
      実施済: {{ completedActivityPlansLength }}/{{ activityPlans.length }}
      <!-- 完了率の表示 -->
      <v-progress-circular
        v-if="activityPlans.length > 0"
        :value="completionRateOfActivityPlans"
        :rotate="270"
        :size="45"
        class="ml-1"
        color="#1976d2"
        >{{ completionRateOfActivityPlans }}
      </v-progress-circular>
    </v-tab>
  </v-tabs>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  model: {
    props: 'value',
    event: 'update'
  },
  props: {
    selectActivityPlansFilter: {
      type: String,
      default: 'all'
    }
  },
  computed: {
    ...mapGetters('modules/activity-plans/activityPlans', [
      'completedActivityPlansLength',
      'remainingActivityPlansLength',
      'completionRateOfActivityPlans'
    ]),
    ...mapState('modules/activity-plans/activityPlans', ['activityPlans'])
  }
}
</script>

<style>
/* Vuetifyの仕様上スタイルが適用されてしまうため非表示にする */
.v-slide-group__prev {
  display: none !important;
}
</style>
