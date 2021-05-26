<template>
  <AppDialog :is-opened="isOpened" class="add-member-dialog" title="メンバー追加" @close="$emit('close', false)">
    <v-form ref="form" v-model="isValid">
      <v-row class="mx-2">
        <!-- メンバー名入力フォーム -->
        <v-col cols="12">
          <TextInput
            v-model="addMemberInput.name"
            required
            label="名前"
            clearable
            dense
            icon="mdi-card-account-details-outline"
            :rules="$rules.name"
          />
        </v-col>
      </v-row>
      <!-- 役割入力フォーム -->
      <v-row class="mx-2">
        <v-col cols="12">
          <ComboboxInput
            v-model="addMemberInput.role"
            :items="circleRoles"
            :rules="$rules.role"
            icon="mdi-briefcase-account-outline"
            label="役割"
          />
        </v-col>
      </v-row>
      <!-- 改善担当入力フォーム -->
      <v-row class="mx-2">
        <v-col cols="12">
          <ComboboxInput
            v-model="addMemberInput.improvementRole"
            :items="improvementRoles"
            :rules="$rules.improvementRoles"
            icon="mdi-briefcase-outline"
            label="改善担当"
          />
        </v-col>
      </v-row>
    </v-form>
    <template slot="buttons">
      <AppButton :loading="isRunning" :disabled="!isValid" @click="runAddMember">保存する </AppButton>
      <AppButton :disabled="isRunning" color="success" outlined @click="$emit('close', false)">キャンセル </AppButton>
    </template>
    <v-divider />
  </AppDialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'AddMemberDialog',
  model: {
    prop: 'isOpened',
    event: 'close'
  },
  props: {
    isOpened: {
      type: Boolean,
      required: true
    },
    improvementRoles: {
      type: Array,
      default: () => []
    },
    circleRoles: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    addMemberInput: {
      name: '',
      role: [],
      improvementRole: []
    },
    nameRules: [v => !!v || '名前は必須です。'],
    isOpenedRegistrationMemberDialog: false,
    isRunning: false,
    isValid: false
  }),
  watch: {
    isOpened() {
      if (this.isOpened) {
        this.$nextTick(() => this.$refs.form.reset())
      }
    }
  },
  methods: {
    // メンバー登録
    runAddMember() {
      this.addMember(this.addMemberInput)
      this.$emit('close', false)
    },

    ...mapActions('modules/circle', ['addMember'])
  }
}
</script>
