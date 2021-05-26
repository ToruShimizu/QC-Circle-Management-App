<template>
  <AppDialog :is-opened="isOpened" class="update-user-email" title="メールアドレス変更" @close="$emit('close', false)">
    <v-card-subtitle class="text-center font-italic">
      現在登録されているメールアドレス<br />
      <v-icon left>mdi-email-outline</v-icon>
      {{ gettersUserEmail }}
    </v-card-subtitle>

    <v-divider />
    <v-form ref="form" v-model="isValid">
      <v-row class="mx-2 py-5">
        <v-col>
          <TextInput
            v-model="updateEmailInput"
            :rules="$rules.email"
            icon="mdi-email-outline"
            label="新しいメールアドレス"
          />
        </v-col>
      </v-row>
    </v-form>
    <template slot="buttons">
      <AppButton :disabled="!isValid" @click="runUpdateEmail">
        保存する
      </AppButton>
      <AppButton :loading="isRunning" color="success" outlined @click="$emit('close', false)">
        キャンセル
      </AppButton>
    </template>
  </AppDialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'UpdateUserEmailDialog',
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
      updateEmailInput: '',
      isRunning: false,
      isValid: false
    }
  },
  computed: {
    ...mapGetters('modules/auth', ['gettersUserEmail'])
  },
  watch: {
    isOpened() {
      if (this.isOpened) {
        this.$nextTick(() => this.$refs.form.reset())
      }
    }
  },
  methods: {
    async runUpdateEmail() {
      // ローディングをON
      this.isRunning = true
      await this.updateEmail({
        email: this.updateEmailInput
      })
      this.$emit('close', false)
      // ローディングをOFF
      this.isRunning = false
    },
    ...mapActions('modules/userInfo', ['updateEmail'])
  }
}
</script>
