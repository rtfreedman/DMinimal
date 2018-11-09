<template>
  <v-card>
    <v-toolbar
      light
      card
      style="background-color: #ffd700"
    >
      <h3>NEW Monster</h3>
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('close')">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <h3>What are we throwing at the party this time?</h3>
      <v-autocomplete
        label="Monster"
        :items="monsterOptions"
        style="max-width: 500px"
        @input="handleSelect"
      />
      <!-- @keyup.enter="name ? $emit('addCharacter', name) : () => {}" -->
    </v-card-text>

  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['monsters', 'monsterOptions']),
  },
  data() {
    return {
      name: '',
    }
  },
  methods: {
    handleSelect() {
      // TODO
    },
  },
}
</script>
