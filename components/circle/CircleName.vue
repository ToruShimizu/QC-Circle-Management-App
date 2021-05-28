<template>
  <v-row class="justify-center mb-5">
    <v-avatar size="70px">
      <!-- チーム画像 -->
      <template v-if="circlePhotoURL">
        <LoadingImg v-if="circlePhotoURL" :src="circlePhotoURL" width="70" height="70" />
      </template>
      <v-icon v-else class="blue--grey darken-1">mdi-account-outline</v-icon>
    </v-avatar>
    <h2 class="blue--grey--text darken-1 font-italic mt-3 ml-2">{{ circleName }}</h2>
    <!-- チーム編集・削除選択リスト -->
    <EditCircleList class="mt-3" />
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('modules/circle', ['circleName', 'circlePhotoURL'])
  }
}
</script>
