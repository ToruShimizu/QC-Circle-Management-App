<template>
  <div class="text-input">
    <v-text-field
      :value="value"
      :placeholder="$attrs.placeholder || label"
      :disabled="disabled"
      :type="$attrs.type"
      :rules="rules"
      :suffix="$attrs.suffix"
      v-bind="$attrs"
      :clearable="clearable"
      :error="error"
      :error-messages="errorMessages"
      dense
      color="grey600"
      background-color="white"
      outlined
      :prepend-inner-icon="hideIcon ? '' : icon"
      @keydown.enter.prevent
      @input="$emit('input', $event)"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: 'TextInput',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    },
    clearable: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    errorMessages: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    hideIcon: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.v-input {
  font-size: 0.875rem;
}
.text-input >>> .v-input__slot {
  padding: 0 12px;
}
.disabled-text {
  opacity: 0.5;
}
</style>
