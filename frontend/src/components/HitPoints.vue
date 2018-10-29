<template>
  <v-layout column mx-3 style="max-width: 150px">
    <v-layout align-center>
      <h3>HIT POINTS</h3>
      <v-tooltip bottom>
        <v-btn
          icon
          flat
          slot="activator"
          color="primary"
          @click="showHitPointDialog = true"
        >
          <v-icon small>mdi-heart</v-icon>
        </v-btn>
        <span>ADJUST HIT POINTS</span>
      </v-tooltip>
    </v-layout>
    <v-layout
      column
      class="border-primary"
      style="height: 50px; max-width: 120px"
    >
      <v-layout justify-center align-center>
        <h1>{{ character.hitPoints }}</h1>
        <h4
          class="mx-1"
          style="margin-top: 8px"
        >/ {{ character.maxHitPoints }}</h4>
      </v-layout>
    </v-layout>
    <!-- dialog -->
    <v-dialog
      v-model="showHitPointDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title>
          <h2>Health</h2>
        </v-card-title>
        <v-card-text>
          <v-layout
            align-center
            justify-center
            fill-height
          >
            <v-tooltip top>
              <!-- TODO Replace with broken shield icon -->
              <v-btn
                large
                icon
                flat
                slot="activator"
                @click="hurt"
              >
                <v-icon>mdi-sword</v-icon>
              </v-btn>
              <span>Take Damage</span>
            </v-tooltip>
            <v-flex xs1>
              <v-text-field
                single-line
                :rules="[mustBeNum, minNum]"
                v-model="offset"
              />
            </v-flex>
            <v-tooltip top>
              <v-btn
                large
                icon
                flat
                slot="activator"
                @click="heal"
              >
                <v-icon>mdi-medical-bag</v-icon>
              </v-btn>
              <span>Heal</span>
            </v-tooltip>
          </v-layout>
        </v-card-text>
        <v-card-text>
          <v-layout
            align-center
            justify-space-between
            fill-height
          >
            <h3>Current Health :</h3>
            <v-flex xs2>
              <v-text-field
                single-line
                reverse
                :rules="[lessThanOrEqualToMax, mustBeNum, minNum]"
                label="HP"
                v-model="character.hitPoints"
              />
            </v-flex>
          </v-layout>
          <v-layout
            align-center
            justify-space-between
          >
            <h3>Maximum Health :</h3>
            <v-flex xs2>
              <v-text-field
                single-line
                reverse
                :rules="[mustBeNum, minNum]"
                label="Max HP"
                v-model="character.maxHitPoints"
              />
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-text>
          <v-layout justify-end>
            <v-tooltip top>
              <v-btn
                icon
                flat
                slot="activator"
                @click="getHealth(true)"
              >
                <v-icon>mdi-dice-multiple</v-icon>
              </v-btn>
              <span>Roll Health</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn
                icon
                flat
                slot="activator"
                @click="getHealth(false)"
              >
                <v-icon>mdi-heart-half-full</v-icon>
              </v-btn>
              <span>Take Avg for Health</span>
            </v-tooltip>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { hitDice } from '../common/constants'
import { roll } from '../common/functions'

export default {
  props: ['character'],

  data() {
    return {
      localHitPoints: this.character.hitPoints,
      offset: '0',
      showHitPointDialog: false,
    }
  },

  methods: {
    getHealth(roll) {
      if (this.character.classes.length === 0) {
        return
      }
      let totalHealth = 0
      let firstLevel = true
      const constitutionOffset = Math.floor(
        (this.character.abilityScores.CON - 10) / 2,
      )
      for (let c = 0; c < this.character.classes.length; c++) {
        for (let l = 0; l < this.character.classes[c].level; l++) {
          totalHealth += constitutionOffset
          let value = 0
          const dice = hitDice[this.character.classes[c].name.split(' ')[0]]
          if (firstLevel) {
            // take max health for first level
            value = dice
            firstLevel = false
          } else if (roll) {
            value = roll(dice)
          } else {
            value = Math.ceil(dice / 2)
          }
          totalHealth += value
        }
      }
      this.character.maxHitPoints = totalHealth
      if (this.character.hitPoints > this.maxHitPoints) {
        this.hitPoints = this.maxHitPoints
      }
      // used to set health on level up (not sure what to do on decrease...)
      this.rollHealth = roll
    },

    heal() {
      if (
        isNaN(parseInt(this.character.hitPoints)) ||
        isNaN(parseInt(this.offset))
      ) {
        return
      }

      if (parseInt(this.offset) === 0) {
        return
      }

      if (this.hitPoints <= 0 && this.deathThrows === 3) {
        this.$store.commit('showSnackbar', {
          color: 'black',
          message: 'You cannot heal death',
          func: this.resurrect,
          buttonMessage: 'Resurrect?',
        })
        return
      }

      this.character.hitPoints = this.$store.commit('setHP', {
        charIndex: this.charIndex,
        hitpoints: parseInt(this.hitPoints) + parseInt(this.offset),
      })
    },
    hurt() {
      if (isNaN(parseInt(this.hitPoints)) || isNaN(parseInt(this.offset))) {
        return
      }
      if (parseInt(this.offset) === 0) {
        return
      }
      if (this.hitPoints <= 0 && this.deathThrows < 3) {
        this.$store.commit('setDeathThrows', {
          charIndex: this.charIndex,
          throwVal: this.deathThrows + 1,
        })
        return
      }
      let newHP = parseInt(this.hitPoints) - parseInt(this.offset)
      if (
        parseInt(this.offset) >=
        parseInt(this.hitPoints) + parseInt(this.maxHitPoints)
      ) {
        this.$store.commit('setDeathThrows', {
          charIndex: this.charIndex,
          throwVal: 3,
        })
        newHP = 0
      }
      this.$store.commit('setHP', {
        charIndex: this.charIndex,
        hitpoints: newHP,
      })
    },
    lessThanOrEqualToMax(val) {
      if (parseInt(val) > this.maxHitPoints) {
        return 'HP must be less than Max HP'
      }
      return true
    },
    mustBeNum(val) {
      if (typeof val === 'string' && val.toLowerCase().includes('e')) {
        return 'Scientific notation not allowed'
      }
      if (isNaN(parseInt(val))) {
        return 'Input is not a number'
      }
      return true
    },
    minNum(val) {
      if (parseInt(val) < 0) {
        return 'No negative numbers'
      }
      return true
    },
    resurrect() {
      this.$store.commit('setHP', {
        charIndex: this.charIndex,
        hitpoints: 1,
      })
      this.$store.commit('hideSnackbar')
    },
  },
}
</script>
