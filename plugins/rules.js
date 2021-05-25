export default ({ app }, inject) => {
  const rules = {
    username: [v => !!v || app.i18n.t('validationMessages.required', { name: '名前' })],
    email: [
      v => !!v || app.i18n.t('validationMessages.required', { name: 'メールアドレス' }),
      v => /.+@.+\..+/.test(v) || app.i18n.t('validationMessages.email')
    ],
    password: [
      v => !!v || app.i18n.t('validationMessages.required', { name: 'パスワード' }),
      v => !v || v.length >= 6 || app.i18n.t('validationMessages.moreThan', { num: 6 })
    ],
    name: [v => !!v || app.i18n.t('validationMessages.required', { name: '名前' })],
    category: [v => !!v || app.i18n.t('validationMessages.required', { name: 'やること' })],
    role: [v => !!v || app.i18n.t('validationMessages.required', { name: '役割' })],
    detail: [v => !!v || app.i18n.t('validationMessages.required', { name: '詳細' })],
    improvementRoles: [v => !!v || app.i18n.t('validationMessages.required', { name: '改善担当' })]
  }
  inject('rules', rules)
}
