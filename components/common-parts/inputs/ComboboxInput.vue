<template>
  <v-combobox
    :value="value"
    :placeholder="$attrs.placeholder || label"
    :prepend-inner-icon="hideIcon ? '' : icon"
    :items="items"
    :rules="rules"
    :label="label"
    dense
    outlined
    :multiple="multiple"
    @input="$emit('input', $event)"
  />
</template>

<script>
export default {
  name: 'ComboboxInput',
  props: {
    value: {
      type: [String, Array],
      default: ''
    },
    items: {
      type: Array,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    rules: {
      type: Array,
      default: () => []
    },
    icon: {
      type: String,
      default: 'mdi-pencil-outline'
    },
    hideIcon: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    }
  }
}
</script>
