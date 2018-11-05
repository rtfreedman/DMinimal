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
        spellcheck="false"
      />
      <v-autocomplete
        label="Sub Class"
        :items="subClasses"
        v-model="subClassName"
        spellcheck="false"
      />
      <v-autocomplete
        label="Level"
        :items="levels"
        v-model="level"
      />
    </v-card-text>
    <v-layout justify-end pb-1>
      <v-btn
        v-if="!isEdit"
        flat
        color="primary"
        :disabled="!valid"
        @click="$emit('add', { character, className, subClassName, level })"
      >ADD</v-btn>
      <v-btn
        v-else
        flat
        color="primary"
        :disabled="!valid"
        @click="$emit('update', { character, existingClassName, className, subClassName, level })"
      >UPDATE</v-btn>
    </v-layout>
  </v-card>
</template>

<script>
import { classes, subClassMap } from '../common/constants'
import { oneToN } from '../common/functions'

export default {
  props: ['character', 'characterClass'],

  computed: {
    availableClasses() {
      const existingClassNames = this.character.classes.map(c => c.className)
      const unusedClasses = classes.filter(c => !existingClassNames.includes(c))
      if (this.isEdit) {
        return unusedClasses.concat(this.className)
      } else {
        return unusedClasses
      }
    },

    // will rely on a map between class and subclass
    subClasses() {
      return subClassMap[this.className]
    },

    valid() {
      return this.className !== ''
    },
  },

  data() {
    return {
      classes,
      className: '',
      existingClassName: '',
      subClassName: '',
      level: 1,
      levels: oneToN(20),
      isEdit: false,
    }
  },

  watch: {
    characterClass(state) {
      if (state) {
        this.className = state.className
        this.existingClassName = state.className
        this.subClassName = state.subClassName
        this.level = state.level
        this.isEdit = true
      } else {
        this.className = ''
        this.subClassName = ''
        this.level = 1
      }
    },
  },
}
</script>

<style>
</style>
