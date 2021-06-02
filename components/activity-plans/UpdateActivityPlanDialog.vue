<template>
  <AppDialog
    title="活動計画編集"
    :is-opened="isOpened"
    class="update-activity-plan-dialog"
    @close="$emit('close', false)"
  >
    <v-divider />
    <v-form ref="form" v-model="isValid" class="py-5">
      <v-row class="mx-2">
        <!-- カテゴリ入力エリア -->
        <v-col>
          <ComboboxInput
            v-model="updateContentsInput.category"
            :items="items"
            :rules="$rules.category"
            label="カテゴリ"
          />
        </v-col>
      </v-row>
      <!-- 日付入力エリア -->
      <v-row class="mx-2">
        <v-col><DateForm :date.sync="updateContentsInput.date" /> </v-col>
      </v-row>
      <!-- 担当入力エリア -->
      <v-row class="mx-2">
        <v-col
          ><ComboboxInput
            v-model="updateContentsInput.inChargeMember"
            :items="gettersCircleMember"
            :rules="$rules.inCharge"
            multiple
            icon="mdi-account-tie-outline"
            label="担当"
          />
        </v-col>
      </v-row>

      <!-- 詳細入力エリア -->
      <v-row class="mx-2">
        <v-col>
          <TextInput
            v-model="updateContentsInput.detail"
            :rules="$rules.detail"
            icon="mdi-briefcase-outline"
            label="詳細"
          />
        </v-col>
      </v-row>
      <!-- 画像ファイルがない場合 -->
      <template v-if="!updateContentsInput.photoURL">
        <v-row class="mx-2">
          <v-col>
            <FileInput v-model="file" label="画像ファイル" />
          </v-col>
        </v-row>
      </template>
      <!-- 画像ファイルがある場合 -->
      <template v-else>
        <v-row no-gutters class="justify-end">
          <v-btn icon @click="removeImage">
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </v-row>
        <v-row no-gutters>
          <LoadingImg :src="updateContentsInput.photoURL" />
        </v-row>
      </template>
    </v-form>
    <!-- 保存ボタン、閉じるボタン -->
    <template slot="buttons">
      <AppButton :disabled="!isValid" :loading="isRunning" @click="runUpdateActivityPlan">更新する </AppButton>
      <AppButton :disabled="isRunning" color="success" outlined @click="$emit('close', false)">キャンセル </AppButton>
    </template>
  </AppDialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UpdateActivityPlanDialog',
  model: {
    prop: 'isOpened',
    event: 'close'
  },
  props: {
    isOpened: {
      type: Boolean,
      required: true
    },
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
      isRunning: false,
      isValid: false,
      updateContentsInput: {},
      file: null
    }
  },

  computed: {
    ...mapGetters('modules/circle', ['gettersCircleMember'])
  },
  watch: {
    isOpened() {
      if (this.isOpened) this.updateContentsInput = Object.assign({}, this.contents)
      this.file = null
    }
  },
  methods: {
    // 活動計画更新ボタン
    async runUpdateActivityPlan() {
      if (!confirm('活動計画を更新しますか？')) return

      await this.updateActivityPlan({ planContents: this.updateContentsInput, file: this.file })

      this.$emit('close', false)
    },
    // 画像ファイルを一時的に取り除く、更新実行時に削除される
    removeImage() {
      this.updateContentsInput.photoURL = ''
    },
    ...mapActions('modules/activityPlans', ['updateActivityPlan'])
  }
}
</script>
