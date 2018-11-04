<template>
  <v-card>
    <v-toolbar
      light
      card
      style="background-color: #ffd700"
    >
      <h3>ADD CHARACTER CLASS</h3>
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('close')">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <h3></h3>
      <v-autocomplete
        label="Class"
        :items="availableClasses"
        v-model="className"
      />
      <v-autocomplete
        label="Sub Class"
        :items="subClasses"
        v-model="subClassName"
      />
      <v-autocomplete
        label="Level"
        :items="levels"
        v-model="level"
      />
    </v-card-text>
    <v-layout justify-end pb-1>
      <v-btn
        flat
        color="primary"
        :disabled="!valid"
        @click="$emit('ok', { character, className, subClassName, level })"
      >ADD</v-btn>
    </v-layout>
  </v-card>
</template>

<script>
import { classes } from '../common/constants'
import { oneToN } from '../common/functions'

export default {
  props: ['character'],

  computed: {
    availableClasses() {
      const existingClassNames = this.character.classes.map(c => c.name)
      return classes.filter(c => !existingClassNames.includes(c))
    },

    // will rely on a map between class and subclass
    subClasses() {
      return ['subclass1', 'subclass2']
    },

    valid() {
      return this.className !== '' && this.subClassName !== ''
    },
  },

  data() {
    return {
      classes,
      className: '',
      subClassName: '',
      level: 1,
      levels: oneToN(20),
    }
  },
}
</script>

<style>
</style>
