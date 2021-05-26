<template>
  <AppDialog :is-opened="isOpened" class="update-member-dialog" title="メンバー編集" @close="$emit('close', false)">
    <v-form ref="form" v-model="isValid">
      <v-row class="mx-2">
        <!-- メンバー名入力フォーム -->
        <v-col cols="12">
          <TextInput
            v-model="editMemberInput.name"
            required
            clearable
            dense
            :rules="$rules.name"
            label="名前"
            icon="mdi-card-account-details-outline"
          />
        </v-col>
      </v-row>

      <!-- 役割入力フォーム -->
      <v-row class="mx-2">
        <v-col cols="12">
          <ComboboxInput
            v-model="editMemberInput.role"
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
            v-model="editMemberInput.improvementRole"
            :items="improvementRoles"
            :rules="$rules.improvementRoles"
            icon="mdi-briefcase-outline"
            label="改善担当"
          />
        </v-col>
      </v-row>
    </v-form>
    <template slot="buttons">
      <AppButton :loading="isRunning" :disabled="!isValid" @click="runUpdateMember">保存する </AppButton>
      <AppButton :disabled="isRunning" color="success" outlined @click="$emit('close', false)">キャンセル </AppButton>
    </template>
  </AppDialog>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  name: 'UpdateMemberDialog',
  model: {
    prop: 'isOpened',
    event: 'close'
  },
  props: {
    isOpened: {
      type: Boolean,
      required: true
    },
    editMember: {
      type: Object,
      required: true
    },
    circleRoles: {
      type: Array,
      required: true
    },
    improvementRoles: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      editMemberInput: {
        name: '',
        role: [],
        improvementRole: []
      },
      isRunning: false,
      isValid: false
    }
  },
  watch: {
    isOpened() {
      if (this.isOpened) {
        this.editMemberInput = Object.assign({}, this.editMember)
      }
    }
  },
  methods: {
    // メンバー更新
    async runUpdateMember() {
      this.isRunning = true
      await this.updateMember(this.editMemberInput)
      this.$emit('close', false)
      this.isRunning = false
    },
    ...mapActions('modules/circle', ['updateMember'])
  }
}
</script>
