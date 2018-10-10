<template>
    <v-card>
      <!-- Name -->
      <v-layout align-center row ml-3>
        <v-flex xs11>
          <v-text-field v-model="name" placeholder="Name..."></v-text-field>
        </v-flex>
      </v-layout>
      <!-- End Name -->
      <!-- "Buttons" -->
      <v-layout column>
        <v-layout align-center row>
          <v-tooltip top>
            <v-btn icon slot="activator" @click="multiclass()">
              <v-icon>add_circle_outline</v-icon>
            </v-btn>
            <span>Multiclass</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn flat slot="activator" icon @click="castSpell()">
              <v-icon>mdi-auto-fix</v-icon>
            </v-btn>
            <span>Cast Spell</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn flat icon slot="activator" @click="longRest()">
              <v-icon>mdi-sleep</v-icon>
            </v-btn>
            <span>Long Rest</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn flat icon slot="activator" @click="shortRest()"> 
              <v-icon>mdi-bell-sleep</v-icon>
            </v-btn>
            <span>Short Rest</span>
          </v-tooltip>
          <v-tooltip top>
            <v-btn :disabled="!character.concentrating" @click="concentrationDialog=true" flat icon slot="activator"><v-icon>remove_red_eye</v-icon></v-btn>
            <span v-if="character.concentrating">Concentrating on {{character.concentrating}}</span>
            <span v-if="!character.concentrating || character.concentrating === ''">Not currently concentrating</span>
          </v-tooltip>
          <v-tooltip top>
            <h3 slot="activator">+{{proficiencyBonus}}</h3>
            <span>Proficiency Bonus</span>
          </v-tooltip>
        </v-layout>
        <v-layout align-center row>
          <!-- Hit Points -->
          <hit-points :charIndex="index"></hit-points>
          <!-- End Hit Points -->
        </v-layout>
      </v-layout>
      <v-dialog v-model="concentrationDialog" max-width=300>
        <v-card>
          <v-card-text>
            <h2>Stop Concentrating on {{character.concentrating}}?</h2>
          </v-card-text>
          <v-layout column>
            <v-btn @click="concentrationDialog = false; stopConcentrating()" flat> Yes </v-btn>
            <v-btn @click="concentrationDialog = false;" flat> No </v-btn>
          </v-layout>
        </v-card>
      </v-dialog>
      <!-- End "Buttons" -->
      <!-- Ability Scores -->
      <ability-scores :scores="character.abilityScores" :index="index"></ability-scores>
      <!-- End Ability Scores -->
      <v-card-text v-for="(characterClass, classindex) in character.classes" :key="classindex">
        <!-- TODO Class stuff -->
        <character-class :charIndex="index" :classIndex="classindex"> </character-class>
      </v-card-text>
      <spell-cast :charIndex="index" ref="spellCast"></spell-cast>
    </v-card>
</template>

<script>
import AbilityScores from '@/components/AbilityScores'
import Class from '@/components/Class'
import SpellCast from '@/components/SpellCast'
import HitPoints from '@/components/HitPoints'
export default {
  name: 'Tracker',
  props: ['id', 'index'],
  components: {
    'ability-scores': AbilityScores,
    'character-class': Class,
    'spell-cast': SpellCast,
    'hit-points': HitPoints
  },
  computed: {
    classOpts () {
      return this.$store.state.classOpts
    },
    character () {
      return this.$store.state.characters[this.index]
    },
    proficiencyBonus () {
      return this.character.proficiency
    },
    name: {
      get () {
        return this.character.name
      },
      set (state) {
        this.$store.commit('changeName', {
          index: this.index,
          name: state
        })
      }
    }
  },
  data () {
    return {
      concentrationDialog: false
    }
  },
  methods: {
    multiclass () {
      this.$store.commit('multiclass', {'index': this.index, 'classname': ''})
    },
    longRest () {
      this.$store.commit('longRest', this.index)
    },
    resetCharacter () {
      for (let c in this.character.classes) {
        this.$store.commit('updateSlots', {
          charIndex: this.index,
          classIndex: c
        })
      }
    },
    shortRest () {
      // TODO
    },
    stopConcentrating () {
      this.$store.commit('stopConcentrating', this.index)
    },
    castSpell () {
      this.$refs.spellCast.spellPreflight()
    }
  }
}
</script>
