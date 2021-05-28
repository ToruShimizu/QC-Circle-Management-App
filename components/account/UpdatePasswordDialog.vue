<template>
  <AppDialog :is-opened="isOpened" class="update-password-dialog" title="パスワード変更" @close="$emit('close', false)">
    <v-card-subtitle class="text-center font-italic">
      ※ 変更完了後にログイン画面に戻ります。
    </v-card-subtitle>
    <v-divider />
    <v-form ref="form" v-model="isValid">
      <!-- メールアドレス入力 -->
      <div class="py-5">
        <v-row class="mx-2">
          <v-col>
            <TextInput
              v-model="updatePasswordInput.email"
              :rules="$rules.email"
              icon="mdi-email-outline"
              label="現在のメールアドレス"
            />
          </v-col>
        </v-row>

        <!-- 現在のパスワード入力 -->
        <v-row class="mx-2">
          <v-col>
            <TextInput
              v-model="updatePasswordInput.password"
              :rules="$rules.password"
              type="password"
              icon="mdi-account-key-outline"
              label="現在のパスワード"
            />
          </v-col>
        </v-row>
        <!-- 新しいパスワード入力 -->
        <v-row class="mx-2">
          <v-col>
            <TextInput
              v-model="updatePasswordInput.newPassword"
              :rules="$rules.password"
              type="password"
              icon="mdi-account-key"
              label="新しいパスワード"
            />
          </v-col>
        </v-row>
      </div>
    </v-form>
    <template slot="buttons">
      <AppButton :disabled="!isValid" :loading="isRunning" @click="runUpdatePassword">
        更新する
      </AppButton>
      <AppButton :disabled="isRunning" color="success" outlined @click="$emit('close', false)">
        キャンセル
      </AppButton>
    </template>
  </AppDialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'UpdatePasswordDialog',
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
      updatePasswordInput: {
        email: '',
        password: '',
        newPassword: ''
      },
      isOpenedNewPassword: false,
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
    // パスワード更新ボタン
    async runUpdatePassword() {
      // ローディングをON
      this.isRunning = true
      await this.updatePassword({
        updatePassword: this.updatePasswordInput.newPassword,
        email: this.updatePasswordInput.email,
        password: this.updatePasswordInput.password
      })
      this.$emit('close', false)
      // ローディングをOFF
      this.isRunning = false
    },
    ...mapActions('modules/userInfo', ['updatePassword'])
  }
}
</script>
