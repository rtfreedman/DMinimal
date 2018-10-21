<template>
  <v-snackbar :color="snackbarColor" v-model="show" :timeout="3000">
    <h3>{{snackbarMessage}}</h3>
    <v-btn
      v-if="typeof snackbarButtonFunction === 'function'"
      flat
      @click="snackbarButtonFunction"
    >{{snackbarButtonMessage}}</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  computed: {
    snackbar() {
      return this.$store.state.snackbar
    },
    show: {
      get() {
        return this.snackbar.show
      },
      set() {
        this.$store.commit('hideSnackbar')
      },
    },
    snackbarMessage() {
      return this.snackbar.message
    },
    snackbarColor() {
      return this.snackbar.color
    },
    snackbarButtonMessage() {
      return this.snackbar.buttonMessage
    },
    snackbarButtonFunction() {
      return this.snackbar.buttonFunction
    },
  },
}
</script>
