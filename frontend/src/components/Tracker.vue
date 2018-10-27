<template>
  <v-card>
    <!-- actions -->
    <v-toolbar color="secondary" flat>
      <v-tooltip bottom>
        <v-btn
          icon
          flat
          slot="activator"
          color="primary"
          @click="multiclass()"
        >
          <v-icon>add_circle_outline</v-icon>
        </v-btn>
        <span>Multiclass</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn
          color="primary"
          flat
          slot="activator"
          icon
          @click="castSpell()"
        >
          <v-icon>mdi-auto-fix</v-icon>
        </v-btn>
        <span>Cast Spell</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn
          color="primary"
          icon
          flat
          slot="activator"
          @click="longRest()"
        >
          <v-icon>mdi-sleep</v-icon>
        </v-btn>
        <span>Long Rest</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn
          color="primary"
          icon
          flat
          slot="activator"
          @click="shortRest()"
        >
          <v-icon>mdi-bell-sleep</v-icon>
        </v-btn>
        <span>Short Rest</span>
      </v-tooltip>
      <v-tooltip bottom>
        <v-btn
          :disabled="!character.concentrating"
          @click="concentrationDialog=true"
          color="primary"
          icon
          flat
          slot="activator"
        >
          <v-icon>remove_red_eye</v-icon>
        </v-btn>
        <span
          v-if="character.concentrating"
        >Concentrating on {{ character.concentrating }}</span>
        <span
          v-if="!character.concentrating || character.concentrating === ''"
        >Not currently concentrating</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <h3>PROFICIENCY BONUS: +{{ character.proficiency }}</h3>
    </v-toolbar>
    <!-- character info -->
    <v-layout>
      <v-flex>
        <v-card light class="text-xs-left ma-2">
          <h3 class="pl-3 pt-3">CHARACTER INFO</h3>
          <v-card-text class="pt-0">
            <v-text-field
              v-model="character.name"
              label="Name"
              @blur="$emit('triggerChangeDetection')"
              hide-details
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout ml-3>
      
    </v-layout>
    <!-- dynamic state -->
    <v-layout column>
      <app-initiative :character="character"/>
      <v-layout align-center row>
        <!-- Hit Points -->
        <hit-points :character="character"></hit-points>
        <!-- End Hit Points -->
      </v-layout>
    </v-layout>
    <death-throws
      v-if="hitpoints <= 0 && maxHitpoints > 0"
      :character="character"
    />
    <v-dialog
      v-model="concentrationDialog"
      max-width="300"
    >
      <v-card>
        <v-card-text>
          <h2>Stop Concentrating on {{character.concentrating}}?</h2>
        </v-card-text>
        <v-layout column>
          <v-btn
            @click="concentrationDialog = false; stopConcentrating()"
            flat
            color="primary"
          >Yes</v-btn>
          <v-btn
            @click="concentrationDialog = false;"
            flat
            color="primary"
          >No</v-btn>
        </v-layout>
      </v-card>
    </v-dialog>
    <!-- End "Buttons" -->
    <!-- Ability Scores -->
    <ability-scores
      :scores="character.abilityScores"
      :character="character"
    ></ability-scores>
    <!-- End Ability Scores -->
    <v-card-text
      v-for="(characterClass, classindex) in character.classes"
      :key="classindex"
    >
      <!-- TODO Class-specific stuff -->

      <character-class
        :characterClass="characterClass"
        :character="character"
        :classIndex="classindex"
      ></character-class>
    </v-card-text>
    <spell-cast
      :character="character"
      ref="spellCast"
    />
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
  name: 'tracker',

  props: ['character'],

  components: {
    'app-ability-scores': AbilityScores,
    'app-character-class': Class,
    'app-death-throws': DeathSavingThrows,
    'app-spell-cast': SpellCast,
    'app-hit-points': HitPoints,
    'app-initiative': Initiative,
  },

  computed: {
    hitDice() {
      return this.$store.state.hitDice
    },

    hitpoints() {
      return this.character.hitpoints
    },

    maxHitpoints() {
      return this.character.maxHitpoints
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
