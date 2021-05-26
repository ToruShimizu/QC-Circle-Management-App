<template>
  <AppDialog :is-opened="isOpened" class="remove-account-dialog" @close="$emit('close', false)">
    <v-card-subtitle class="text-center font-italic">
      ※ 削除後にログイン画面に戻ります。
    </v-card-subtitle>

    <v-divider />
    <v-form ref="form" v-model="isValid">
      <!-- メールアドレス入力 -->
      <div class="py-3 ">
        <v-row class="mx-2">
          <v-col>
            <TextInput
              v-model="removeAccountInput.email"
              :rules="$rules.email"
              icon="mdi-email-outline"
              label="現在のメールアドレス"
            />
          </v-col>
        </v-row>
        <!-- パスワード入力 -->
        <v-row class="mx-2">
          <v-col>
            <TextInput
              v-model="removeAccountInput.password"
              :rules="$rules.password"
              icon="mdi-account-key-outline"
              type="password"
              label="現在のパスワード"
            />
          </v-col>
        </v-row>
      </div>
    </v-form>
    <template slot="buttons">
      <AppButton color="warning" :disabled="!isValid" :loading="isRunning" @click="runRemoveAccount"
        >削除する
      </AppButton>
      <AppButton color="success" outlined @click="$emit('close', false)">閉じる </AppButton>
    </template>
  </AppDialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'RemoveAccountDialog',
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
      removeAccountInput: {
        email: '',
        password: ''
      },
      isValid: false,
      isRunning: false
    }
  },
  watch: {
    isOpened() {
      this.$nextTick(() => this.$refs.form.reset())
    }
  },
  methods: {
    runRemoveAccount() {
      this.removeAccount({
        email: this.removeAccountInput.email,
        password: this.removeAccountInput.password
      })
      this.$emit('close', false)
    },
    ...mapActions('modules/user/userInfo', ['removeAccount'])
  }
}
</script>
