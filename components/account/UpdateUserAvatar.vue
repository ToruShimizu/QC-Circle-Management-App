<template>
  <v-file-input
    ref="image"
    v-model="userImageFile"
    accept="image/*"
    show-size
    label="画像ファイルをアップロードしてください"
    prepend-icon="mdi-image"
    style="display: none"
    @change="changeUserImageFile"
  />
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      userImageFile: null
    }
  },
  methods: {
    // 画像をクリックしした時にv-file-inputでファイルを選択できるようにする
    selectUserImageFile() {
      this.$refs.image.$refs.input.click()
    },
    // @changeメソッドでファイルに変換してfirestorageへの追加処理を呼び出す
    changeUserImageFile() {
      this.uploadUserImageFile(this.userImageFile)
    },
    ...mapActions('modules/userInfo', ['uploadUserImageFile'])
  }
}
</script>
