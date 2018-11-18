<template>
  <v-layout column style="max-width: 150px">
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
        <v-text-field
          class="hp"
          solo
          flat
          height="10px"
          :value="character.hitPoints"
          v-model="localHitPoints"
          type="number"
        />
      </v-layout>
    </v-layout>
    <!-- dialog -->
    <v-dialog v-model="showHitPointDialog" max-width="500">
      <v-card>
        <v-card-title>
          <h2>Health</h2>
        </v-card-title>
        <v-card-text>
          <v-layout align-center justify-center fill-height>
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
                v-model="localHitPoints"
              />
            </v-flex>
          </v-layout>
          <v-layout align-center justify-space-between>
            <h3>Maximum Health :</h3>
            <v-flex xs2>
              <v-text-field
                single-line
                reverse
                :rules="[mustBeNum, minNum]"
                label="Max HP"
                v-model="localMaxHitPoints"
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
import { rollNdS } from '../common/functions'

export default {
  props: ['character'],

  data() {
    return {
      offset: '0',
      showHitPointDialog: false,
    }
  },
  computed: {
    localHitPoints: {
      get() {
        return this.character.hitPoints
      },
      set(value) {
        if (parseInt(value) > parseInt(this.character.maxHitPoints)) {
          value = this.character.maxHitPoints
        }
        if (value < 0) {
          value = 0
        }
        this.$store.commit('MUTATE_CHARACTER', {
          character: this.character,
          method: 'setHealth',
          args: [value],
        })
      },
    },
    localMaxHitPoints: {
      get() {
        return this.character.maxHitPoints
      },
      set(value) {
        this.$store.commit('MUTATE_CHARACTER', {
          character: this.character,
          method: 'setMaxHealth',
          args: [value],
        })
      },
    },
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
          const dice =
            hitDice[this.character.classes[c].className.split(' ')[0]]
          if (firstLevel) {
            // take max health for first level
            value = dice
            firstLevel = false
          } else if (roll) {
            value = rollNdS(1, dice)
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

      if (this.localHitPoints <= 0 && this.character.deathThrows == 3) {
        this.$store.commit('showSnackbar', {
          color: 'black',
          message: 'You cannot heal death',
          func: this.resurrect,
          buttonMessage: 'Resurrect?',
        })
        return
      }
      this.localHitPoints += parseInt(this.offset)
    },

    hurt() {
      if (
        isNaN(parseInt(this.localHitPoints)) ||
        isNaN(parseInt(this.offset))
      ) {
        return
      }
      if (parseInt(this.offset) === 0) {
        return
      }
      if (this.localHitPoints <= 0 && this.deathThrows < 3) {
        this.$store.commit('MUTATE_CHARACTER', {
          character: this.character,
          method: 'dying',
          args: [],
        })
        return
      }
      let newHP = parseInt(this.localHitPoints) - parseInt(this.offset)
      if (
        parseInt(this.offset) >=
        parseInt(this.localHitPoints) + parseInt(this.localMaxHitPoints)
      ) {
        this.$store.commit('MUTATE_CHARACTER', {
          character: this.character,
          method: 'die',
          args: [],
        })
        newHP = 0
      }
      this.localHitPoints = newHP
    },

    lessThanOrEqualToMax(val) {
      if (parseInt(val) > this.localMaxHitPoints) {
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
      this.$store.commit('MUTATE_CHARACTER', {
        character: this.character,
        method: 'setHealth',
        args: [1],
      })
      this.$store.commit('hideSnackbar')
    },
  },
}
</script>


<style lang="css" scoped>
.hp {
  margin-top: 28px;
  font-size: 2em;
  font-weight: bold;
}
</style>
