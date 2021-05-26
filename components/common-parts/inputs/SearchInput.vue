<template>
  <div class="search-input">
    <v-combobox
      :search-input="value"
      :placeholder="$attrs.placeholder || label"
      :disabled="$attrs.disabled"
      :items="items"
      :rules="rules"
      outlined
      :clearable="clearable"
      dense
      color="grey600"
      background-color="white"
      :prepend-inner-icon="hideIcon ? '' : 'mdi-magnify'"
      @update:search-input="$emit('update', $event)"
    />
  </div>
</template>

<script>
export default {
  name: 'SearchInput',
  model: {
    prop: 'value',
    event: 'update'
  },
  props: {
    value: {
      type: String,
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
    hideIcon: {
      type: Boolean,
      required: false
    },
    items: {
      type: Array,
      default: () => []
    },
    rules: {
      type: Array,
      default: () => []
    },
    clearable: {
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
</style>
