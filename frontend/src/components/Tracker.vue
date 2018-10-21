<template>
  <v-card>
    <!-- Name -->
    <v-layout align-center
              row
              ml-3>
      <v-flex xs11>
        <v-text-field v-model="name"
                      placeholder="Name..."></v-text-field>
      </v-flex>
    </v-layout>
    <!-- End Name -->
    <!-- "Buttons" -->
    <v-layout column>
      <v-layout align-center
                row>
        <v-tooltip top>
          <v-btn icon
                 slot="activator"
                 @click="multiclass()">
            <v-icon>add_circle_outline</v-icon>
          </v-btn>
          <span>Multiclass</span>
        </v-tooltip>
        <v-tooltip top>
          <v-btn flat
                 slot="activator"
                 icon
                 @click="castSpell()">
            <v-icon>mdi-auto-fix</v-icon>
          </v-btn>
          <span>Cast Spell</span>
        </v-tooltip>
        <v-tooltip top>
          <v-btn flat
                 icon
                 slot="activator"
                 @click="longRest()">
            <v-icon>mdi-sleep</v-icon>
          </v-btn>
          <span>Long Rest</span>
        </v-tooltip>
        <v-tooltip top>
          <v-btn flat
                 icon
                 slot="activator"
                 @click="shortRest()">
            <v-icon>mdi-bell-sleep</v-icon>
          </v-btn>
          <span>Short Rest</span>
        </v-tooltip>
        <v-tooltip top>
          <v-btn :disabled="!character.concentrating"
                 @click="concentrationDialog=true"
                 flat
                 icon
                 slot="activator">
            <v-icon>remove_red_eye</v-icon>
          </v-btn>
          <span v-if="character.concentrating">Concentrating on {{character.concentrating}}</span>
          <span v-if="!character.concentrating || character.concentrating === ''">Not currently concentrating</span>
        </v-tooltip>
        <v-tooltip top>
          <h3 slot="activator">+{{proficiencyBonus}}</h3>
          <span>Proficiency Bonus</span>
        </v-tooltip>
      </v-layout>
      <initiative :charIndex="index" />
      <v-layout align-center
                row>
        <!-- Hit Points -->
        <hit-points :charIndex="index"></hit-points>
        <!-- End Hit Points -->
      </v-layout>
    </v-layout>
    <death-throws v-if="hitpoints <= 0 && maxHitpoints > 0"
                  :charIndex="index" />
    <v-dialog v-model="concentrationDialog"
              max-width=300>
      <v-card>
        <v-card-text>
          <h2>Stop Concentrating on {{character.concentrating}}?</h2>
        </v-card-text>
        <v-layout column>
          <v-btn @click="concentrationDialog = false; stopConcentrating()"
                 flat> Yes </v-btn>
          <v-btn @click="concentrationDialog = false;"
                 flat> No </v-btn>
        </v-layout>
      </v-card>
    </v-dialog>
    <!-- End "Buttons" -->
    <!-- Ability Scores -->
    <ability-scores :scores="character.abilityScores"
                    :index="index"></ability-scores>
    <!-- End Ability Scores -->
    <v-card-text v-for="(characterClass, classindex) in character.classes"
                 :key="classindex">
      <!-- TODO Class-specific stuff -->
      <character-class :charIndex="index"
                       :classIndex="classindex"> </character-class>
    </v-card-text>
    <spell-cast :charIndex="index"
                ref="spellCast" />
  </v-card>
</template>

<script>
import AbilityScores from '@/components/AbilityScores'
import Class from '@/components/Class'
import SpellCast from '@/components/SpellCast'
import HitPoints from '@/components/HitPoints'
import DeathSavingThrows from './DeathSavingThrows'
import Initiative from '@/components/Initiative'
export default {
  name: 'Tracker',
  props: ['id', 'index'],
  components: {
    'ability-scores': AbilityScores,
    'character-class': Class,
    'death-throws': DeathSavingThrows,
    'spell-cast': SpellCast,
    'hit-points': HitPoints,
    initiative: Initiative,
  },
  computed: {
    classOpts() {
      return this.$store.state.classOpts
    },
    hitDice() {
      return this.$store.state.hitDice
    },
    character() {
      return this.$store.state.characters[this.index]
    },
    hitpoints() {
      return this.character.hitpoints
    },
    maxHitpoints() {
      return this.character.maxHitpoints
    },
    proficiencyBonus() {
      return this.character.proficiency
    },
    name: {
      get() {
        return this.character.name
      },
      set(state) {
        this.$store.commit('changeName', {
          index: this.index,
          name: state,
        })
      },
    },
  },
  data() {
    return {
      concentrationDialog: false,
      shortRestDie: {},
    }
  },
  methods: {
    multiclass() {
      this.$store.commit('multiclass', { index: this.index, classname: '' })
    },
    longRest() {
      this.$store.commit('longRest', this.index)
    },
    resetCharacter() {
      for (const c in this.character.classes) {
        this.$store.commit('updateSlots', {
          charIndex: this.index,
          classIndex: c,
        })
      }
    },
    performShortRest() {
      let restoredHealth = 0
      for (const a in this.shortRestDie) {
        restoredHealth += Math.floor(Math.random() * this.shortRestDie[a])
      }
      this.$store.commit('setHP', {
        charIndex: this.index,
        hitpoints: parseInt(this.hitpoints) + restoredHealth,
      })
      this.$store.commit('hideSnackbar')
    },
    shortRest() {
      const acc = {}
      for (const c in this.character.classes) {
        if (
          !this.hitDice.hasOwnProperty(
            this.character.classes[c].classname.split(' ')[0],
          )
        ) {
          continue
        }
        const hitDie = this.hitDice[
          this.character.classes[c].classname.split(' ')[0]
        ]
        if (!acc.hasOwnProperty(hitDie)) {
          acc[hitDie] = 0
        }
        acc[hitDie] += this.character.classes[c].level
      }
      let message = []
      this.shortRestDie = []
      for (const k in acc) {
        message.push(acc[k].toString() + 'd' + k.toString())
        this.shortRestDie.push.apply(
          this.shortRestDie,
          new Array(acc[k]).fill(k),
        )
      }
      message = 'Restore ' + message.join(', ')
      this.$store.commit('showSnackbar', {
        color: 'green',
        message,
        func: this.performShortRest,
        buttonMessage: 'Roll',
      })
    },
    stopConcentrating() {
      this.$store.commit('stopConcentrating', this.index)
    },
    castSpell() {
      this.$refs.spellCast.spellPreflight()
    },
  },
}
</script>
