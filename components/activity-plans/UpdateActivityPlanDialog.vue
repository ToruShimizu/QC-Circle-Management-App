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
        <v-col cols="12" sm="6" md="6">
          <ComboboxInput v-model="contents.category" :items="items" :rules="$rules.category" label="カテゴリ" />
        </v-col>
        <!-- 日付入力エリア -->
        <v-col cols="12" sm="6" md="6"><DateForm :date.sync="contents.date" /> </v-col>
      </v-row>
      <!-- 担当入力エリア -->
      <v-row class="mx-2">
        <v-col cols="12"
          ><ComboboxInput
            v-model="contents.inChargeMember"
            :items="gettersCircleMember"
            :rules="$rules.inCharge"
            icon="mdi-account-tie-outline"
            label="担当"
          />
        </v-col>
      </v-row>

      <!-- 詳細入力エリア -->
      <v-row class="mx-2">
        <v-col cols="12">
          <TextInput v-model="contents.detail" :rules="$rules.detail" icon="mdi-briefcase-outline" label="詳細" />
        </v-col>
      </v-row>

      <template v-if="contents.photoURL">
        <v-row no-gutters class="mx-2 text-right">
          <v-col cols="12">
            <AppButton color="success" icon @click="runRemovePlanContensImage"
              ><v-icon>mdi-delete-outline</v-icon>
            </AppButton>
          </v-col>
        </v-row>

        <!-- 画像入力エリア -->
        <v-row no-gutters>
          <v-col cols="12">
            <!-- 画像の表示 -->
            <LoadingImg class="mx-auto" :src="contents.photoURL" width="200" height="200" />
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <v-row class="mx-2">
          <v-col cols="12">
            <FileInput v-model="file" label="画像ファイル" />
          </v-col>
        </v-row>
      </template>
    </v-form>
    <!-- 保存ボタン、閉じるボタン -->
    <template slot="buttons">
      <AppButton :disabled="!isValid" :loading="isRunning" @click="runUpdateActivityPlan">保存する </AppButton>
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
    }
  },
  methods: {
    // 活動計画更新ボタン
    async runUpdateActivityPlan() {
      if (!confirm('活動計画を更新しますか？')) return
      if (this.file) {
        this.updateContentsInput.filename = this.file
        await this.runUpdateImageFile({ planContents: this.updateContentsInput, file: this.file })
      } else {
        await this.updateActivityPlan(this.updateContentsInput)
      }
      this.$emit('close', false)
    },

    // 画像ファイルを削除
    async runRemovePlanContensImage() {
      if (!confirm('画像を削除しますか？')) return
      await this.removePlanContentsImage(this.contents)
    },
    // 画像ファイルを更新
    async runUpdateImageFile(planContents) {
      console.log('hoge')
      await this.updatePlanContentsImageFile(planContents)
    },
    ...mapActions('modules/activity-plans/activityPlans', [
      'updateActivityPlan',
      'removePlanContentsImage',
      'updatePlanContentsImageFile'
    ])
  }
}
</script>
