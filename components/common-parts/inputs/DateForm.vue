<template>
  <v-menu
    v-model="isOpenedDateMenu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="dateRangeText"
        prepend-inner-icon="mdi-calendar-today"
        placeholder="日付"
        readonly
        outlined
        dense
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker v-model="innerDate" no-title range>
      <v-spacer />
      <AppButton outlined @click="isOpenedDateMenu = false">閉じる </AppButton>
    </v-date-picker>
  </v-menu>
</template>

<script>
export default {
  props: {
    date: {
      type: Array,
      default: () => [new Date().toISOString().substr(0, 10)]
    },
    label: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isOpenedDateMenu: false
    }
  },

  computed: {
    innerDate: {
      get() {
        return this.date
      },
      set(date) {
        this.$emit('update:date', date)
      }
    },
    // 日付の配列を文字列に加工
    dateRangeText: {
      get() {
        return this.innerDate.join('~')
      },
      set(dateRangeText) {
        return dateRangeText
      }
    }
  }
}
</script>
