<template>
  <AppDialog
    :is-opened="isOpened"
    class="reset-password-dialog"
    title="パスワード再設定"
    @close="$emit('close', false)"
  >
    <v-card-subtitle class="text-center font-italic">
      登録されているメールアドレスを入力してください。
      <br />パスワード再設定のURLが送信されます。
    </v-card-subtitle>

    <v-divider />
    <v-form ref="form" v-model="isValid">
      <v-row class="mx-2 py-5">
        <v-col>
          <TextInput
            v-model="resetUserPasswordInput.email"
            :rules="$rules.email"
            icon="mdi-email-outline"
            label="現在のメールアドレス"
          />
        </v-col>
      </v-row>
    </v-form>
    <template slot="buttons">
      <AppButton :loading="isRunning" :disabled="!isValid" color="accent" @click="runResetPassword"
        >送信する
      </AppButton>
      <AppButton :disabled="isRunning" outlined @click="$emit('close', false)">キャンセル </AppButton>
    </template>
  </AppDialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ResetPasswordDialog',
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
      resetUserPasswordInput: {
        email: ''
      },
      isRunning: false,
      isValid: false
    }
  },
  watch: {
    isOpened() {
      if (this.isOpened) {
        this.$nextTick(() => this.$refs.form.reset())
      }
    }
  },
  methods: {
    // パスワードリセット実行
    async runResetPassword() {
      if (this.resetUserPasswordInput.email === 'test@example.com') {
        // ローディングをON
        this.isRunning = true
        alert('テストユーザーはパスワードを再設定することはできません')
        return
      }
      await this.resetPassword({
        email: this.resetUserPasswordInput.email
      })
      this.$emit('close', false)
      // ローディングをOFF
      this.isRunning = false
    },
    ...mapActions('modules/user/userInfo', ['resetPassword'])
  }
}
</script>
