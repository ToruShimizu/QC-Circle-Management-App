<template>
  <AppDialog title="サークル新規作成" :is-opened="isOpened" class="create-circle-dialog" @close="$emit('close', false)">
    <v-form ref="form" v-model="isValid">
      <!-- チーム画像表示 -->
      <v-row class="mx-2">
        <v-col class="text-center">
          <v-avatar size="200px">
            <LoadingImg v-if="circlePhotoURL" :src="circlePhotoURL" width="200" />
            <v-icon v-else large>mdi-account-outline</v-icon>
          </v-avatar>
        </v-col>
      </v-row>

      <!-- サークル名入力 -->
      <v-row class="mx-2">
        <v-col>
          <TextInput
            v-model="createCircleInput.name"
            icon="mdi-card-account-details-outline"
            label="サークル名"
            :rules="$rules.name"
          />
        </v-col>
      </v-row>

      <!-- サークル画像選択 -->
      <v-row class="mx-2">
        <v-col>
          <FileInput v-model="file" label="画像ファイル" />
        </v-col>
      </v-row>
    </v-form>
    <!-- 保存、閉じるボタン -->
    <template slot="buttons">
      <AppButton :disabled="!isValid" :loading="isRunning" @click="runCreateCircle">保存する </AppButton>
      <AppButton color="success" outlined :disabled="isRunning" @click="$emit('close', false)">キャンセル </AppButton>
    </template>
  </AppDialog>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'CreateCircleDialog',
  model: {
    prop: 'isOpened',
    event: 'close'
  },
  props: {
    isOpened: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      createCircleInput: {
        name: '',
        fileName: '',
        photoURL: ''
      },
      file: null,
      isRunning: false,
      isValid: false
    }
  },
  computed: {
    ...mapGetters('modules/circle', ['circlePhotoURL'])
  },
  watch: {
    isOpened() {
      if (this.isOpened) {
        this.$nextTick(() => {
          this.$refs.form.reset()
          this.file = null
          this.createCircleInput.photoURL = ''
          this.createCircleInput.fileName = ''
        })
      }
    }
  },

  methods: {
    // サークル作成
    async runCreateCircle() {
      this.isRunning = true

      await this.createCircle({ circle: this.createCircleInput, file: this.file })

      this.isRunning = false
      this.$emit('close', false)
    },

    ...mapActions('modules/circle', ['createCircle'])
  }
}
</script>
