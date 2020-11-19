<template>
  <FormDialog :form-dialog="createUserDialog">
    <template v-slot:dialog>
      <FormView :title="'新規作成'">
        <template v-slot:form>
          <FormCardText>
            <template v-slot:text> ※ 作成後にログインします。 </template>
          </FormCardText>
          <v-form ref="form" lazy-validation @submit.prevent="createUser">
            <FormUserName :user-name.sync="createNewUser.name" :name-label="'登録する名前'" />
            <FormUserEmail
              :user-email.sync="createNewUser.email"
              :email-label="'登録するメールアドレス'"
            />
            <FormUserPassword
              :user-password.sync="createNewUser.password"
              :passwordLabel="'登録するパスワード'"
            />

            <SaveAndCloseButton
              :close-button-title="'close'"
              :save-button-title="'save'"
              @close-button="closeCreateUser"
              @save-button="handleCreateUser"
            >
              <template v-slot:save>
                <v-icon left>mdi-account-plus</v-icon>
              </template>
            </SaveAndCloseButton>
          </v-form>
        </template>
      </FormView>
    </template>
  </FormDialog>
</template>

<script>
import { mapActions } from 'vuex'
import FormUserName from '@/components/commonParts/user/form/FormUserName'
import FormUserEmail from '@/components/commonParts/user/form/FormUserEmail'
import FormUserPassword from '@/components/commonParts/user/form/FormUserPassword'
import SaveAndCloseButton from '@/components/commonParts/button/SaveAndCloseButton'
import FormView from '@/components/commonParts/form/FormView'
import FormCardText from '@/components/commonParts/card/FormCardText'
import FormDialog from '@/components/commonParts/dialog/FormDialog'

export default {
  components: {
    FormUserName,
    FormUserEmail,
    FormUserPassword,
    SaveAndCloseButton,
    FormView,
    FormCardText,
    FormDialog
  },

  props: {
    createUserDialog: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      createNewUser: {
        name: '',
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async handleCreateUser() {
      const createUser = this.createNewUser
      if (!createUser.password || !createUser.email || !createUser.name) {
        this.$refs.form.validate()
        return
      }
      await this.createUser({
        email: createUser.email,
        password: createUser.password,
        userName: createUser.name
      })
    },
    closeCreateUser() {
      this.$emit('close-create-user')
      this.$refs.form.reset()
    },
    ...mapActions('modules/user/auth', ['createUser'])
  }
}
</script>
<style scoped>
.fill-width {
  width: 100%;
}
</style>
