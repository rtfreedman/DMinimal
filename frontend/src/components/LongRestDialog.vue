<template>
  <v-card>
    <v-toolbar light card style="background-color: #ffd700">
      <h3>LONG REST</h3>
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('close')">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <p>A long rest is a period of extended downtime, at least 8 hours long, during which a character sleeps or performs light activity: reading, talking, eating, or standing watch for no more than 2 hours. If the rest is interrupted by a period of strenuous activity: at least 1 hour of walking, fighting, casting spells, or similar adventuring activity, the character must begin the rest again to gain any benefit from it. At the end of a long rest, a character regains all lost hit points. The character also regains spent hit dice, up to a number of dice equal to half of the character’s total number of them (minimum of one die). For example, if a character has eight hit dice, he or she can regain four spent hit dice upon finishing a long rest. A character can’t benefit from more than one long rest in a 24-hour period, and a character must have at least 1 hit point at the start of the rest to gain its benefits.</p>
    </v-card-text>
    <v-card-actions>
      <v-layout justify-end pb-1>
        <v-btn
          flat
          color="primary"
          @click="longRest"
        >GRANT {{ character.name }} A LONG REST</v-btn>
      </v-layout>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: { character: Object },

  methods: {
    ...mapActions(['characterAction']),

    longRest() {
      this.characterAction({
        character: this.character,
        method: 'longRest',
        args: [],
      })
      this.$emit('close')
    },
  },
}
</script>

<style scoped>
</style>
