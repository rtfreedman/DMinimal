<template>
  <v-card>
    <v-toolbar light card style="background-color: #ffd700">
      <h3>SHORT REST</h3>
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('close')">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <p>A short rest is a period of downtime, at least 1 hour long, during which a character does nothing more strenuous than eating, drinking, reading, and tending to wounds. A character can spend one or more hit dice at the end of a short rest, up to the character’s maximum number of hit dice, which is equal to the character’s level. For each hit die spent in this way, the player rolls the die and adds the character’s constitution modifier to it. The character regains hit points equal to the total. The player can decide to spend an additional hit die after each roll. A player may regain up to half their spent hit dice following a long rest.</p>
      <v-layout justify-space-between>
        <v-flex xs5>
          <h3>AVAILABLE HIT DICE</h3>
          <v-layout
            v-if="availableHitDice.length"
            class="border-primary"
            pa-3
            :wrap="true"
          >
            <v-chip
              v-for="(die, i) in availableHitDice"
              :key="`${die.className}_${die.level}`"
              @click="spendHitDie(i)"
              small
              color="primary"
            >{{ `${die.className}: d${die.value}` }}</v-chip>
          </v-layout>
          <v-layout class="border-primary" v-else pa-3>
            <i style="height: 32px">No more dice...</i>
          </v-layout>
        </v-flex>
        <v-flex v-if="hitDiceToSpend.length" xs5>
          <h3>DICE TO SPEND ON THIS REST</h3>
          <v-layout
            class="border-primary"
            pa-3
            :wrap="true"
          >
            <v-chip
              v-for="(die, i) in hitDiceToSpend"
              :key="`${die.className}_${die.level}`"
              close
              small
              @input="restoreDie(i)"
              color="light-gray"
            >{{ `${die.className}: d${die.value}` }}</v-chip>
          </v-layout>
        </v-flex>
      </v-layout>
      <v-layout justify-space-between mt-3>
        <v-spacer></v-spacer>
        <v-flex xs5>
          <v-autocomplete
            v-if="maxRecoveryHitPoints"
            label="Restored Hit Points"
            :items="recoveryHitPointOptions"
            v-model="recoveryHitPoints"
            style="max-width: 240px"
            persistent-hint
            :hint="`Possible range: ${minRecoveryHitPoints} - ${maxRecoveryHitPoints}`"
          />
        </v-flex>
      </v-layout>
      <v-card-actions>
        <v-layout justify-end pb-1>
          <v-btn
            flat
            color="primary"
            :disabled="!recoveryHitPoints"
            @click="shortRest"
          >SPEND DICE</v-btn>
        </v-layout>
      </v-card-actions>
      <template v-if="previouslySpentHitDice.length">
        <v-divider class="mb-3"/>
        <h3>PREVIOUSLY SPENT HIT DICE</h3>
        <v-layout :wrap="true" class="border-white" pa-3>
          <v-chip
            v-for="die in previouslySpentHitDice"
            :key="`${die.className}_${die.level}`"
            color="light-gray"
            outline
            disabled
          >{{ `${die.className}: d${die.value}` }}</v-chip>
        </v-layout>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import { oneToN } from '@/common/functions'

export default {
  props: ['character'],

  computed: {
    recoveryHitPointOptions() {
      return oneToN(this.maxRecoveryHitPoints).slice(
        this.minRecoveryHitPoints - 1,
      )
    },
  },

  data() {
    return {
      availableHitDice: this.character.getHitDice().filter(d => !d.spent),
      previouslySpentHitDice: this.character.getHitDice().filter(d => d.spent),
      recoveryHitPoints: null,
      hitDiceToSpend: [],
      minRecoveryHitPoints: 0,
      maxRecoveryHitPoints: 0,
    }
  },

  methods: {
    ...mapActions(['characterAction']),

    spendHitDie(index) {
      const die = this.availableHitDice.splice(index, 1)[0]
      this.hitDiceToSpend.push(die)
      this.minRecoveryHitPoints += 1 + this.character.getModifier('CON')
      this.maxRecoveryHitPoints += die.value + this.character.getModifier('CON')
    },

    restoreDie(index) {
      const die = this.hitDiceToSpend.splice(index, 1)[0]
      this.availableHitDice.push(die)
      this.minRecoveryHitPoints -= 1 + this.character.getModifier('CON')
      this.maxRecoveryHitPoints -= die.value + this.character.getModifier('CON')
    },

    shortRest() {
      this.characterAction({
        character: this.character,
        method: 'shortRest',
        args: [this.recoveryHitPoints, this.hitDiceToSpend],
      })
      this.$emit('close')
    },
  },
}
</script>

<style scoped>
</style>
