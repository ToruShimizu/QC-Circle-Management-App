<template>
  <AppDialog title="コメント" :is-opened="isOpened" class="add-comment-dialog" @close="$emit('close', false)">
    <v-divider />

    <!-- コメント表示 -->
    <v-row class="mx-2">
      <v-col cols="12">
        <div v-for="comment in planContents.comments" :key="comment.id">
          <v-card class="mx-auto my-2" width="100%" elevation="3">
            <v-card-title class="pa-0 ml-1 mt-1">
              <v-icon small> mdi-comment-text-outline </v-icon>
              <!-- コメント作成日時 -->
              <span class="text-subtitle-2 font-weight-light ml-2">{{ comment.created }}</span>
            </v-card-title>
            <!-- コメント -->
            <v-card-title class="text-body-1 font-weight-bold  mt-2"> "{{ comment.message }}" </v-card-title>
            <v-card-actions class="py-0">
              <!-- ユーザー画像 -->
              <v-avatar max-width="50" max-height="50">
                <v-img v-if="photoURL" :src="photoURL" :lazy-src="photoURL">
                  <template #placeholder>
                    <v-row class="ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
                <!-- ユーザー画像がない場合 -->
                <v-icon v-else>mdi-account-outline</v-icon>
              </v-avatar>
              <!-- ユーザーネーム -->
              <span>{{ gettersUsername }}</span> <v-spacer />
              <v-btn icon @click="runRemoveComment(comment)">
                <v-icon>mdi-delete-outline</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </div>
      </v-col>
    </v-row>
    <template slot="buttons">
      <!-- コメント入力 -->
      <v-col cols="9">
        <TextInput v-model="message" icon="mdi-message-text-outline" label="コメントを追加する" />
      </v-col>
      <v-col cols="3">
        <AppButton class="ml-3 mb-6" :disabled="!message" @click="runAddComment">追加する </AppButton>
      </v-col>
    </template>
  </AppDialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AddCommentDialog',
  model: {
    prop: 'isOpened',
    event: 'close'
  },
  props: {
    isOpened: {
      type: Boolean,
      default: false
    },
    planContents: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      message: ''
    }
  },
  computed: {
    ...mapGetters('modules/user/auth', ['gettersUserName', 'photoURL'])
  },
  watch: {
    isOpened() {
      if (!this.isOpened) {
        this.message = ''
      }
    }
  },
  methods: {
    // コメント追加
    runAddComment() {
      this.addComment({
        id: this.planContents.id,
        message: this.message
      })
      this.message = ''
    },
    // コメント削除
    runRemoveComment(comment) {
      if (!confirm(comment.message + 'を削除しますか?')) return
      this.removeComment(comment)
    },
    ...mapActions('modules/activity-plans/activityPlans', ['addComment', 'removeComment'])
  }
}
</script>
