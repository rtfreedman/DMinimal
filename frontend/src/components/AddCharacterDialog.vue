<template>
  <v-card>
    <v-toolbar
      light
      card
      style="background-color: #ffd700"
    >
      <h3>NEW CHARACTER</h3>
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('close')">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <h3>Who do we have here?</h3>
      <v-text-field
        label="Name"
        v-model="name"
        autofocus
      />
    </v-card-text>
    <v-layout justify-end pb-1>
      <v-btn
        flat
        color="primary"
        :disabled="!name"
        @click="$emit('addCharacter', name)"
      >ADD</v-btn>
    </v-layout>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      name: '',
    }
  },
}
</script>

<style>
</style>
