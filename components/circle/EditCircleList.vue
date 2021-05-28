<template>
  <div>
    <!-- サークル編集・削除ボタン -->
    <v-menu transition="slide-y-transition">
      <template #activator="{ on, attrs }">
        <v-btn small text class="mt-1 ml-5" color="blue--grey darken-1" v-bind="attrs" v-on="on">
          <v-icon class="blue--grey darken-1"> mdi-pencil </v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title>
            <!-- サークル編集ダイアログを開くボタン -->
            <AppButton class="font-weight-bold" color="success" text @click="isOpenedUpdateCircleDialog = true">
              編集する
            </AppButton>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <!-- サークル削除ボタン -->
            <AppButton class="font-weight-bold" color="success" text @click="runRemoveCircle">削除する </AppButton>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <!-- サークル編集ダイアログ -->
    <LazyUpdateCircleDialog v-model="isOpenedUpdateCircleDialog" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      isOpenedUpdateCircleDialog: false
    }
  },
  computed: {
    ...mapGetters('modules/circle', ['circleName', 'circlePhotoURL'])
  },
  methods: {
    // サークル削除
    async runRemoveCircle() {
      if (!confirm('サークルを削除しますか？')) return
      await this.removeCircle()
    },
    ...mapActions('modules/circle', ['removeCircle'])
  }
}
</script>
