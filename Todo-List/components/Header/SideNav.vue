<template>
  <v-container>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title grey--text text--darken-2"
          >ログインユーザー
        </v-list-item-title>
      </v-list-item-content>
      <UpdateUser
        @update:selectedUpdateUserName="selectedUpdateUserInfo = $event"
        :updateUserNameDialog="updateUserNameDialog"
      />
      <UpdatePassword
        @update:selectedUpdatePassword="selectedUpdateUserInfo = $event"
        :updatePasswordDialog="updatePasswordDialog"
      />

      <UpdateEmailAddress
        @update:selectedUpdateEmailAddress="selectedUpdateUserInfo = $event"
        :updateEmailAddressDialog="updateEmailAddressDialog"
      />

      <DeleteLoginUser
        @update:selectedDeleteUser="selectedUpdateUserInfo = $event"
        :deleteUserDialog="deleteUserDialog"
      />
      <v-menu open-on-hover down offset-y v-if="login_user">
        <v-spacer />
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on">mdi-dots-vertical</v-icon>
        </template>
        <!-- FIXME: コンポーネント化するか検討中 -->
        <v-list :updateUserInfo="updateUserInfo">
          <v-list-item @click="selectedUpdateUserInfo = 'openUpdateUserName'">
            <v-list-item-title>ユーザー情報編集</v-list-item-title>
          </v-list-item>
          <v-list-item @click="selectedUpdateUserInfo = 'openUpdateEmailAddress'">
            <v-list-item-title>メールアドレス変更</v-list-item-title>
          </v-list-item>
          <v-list-item @click="selectedUpdateUserInfo = 'openUpdatePassword'">
            <v-list-item-title>パスワード変更</v-list-item-title>
          </v-list-item>
          <v-list-item @click="selectedUpdateUserInfo = 'openDeleteUser'">
            <v-list-item-title>アカウント削除</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-list-item>
    <v-divider></v-divider>
    <v-list dense nav>
      <v-list-item-content v-if="login_user">
        <v-list-item-title class="title grey--text text--darken-2">
          <v-avatar size="50" v-if="photoURL">
            <img :src="photoURL" />
          </v-avatar>
          <v-icon v-if="!photoURL">mdi-account-outline</v-icon>
          {{ userName }}
        </v-list-item-title>
      </v-list-item-content>
      <v-list-item>
        <v-list-item-content v-if="!login_user">
          <v-list-item-title>ログインユーザーはいません</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import UpdateUser from '@/components/UpdateUserInfo/UpdateUserName'
import UpdatePassword from '@/components/UpdateUserInfo/UpdatePassword'
import UpdateEmailAddress from '@/components/UpdateUserInfo/UpdateEmailAddress'
import DeleteLoginUser from '@/components/UpdateUserInfo/DeleteUser'

export default {
  components: {
    UpdateUser,
    UpdatePassword,
    UpdateEmailAddress,
    DeleteLoginUser
  },
  data() {
    return {
      selectedUpdateUserInfo: '',
      updateUserNameDialog: false,
      updatePasswordDialog: false,
      updateEmailAddressDialog: false,
      deleteUserDialog: false
    }
  },
  computed: {
    // ユーザー情報編集の選択
    updateUserInfo() {
      return this.selectedUserInfo()
    },
    ...mapGetters('modules/auth', ['userName', 'photoURL', 'userEmail']),
    ...mapState('modules/auth', ['login_user'])
  },
  methods: {
    // ユーザー画面編集の選択
    selectedUserInfo() {
      let returnvalue
      switch (this.selectedUpdateUserInfo) {
        // ユーザーネームの変更画面の開閉
        case 'openUpdateUserName':
          returnvalue = this.updateUserNameDialog = true
          break
        case 'closeUpdateUserName':
          returnvalue = this.updateUserNameDialog = false
          break
        // パスワード変更画面の開閉
        case 'openUpdatePassword':
          returnvalue = this.updatePasswordDialog = true
          break
        case 'closeUpdatePassword':
          returnvalue = this.updatePasswordDialog = false
          break
        // メールアドレス変更画面の開閉
        case 'openUpdateEmailAddress':
          returnvalue = this.updateEmailAddressDialog = true
          break
        case 'closeUpdateEmailAddress':
          returnvalue = this.updateEmailAddressDialog = false
          break
        // アカウント削除画面の開閉
        case 'openDeleteUser':
          returnvalue = this.deleteUserDialog = true
          break
        case 'closeDeleteUser':
          returnvalue = this.deleteUserDialog = false
          break
        default:
      }
      return returnvalue
    }
  }
}
</script>
