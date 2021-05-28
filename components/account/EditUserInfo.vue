<template>
  <div class="edit-user-info">
    <v-list v-if="loginUser">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title white--text">ユーザー情報編集 </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider color="white" />

      <!-- ユーザー情報編集選択リスト -->
      <v-list-item @click="isOpenedUpdateUserNameDialog = true">
        <v-list-item-title class="white--text font-weight-bold">
          ユーザー情報変更
        </v-list-item-title>
      </v-list-item>

      <v-list-item @click="openSelectUserImageFile">
        <v-list-item-title class="white--text font-weight-bold">
          プロフィール画像変更
        </v-list-item-title>
      </v-list-item>

      <v-list-item @click="isOpenedUpdateEmail = true">
        <v-list-item-title class="white--text font-weight-bold">
          メールアドレス変更
        </v-list-item-title>
      </v-list-item>

      <v-list-item @click="isOpenedUpdatePassword = true">
        <v-list-item-title class="white--text font-weight-bold">
          パスワード変更
        </v-list-item-title>
      </v-list-item>

      <v-list-item @click="isOpenedRemoveAccount = true">
        <v-list-item-title class="white--text font-weight-bold">
          アカウント削除
        </v-list-item-title>
      </v-list-item>
    </v-list>
    <!-- ユーザー名変更ダイアログ -->
    <LazyUpdateUsernameDialog v-model="isOpenedUpdateUserNameDialog" />
    <!-- プロフィール画像変更 -->
    <UpdateUserAvatar ref="updateUserAvatar" />

    <!-- メールアドレス変更ダイアログ -->
    <LazyUpdateEmailDialog v-model="isOpenedUpdateEmail" />
    <!-- パスワード変更ダイアログ -->
    <LazyUpdatePasswordDialog v-model="isOpenedUpdatePassword" />
    <!-- アカウント削除ダイアログ -->
    <LazyRemoveAccountDialog v-model="isOpenedRemoveAccount" />
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'EditUserInfo',
  data() {
    return {
      isOpenedUpdateUserNameDialog: false,
      isOpenedUpdateEmail: false,
      isOpenedUpdatePassword: false,
      isOpenedRemoveAccount: false
    }
  },
  computed: {
    ...mapState('modules/auth', ['loginUser'])
  },
  methods: {
    // 画像選択画面を開く
    openSelectUserImageFile() {
      this.$refs.updateUserAvatar.selectUserImageFile()
    }
  }
}
</script>
