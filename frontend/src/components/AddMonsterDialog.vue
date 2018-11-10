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
    {{currentMonsterInfo}}
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters(['monsters', 'currentMonsterInfo', 'monsterOptions']),
  },
  data() {
    return {
      name: '',
    }
  },
  methods: {
    ...mapActions(['dispatchRetrieveMonsterInfo']),
    handleSelect(name) {
      this.dispatchRetrieveMonsterInfo({ name })
    },
  },
}
</script>
