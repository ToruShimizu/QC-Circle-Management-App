<template>
  <AppDialog :is-opened="isOpened" class="update-circle-dialog" title="サークル編集" @close="$emit('close', false)">
    <!-- チーム画像表示 -->
    <template v-if="editCircleInput.photoURL">
      <v-row no-gutters class="justify-end">
        <v-btn icon @click="removeImage">
          <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
      </v-row>
      <v-row class="mx-2">
        <v-col class="text-center">
          <v-avatar size="200px">
            <LoadingImg :src="editCircleInput.photoURL" width="200" />
          </v-avatar>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <v-row class="mx-2">
        <v-col class="text-center">
          <v-avatar size="200px"> <v-icon large>mdi-account-outline</v-icon> </v-avatar>
        </v-col>
      </v-row>
    </template>

    <v-form ref="form" v-model="isValid">
      <!-- サークル名入力 -->
      <v-row class="mx-2">
        <v-col>
          <TextInput
            v-model="editCircleInput.name"
            label="サークル名"
            :rules="nameRules"
            icon="mdi-card-account-details-outline"
            clearable
          />
        </v-col>
      </v-row>

      <!-- サークル画像選択 -->
      <template v-if="!editCircleInput.photoURL">
        <v-row class="mx-2">
          <v-col>
            <FileInput v-model="file" label="画像ファイル" />
          </v-col>
        </v-row>
      </template>
    </v-form>
    <!-- 保存、閉じるボタン -->
    <template slot="buttons">
      <AppButton :disabled="!isValid" :loading="isRunning" @click="runUpdateCircle">保存する </AppButton>
      <AppButton color="success" outlined :disabled="isRunning" @click="$emit('close', false)">キャンセル </AppButton>
    </template>
  </AppDialog>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'UpdateCircleDialog',
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
      nameRules: [v => !!v || '名前は必須です。'],
      editCircleInput: {},
      file: null,
      isRunning: false,
      isValid: false
    }
  },
  computed: {
    ...mapState('modules/circle', ['circle'])
  },
  watch: {
    isOpened() {
      if (this.isOpened) {
        this.editCircleInput = Object.assign({}, this.circle)
        this.file = null
      }
    }
  },
  methods: {
    // サークル更新
    async runUpdateCircle() {
      this.isRunning = true

      await this.updateCircle({ circle: this.editCircleInput, file: this.file })

      this.$emit('close', false)
      this.isRunning = false
    },
    // 画像ファイルを一時的に取り除く、更新実行時に削除される
    removeImage() {
      this.editCircleInput.photoURL = ''
    },
    ...mapActions('modules/circle', ['updateCircle'])
  }
}
</script>
