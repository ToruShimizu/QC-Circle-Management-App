<template>
  <AppDialog :is-opened="isOpened" class="create-user-dialog" title="ユーザー作成" @close="$emit('close', false)">
    <v-card-subtitle class="text-center font-italic">
      ※ 作成後にログインします
    </v-card-subtitle>

    <v-divider />
    <v-form ref="form" v-model="isValid" class="py-5">
      <v-row no-gutters class="mx-2">
        <v-col>
          <TextInput
            v-model="createUserInput.name"
            :rules="$rules.name"
            icon="mdi-account-outline"
            label="登録する名前"
          />
        </v-col>
      </v-row>
      <v-row no-gutters class="mx-2">
        <v-col>
          <TextInput
            v-model="createUserInput.email"
            :rules="$rules.email"
            icon="mdi-email-outline"
            label="登録するメールアドレス"
          />
        </v-col>
      </v-row>
      <v-row no-gutters class="mx-2">
        <v-col>
          <TextInput
            v-model="createUserInput.password"
            :rules="$rules.password"
            icon="mdi-account-key-outline"
            label="登録するパスワード"
          />
        </v-col>
      </v-row>
    </v-form>
    <template slot="buttons">
      <AppButton :disabled="!isValid" :loading="isRunning" @click="runCreateUser">保存する </AppButton>
      <AppButton :disabled="isRunning" color="success" outlined @click="$emit('close', false)">
        キャンセル
      </AppButton>
    </template>
  </AppDialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'CreateUserDialog',
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
      createUserInput: {
        name: '',
        email: '',
        password: ''
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
    // ユーザー作成
    async runCreateUser() {
      // ローディングをON
      this.isRunning = true
      console.log(this.createUserInput.name)
      await this.createUser({
        email: this.createUserInput.email,
        password: this.createUserInput.password,
        username: this.createUserInput.name
      })
      // ローディングをOFF
      this.isRunning = false
      this.$emit('close', false)
    },

    ...mapActions('modules/auth', ['createUser'])
  }
}
</script>
