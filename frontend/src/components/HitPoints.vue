<template>
  <div>
    <v-btn @click="hitpointDialog=true" round flat><v-layout justify-space-around align-center><v-icon>mdi-heart</v-icon><span>{{hitpoints}} / {{maxHitpoints}}</span></v-layout></v-btn>
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
            <v-tooltip top> <!-- TODO Replace with broken shield icon -->
              <v-btn large icon flat slot="activator" @click="hurt"><v-icon>mdi-sword</v-icon></v-btn>
              <span>Take Damage</span>
            </v-tooltip>
            <v-flex xs1>
              <v-text-field
                single-line
                :rules="[mustBeNum, maxNum]"
                v-model="offset"
              />
            </v-flex>
            <v-tooltip top>
              <v-btn large icon flat slot="activator" @click="heal"><v-icon>mdi-medical-bag</v-icon></v-btn>
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
                :rules="[lessThanOrEqualToMax, mustBeNum, maxNum]"
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
                :rules="[mustBeNum, maxNum]"
                label="Max HP"
                v-model="maxHitpoints"
              />
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-text>
          <v-layout justify-end row>
            <v-tooltip top>
              <v-btn large icon flat slot="activator" @click="heal"><v-icon>mdi-medical-bag</v-icon></v-btn>
              <span>Heal</span>
            </v-tooltip>
            <v-tooltip top> <!-- TODO Replace with broken shield icon -->
              <v-btn large icon flat slot="activator" @click="hurt"><v-icon>mdi-sword</v-icon></v-btn>
              <span>Take Damage</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn icon flat slot="activator" @click="getHealth(true)"><v-icon>mdi-dice-multiple</v-icon></v-btn>
              <span>Roll Health</span>
            </v-tooltip>
            <v-tooltip top>
              <v-btn icon flat slot="activator" @click="getHealth(false)"><v-icon>mdi-heart-half-full</v-icon></v-btn>
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
  computed: {
    character () {
      return this.$store.state.characters[this.charIndex]
    },
    hitDice () {
      return this.$store.state.hitDice
    },
    hitpoints: {
      get () {
        return this.character.hitpoints
      },
      set (val) {
        if (isNaN(parseInt(val))) {
          return
        }
        this.$store.commit('setHP', {
          charIndex: this.charIndex,
          hitpoints: parseInt(val)
        })
      }
    },
    maxHitpoints: {
      get () {
        return this.character.maxHitpoints
      },
      set (val) {
        if (isNaN(parseInt(val))) {
          return
        }
        this.$store.commit('setMaxHP', {
          charIndex: this.charIndex,
          hitpoints: parseInt(val)
        })
      }
    },
    rollHealth: {
      get () { // unused
        return this.character.rollHealth
      },
      set (val) {
        this.$store.commit('setRollState', {
          charIndex: this.charIndex,
          rollHealth: val
        })
      }
    }
  },
  data () {
    return {
      offset: '0',
      hitpointDialog: false
    }
  },
  methods: {
    heal () {
      if (isNaN(parseInt(this.hitpoints)) || isNaN(parseInt(this.offset))) {
        return
      }
      this.$store.commit('setHP', {
        charIndex: this.charIndex,
        hitpoints: parseInt(this.hitpoints) + parseInt(this.offset)
      })
    },
    hurt () {
      if (isNaN(parseInt(this.hitpoints)) || isNaN(parseInt(this.offset))) {
        return
      }
      this.$store.commit('setHP', {
        charIndex: this.charIndex,
        hitpoints: parseInt(this.hitpoints) - parseInt(this.offset)
      })
    },
    lessThanOrEqualToMax (val) {
      if (parseInt(val) > this.maxHitpoints) {
        return 'HP must be less than Max HP'
      }
      return true
    },
    mustBeNum (val) {
      if (typeof val === 'string' && val.toLowerCase().includes('e')) {
        return 'Scientific notation not allowed'
      }
      if (isNaN(parseInt(val))) {
        return 'Input is not a number'
      }
      return true
    },
    maxNum (val) {
      if (parseInt(val) > 1000) {
        return 'Input too large'
      }
      return true
    },
    getHealth (roll) {
      if (this.character.classes.length === 0) {
        return
      }
      let hitDie = []
      let totalHealth = 0
      let firstLevel = true
      for (let c = 0; c < this.character.classes.length; c++) {
        for (let l = 0; l < this.character.classes[c].level; l++) {
          if (firstLevel) {
            // take max health for first level
            totalHealth += this.hitDice[this.character.classes[c].classname.split(' ')[0]]
            firstLevel = false
          } else {
            hitDie.push(this.hitDice[this.character.classes[c].classname.split(' ')[0]])
          }
        }
      }
      if (hitDie.length === 0) {
        this.maxHitpoints = totalHealth
        return
      }
      // add constitution modifier
      totalHealth += (hitDie.length * ((this.character.abilityScores.CON - 10) / 2))
      // if we want to roll we do that
      if (roll) {
        totalHealth += hitDie.reduce((accumulator, dice) => {
          return accumulator + (Math.floor(Math.random() * dice) + 1)
        })
      } else { // if we want to take the average variant
        totalHealth += hitDie.reduce((accumulator, dice) => {
          return accumulator + Math.ceil((dice + 1) / 2)
        })
      }
      this.maxHitpoints = totalHealth
      if (this.hitpoints > this.maxHitpoints) {
        this.hitpoints = this.maxHitpoints
      }
      // used to set health on level up (not sure what to do on decrease...)
      this.rollHealth = roll
    }
  }
}
</script>
