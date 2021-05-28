<template>
  <v-img
    v-if="src"
    :src="src"
    :lazy-src="src"
    aspect-ratio="1"
    class="grey lighten-2"
    :max-width="width"
    :max-height="height"
    @click="$emit('remove')"
  >
    <template #placeholder>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
      </v-row>
    </template>
  </v-img>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '200'
    }
  }
}
</script>
