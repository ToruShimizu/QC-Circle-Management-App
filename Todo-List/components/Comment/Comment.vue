<template>
  <v-list subheader>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-icon v-if="photoURL">
          <v-avatar size="50">
            <img :src="photoURL" />
          </v-avatar>
        </v-list-item-icon>
        <v-list-item-title> {{ userName }}さんがコメントしました</v-list-item-title>
        <v-list-item-title> {{ commentCreateTime }}</v-list-item-title>
        <v-layout>
          <v-text-field v-model="comment.message" />
          <v-btn icon @click="removeComment(comment)">
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </v-layout>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import moment from 'moment'

export default {
  props: {
    comment: {
      type: Object
    }
  },
  computed: {
    commentCreateTime(comment) {
      return moment(this.comment.created.toDate()).format('YYYY年MM月DD日 HH時mm分ss秒')
    },
    ...mapState('modules/todos', ['comments']),
    ...mapGetters('modules/auth', ['userName', 'photoURL', 'userEmail'])
  },
  methods: {
    removeComment(comment) {
      if (!confirm('Are you sure?')) return
      this.$store.dispatch('modules/todos/removeComment', { id: comment.id })
    },
    ...mapActions('modules/todos', ['fetchComments'])
  }
}
</script>
