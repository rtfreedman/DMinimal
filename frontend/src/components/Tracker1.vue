<template>
    <v-card>
      <!-- "Buttons" -->
      <v-layout row align-center>
      <v-tooltip top>
        <v-btn icon slot="activator" @click="multiclass()">
          <v-icon>add_circle_outline</v-icon>
        </v-btn>
        <span>Multiclass</span>
      </v-tooltip>
      <v-tooltip top>
        <v-btn flat slot="activator" icon @click="getSpellSlots">
          <v-icon> autorenew </v-icon>
        </v-btn>
        <span>Update Slots</span>
      </v-tooltip>
      <v-tooltip top>
        <v-btn :disabled="!character.concentrating" @click="concentrationDialog=true" flat icon slot="activator"><v-icon>remove_red_eye</v-icon></v-btn>
        <span v-if="character.concentrating">Concentrating on {{character.concentrating}}</span>
        <span v-if="!character.concentrating || character.concentrating === ''">Not currently concentrating</span>
      </v-tooltip>
      <v-tooltip top>
        <h3 slot="activator">{{proficiencyBonus}}</h3>
        <span>Proficiency Bonus</span>
      </v-tooltip>
      </v-layout>
      <v-dialog v-model="concentrationDialog" max-width=300>
        <v-card>
          <v-card-text>
            <h2>Stop Concentrating on {{character.concentration}}?</h2>
          </v-card-text>
          <v-layout column>
            <v-btn @click="concentrationDialog = false; stopConcentrating()" flat> Yes </v-btn>
            <v-btn @click="concentrationDialog = false;" flat> No </v-btn>
          </v-layout>
        </v-card>
      </v-dialog>
      <!-- End "Buttons" -->
      <!-- Name -->
      <v-layout align-center justify-center row>
        <v-flex xs11>
          <v-text-field v-model="name" placeholder="Name..."></v-text-field>
        </v-flex>
      </v-layout>
      <!-- End Name -->
      <!-- Ability Scores -->
      <ability-scores :scores="character.abilityScores" :index="index"></ability-scores>
      <!-- End Ability Scores -->
      <v-card-text v-for="(characterClass, classindex) in character.classes" :key="classindex">
        <!-- TODO Class stuff -->
        <character-class :characterIndex="index" :classIndex="classindex" :classOpts="classOpts"> </character-class>
      </v-card-text>
    </v-card>
</template>

<script>
import AbilityScores from '@/components/AbilityScores'
import Class from '@/components/Class'
export default {
  name: 'Tracker1',
  props: ['id', 'index', 'classOpts'],
  components: {
    'ability-scores': AbilityScores,
    'character-class': Class
  },
  computed: {
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
    getSpellSlots () {
      // TODO
    },
    stopConcentrating () {
      this.$store.commit('stopConcentrating', this.index)
    }
  }
}
</script>
