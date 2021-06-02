<template>
  <div>
    <v-file-input
      :value="file"
      accept="image/*"
      :placeholder="$attrs.placeholder || label"
      :truncate-length="15"
      show-size
      outlined
      dense
      :prepend-icon="null"
      prepend-inner-icon="mdi-file-image-outline"
      @change="$emit('change', $event)"
    >
      <template #selection="{ text }">
        <v-chip small label color="blue darken-1" class="font-italic white--text">
          <span>
            {{ text }}
          </span>
        </v-chip>
      </template>
    </v-file-input>
  </div>
</template>

<script>
export default {
  name: 'FileInput',
  model: {
    prop: 'file',
    event: 'change'
  },
  props: {
    file: {
      type: File,
      default: null
    },
    label: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: false
    }
  }
}
</script>
