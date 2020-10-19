<template>
  <v-app>
    <v-dialog
      v-model="updateUserNameDialog"
      persistent
      max-width="400px"
      transition="scroll-y-transition"
    >
      <v-app>
        <v-col cols="12" sm="12" md="12">
          <v-card width="400px" class="mx-auto mt-5 text-center">
            <v-card-title>
              <h2>ユーザー情報編集</h2>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" lazy-validation @submit.prevent="createUser">
                <v-text-field
                  v-model="updateUserName"
                  prepend-inner-icon="mdi-card-account-details-outline"
                  label="名前を変更する"
                  :rules="nameRules"
                  clearable
                />
                <v-card-actions>
                  <v-btn
                    color="success"
                    @click="editUserName"
                    :loading="loadingUpdateUserName"
                    :disabled="loadingUpdateUserName"
                  >
                    <v-icon left>mdi-account</v-icon>SAVE
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click="selectedUpdateUserName = 'closeUpdateUserName'">
                    <v-icon left>mdi-login-variant</v-icon>戻る
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-app>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  props: {
    updateUserNameDialog: {
      type: Boolean
    },
    selectedUpdateUserInfo: {
      type: String
    }
  },
  watch: {
    loader() {
      const l = this.loader
      this[l] = !this[l]

      setTimeout(() => (this[l] = false), 3000)

      this.loader = null
    }
  },
  computed: {
    selectedUpdateUserName: {
      get() {
        return this.selectedUpdateUserInfo
      },
      set(value) {
        this.$emit('update:selectedUpdateUserName', value)
      }
    }
  },
  data() {
    return {
      loader: null,
      loadingUpdateUserName: false,
      editUserName: '',
      validate: true,
      nameRules: [(v) => !!v || '名前は必須です']
    }
  },
  methods: {
    updateUserName() {
      this.loader = 'loadingUpdateUserName'
      this.$store.dispatch('modules/auth/updateUserName', {
        userName: this.updateUserName
      })
      this.updateUserName = ''
      this.$emit('update:selectedUpdateUserName', 'closeUpdateUserName')
    }
  }
}
</script>
