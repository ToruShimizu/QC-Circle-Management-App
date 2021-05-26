<template>
  <AppDialog title="サークル新規作成" :is-opened="isOpened" class="create-circle-dialog" @close="$emit('close', false)">
    <v-form ref="form" v-model="isValid">
      <!-- チーム画像表示 -->
      <v-row class="mx-2">
        <v-col cols="12" class="text-center">
          <v-avatar size="200px">
            <LoadingImg v-if="circlePhotoURL" :src="circlePhotoURL" width="200" />
            <v-icon v-else large>mdi-account-outline</v-icon>
          </v-avatar>
        </v-col>
      </v-row>

      <!-- サークル名入力 -->
      <v-row class="mx-2">
        <v-col cols="12">
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
        <v-col cols="12">
          <FileInput v-model="createCircleInput.imageFile" @change-image-file="changeImageFile" />
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
        imageFile: null,
        fileName: '',
        photoURL: ''
      },
      nameRules: [v => !!v || '名前は必須です。'],
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
        this.$nextTick(() => this.$refs.form.reset())
      }
    }
  },

  methods: {
    // 画像ファイル変換
    changeImageFile(file) {
      this.ircle.imageFile = file
    },
    // サークル作成
    async runCreateCircle() {
      if (this.createCircleInput.imageFile) {
        await this.uploadCircleImageFile(this.createCircleInput.imageFile)
      } else {
        await this.createCircle(this.createCircleInput)
      }
      this.$emit('close', false)
    },

    ...mapActions('modules/circle', ['createCircle', 'uploadCircleImageFile'])
  }
}
</script>
