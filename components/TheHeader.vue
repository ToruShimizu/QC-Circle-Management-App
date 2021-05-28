<template>
  <div>
    <v-navigation-drawer v-model="sideNavDrawer" app clipped hide-overlay color="blue-grey darken-4">
      <SideNav />
    </v-navigation-drawer>
    <v-app-bar color="#051e34" dark app clipped-left>
      <v-app-bar-nav-icon @click="sideNavDrawer = !sideNavDrawer"></v-app-bar-nav-icon>
      <nuxt-link to="/activityPlans" class="white--text">
        <v-toolbar-title>QC活動管理</v-toolbar-title>
      </nuxt-link>
      <v-btn v-if="$route.path === '/circle'" text nuxt to="/activityPlans" color="indigo darken-2">
        <v-icon color="white">mdi-arrow-left-bold-box-outline </v-icon>
      </v-btn>
      <v-spacer />
      <v-toolbar-items v-if="loginUser">
        <v-icon @click="logout"> mdi-account-arrow-right-outline </v-icon>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      sideNavDrawer: null
    }
  },
  computed: {
    ...mapState('modules/auth', ['loginUser'])
  },
  methods: {
    ...mapActions('modules/auth', ['logout'])
  }
}
</script>
