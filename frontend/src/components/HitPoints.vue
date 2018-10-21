<template>
  <div>
    <v-btn @click="hitpointDialog=true" round flat>
      <v-layout justify-space-around align-center>
        <v-icon>mdi-heart</v-icon>
        <span>{{hitpoints}} / {{maxHitpoints}}</span>
      </v-layout>
    </v-btn>
    <!-- Hit Point Counter md-heart -->
    <!-- Hit Point Roll md-refresh -->
    <!-- Receive Attack Dialog md-sword -->
    <v-dialog v-model="hitpointDialog" max-width="500">
      <v-card>
        <v-card-title>
          <h2>Health</h2>
        </v-card-title>
        <v-card-text>
          <v-layout align-center justify-center row fill-height>
            <v-tooltip top>
              <!-- TODO Replace with broken shield icon -->
              <v-btn large icon flat slot="activator" @click="hurt">
                <v-icon>mdi-sword</v-icon>
              </v-btn>
              <span>Take Damage</span>
            </v-tooltip>
            <v-flex xs1>
              <v-text-field single-line :rules="[mustBeNum, minNum]" v-model="offset"/>
            </v-flex>
            <v-tooltip top>
              <v-btn large icon flat slot="activator" @click="heal">
                <v-icon>mdi-medical-bag</v-icon>
              </v-btn>
              <span>Heal</span>
            </v-tooltip>
          </v-layout>
        </v-card-text>
        <v-card-text>
          <v-layout align-center justify-space-between row fill-height>
            <h3>Current Health :</h3>
            <v-flex xs2>
              <v-text-field
                single-line
                reverse
                :rules="[lessThanOrEqualToMax, mustBeNum, minNum]"
                label="HP"
                v-model="hitpoints"
              />
            </v-flex>
          </v-layout>
          <v-layout align-center justify-space-between row>
            <h3>Maximum Health :</h3>
            <v-flex xs2>
              <v-text-field
                single-line
                reverse
                :rules="[mustBeNum, minNum]"
                label="Max HP"
                v-model="maxHitpoints"
              />
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-text>
          <v-layout justify-end row>
            <v-tooltip top>
              <v-btn icon flat slot="activator" @click="getHealth(true)">
                <v-icon>mdi-dice-multiple</v-icon>
              </v-btn>
              <span>Roll Health</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn icon flat slot="activator" @click="getHealth(false)">
                <v-icon>mdi-heart-half-full</v-icon>
              </v-btn>
              <span>Take Avg for Health</span>
            </v-tooltip>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['charIndex'],
  mounted() {
    this.getHealth(false)
    this.offset = this.maxHitpoints
    this.heal()
    this.offset = '0'
  },
  computed: {
    character() {
      return this.$store.state.characters[this.charIndex]
    },
    deathThrows() {
      return this.character.deathThrows
    },
    hitDice() {
      return this.$store.state.hitDice
    },
    hitpoints: {
      get() {
        return this.character.hitpoints
      },
      set(val) {
        if (isNaN(parseInt(val))) {
          return
        }
        this.$store.commit('setHP', {
          charIndex: this.charIndex,
          hitpoints: parseInt(val),
        })
      },
    },
    maxHitpoints: {
      get() {
        return this.character.maxHitpoints
      },
      set(val) {
        if (isNaN(parseInt(val))) {
          return
        }
        this.$store.commit('setMaxHP', {
          charIndex: this.charIndex,
          hitpoints: parseInt(val),
        })
      },
    },
    rollHealth: {
      get() {
        // unused
        return this.character.rollHealth
      },
      set(val) {
        this.$store.commit('setRollState', {
          charIndex: this.charIndex,
          rollHealth: val,
        })
      },
    },
  },
  data() {
    return {
      offset: '0',
      hitpointDialog: false,
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
          const dice = this.hitDice[
            this.character.classes[c].classname.split(' ')[0]
          ]
          if (firstLevel) {
            // take max health for first level
            value = dice
            firstLevel = false
          } else if (roll) {
            value = Math.floor(Math.random() * (dice - 1)) + 1
          } else {
            value = Math.ceil(dice / 2)
          }
          totalHealth += value
        }
      }
      this.maxHitpoints = totalHealth
      if (this.hitpoints > this.maxHitpoints) {
        this.hitpoints = this.maxHitpoints
      }
      // used to set health on level up (not sure what to do on decrease...)
      this.rollHealth = roll
    },
    heal() {
      if (isNaN(parseInt(this.hitpoints)) || isNaN(parseInt(this.offset))) {
        return
      }
      if (parseInt(this.offset) === 0) {
        return
      }
      if (this.hitpoints <= 0 && this.deathThrows === 3) {
        this.$store.commit('showSnackbar', {
          color: 'black',
          message: 'You cannot heal death',
          func: this.resurrect,
          buttonMessage: 'Resurrect?',
        })
        return
      }
      this.$store.commit('setHP', {
        charIndex: this.charIndex,
        hitpoints: parseInt(this.hitpoints) + parseInt(this.offset),
      })
    },
    hurt() {
      if (isNaN(parseInt(this.hitpoints)) || isNaN(parseInt(this.offset))) {
        return
      }
      if (parseInt(this.offset) === 0) {
        return
      }
      if (this.hitpoints <= 0 && this.deathThrows < 3) {
        this.$store.commit('setDeathThrows', {
          charIndex: this.charIndex,
          throwVal: this.deathThrows + 1,
        })
        return
      }
      let newHP = parseInt(this.hitpoints) - parseInt(this.offset)
      if (
        parseInt(this.offset) >=
        parseInt(this.hitpoints) + parseInt(this.maxHitpoints)
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
      if (parseInt(val) > this.maxHitpoints) {
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
