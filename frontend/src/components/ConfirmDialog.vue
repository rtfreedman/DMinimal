<template>
  <v-dialog
    v-model="showDialog"
    max-width="400px"
  >
    <v-card>
      <v-toolbar light card style="background-color: #ffd700">
        <slot name="title">CONFIRM ACTION</slot>
      </v-toolbar>
      <v-card-text>
        <slot name="text">Are you sure?</slot>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn flat @click="showDialog = false">
          <slot name="cancel">Cancel</slot>
        </v-btn>
        <v-btn
          :color="okColor || 'primary'"
          flat
          @click.stop="handleOk"
        >
          <slot name="ok"></slot>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['show', 'okColor', 'context'],

  data() {
    return {
      showDialog: false,
    }
  },

  methods: {
    handleOk() {
      this.$emit('ok', this.context)
      this.showDialog = false
    },
  },

  watch: {
    show(state) {
      this.showDialog = state
    },

    showDialog(state) {
      if (!state) {
        this.$emit('close')
      }
    },
  },
}
</script>
