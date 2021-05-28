<template>
  <AppDialog
    title="活動計画作成"
    :is-opened="isOpened"
    class="create-activity-plan-dialog"
    @close="$emit('close', false)"
  >
    <v-divider />
    <div class="py-4">
      <v-form ref="form" v-model="isValid">
        <v-row class="mx-2">
          <!-- カテゴリ入力エリア -->
          <v-col>
            <ComboboxInput
              v-model="createPlanContentsInput.category"
              :items="items"
              :rules="$rules.category"
              label="カテゴリ"
            />
          </v-col>
          <!-- 日付入力エリア -->
        </v-row>
        <v-row class="mx-2">
          <v-col> <DateForm :date.sync="createPlanContentsInput.date" /> </v-col>
        </v-row>
        <!-- 担当入力エリア -->
        <v-row class="mx-2">
          <v-col
            ><ComboboxInput
              v-model="createPlanContentsInput.inChargeMember"
              :items="gettersCircleMember"
              :rules="$rules.incharge"
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
              v-model="createPlanContentsInput.detail"
              outlined
              :rules="$rules.detail"
              icon="mdi-briefcase-outline"
              label="詳細"
            />
          </v-col>
        </v-row>
        <slot name="imageFile"></slot>
        <v-row class="mx-2">
          <v-col sm="12" md="12">
            <!-- 画像入力エリア -->
            <FileInput v-model="createPlanContentsInput.imageFile" label="画像ファイル" />
          </v-col>
        </v-row>
      </v-form>
    </div>
    <!-- 保存ボタン、閉じるボタン -->
    <template slot="buttons">
      <AppButton :disabled="!isValid" :loading="isRunning" @click="runCreateActivityPlan">保存する </AppButton>
      <AppButton :disabled="isRunning" color="success" outlined @click="$emit('close', false)">キャンセル </AppButton>
    </template>
  </AppDialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'CreateActivityPlanDialog',
  model: {
    prop: 'isOpened',
    event: 'close'
  },
  props: {
    isOpened: {
      type: Boolean,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      createPlanContentsInput: {
        category: '',
        detail: '',
        imageFile: null,
        inChargeMember: [],
        fileName: '',
        photoURL: '',
        date: [],
        done: false
      },
      isRunning: false,
      isValid: false
    }
  },
  computed: {
    ...mapGetters('modules/circle', ['gettersCircleMember'])
  },
  watch: {
    isOpened() {
      if (this.isOpened) {
        this.$nextTick(() => this.$refs.form.reset())
      }
    }
  },
  methods: {
    // 活動計画作成
    async runCreateActivityPlan() {
      if (!confirm('活動計画を作成しますか？')) return
      this.isRunning = true
      if (this.createPlanContentsInput.imageFile) {
        await this.uploadPlanContentsImageFile(this.createPlanContentsInput)
      } else {
        await this.createActivityPlan(this.createPlanContentsInput)
      }
      this.isRunning = false

      this.$emit('close', false)
    },

    ...mapActions('modules/activityPlans', ['createActivityPlan', 'uploadPlanContentsImageFile'])
  }
}
</script>
