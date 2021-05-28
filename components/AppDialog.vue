<template>
  <v-dialog :value="isOpened" :width="width" no-click-animation class="app-dialog" persistent>
    <v-card tile>
      <!-- ダイアログのヘッダ -->
      <v-toolbar flat>
        <!-- タイトル -->
        <span> {{ title }}</span>
        <v-spacer />
        <!-- 閉じるボタン -->
        <v-btn text icon @click.stop="$emit('close', false)"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>
      <!-- 内容表示部 -->

      <div class="app-dialog-contents px-4 pt-6">
        <slot />
      </div>

      <!-- ボタン -->
      <v-card-actions class="d-flex justify-end px-4 ">
        <slot name="buttons" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
export default {
  name: 'AppDialog',
  model: {
    prop: 'isOpened',
    event: 'close'
  },
  props: {
    isOpened: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '400px'
    }
  }
}
</script>
<style scoped>
/* dialogから角をなくす */
.v-dialog__content >>> .v-dialog {
  border-radius: 0 !important;
}

/* 高さを指定してスクロール可能にする */
.app-dialog-contents {
  width: 100%;
  height: 60vh;
  overflow-y: auto;
}
</style>
