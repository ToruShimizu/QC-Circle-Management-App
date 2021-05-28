<template>
  <AppDialog :is-opened="isOpened" class="update-username-dialog" title="ユーザー名変更" @close="$emit('close', false)">
    <v-card-subtitle class="text-center font-italic">
      現在登録されているユーザー名<br />
      <v-icon left>mdi-account-outline</v-icon>
      {{ gettersUsername }}さん
    </v-card-subtitle>
    <v-divider />
    <v-form ref="form" v-model="isValid">
      <v-row class="mx-2 py-5">
        <v-col>
          <TextInput
            v-model="usernameInput"
            :rules="$rules.username"
            icon="mdi-account-outline"
            label="新しいユーザー名"
          />
        </v-col>
      </v-row>
    </v-form>
    <template slot="buttons">
      <AppButton :disabled="!isValid" :loading="isRunning" @click="runUpdateUsername">
        更新する
      </AppButton>
      <AppButton :disabled="isRunning" color="success" outlined @click="$emit('close', false)">
        キャンセル
      </AppButton>
    </template>
  </AppDialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'UpdateUsernameDialog',
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
      usernameInput: '',
      isRunning: false,
      isValid: false
    }
  },
  computed: {
    ...mapGetters('modules/auth', ['gettersUsername'])
  },
  watch: {
    isOpened() {
      if (this.isOpened) {
        this.$nextTick(() => this.$refs.form.reset())
      }
    }
  },
  methods: {
    async runUpdateUsername() {
      // ローディングをON
      this.isRunning = true
      await this.updateUsername({
        username: this.usernameInput
      })
      this.$emit('close', false)

      // ローディングをOFF
      this.isRunning = false
    },

    ...mapActions('modules/userInfo', ['updateUsername'])
  }
}
</script>
