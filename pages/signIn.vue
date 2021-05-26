<template>
  <v-card width="500px" class="mx-auto mt-8 py-5">
    <v-card-title class="justify-center"> ログインはこちら</v-card-title>
    <v-divider />
    <!-- Googleログインボタン -->
    <v-row justify="center" class="my-3">
      <AppButton width="400" color="success" outlined @click="googleLogin">
        <img
          class="google-icon mr-4"
          src="https://madeby.google.com/static/images/google_g_logo.svg"
        />Googleアカウントでログイン
      </AppButton>
    </v-row>
    <!-- テストユーザーログインボタン -->
    <v-row justify="center" class="my-3">
      <AppButton :loading="isRunningTestLogin" width="400" color="success" outlined @click="testLogin"
        ><v-icon>mdi-account-arrow-left-outline</v-icon>テストユーザーでログイン
      </AppButton>
    </v-row>

    <v-divider />

    <v-card-title class="justify-center">
      または
    </v-card-title>

    <v-form ref="form" v-model="isValid">
      <v-row no-gutters class="mx-2" justify="center">
        <v-col cols="10" class="pa-0">
          <TextInput v-model="signInUser.email" :rules="$rules.email" placeholder="メールアドレス" />
        </v-col>
      </v-row>
      <v-row no-gutters class="mx-2" justify="center">
        <v-col cols="10" class="pa-0">
          <TextInput v-model="signInUser.password" :rules="$rules.password" label="パスワード" />
        </v-col>
      </v-row>
    </v-form>
    <v-row justify="center">
      <AppButton text @click="isOpenedResetPasswordDialog = true">※パスワードを忘れた方はこちら </AppButton>
    </v-row>
    <v-card-actions class="justify-end">
      <AppButton :disabled="!isValid" :loading="isRunningLogin" @click="login">ログイン</AppButton>
      <AppButton outlined @click="isOpenedCreateUserDialog = true">新規作成</AppButton>
    </v-card-actions>
    <!-- 新規ユーザー作成ダイアログ -->
    <LazyCreateUserDialog v-model="isOpenedCreateUserDialog" />
    <!-- パスワードリセットダイアログ -->
    <LazyResetPasswordDialog v-model="isOpenedResetPasswordDialog" />
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      signInUser: {
        email: '',
        password: ''
      },
      isOpenedCreateUserDialog: false,
      isOpenedResetPasswordDialog: false,
      isRunningTestLogin: false,
      isRunningLogin: false,
      isValid: false
    }
  },
  methods: {
    // テストログイン
    testLogin() {
      // ボタンのローディングをON
      this.isRunningTestLogin = true
      this.login({
        email: 'test@example.com',
        password: 'testUser',
        userName: 'テストユーザー'
      })
      // ボタンのローディングをOFF
      this.isRunningTestLogin = true
    },
    // メールアドレスログイン
    login() {
      // ボタンのローディングをON
      this.isRunningLogin = true

      this.login({
        email: this.signInUser.email,
        password: this.signInUser.password
      })
      // ボタンのローディングをOFF
      this.isRunningLogin = false
      this.$refs.form.reset()
    },

    ...mapActions('modules/auth', ['googleLogin', 'login'])
  }
}
</script>

<style>
.google-icon {
  height: 24px;
}
</style>
