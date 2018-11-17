<template>
  <v-card>
    <app-character-actions :character="character" @characterRemoved="$emit('characterRemoved')"/>
    <app-character-info class="mb-2" :character="character"/>
    <v-layout mb-2>
      <app-initiative :character="character"/>
      <app-hit-points :character="character"/>
      <app-speed :character="character"/>
      <app-armor-class :character="character"/>
    </v-layout>
    <app-death-throws
      v-if="character.hitPoints <= 0 && character.maxHitPoints > 0"
      :character="character"
    />
    <app-ability-scores :character="character"/>
    <v-layout align-center>
      <h3 class="ml-3">CLASS</h3>
      <v-tooltip bottom>
        <v-btn
          icon
          flat
          slot="activator"
          color="primary"
          :disabled="character.classes.length >= 10"
          @click="showClassDialog = true"
        >
          <v-icon>add_circle_outline</v-icon>
        </v-btn>
        <span>ADD CLASS</span>
      </v-tooltip>
    </v-layout>
    <v-layout column>
      <app-character-class
        v-for="(characterClass, classIndex) in character.classes"
        :key="characterClass.className"
        :characterClass="characterClass"
        :classIndex="classIndex"
        :character="character"
        @castSpell="castSpell(classIndex)"
        @edit="editClass(characterClass)"
        class="mx-3 mb-3"
      />
    </v-layout>
    <v-dialog v-model="showClassDialog">
      <app-class-dialog
        :character="character"
        :characterClass="classUnderEdit"
        @close="showClassDialog = false"
        @add="addClass($event); showClassDialog = false"
        @update="updateClass($event); showClassDialog = false"
      />
    </v-dialog>
    <v-dialog v-if="spellClassIndex !== null" v-model="showSpellDialog">
      <app-cast-spell-dialog
        :character="character"
        :spellClassIndex="spellClassIndex"
        :castSpellState="castSpellState"
        @close="showSpellDialog = false"
      />
    </v-dialog>
  </v-card>
</template>

<script>
import { mapActions } from 'vuex'
import CharacterActions from './CharacterActions'
import CharacterInfo from './CharacterInfo'
import AbilityScores from './AbilityScores'
import CharacterClass from './CharacterClass'
import HitPoints from './HitPoints'
import Speed from './Speed'
import ArmorClass from './ArmorClass'
import DeathSavingThrows from './DeathSavingThrows'
import Initiative from './Initiative'
import CastSpellDialog from './CastSpellDialog'
import ClassDialog from './ClassDialog'

export default {
  name: 'tracker',

  props: ['character'],

  components: {
    'app-character-info': CharacterInfo,
    'app-character-actions': CharacterActions,
    'app-ability-scores': AbilityScores,
    'app-character-class': CharacterClass,
    'app-death-throws': DeathSavingThrows,
    'app-hit-points': HitPoints,
    'app-initiative': Initiative,
    'app-armor-class': ArmorClass,
    'app-speed': Speed,
    'app-cast-spell-dialog': CastSpellDialog,
    'app-class-dialog': ClassDialog,
  },

  data() {
    return {
      spellClassIndex: null,
      showSpellDialog: false,
      showClassDialog: false,
      classUnderEdit: null,
      castSpellState: {
        spell: null,
        level: null,
      },
    }
  },

  methods: {
    ...mapActions(['characterAction', 'updateClass']),

    editClass(targetClass) {
      this.showClassDialog = true
      this.classUnderEdit = targetClass
    },

    castSpell(classIndex) {
      this.spellClassIndex = classIndex
      this.showSpellDialog = true
    },

    addClass({ className, subClassName, level }) {
      this.characterAction({
        character: this.character,
        method: 'addClass',
        args: [className, subClassName, level],
      })
    },
  },

  watch: {
    showClassDialog(state) {
      if (!state) {
        this.classUnderEdit = null
        console.log('c', this.classUnderEdit)
      }
    },

    showSpellDialog(state) {
      if (!state) {
        this.spellClassIndex = null
        this.castSpellState = {
          spell: null,
          level: null,
        }
      }
    },
  },
}
</script>
