<template>
  <v-snackbar
    :color="snackbar.color"
    v-model="snackbar.show"
    :timeout="3000"
  >
    <h3>{{ snackbar.message }}</h3>
    <v-btn
      v-if="typeof snackbar.buttonFunction === 'function'"
      flat
      @click="snackbar.buttonFunction"
    >{{ snackbar.buttonMessage }}</v-btn>
  </v-snackbar>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['snackbar']),

    hasAction() {
      return !!this.snackbar.buttonFunction
    },
  },
}
</script>
