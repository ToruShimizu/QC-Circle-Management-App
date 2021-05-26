<template>
  <AppDialog :is-opened="isOpened" class="update-circle-dialog" title="サークル編集" @close="$emit('close', false)">
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
            v-model="editCircleInput.name"
            label="サークル名"
            :rules="nameRules"
            icon="mdi-card-account-details-outline"
            clearable
          />
        </v-col>
      </v-row>

      <!-- サークル画像選択 -->
      <v-row class="mx-2">
        <v-col>
          <FileInput v-model="editCircleInput.imageFile" />
        </v-col>
      </v-row>
    </v-form>
    <!-- 保存、閉じるボタン -->
    <template slot="buttons">
      <AppButton :disabled="!isValid" :loading="isRunning" @click="runUpdateCircle">保存する </AppButton>
      <AppButton color="success" outlined :disabled="isRunning" @click="$emit('close', false)">キャンセル </AppButton>
    </template>
  </AppDialog>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
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
      editCircleInput: {
        id: '',
        name: '',
        imageFile: null,
        fileName: '',
        photoURL: ''
      },
      isRunning: false,
      isValid: false
    }
  },
  computed: {
    ...mapState('modules/circle', ['circle']),
    ...mapGetters('modules/circle', ['circlePhotoURL'])
  },
  watch: {
    isOpened() {
      if (this.isOpened) {
        this.editCircleInput = Object.assign({}, this.circle)
      }
    }
  },
  methods: {
    // サークル更新
    async runUpdateCircle() {
      this.isRunning = true
      if (this.editCircleInput.imageFile) {
        await this.updateCircleImageFile(this.editCircleInput)
      } else {
        await this.updateCircle(this.editCircleInput)
      }
      this.$emit('close', false)
      this.isRunning = false
    },

    ...mapActions('modules/circle', ['updateCircle', 'updateCircleImageFile'])
  }
}
</script>
