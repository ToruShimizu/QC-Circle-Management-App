<template>
  <v-btn
    class="app-button font-weight-bold"
    :class="{ 'white--text': !outlined, 'bg-white-btn ': outlined }"
    :outlined="outlined"
    :height="height"
    :width="width"
    :color="color"
    :disabled="disabled"
    :loading="loading"
    :icon="icon"
    :text="text"
    :nuxt="nuxt"
    :to="to"
    depressed
    @click="$emit('click')"
  >
    <slot v-if="!loading" />
  </v-btn>
</template>
<script>
export default {
  name: 'AppButton',

  props: {
    height: {
      type: String,
      default: '36px'
    },
    width: {
      type: String,
      default: '95px'
    },
    color: {
      type: String,
      default: 'accent'
    },
    outlined: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    icon: {
      type: Boolean,
      default: false
    },
    text: {
      type: Boolean,
      default: false
    },
    nuxt: {
      type: Boolean,
      default: false
    },
    to: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.app-btn {
  border-radius: 10px;
}
.bg-white-btn {
  background-color: white;
}
</style>
