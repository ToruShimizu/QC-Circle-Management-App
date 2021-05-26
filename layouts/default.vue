<template>
  <v-app :style="{ background: $vuetify.theme.themes.dark.mainBackground }">
    <TheHeader />
    <transition name="page">
      <v-main>
        <nuxt />
      </v-main>
    </transition>
    <DoneSnackbar />
    <v-footer color="#051e34" fixed>
      <span class="grey--text text--lighten-2">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'LayoutsDefault'
}
</script>

<style>
a {
  text-decoration: none;
}
html {
  height: 100%;
  background: #f5f5f5;
}
.page-enter {
  opacity: 0;
}
.page-enter-active {
  transition: opacity 1s;
}
</style>
