<template>
  <v-snackbar v-model="snackbar" color="grey darken-3" :top="true">
    <div class="text-center">
      <v-icon color="cyan accent-2">mdi-check-circle </v-icon>
      <span class="font-italic white--text">{{ title }}</span>
    </div>
  </v-snackbar>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'DoneSnackbar',
  data() {
    return {
      title: 'successful!'
    }
  },
  computed: {
    ...mapState('modules/commonParts', ['snackbar'])
  },
  watch: {
    snackbar() {
      setTimeout(() => {
        this.closeSnackbar()
      }, 2000)
    }
  },
  methods: {
    ...mapMutations('modules/commonParts', ['closeSnackbar'])
  }
}
</script>
